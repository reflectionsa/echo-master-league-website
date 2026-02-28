/**
 * EML Discord OAuth2 Cloudflare Worker
 *
 * Endpoints:
 *   POST /auth/callback   — exchange Discord OAuth code for user info + roles
 *   POST /signups/add     — caster signs up to cast a match (KV write)
 *   POST /signups/remove  — caster withdraws signup (KV write)
 *   GET  /signups/:matchId — fetch current signups for a match (KV read)
 *
 * Secrets (set via `wrangler secret put`, never in wrangler.toml):
 *   DISCORD_CLIENT_SECRET
 *   DISCORD_BOT_TOKEN  (optional — only needed if DISCORD_ROLE_MAP not set)
 *
 * Vars (in wrangler.toml [vars], safe to commit):
 *   DISCORD_CLIENT_ID, DISCORD_GUILD_ID, ALLOWED_ORIGINS, DISCORD_ROLE_MAP
 *
 * KV binding: EML_SIGNUPS
 */

const DISCORD_API = 'https://discord.com/api/v10';

// ─── Role Mapping ─────────────────────────────────────────────────────────────

const ROLE_PRIORITY = ['viewer', 'player', 'caster', 'mod', 'admin'];

const STATIC_ROLE_NAME_MAP = {
  'Commissioner': 'admin',
  'Commisoner': 'admin', // typo variant that may exist in the guild
  'Board': 'admin',
  'League Mods': 'mod',
  'Casters': 'caster',
  'Player NA': 'player',
  'Player EU': 'player',
  'Captains': 'player',
  'Co-Captains': 'player',
};

function mapRoleNamesToAppRole(roleNames) {
  const appRoles = roleNames
    .map(name => STATIC_ROLE_NAME_MAP[name])
    .filter(Boolean);

  if (!appRoles.length) return 'viewer';

  return appRoles.reduce((best, current) =>
    ROLE_PRIORITY.indexOf(current) > ROLE_PRIORITY.indexOf(best) ? current : best,
    appRoles[0]
  );
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

function getAllowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
}

function buildCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = getAllowedOrigins(env);
  const reflected = allowed.includes(origin) ? origin : (allowed[0] || '*');

  return {
    'Access-Control-Allow-Origin': reflected,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// ─── Role ID Resolution ───────────────────────────────────────────────────────

/**
 * Resolve an array of Discord role IDs to role names.
 *
 * Strategy (in order):
 *   1. DISCORD_ROLE_MAP env var (JSON string: {"roleId": "roleName"}) — fastest, no bot needed
 *   2. Bot token + KV-cached guild roles list — self-updating but requires bot
 */
async function resolveRoleNames(roleIds, env) {
  if (!roleIds.length) return [];

  // Strategy 1: static JSON map in wrangler.toml [vars]
  if (env.DISCORD_ROLE_MAP) {
    try {
      const idToName = JSON.parse(env.DISCORD_ROLE_MAP);
      return roleIds.map(id => idToName[id]).filter(Boolean);
    } catch (e) {
      console.error('Failed to parse DISCORD_ROLE_MAP:', e.message);
    }
  }

  // Strategy 2: bot token + KV cache
  if (env.DISCORD_BOT_TOKEN && env.EML_SIGNUPS) {
    const cacheKey = `guild_roles_cache_${env.DISCORD_GUILD_ID}`;
    let guildRoles;

    const cached = await env.EML_SIGNUPS.get(cacheKey);
    if (cached) {
      guildRoles = JSON.parse(cached);
    } else {
      const res = await fetch(`${DISCORD_API}/guilds/${env.DISCORD_GUILD_ID}/roles`, {
        headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` },
      });
      if (res.ok) {
        guildRoles = await res.json();
        await env.EML_SIGNUPS.put(cacheKey, JSON.stringify(guildRoles), { expirationTtl: 3600 });
      }
    }

    if (guildRoles) {
      const idToName = Object.fromEntries(guildRoles.map(r => [r.id, r.name]));
      return roleIds.map(id => idToName[id]).filter(Boolean);
    }
  }

  return [];
}

// ─── Route: POST /auth/callback ───────────────────────────────────────────────

async function handleAuthCallback(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, cors);
  }

  const { code, redirect_uri } = body;
  if (!code || !redirect_uri) {
    return jsonResponse({ error: 'Missing code or redirect_uri' }, 400, cors);
  }

  // 1. Exchange authorization code for access token
  const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET, // Workers Secret — never leaves the Worker
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error('Discord token exchange failed:', err);
    return jsonResponse({ error: 'Token exchange failed. Verify your redirect_uri matches exactly.' }, 401, cors);
  }

  const { access_token } = await tokenRes.json();

  // 2. Fetch Discord user info
  const userRes = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) {
    return jsonResponse({ error: 'Failed to fetch Discord user info' }, 401, cors);
  }
  const discordUser = await userRes.json();

  // 3. Fetch guild member info to get role IDs
  let guildRoleIds = [];
  let guildRoleNames = [];

  const memberRes = await fetch(`${DISCORD_API}/users/@me/guilds/${env.DISCORD_GUILD_ID}/member`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (memberRes.ok) {
    const member = await memberRes.json();
    guildRoleIds = member.roles || [];
    guildRoleNames = await resolveRoleNames(guildRoleIds, env);
  } else if (memberRes.status === 404) {
    // User is not in the EML guild — they log in as 'viewer'
    guildRoleNames = [];
  } else {
    console.error('Guild member fetch failed:', memberRes.status, await memberRes.text());
    guildRoleNames = [];
  }

  const appRole = mapRoleNamesToAppRole(guildRoleNames);

  // 4. Build avatar URL
  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number(discordUser.discriminator || '0') % 5}.png`;

  // 5. Return sanitized user object — access_token is NEVER sent to the frontend
  return jsonResponse({
    id: discordUser.id,
    username: discordUser.username,
    globalName: discordUser.global_name || discordUser.username,
    avatar: avatarUrl,
    guildRoles: guildRoleNames,
    appRole,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }, 200, cors);
}

// ─── Route: POST /signups/add ─────────────────────────────────────────────────

async function handleSignupAdd(request, env, cors) {
  let body;
  try { body = await request.json(); } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
  }

  const { matchId, userId, username, role } = body;
  if (!matchId || !userId || !username) {
    return jsonResponse({ error: 'Missing required fields: matchId, userId, username' }, 400, cors);
  }

  const key = `signups:${matchId}`;
  const existing = await env.EML_SIGNUPS.get(key);
  const signups = existing ? JSON.parse(existing) : [];

  // Idempotent — don't add duplicates
  if (!signups.find(s => s.userId === userId)) {
    signups.push({ userId, username, role: role || 'caster', signedUpAt: new Date().toISOString() });
    await env.EML_SIGNUPS.put(key, JSON.stringify(signups));
  }

  return jsonResponse({ success: true, signups }, 200, cors);
}

// ─── Route: POST /signups/remove ──────────────────────────────────────────────

async function handleSignupRemove(request, env, cors) {
  let body;
  try { body = await request.json(); } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, cors);
  }

  const { matchId, userId } = body;
  if (!matchId || !userId) {
    return jsonResponse({ error: 'Missing required fields: matchId, userId' }, 400, cors);
  }

  const key = `signups:${matchId}`;
  const existing = await env.EML_SIGNUPS.get(key);
  const signups = existing ? JSON.parse(existing) : [];
  const updated = signups.filter(s => s.userId !== userId);
  await env.EML_SIGNUPS.put(key, JSON.stringify(updated));

  return jsonResponse({ success: true, signups: updated }, 200, cors);
}

// ─── Route: GET /signups/:matchId ─────────────────────────────────────────────

async function handleSignupGet(matchId, env, cors) {
  const data = await env.EML_SIGNUPS.get(`signups:${matchId}`);
  const signups = data ? JSON.parse(data) : [];
  return jsonResponse({ signups }, 200, cors);
}

// ─── Main Fetch Handler ───────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const cors = buildCorsHeaders(request, env);

    // Handle CORS preflight for all routes
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'POST' && path === '/auth/callback') {
      return handleAuthCallback(request, env, cors);
    }

    if (request.method === 'POST' && path === '/signups/add') {
      return handleSignupAdd(request, env, cors);
    }

    if (request.method === 'POST' && path === '/signups/remove') {
      return handleSignupRemove(request, env, cors);
    }

    const signupGetMatch = path.match(/^\/signups\/(.+)$/);
    if (request.method === 'GET' && signupGetMatch) {
      return handleSignupGet(decodeURIComponent(signupGetMatch[1]), env, cors);
    }

    return jsonResponse({ error: 'Not found' }, 404, cors);
  },
};
