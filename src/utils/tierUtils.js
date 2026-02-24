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
