import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';
import { useDataJson } from './useDataJson';

export const useTeams = () => {
  const { data: jsonData, loading: jsonLoading, error: jsonError } = useDataJson('teams');
  const useSheets = !jsonLoading && (jsonError || !jsonData || jsonData.length === 0);

  const config = getRosterConfig();
  const { data, loading: sheetsLoading, error: sheetsError, refetch } = useGoogleSheets(
    useSheets ? config.spreadsheetId : null,
    GOOGLE_SHEETS_CONFIG.ranges.rosterWide,
    useSheets ? config.apiKey : null
  );

  // If JSON data is available, return it directly (already transformed)
  if (!jsonLoading && jsonData && jsonData.length > 0) {
    return { teams: jsonData, loading: false, error: null, refetch: () => { } };
  }

  const loading = jsonLoading || (useSheets && sheetsLoading);
  const error = useSheets ? sheetsError : jsonError;

  // Transform Google Sheets data to app format
  // _RosterWide headers: Team | Captain | Co-Captain (CC) Player | Player | Player | Player | Player | Status
  // After duplicate-header processing: Player, Player_2, Player_3, Player_4
  const teams = data.map(row => ({
    id: row.id,
    name: row['Team Name'] || row['Team'] || row.name || '',
    captain: row['Captain'] || row.captain || '',
    coCaptain: (row['Co-Captain (CC) Player'] || row['Co-Captain'] || row['Co Captain'] || row.coCaptain || '').replace(/^\(CC\)\s*/, ''),
    players: [
      row['Player 1'] || row['Player'] || row.player1 || '',
      row['Player 2'] || row['Player_2'] || row.player2 || '',
      row['Player 3'] || row['Player_3'] || row.player3 || '',
      row['Player 4'] || row['Player_4'] || row.player4 || ''
    ].filter(Boolean),
    tier: row['Tier'] || row.tier || '',
    region: row['Region'] || row.region || 'NA',
    status: row['Status'] || row.status || 'Active',
    leaguePoints: parseInt(row['League Points'] || row.leaguePoints || row.Points || 0),
    wins: parseInt(row['Wins'] || row.wins || 0),
    losses: parseInt(row['Losses'] || row.losses || 0),
    teamLogo: row['Team Logo'] || row.teamLogo || row.Logo || '',
  })).filter(team => team.name); // Filter out empty rows

  return { teams, loading, error, refetch };
};
