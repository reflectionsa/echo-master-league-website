import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';
import { useDataJson } from './useDataJson';

export const usePlayerLeaderboard = () => {
    const { data: jsonData, loading: jsonLoading, error: jsonError } = useDataJson('playerLeaderboard');
    const useSheets = !jsonLoading && (jsonError || !jsonData || jsonData.length === 0);

    const config = getRosterConfig();
    const { data, loading: sheetsLoading, error: sheetsError, refetch } = useGoogleSheets(
        useSheets ? config.spreadsheetId : null,
        GOOGLE_SHEETS_CONFIG.ranges.playerLeaderboard,
        useSheets ? config.apiKey : null
    );

    if (!jsonLoading && jsonData && jsonData.length > 0) {
        // Transform and sort by overall rating
        const leaderboard = (jsonData || [])
            .map((player, idx) => ({
                id: idx + 1,
                position: idx + 1,
                name: player['Player Name'] || player['player'] || player.name || '',
                psr: parseInt(player['PSR'] || player.psr || 0),
                overallRating: parseInt(player['Overall Rating'] || player['overallRating'] || player['rating'] || 0),
                isMvp: player['MVP'] === 'Yes' || player['MVP'] === true || player.isMvp === true,
                team: player['Team'] || player.team || '',
            }))
            .filter(player => player.name)
            .sort((a, b) => b.overallRating - a.overallRating)
            .map((player, idx) => ({ ...player, position: idx + 1 }));

        return { leaderboard, loading: false, error: null, refetch: () => { } };
    }

    const loading = jsonLoading || (useSheets && sheetsLoading);
    const error = useSheets ? sheetsError : jsonError;

    // Transform Google Sheets data to app format
    const leaderboard = (data || [])
        .map((row, idx) => ({
            id: idx + 1,
            position: idx + 1,
            name: row['Player Name'] || row['player'] || row.name || '',
            psr: parseInt(row['PSR'] || row.psr || 0),
            overallRating: parseInt(row['Overall Rating'] || row['overallRating'] || row['rating'] || 0),
            isMvp: row['MVP'] === 'Yes' || row['MVP'] === true || row.isMvp === true,
            team: row['Team'] || row.team || '',
        }))
        .filter(player => player.name)
        .sort((a, b) => b.overallRating - a.overallRating)
        .map((player, idx) => ({ ...player, position: idx + 1 }));

    return { leaderboard, loading, error, refetch };
};
