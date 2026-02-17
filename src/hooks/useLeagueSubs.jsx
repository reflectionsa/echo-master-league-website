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
  const subs = data
    .map(row => {
      const playerName = row['Player Name'] || row.Player || row.player || row.name || '';
      return playerName;
    })
    .filter(Boolean); // Remove empty entries

  return { subs, count: subs.length, loading, error, refetch };
};
