import { useState, useEffect } from 'react';

export const useTheme = () => {
  // theme format: "scheme-mode" e.g. "g2-dark", "pink-light", "camo-dark"
  // legacy: "dark" / "light" map to "g2-dark" / "g2-light"
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eml-theme');
      if (!stored) return 'g2-dark';
      if (stored === 'dark') return 'g2-dark';
      if (stored === 'light') return 'g2-light';
      return stored;
    }
    return 'g2-dark';
  });

  const [colorScheme, mode] = theme.includes('-') ? theme.split('-') : ['g2', theme];

  useEffect(() => {
    localStorage.setItem('eml-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const [scheme, m] = prev.includes('-') ? prev.split('-') : ['g2', prev];
      return `${scheme}-${m === 'dark' ? 'light' : 'dark'}`;
    });
  };

  const setColorScheme = (scheme) => {
    setTheme(`${scheme}-${mode}`);
  };

  const setMode = (m) => {
    setTheme(`${colorScheme}-${m}`);
  };

  return { theme, toggleTheme, colorScheme, mode, setColorScheme, setMode };
};
