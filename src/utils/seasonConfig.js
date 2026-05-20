/**
 * Season Configuration
 *
 * Set CURRENT_SEASON_ACTIVE = false when a season has concluded and is being
 * archived. This hides live standings, match data, and leaderboards from the
 * main site — they move to the Archived Seasons tab in Resources.
 *
 * Update CURRENT_SEASON_NUMBER and NEXT_SEASON_NUMBER when progressing.
 */

export const CURRENT_SEASON_NUMBER = 4;
export const NEXT_SEASON_NUMBER = 5;

/**
 * false  → Season has concluded; S4 data is archived.
 *          Live standings/matches/leaderboard are hidden on the main site.
 * true   → A season is actively running; show live data everywhere.
 */
export const CURRENT_SEASON_ACTIVE = false;
