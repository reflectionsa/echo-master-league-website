import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';
import { useDataJson } from './useDataJson';

export const useStandings = () => {
  const { data: jsonData, loading: jsonLoading, error: jsonError } = useDataJson('standings');
  const useSheets = !jsonLoading && (jsonError || !jsonData || jsonData.length === 0);

  const config = getRosterConfig();
  const { data, loading: sheetsLoading, error: sheetsError, refetch } = useGoogleSheets(
    useSheets ? config.spreadsheetId : null,
    GOOGLE_SHEETS_CONFIG.ranges.rankings,
    useSheets ? config.apiKey : null
  );

  if (!jsonLoading && jsonData && jsonData.length > 0) {
    return { standings: jsonData, loading: false, error: null, refetch: () => { } };
  }

  const loading = jsonLoading || (useSheets && sheetsLoading);
  const error = useSheets ? sheetsError : jsonError;

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
