/**
 * Season week utilities
 * Weeks run Monday → Sunday.
 * Update SEASON_START_DATE at the beginning of each new season.
 */

// Season 4 started Monday, February 2, 2026 (Week 1)
const SEASON_START_DATE = new Date('2026-02-02T00:00:00-05:00'); // ET midnight

const WEEK_NAMES = [
    '', 'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve',
];

/**
 * Returns the current season week number (1-based) based on today's date.
 * Clamps to a minimum of 1.
 */
export const getCurrentSeasonWeek = () => {
    const now = new Date();
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekIndex = Math.floor((now - SEASON_START_DATE) / msPerWeek) + 1;
    return Math.max(1, weekIndex);
};

/**
 * Returns the spelled-out name for a week number, e.g. 4 → "Four".
 * Falls back to the number itself for weeks beyond the array.
 */
export const getWeekName = (weekNumber) => {
    return WEEK_NAMES[weekNumber] || String(weekNumber);
};

/**
 * Returns the date range string for a given week number, e.g. "Feb 23 – Mar 1".
 */
export const getWeekDateRange = (weekNumber) => {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const start = new Date(SEASON_START_DATE.getTime() + (weekNumber - 1) * msPerWeek);
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}`;
};
