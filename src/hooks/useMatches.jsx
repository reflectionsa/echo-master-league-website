import { useGoogleSheets } from './useGoogleSheets';
import { getTournamentConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Hook to fetch matches from the NA PBLC MATCHES sheet
 * This sheet contains match assignments with team rankings
 */
export const useMatches = () => {
  const config = getTournamentConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.matches, // Using the new NA PBLC MATCHES range
    config.apiKey
  );

  // Transform Google Sheets data to app format
  const matches = data.map(row => {
    // Parse date if available
    let matchDate = null;
    const dateStr = row['Match Date'] || row['Date'] || row.date || '';
    if (dateStr) {
      try {
        matchDate = new Date(dateStr);
      } catch (e) {
        console.warn('Invalid date:', dateStr);
      }
    }

    return {
      id: row.id,
      matchDate: matchDate,
      matchTime: row['Match Time'] || row['Time'] || row.time || '',
      team1: row['Team 1'] || row['Home Team'] || row.team1 || row.home || '',
      team2: row['Team 2'] || row['Away Team'] || row.team2 || row.away || '',
      score: row['Score'] || row['Final Score'] || row.score || '',
      status: row['Status'] || row.status || 'Scheduled',
      week: row['Week'] || row.week || '',
      round: row['Round'] || row.round || '',
      streamLink: {
        url: row['Stream Link'] || row['Stream URL'] || row.streamLink || '',
        platform: row['Stream Platform'] || 'Twitch'
      },
      division: row['Division'] || row.division || '',
      bracket: row['Bracket'] || row.bracket || '',
      // Additional fields that might be in NA PBLC MATCHES
      courtAssignment: row['Court'] || row['Court Assignment'] || row.court || '',
      referee: row['Referee'] || row.referee || '',
      notes: row['Notes'] || row.notes || '',
    };
  }).filter(match => match.team1 && match.team2); // Filter out empty rows

  return { matches, loading, error, refetch };
};
