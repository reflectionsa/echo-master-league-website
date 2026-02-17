import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

export const useStandings = () => {
  const config = getRosterConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.rankings,
    config.apiKey
  );

  console.log('Rankings sheet data loaded:', data.length, 'rows'); // DEBUG
  if (data.length > 0) {
    console.log('First ranking row:', data[0]); // DEBUG
    console.log('Column names:', Object.keys(data[0])); // DEBUG
  }

  // Transform Google Sheets data to app format
  const standings = data.map((row, idx) => {
    // Try multiple column name variations
    const teamName = row['team name'] || row['Team'] || row.team || row['Team Name'] || '';
    const rating = row['Rating'] || row['MMR'] || row.mmr || row.rating || '';
    const rank = row['Rank'] || row.tier || row.Tier || '';
    const active = row['Active'] || row.active || row.Status || 'Active';

    return {
      id: row.id || idx,
      position: idx + 1, // Use index as position since sheet is already sorted
      tier: rank,
      team: teamName,
      region: row['Region'] || row.region || 'NA',
      wins: parseInt(row['Wins'] || row['W'] || row.wins || 0),
      losses: parseInt(row['Losses'] || row['L'] || row.losses || 0),
      mmr: parseInt(rating || 0),
      points: parseInt(row['Points'] || row['League Points'] || row.points || 0),
      active: active,
    };
  }).filter(team => team.team); // Filter out empty rows

  return { standings, loading, error, refetch };
};
