import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

export const useStandings = () => {
  const config = getRosterConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.rankings,
    config.apiKey
  );

  // Transform Google Sheets data to app format
  const standings = data.map((row, idx) => ({
    id: row.id,
    position: idx + 1, // Use index as position since sheet is already sorted
    tier: row['Rank'] || row.tier || '', // 'Rank' column has tier like "Master", "Diamond 4"
    team: row['team name'] || row['Team'] || row.team || '', // 'team name' is the actual column
    region: row['Region'] || row.region || 'NA',
    wins: parseInt(row['Wins'] || row['W'] || row.wins || 0),
    losses: parseInt(row['Losses'] || row['L'] || row.losses || 0),
    mmr: parseInt(row['Rating'] || row['MMR'] || row.mmr || 0), // 'Rating' is the actual column
    points: parseInt(row['Points'] || row['League Points'] || row.points || 0),
    active: row['Active'] || row.active || 'Yes',
  })).filter(team => team.team); // Filter out empty rows

  return { standings, loading, error, refetch };
};
