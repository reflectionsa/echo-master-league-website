import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';
import { useDataJson } from './useDataJson';

/**
 * Hook to fetch registered league substitute players from data.json or Google Sheets
 */
export const useLeagueSubs = () => {
    const { data: jsonData, loading: jsonLoading, error: jsonError } = useDataJson('leagueSubs');
    const useSheets = !jsonLoading && (jsonError || !jsonData || jsonData.length === 0);

    const config = getRosterConfig();
    const { data, loading: sheetsLoading, error: sheetsError, refetch } = useGoogleSheets(
        useSheets ? config.spreadsheetId : null,
        GOOGLE_SHEETS_CONFIG.ranges.registeredLeagueSubs,
        useSheets ? config.apiKey : null
    );

    // leagueSubs is an array of strings in data.json
    if (!jsonLoading && jsonData && jsonData.length > 0) {
        return { subs: jsonData, count: jsonData.length, loading: false, error: null, refetch: () => { } };
    }

    const loading = jsonLoading || (useSheets && sheetsLoading);
    const error = useSheets ? sheetsError : jsonError;

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

    console.log('League Subs loaded:', subs.length, 'subs'); // DEBUG
    if (subs.length > 0) {
        console.log('First 5 subs:', subs.slice(0, 5)); // DEBUG
    }

    return { subs, count: subs.length, loading, error, refetch };
};
