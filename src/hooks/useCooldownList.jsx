import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Hook to fetch cooldown list from Google Sheets
 * Shows players who are on cooldown and cannot participate in matches
 */
export const useCooldownList = () => {
    const config = getRosterConfig();
    const { data, loading, error, refetch } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.cooldownList,
        config.apiKey
    );

    // Transform Google Sheets data to app format
    // Cooldown List headers: Player Name | Team Left | Expires
    const cooldownPlayers = data.map(row => ({
        id: row.id,
        playerName: row['Player Name'] || row['Player'] || row.playerName || row.player || '',
        team: row['Team Left'] || row['Team'] || row['Team Name'] || row.team || '',
        cooldownUntil: row['Expires'] || row['Cooldown Until'] || row['Until'] || row.cooldownUntil || '',
        reason: row['Reason'] || row.reason || 'Team Transfer',
        eligibleDate: row['Expires'] || row['Eligible Date'] || row['Eligible'] || row.eligibleDate || '',
    })).filter(player => player.playerName); // Filter out empty rows

    return { cooldownPlayers, loading, error, refetch };
};
