import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

export const useTeams = () => {
  const config = getRosterConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.rosterWide,
    config.apiKey
  );

  // Transform Google Sheets data to app format
  const teams = data.map(row => ({
    id: row.id,
    name: row['Team Name'] || row.Team || row.name || '',
    captain: row['Captain'] || row.captain || '',
    coCaptain: row['Co-Captain'] || row['Co Captain'] || row.coCaptain || '',
    players: [
      row['Player 1'] || row.player1 || '',
      row['Player 2'] || row.player2 || '',
      row['Player 3'] || row.player3 || '',
      row['Player 4'] || row.player4 || ''
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
