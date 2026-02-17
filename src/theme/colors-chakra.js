// Chakra UI Color Theme - Legacy System
// This file contains the original Chakra UI color tokens used before centralization
// Can be swapped with colors.js for a Chakra-based color system

export const emlColors = {
    // Main Backgrounds
    bgPrimary: 'gray.950',           // Main app background (dark mode)
    bgPrimaryLight: 'gray.50',       // Main app background (light mode)
    bgSecondary: 'gray.900',         // Cards, tables, secondary surfaces
    bgTertiary: 'gray.850',          // Special highlighted rows
    bgCard: 'gray.900',              // Card backgrounds
    bgElevated: 'purple.900',        // Elevated card headers
    bgHover: 'gray.800',             // Hover states, table headers

    // Semi-transparent Backgrounds
    bgOverlayDark: 'blackAlpha.600',      // Dark overlay (navigation)
    bgOverlayDarkStrong: 'blackAlpha.700', // Stronger dark overlay
    bgOverlayLight: 'whiteAlpha.800',      // Light overlay
    bgOverlayLightStrong: 'whiteAlpha.900', // Stronger light overlay
    bgSubtleDark: 'whiteAlpha.100',        // Subtle overlay in dark mode
    bgSubtleLight: 'blackAlpha.100',       // Subtle overlay in light mode
    bgBlurDark: 'orange.500/10',           // Blur effect background dark
    bgBlurLight: 'blue.500/10',            // Blur effect background light

    // Gradient Accents (primary brand colors)
    accentOrange: 'orange.300',      // Primary orange (dark mode)
    accentOrangeAlt: 'orange.400',   // Orange border/accent
    accentOrangeMid: 'orange.500',   // Mid orange
    accentOrangeStrong: 'orange.600', // Strong orange (light mode/bronze)
    accentBlue: 'blue.400',          // Primary blue accent
    accentBlueMid: 'blue.500',       // Mid blue
    accentBlueStrong: 'blue.600',    // Strong blue (light mode)
    accentPurple: 'purple.300',      // Purple accent (icons)
    accentPurpleMid: 'purple.400',   // Mid purple (team names)
    accentPurpleStrong: 'purple.600', // Strong purple (light mode)
    accentPurpleBg: 'purple.900',    // Purple background
    accentPurpleBorder: 'purple.800', // Purple border

    // Text Colors
    textPrimary: 'white',            // Primary text (dark mode)
    textPrimaryLight: 'gray.900',    // Primary text (light mode)
    textSecondary: 'gray.300',       // Secondary text (dark mode)
    textSecondaryLight: 'gray.700',  // Secondary text (light mode)
    textMuted: 'gray.400',           // Muted text, table headers
    textMutedAlt: 'gray.500',        // Slightly darker muted text
    textSubtle: 'gray.600',          // Subtle text (VS divider, light mode muted)

    // Status Colors
    statusLive: 'red.500',           // Live indicator pulse
    statusLiveBorder: 'red.600',     // Live match border
    statusScheduled: 'green.500',    // Scheduled status
    statusCompleted: 'blue.500',     // Completed status
    statusDisputed: 'purple.500',    // Disputed/special status

    // Trophy/Award Colors
    awardGold: 'yellow.400',         // 1st place trophy
    awardSilver: 'gray.400',         // 2nd place trophy
    awardBronze: 'orange.600',       // 3rd place trophy

    // Borders
    borderLight: 'gray.800',         // Standard borders (dark mode)
    borderLightMode: 'gray.200',     // Standard borders (light mode)
    borderMedium: 'gray.700',        // Medium borders (dark mode)
    borderMediumLight: 'gray.200',   // Medium borders (light mode)
    borderAccent: 'orange.400',      // Accent borders (dark mode)
    borderAccentLight: 'blue.500',   // Accent borders (light mode)
    borderTransparentDark: 'whiteAlpha.200', // Transparent border (dark)
    borderTransparentLight: 'blackAlpha.200', // Transparent border (light)

    // Gradients (stored as strings for direct use)
    gradientHeroDark: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    gradientHeroLight: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    gradientTextDark: 'linear(to-r, orange.300, blue.400)',
    gradientTextLight: 'linear(to-r, blue.600, orange.500)',
}

// Helper for conditional theming (dark/light mode)
export const themed = (isDark, darkValue, lightValue) => {
    return isDark ? darkValue : lightValue;
}

// Note: These are Chakra UI color tokens and should be used with Chakra components
// Example: <Box bg={emlColors.bgPrimary} color={emlColors.textPrimary} />
