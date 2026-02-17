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
    position: parseInt(row['Position'] || row['Rank'] || row.position || idx + 1),
    tier: row['Tier'] || row.tier || '',
    team: row['Team'] || row['Team Name'] || row.team || '',
    region: row['Region'] || row.region || 'NA',
    wins: parseInt(row['Wins'] || row['W'] || row.wins || 0),
    losses: parseInt(row['Losses'] || row['L'] || row.losses || 0),
    mmr: parseInt(row['MMR'] || row['Rating'] || row.mmr || 0),
    points: parseInt(row['Points'] || row['League Points'] || row.points || 0),
  })).filter(team => team.team); // Filter out empty rows

  return { standings, loading, error, refetch };
};
