// Complete EML Color System - Single Source of Truth
// These values are used in both the Chakra UI theme and direct component styling

export const emlColors = {
    // Backgrounds - G2 Dark Aesthetic
    bgPrimary: 'transparent',                 // Transparent — shows background pattern
    bgSecondary: 'rgba(17,17,17,0.55)',        // Very dark grey semi-transparent
    bgTertiary: 'rgba(26,26,26,0.45)',         // Dark grey semi-transparent
    bgCard: 'rgba(13,13,13,0.82)',             // Card backgrounds (semi-transparent)
    bgElevated: 'rgba(30,30,30,0.80)',         // Elevated surfaces (semi-transparent)
    bgHover: 'rgba(36,36,36,0.90)',            // Hover states

    // Gradient Accents (G2 + Echo VR theme)
    accentOrange: '#ff6b2b',   // G2 signature orange
    accentPink: '#ff8c42',     // Soft orange highlight
    accentRose: '#ef4444',     // Rose/red
    accentBlue: '#00bfff',     // Electric blue (Echo VR)
    accentCyan: '#00e5ff',     // Bright cyan
    accentPurple: '#7c3aed',   // Purple (secondary)

    // Text
    textPrimary: '#ffffff',    // White
    textSecondary: '#e5e7eb',  // Light gray
    textMuted: '#9ca3af',      // Medium gray
    textSubtle: '#6b7280',     // Subtle gray

    // Status Colors
    statusLive: '#ef4444',     // Red (live matches)
    statusScheduled: '#10b981', // Green
    statusCompleted: '#3b82f6', // Blue
    statusDisputed: '#f59e0b',  // Amber (disputed)

    // Borders
    borderLight: 'rgba(255, 255, 255, 0.07)',
    borderMedium: 'rgba(255, 255, 255, 0.12)',
    borderAccent: '#ff6b2b',
}

// Light mode color overrides
export const emlColorsLight = {
    // Backgrounds
    bgPrimary: 'transparent',                   // Transparent — shows background pattern
    bgSecondary: 'rgba(224,231,255,0.55)',       // Light indigo semi-transparent
    bgTertiary: 'rgba(199,210,254,0.45)',        // Mid indigo semi-transparent
    bgCard: 'rgba(255,255,255,0.84)',            // Pure white cards (semi-transparent)
    bgElevated: 'rgba(241,245,249,0.80)',        // Slightly elevated (semi-transparent)
    bgHover: 'rgba(226,232,240,0.90)',           // Hover states

    // Gradient Accents (same vibrant colors work in light mode)
    accentOrange: '#f97316',   // Slightly darker orange
    accentPink: '#ec4899',     // Slightly darker pink
    accentRose: '#ef4444',     // Rose/red
    accentBlue: '#0ea5e9',     // Slightly darker blue
    accentCyan: '#06b6d4',     // Cyan
    accentPurple: '#9333ea',   // Slightly darker purple

    // Text
    textPrimary: '#0f172a',    // Dark navy
    textSecondary: '#334155',  // Medium slate
    textMuted: '#64748b',      // Slate gray
    textSubtle: '#94a3b8',     // Light slate

    // Status Colors (same as dark mode)
    statusLive: '#ef4444',
    statusScheduled: '#10b981',
    statusCompleted: '#3b82f6',
    statusDisputed: '#a855f7',

    // Borders
    borderLight: 'rgba(0, 0, 0, 0.1)',
    borderMedium: 'rgba(0, 0, 0, 0.15)',
    borderAccent: '#f97316',
}

/**
 * Color-blind-friendly semantic colors
 * Replaces red/green (indistinguishable for ~8% of men) with blue/orange
 * These are used when the user's OS has accessibility/color filter settings enabled
 */
export const colorBlindSemanticColors = {
    win: '#2563eb',        // Blue (replaces green)
    loss: '#f97316',       // Orange (replaces red)  
    winBadge: 'blue',      // Chakra colorPalette for wins
    lossBadge: 'orange',   // Chakra colorPalette for losses
    active: 'blue',        // Chakra colorPalette for active status
    inactive: 'orange',    // Chakra colorPalette for inactive status
    live: '#f97316',       // Orange (replaces red for live indicator)
    error: '#f97316',      // Orange error text
};

/**
 * Default semantic colors (standard red/green)
 */
export const defaultSemanticColors = {
    win: '#22c55e',        // green.500
    loss: '#ef4444',       // red.500
    winBadge: 'green',
    lossBadge: 'red',
    active: 'green',
    inactive: 'red',
    live: '#ef4444',       // red.500
    error: '#f87171',      // red.400
};

