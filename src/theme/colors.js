// Complete EML Color System - Single Source of Truth
// These values are used in both the Chakra UI theme and direct component styling

export const emlColors = {
    // Backgrounds
    bgPrimary: '#0f172a',      // Deep navy (main bg)
    bgSecondary: '#1e1b4b',    // Mid indigo
    bgTertiary: '#312e81',     // Light indigo
    bgCard: '#1a1d3a',         // Card backgrounds
    bgElevated: '#252850',     // Elevated surfaces
    bgHover: '#2d3154',        // Hover states

    // Gradient Accents (from logo)
    accentOrange: '#ff8c42',   // Top gradient
    accentPink: '#ff5c8d',     // Mid-top gradient  
    accentRose: '#ef4444',     // Rose/red
    accentBlue: '#00d4ff',     // Bottom gradient
    accentCyan: '#06b6d4',     // Cyan
    accentPurple: '#a855f7',   // Purple accent

    // Text
    textPrimary: '#ffffff',    // White
    textSecondary: '#e5e7eb',  // Light gray
    textMuted: '#9ca3af',      // Medium gray
    textSubtle: '#6b7280',     // Subtle gray

    // Status Colors
    statusLive: '#ef4444',     // Red (live matches)
    statusScheduled: '#10b981', // Green
    statusCompleted: '#3b82f6', // Blue
    statusDisputed: '#a855f7',  // Purple

    // Borders
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderMedium: 'rgba(255, 255, 255, 0.2)',
    borderAccent: '#ff8c42',
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

// Helper function to get theme-aware colors
export const getThemedColors = (theme) => {
    return theme === 'light' ? emlColorsLight : emlColors;
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
