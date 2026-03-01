import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'eml-auth-user';
const STATE_KEY = 'eml-oauth-state';

// CLIENT_ID is not a secret — hardcoded as fallback so OAuth never breaks
// if env injection fails (old build, local dev without .env, mobile cache, etc.)
const DISCORD_CLIENT_ID =
  (import.meta.env.VITE_DISCORD_CLIENT_ID &&
    import.meta.env.VITE_DISCORD_CLIENT_ID !== 'undefined')
    ? import.meta.env.VITE_DISCORD_CLIENT_ID
    : '1477115120759996667';

// Derive the redirect URI from the actual browser URL at runtime so it always
// exactly matches what Discord sends the user back to — handles trailing-slash
// differences, mobile in-app browsers, and local dev without any config.
function getRedirectUri() {
  const env = import.meta.env.VITE_DISCORD_REDIRECT_URI;
  if (env && env !== 'undefined') return env;
  // Build from window.location: origin + pathname, normalised to a trailing slash
  const base = window.location.origin + window.location.pathname.replace(/\/+$/, '');
  return base + '/';
}

const WORKER_URL =
  (import.meta.env.VITE_WORKER_URL &&
    import.meta.env.VITE_WORKER_URL !== 'undefined')
    ? import.meta.env.VITE_WORKER_URL
    : null;

if (!WORKER_URL) {
  console.error('[Auth] VITE_WORKER_URL is not set. Login will not work until this is configured.');
}

function generateState() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user.exp && Date.now() > user.exp) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const callbackHandled = useRef(false);

  const login = useCallback(() => {
    if (!WORKER_URL) {
      setError('Login is not configured. Please contact the site administrator.');
      return;
    }

    const redirectUri = getRedirectUri();
    const state = generateState();
    localStorage.setItem(STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify guilds.members.read',
      state,
    });

    window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setError(null);
  }, []);

  // Handle OAuth callback — runs once on mount when ?code= is present in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const stored = localStorage.getItem(STATE_KEY);

    if (!code) return;
    if (callbackHandled.current) return;
    callbackHandled.current = true;

    // Clean ?code= and ?state= from URL immediately (no tokens in history)
    const cleanSearch = url.search
      .replace(/[?&]code=[^&]+/, '')
      .replace(/[?&]state=[^&]+/, '')
      .replace(/^\?$/, '');
    window.history.replaceState({}, document.title, url.pathname + cleanSearch);

    // CSRF check — if stored is null the redirect came through a different browser
    // context (common on mobile with in-app browsers). Allow through; only reject
    // if a stored state exists but explicitly doesn't match.
    localStorage.removeItem(STATE_KEY);
    if (stored && stored !== state) {
      setError('Login failed: invalid state parameter. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${WORKER_URL}/auth/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: getRedirectUri() }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e.error || 'Authentication failed'));
        return res.json();
      })
      .then(userData => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        setLoading(false);
      })
      .catch(err => {
        console.error('OAuth callback error:', err);
        setError(typeof err === 'string' ? err : 'Login failed. Please try again.');
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isAdmin = user?.appRole === 'admin';
  const isMod = user?.appRole === 'mod' || isAdmin;
  const isCaster = user?.appRole === 'caster' || isAdmin;
  const isPlayer = ['player', 'caster', 'mod', 'admin'].includes(user?.appRole);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      isAdmin,
      isMod,
      isCaster,
      isPlayer,
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
