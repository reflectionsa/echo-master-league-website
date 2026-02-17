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
