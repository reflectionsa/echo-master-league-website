import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Hook to fetch matches from the NA PBLC MATCHES sheet
 * This sheet contains match assignments with team rankings
 */
export const useMatches = () => {
  const config = getRosterConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.matches, // Using the new NA PBLC MATCHES range
    config.apiKey
  );

  // Transform Google Sheets data to app format
  // Proposed Match Results headers: Team Submitting Scores | Team Accepting Scores | Match Status |
  //   Team A Round 1 | Team B Round 1 | Team A Round 2 | Team B Round 2 | Team A Round 3 | Team B Round 3 | Proposed Result
  const matches = data.map(row => {
    const team1 = row['Team Submitting Scores'] || row['Team 1'] || row['Home Team'] || row.team1 || '';
    const team2 = row['Team Accepting Scores'] || row['Team 2'] || row['Away Team'] || row.team2 || '';

    // Parse round scores if available
    const t1r1 = parseInt(row['Team A Round 1'] || 0);
    const t1r2 = parseInt(row['Team A Round 2'] || 0);
    const t1r3 = parseInt(row['Team A Round 3'] || 0);
    const t2r1 = parseInt(row['Team B Round 1'] || 0);
    const t2r2 = parseInt(row['Team B Round 2'] || 0);
    const t2r3 = parseInt(row['Team B Round 3'] || 0);
    const team1Score = t1r1 + t1r2 + t1r3;
    const team2Score = t2r1 + t2r2 + t2r3;

    return {
      id: row.id,
      matchDate: null,
      matchTime: '',
      team1,
      team2,
      score: (team1Score || team2Score) ? `${team1Score} - ${team2Score}` : '',
      status: row['Match Status'] || row['Status'] || row.status || 'Pending',
      matchType: row['Match Type'] || row.matchType || '',
      week: row['Week'] || row.week || '',
      round: row['Round'] || row.round || '',
      proposedResult: row['Proposed Result'] || '',
      streamLink: {
        url: '',
        platform: 'Twitch'
      },
    };
  }).filter(match => match.team1 && match.team2); // Filter out empty rows

  return { matches, loading, error, refetch };
};
