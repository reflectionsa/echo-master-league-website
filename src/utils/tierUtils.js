/**
 * Tier Images Configuration
 */
export const tierImages = {
    Master: 'https://media.discordapp.net/attachments/1241825775414677536/1473148628246986773/Untitled_design.png?ex=69952812&is=6993d692&hm=cb884e6b000e496a4fd0f5d2dd2ae10745cb2f05165b23616bed6b3a16c00ac2&format=webp&quality=lossless&width=128&height=128',
    Diamond: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627722440832/47d4a6da-edc5-4199-839b-57d41a7528f2.png?ex=69952812&is=6993d692&hm=637e229972387e1c434b33e87755dd754eb72ffbd185568eb2016a57bfa6c265&format=webp&quality=lossless&width=128&height=128',
    Platinum: 'https://media.discordapp.net/attachments/1241825775414677536/1473148627236028509/platniumtriangle.eml.png?ex=69952812&is=6993d692&hm=bba6b394c750debadb3619aeddcd88c8859917d28be07ff93fa9a5f5cc2a18c6&format=webp&quality=lossless&width=128&height=128',
    Gold: 'https://media.discordapp.net/attachments/1241825775414677536/1473148626732585162/goldtriangle.eml.png?ex=69952812&is=6993d692&hm=47765da999614de2be3329c65f73b51b190b9bfae82f685a591087225c0f8653&format=webp&quality=lossless&width=128&height=128',
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
