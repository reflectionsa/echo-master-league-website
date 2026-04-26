import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Fetches the Team History sheet to find previous teams for a player.
 * Columns expected: Player Name | Team | Season (and any extras)
 * Returns { getPlayerHistory(playerName) → [{ team, season }], loading }
 */
export const useTeamHistory = () => {
    const config = getRosterConfig();
    const { data, loading } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.teamHistory,
        config.apiKey
    );

    const getPlayerHistory = (playerName) => {
        if (!playerName || !data?.length) return [];
        const name = playerName.toLowerCase().trim();
        return data
            .filter(row => {
                const rName =
                    row['Player Name'] ||
                    row['Player'] ||
                    row['Name'] ||
                    row['name'] ||
                    '';
                return rName.toLowerCase().trim() === name;
            })
            .map(row => ({
                team: row['Team'] || row['Team Name'] || row['team'] || '',
                season: row['Season'] || row['season'] || '',
            }))
            .filter(r => r.team);
    };

    return { getPlayerHistory, loading };
};