// Helper function to get theme-aware colors
export const getThemedColors = (theme, colorBlind = false) => {
    const [colorScheme, mode] = theme.includes('-') ? theme.split('-') : [theme === 'light' ? 'g2' : 'g2', theme === 'light' ? 'light' : 'dark'];
    const palette = COLOR_THEMES[colorScheme] || COLOR_THEMES.g2;
    const base = mode === 'light' ? palette.light : palette.dark;
    const semantic = colorBlind ? colorBlindSemanticColors : defaultSemanticColors;
    return { ...base, semantic };
}

// ─── Color Theme Definitions ─────────────────────────────────────────────────

export const COLOR_THEMES = {
    g2: {
        label: 'G2 Classic',
        preview: ['#0a0a0a', '#ff6b2b', '#00bfff'],
        dark: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(17,17,17,0.55)',
            bgTertiary: 'rgba(26,26,26,0.45)',
            bgCard: 'rgba(13,13,13,0.82)',
            bgElevated: 'rgba(30,30,30,0.80)',
            bgHover: 'rgba(36,36,36,0.90)',
            accentOrange: '#ff6b2b',
            accentPink: '#ff8c42',
            accentRose: '#ef4444',
            accentBlue: '#00bfff',
            accentCyan: '#00e5ff',
            accentPurple: '#7c3aed',
            textPrimary: '#ffffff',
            textSecondary: '#e5e7eb',
            textMuted: '#9ca3af',
            textSubtle: '#6b7280',
            statusLive: '#ef4444',
            statusScheduled: '#10b981',
            statusCompleted: '#3b82f6',
            statusDisputed: '#f59e0b',
            borderLight: 'rgba(255,255,255,0.07)',
            borderMedium: 'rgba(255,255,255,0.12)',
            borderAccent: '#ff6b2b',
        },
        light: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(224,231,255,0.55)',
            bgTertiary: 'rgba(199,210,254,0.45)',
            bgCard: 'rgba(255,255,255,0.84)',
            bgElevated: 'rgba(241,245,249,0.80)',
            bgHover: 'rgba(226,232,240,0.90)',
            accentOrange: '#f97316',
            accentPink: '#ec4899',
            accentRose: '#ef4444',
            accentBlue: '#0ea5e9',
            accentCyan: '#06b6d4',
            accentPurple: '#9333ea',
            textPrimary: '#0f172a',
            textSecondary: '#334155',
            textMuted: '#64748b',
            textSubtle: '#94a3b8',
            statusLive: '#ef4444',
            statusScheduled: '#10b981',
            statusCompleted: '#3b82f6',
            statusDisputed: '#a855f7',
            borderLight: 'rgba(0,0,0,0.08)',
            borderMedium: 'rgba(0,0,0,0.15)',
            borderAccent: '#f97316',
        },
    },
    pink: {
        label: 'Pink',
        preview: ['#1a0a12', '#ff4d9d', '#ff99cc'],
        dark: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(26,15,21,0.55)',
            bgTertiary: 'rgba(35,21,32,0.45)',
            bgCard: 'rgba(19,12,17,0.82)',
            bgElevated: 'rgba(42,26,34,0.80)',
            bgHover: 'rgba(51,30,42,0.90)',
            accentOrange: '#ff4d9d',
            accentPink: '#ff80bf',
            accentRose: '#ff2d78',
            accentBlue: '#c084fc',
            accentCyan: '#f0abfc',
            accentPurple: '#a855f7',
            textPrimary: '#ffe4f0',
            textSecondary: '#fbbfd8',
            textMuted: '#d878a8',
            textSubtle: '#a05070',
            statusLive: '#ff2d78',
            statusScheduled: '#34d399',
            statusCompleted: '#c084fc',
            statusDisputed: '#fbbf24',
            borderLight: 'rgba(255,100,180,0.08)',
            borderMedium: 'rgba(255,100,180,0.18)',
            borderAccent: '#ff4d9d',
        },
        light: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(255,224,238,0.55)',
            bgTertiary: 'rgba(255,192,221,0.45)',
            bgCard: 'rgba(255,255,255,0.84)',
            bgElevated: 'rgba(255,245,249,0.80)',
            bgHover: 'rgba(255,214,232,0.90)',
            accentOrange: '#e91e8c',
            accentPink: '#f472b6',
            accentRose: '#db2777',
            accentBlue: '#a21caf',
            accentCyan: '#c026d3',
            accentPurple: '#9333ea',
            textPrimary: '#3b0a25',
            textSecondary: '#701a45',
            textMuted: '#9d174d',
            textSubtle: '#be185d',
            statusLive: '#db2777',
            statusScheduled: '#059669',
            statusCompleted: '#7e22ce',
            statusDisputed: '#d97706',
            borderLight: 'rgba(219,39,119,0.1)',
            borderMedium: 'rgba(219,39,119,0.2)',
            borderAccent: '#e91e8c',
        },
    },
    tan: {
        label: 'Tan',
        preview: ['#1a1410', '#c9a96e', '#e8d5b0'],
        dark: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(26,21,16,0.55)',
            bgTertiary: 'rgba(37,32,24,0.45)',
            bgCard: 'rgba(20,16,8,0.82)',
            bgElevated: 'rgba(44,36,24,0.80)',
            bgHover: 'rgba(53,44,31,0.90)',
            accentOrange: '#c9a96e',
            accentPink: '#d4b896',
            accentRose: '#c0654a',
            accentBlue: '#7a9e8e',
            accentCyan: '#a8c5b5',
            accentPurple: '#9e7a5a',
            textPrimary: '#f5ead8',
            textSecondary: '#d4c4a0',
            textMuted: '#a08860',
            textSubtle: '#7a6448',
            statusLive: '#c0654a',
            statusScheduled: '#6a9e78',
            statusCompleted: '#7a9e8e',
            statusDisputed: '#c9a040',
            borderLight: 'rgba(201,169,110,0.08)',
            borderMedium: 'rgba(201,169,110,0.18)',
            borderAccent: '#c9a96e',
        },
        light: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(245,230,200,0.55)',
            bgTertiary: 'rgba(232,208,160,0.45)',
            bgCard: 'rgba(255,253,245,0.84)',
            bgElevated: 'rgba(250,240,216,0.80)',
            bgHover: 'rgba(240,224,184,0.90)',
            accentOrange: '#a0722a',
            accentPink: '#c09050',
            accentRose: '#a0442a',
            accentBlue: '#4a7a6a',
            accentCyan: '#5a9080',
            accentPurple: '#7a5a3a',
            textPrimary: '#2a1e08',
            textSecondary: '#4a3818',
            textMuted: '#6a5030',
            textSubtle: '#8a7050',
            statusLive: '#a0442a',
            statusScheduled: '#3a7a4a',
            statusCompleted: '#4a7a6a',
            statusDisputed: '#a08020',
            borderLight: 'rgba(120,90,40,0.1)',
            borderMedium: 'rgba(120,90,40,0.2)',
            borderAccent: '#a0722a',
        },
    },
    camo: {
        label: 'Camo',
        preview: ['#0d1208', '#4a7a2a', '#8aaa5a'],
        dark: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(17,24,8,0.55)',
            bgTertiary: 'rgba(26,37,16,0.45)',
            bgCard: 'rgba(13,18,8,0.82)',
            bgElevated: 'rgba(32,46,20,0.80)',
            bgHover: 'rgba(40,56,26,0.90)',
            accentOrange: '#8aaa3a',
            accentPink: '#aac85a',
            accentRose: '#c87840',
            accentBlue: '#5a8a5a',
            accentCyan: '#7aaa7a',
            accentPurple: '#6a7a3a',
            textPrimary: '#e0ecc8',
            textSecondary: '#b8cc98',
            textMuted: '#7a9a5a',
            textSubtle: '#506a38',
            statusLive: '#c87840',
            statusScheduled: '#5a9a4a',
            statusCompleted: '#5a8a5a',
            statusDisputed: '#c8a030',
            borderLight: 'rgba(100,140,50,0.08)',
            borderMedium: 'rgba(100,140,50,0.18)',
            borderAccent: '#8aaa3a',
        },
        light: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(220,232,200,0.55)',
            bgTertiary: 'rgba(192,212,160,0.45)',
            bgCard: 'rgba(248,250,240,0.84)',
            bgElevated: 'rgba(232,240,216,0.80)',
            bgHover: 'rgba(208,224,176,0.90)',
            accentOrange: '#4a7a18',
            accentPink: '#6a9a30',
            accentRose: '#8a4a18',
            accentBlue: '#2a5a2a',
            accentCyan: '#3a7a3a',
            accentPurple: '#4a5a18',
            textPrimary: '#0a1a04',
            textSecondary: '#1a3008',
            textMuted: '#2a4a10',
            textSubtle: '#4a6a28',
            statusLive: '#8a4a18',
            statusScheduled: '#2a6a1a',
            statusCompleted: '#2a5a2a',
            statusDisputed: '#7a6010',
            borderLight: 'rgba(50,80,20,0.1)',
            borderMedium: 'rgba(50,80,20,0.2)',
            borderAccent: '#4a7a18',
        },
    },
    crimson: {
        label: 'Crimson',
        preview: ['#0f0306', '#dc143c', '#ff4d6d'],
        dark: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(26,5,9,0.55)',
            bgTertiary: 'rgba(38,8,14,0.45)',
            bgCard: 'rgba(19,4,7,0.82)',
            bgElevated: 'rgba(32,6,16,0.80)',
            bgHover: 'rgba(46,8,20,0.90)',
            accentOrange: '#dc143c',
            accentPink: '#ff4d6d',
            accentRose: '#ff0030',
            accentBlue: '#c084fc',
            accentCyan: '#f472b6',
            accentPurple: '#a855f7',
            textPrimary: '#ffe4ea',
            textSecondary: '#ffb3c1',
            textMuted: '#cc6680',
            textSubtle: '#8a3a50',
            statusLive: '#ff0030',
            statusScheduled: '#34d399',
            statusCompleted: '#818cf8',
            statusDisputed: '#fbbf24',
            borderLight: 'rgba(220,20,60,0.08)',
            borderMedium: 'rgba(220,20,60,0.18)',
            borderAccent: '#dc143c',
        },
        light: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(255,224,228,0.55)',
            bgTertiary: 'rgba(255,192,202,0.45)',
            bgCard: 'rgba(255,255,255,0.84)',
            bgElevated: 'rgba(255,245,246,0.80)',
            bgHover: 'rgba(255,214,219,0.90)',
            accentOrange: '#b00020',
            accentPink: '#dc143c',
            accentRose: '#9b0000',
            accentBlue: '#7c3aed',
            accentCyan: '#be185d',
            accentPurple: '#6d28d9',
            textPrimary: '#2d0008',
            textSecondary: '#5a0015',
            textMuted: '#8b0020',
            textSubtle: '#b91c3a',
            statusLive: '#9b0000',
            statusScheduled: '#059669',
            statusCompleted: '#4f46e5',
            statusDisputed: '#d97706',
            borderLight: 'rgba(176,0,32,0.1)',
            borderMedium: 'rgba(176,0,32,0.2)',
            borderAccent: '#b00020',
        },
    },
    blue: {
        label: 'Blue',
        preview: ['#030a14', '#1e6fff', '#38bdf8'],
        dark: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(5,15,30,0.55)',
            bgTertiary: 'rgba(9,24,40,0.45)',
            bgCard: 'rgba(4,12,24,0.82)',
            bgElevated: 'rgba(12,26,46,0.80)',
            bgHover: 'rgba(16,34,56,0.90)',
            accentOrange: '#1e6fff',
            accentPink: '#38bdf8',
            accentRose: '#818cf8',
            accentBlue: '#00e5ff',
            accentCyan: '#67e8f9',
            accentPurple: '#818cf8',
            textPrimary: '#e0f2ff',
            textSecondary: '#bae6fd',
            textMuted: '#60a5fa',
            textSubtle: '#3b82f6',
            statusLive: '#ef4444',
            statusScheduled: '#34d399',
            statusCompleted: '#38bdf8',
            statusDisputed: '#fbbf24',
            borderLight: 'rgba(30,111,255,0.08)',
            borderMedium: 'rgba(30,111,255,0.18)',
            borderAccent: '#1e6fff',
        },
        light: {
            bgPrimary: 'transparent',
            bgSecondary: 'rgba(219,238,255,0.55)',
            bgTertiary: 'rgba(191,219,254,0.45)',
            bgCard: 'rgba(255,255,255,0.84)',
            bgElevated: 'rgba(245,249,255,0.80)',
            bgHover: 'rgba(219,234,254,0.90)',
            accentOrange: '#1d4ed8',
            accentPink: '#2563eb',
            accentRose: '#4f46e5',
            accentBlue: '#0284c7',
            accentCyan: '#0891b2',
            accentPurple: '#4338ca',
            textPrimary: '#030d1f',
            textSecondary: '#1e3a5f',
            textMuted: '#1e40af',
            textSubtle: '#3b82f6',
            statusLive: '#dc2626',
            statusScheduled: '#059669',
            statusCompleted: '#2563eb',
            statusDisputed: '#d97706',
            borderLight: 'rgba(29,78,216,0.1)',
            borderMedium: 'rgba(29,78,216,0.2)',
            borderAccent: '#1d4ed8',
        },
    },
};

export const THEME_LIST = Object.entries(COLOR_THEMES).map(([id, t]) => ({ id, label: t.label, preview: t.preview }));

// Helper function to add opacity to hex colors
export const withOpacity = (color, opacity) => {
    if (color.startsWith('rgba')) {
        return color
    }
    if (color.startsWith('#')) {
        const hex = color.slice(1)
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
    return color
}
