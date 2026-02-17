import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

/**
 * Parse score rounds (R1, R2, R3) and calculate total
 * Returns winner's score and loser's score
 */
const parseMatchScore = (row) => {
  const team1 = row['Team 1'] || row.team1 || '';
  const team2 = row['Team 2'] || row.team2 || '';
  
  // Get round scores for Team 1
  const t1r1 = parseInt(row['Team 1 R1'] || row['T1 R1'] || 0);
  const t1r2 = parseInt(row['Team 1 R2'] || row['T1 R2'] || 0);
  const t1r3 = parseInt(row['Team 1 R3'] || row['T1 R3'] || 0);
  const team1Total = t1r1 + t1r2 + t1r3;

  // Get round scores for Team 2
  const t2r1 = parseInt(row['Team 2 R1'] || row['T2 R1'] || 0);
  const t2r2 = parseInt(row['Team 2 R2'] || row['T2 R2'] || 0);
  const t2r3 = parseInt(row['Team 2 R3'] || row['T2 R3'] || 0);
  const team2Total = t2r1 + t2r2 + t2r3;

  // Check for forfeit
  const forfeit = row['Forfeit'] || row.forfeit || '';
  const isForfeit = forfeit && forfeit.toLowerCase() !== 'no' && forfeit.toLowerCase() !== 'false';

  return {
    team1,
    team2,
    team1Score: team1Total,
    team2Score: team2Total,
    team1Won: team1Total > team2Total,
    team2Won: team2Total > team1Total,
    isForfeit,
    forfeitTeam: isForfeit ? forfeit : null,
  };
};

/**
 * Hook to fetch match results from Google Sheets
 * Shows completed matches with scores (winner in green, loser in red)
 */
export const useMatchResults = () => {
  const config = getRosterConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.matchResults,
    config.apiKey
  );

  // Transform Google Sheets data to app format
  const matchResults = data.map(row => {
    const scoreData = parseMatchScore(row);
    
    return {
      id: row.id,
      week: row['Week'] || row.week || '',
      matchDate: row['Date'] || row['Match Date'] || row.date || '',
      ...scoreData,
      round: row['Round'] || row.round || '',
      division: row['Division'] || row.division || '',
    };
  }).filter(match => match.team1 && match.team2 && (match.team1Score > 0 || match.team2Score > 0)); // Filter out empty/unplayed matches

  return { matchResults, loading, error, refetch };
};
