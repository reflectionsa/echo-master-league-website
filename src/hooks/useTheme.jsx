import { useState, useEffect } from 'react';
import { COLOR_THEMES } from '../theme/colors';

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
    // Apply theme as a class on body so CSS (e.g. scrollbar) can target it
    document.body.className = document.body.className
      .replace(/\beml-theme-\S+/g, '')
      .trim();
    document.body.classList.add(`eml-theme-${theme}`);
    // Also add light/dark mode class for generic selectors
    document.body.classList.remove('eml-light', 'eml-dark');
    document.body.classList.add(theme.endsWith('-light') ? 'eml-light' : 'eml-dark');

    // Set CSS custom property for the accent color so scrollbar matches scheme
    const [scheme, m] = theme.includes('-') ? theme.split('-') : ['g2', 'dark'];
    const palette = COLOR_THEMES[scheme] || COLOR_THEMES.g2;
    const modeColors = palette[m] || palette.dark;
    document.documentElement.style.setProperty('--eml-accent', modeColors.accentOrange);
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
