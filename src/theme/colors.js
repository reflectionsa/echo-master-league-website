// Complete EML Color System - Single Source of Truth
// These values are used in both the Chakra UI theme and direct component styling

export const emlColors = {
    // Backgrounds - G2 Dark Aesthetic
    bgPrimary: '#0a0a0a',      // Near-black (G2 style)
    bgSecondary: '#111111',    // Very dark grey
    bgTertiary: '#1a1a1a',     // Dark grey
    bgCard: '#0d0d0d',         // Card backgrounds
    bgElevated: '#1e1e1e',     // Elevated surfaces
    bgHover: '#242424',        // Hover states

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
    bgPrimary: '#f8fafc',      // Very light blue-gray
    bgSecondary: '#e0e7ff',    // Light indigo
    bgTertiary: '#c7d2fe',     // Mid indigo
    bgCard: '#ffffff',         // Pure white cards
    bgElevated: '#f1f5f9',     // Slightly elevated
    bgHover: '#e2e8f0',        // Hover states

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
    const base = theme === 'light' ? emlColorsLight : emlColors;
    const semantic = colorBlind ? colorBlindSemanticColors : defaultSemanticColors;
    return { ...base, semantic };
}

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
