import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Hook to fetch registered league substitute players
 */
export const useLeagueSubs = () => {
    const config = getRosterConfig();
    const { data, loading, error, refetch } = useGoogleSheets(
        config.spreadsheetId,
        GOOGLE_SHEETS_CONFIG.ranges.registeredLeagueSubs,
        config.apiKey
    );

    // Transform Google Sheets data to app format
    // Handle various column formats - could be in any column
    const subs = data
        .map(row => {
            // Try to get player name from various possible column names
            const playerName =
                row['Player Name'] ||
                row['Player'] ||
                row['player'] ||
                row['name'] ||
                row['Name'] ||
                row['Substitute'] ||
                row['Sub'] ||
                // If none of those, get first non-empty value from row
                Object.values(row).find(val => val && typeof val === 'string' && val.trim()) || '';

            return playerName.trim();
        })
        .filter(Boolean); // Remove empty entries

    return { subs, count: subs.length, loading, error, refetch };
};
