import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';

export const useMatches = () => {
  const config = getRosterConfig();
  const { data, loading, error, refetch } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.upcomingMatches,
    config.apiKey
  );

  // Transform Google Sheets data to app format
  const matches = data.map(row => ({
    id: row.id,
    matchDate: row['Match Date'] || row['Date'] || row.date || '',
    matchTime: row['Match Time'] || row['Time'] || row.time || '',
    team1: row['Team 1'] || row.team1 || '',
    team2: row['Team 2'] || row.team2 || '',
    score: row['Score'] || row.score || '',
    status: row['Status'] || row.status || 'Scheduled',
    week: row['Week'] || row.week || '',
    round: row['Round'] || row.round || '',
    streamLink: row['Stream Link'] || row.streamLink || '',
    division: row['Division'] || row.division || '',
  })).filter(match => match.team1 && match.team2); // Filter out empty rows

  return { matches, loading, error, refetch };
};
