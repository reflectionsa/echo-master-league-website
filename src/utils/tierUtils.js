/**
 * Tier Images Configuration
 */
export const tierImages = {
    Master: '/images/tiers/master.svg',
    Diamond: '/images/tiers/diamond.svg',
    Platinum: '/images/tiers/platinum.svg',
    Gold: '/images/tiers/gold.svg',
};

/**
 * VRML Star Tier configuration — G2 style
 * Star count mirrors VRML progression: Gold=1, Platinum=2, Diamond=3, Master=4
 */
export const tierInfo = {
    Master: {
        stars: 4,
        color: '#FFD700',
        glowColor: 'rgba(255, 215, 0, 0.5)',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        bannerGradient: 'linear-gradient(135deg, rgba(255,215,0,0.25) 0%, rgba(255,165,0,0.08) 100%)',
        borderColor: 'rgba(255,215,0,0.6)',
        label: 'Master',
        badge: '★★★★',
    },
    Diamond: {
        stars: 3,
        color: '#7dd3fc',
        glowColor: 'rgba(125, 211, 252, 0.45)',
        gradient: 'linear-gradient(135deg, #bae6fd 0%, #0ea5e9 100%)',
        bannerGradient: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(186,230,253,0.08) 100%)',
        borderColor: 'rgba(125, 211, 252, 0.6)',
        label: 'Diamond',
        badge: '★★★',
    },
    Platinum: {
        stars: 2,
        color: '#94a3b8',
        glowColor: 'rgba(148, 163, 184, 0.4)',
        gradient: 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)',
        bannerGradient: 'linear-gradient(135deg, rgba(100,116,139,0.25) 0%, rgba(203,213,225,0.08) 100%)',
        borderColor: 'rgba(148, 163, 184, 0.5)',
        label: 'Platinum',
        badge: '★★',
    },
    Gold: {
        stars: 1,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        gradient: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)',
        bannerGradient: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(253,230,138,0.08) 100%)',
        borderColor: 'rgba(251, 191, 36, 0.5)',
        label: 'Gold',
        badge: '★',
    },
};

/**
 * Get full tier info object for a given tier string
 */
export const getTierInfo = (tier) => {
    const baseTier = getBaseTier(tier);
    return tierInfo[baseTier] || null;
};

/**
 * Extract base tier name from tier string
 * Examples:
 *   "Diamond 4" -> "Diamond"
 *   "Master" -> "Master"
 *   "Platinum 2" -> "Platinum"
 * @param {string} tier - The tier string (e.g., "Diamond 4", "Master")
 * @returns {string} - The base tier name
 */
export const getBaseTier = (tier) => {
    if (!tier) return '';

    const tierStr = String(tier).trim();

    // Match tier name before any number or division
    const match = tierStr.match(/^(Master|Diamond|Platinum|Gold|Silver|Bronze)/i);

    if (match) {
        // Capitalize first letter
        const baseTier = match[1];
        return baseTier.charAt(0).toUpperCase() + baseTier.slice(1).toLowerCase();
    }

    // If no match, return the original (might be just "Master" etc.)
    return tierStr.split(' ')[0];
};

/**
 * Get tier image URL for a given tier
 * @param {string} tier - The tier string (e.g., "Diamond 4", "Master")
 * @returns {string|null} - The tier image URL or null if not found
 */
export const getTierImage = (tier) => {
    const baseTier = getBaseTier(tier);
    return tierImages[baseTier] || null;
};
