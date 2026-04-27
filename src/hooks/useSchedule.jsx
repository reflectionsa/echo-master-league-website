import { useMatchResults } from './useMatchResults';
import { useTeamRoles } from './useTeamRoles';
import { useGoogleSheets } from './useGoogleSheets';
import { getRosterConfig, GOOGLE_SHEETS_CONFIG } from '../../config/sheets';
import { useMemo } from 'react';

export const useSchedule = () => {
  const { matchResults, loading: resultsLoading } = useMatchResults();
  const { teams } = useTeamRoles();

  const config = getRosterConfig();
  const { data: upcomingData, loading: upcomingLoading } = useGoogleSheets(
    config.spreadsheetId,
    GOOGLE_SHEETS_CONFIG.ranges.upcomingMatches,
    config.apiKey
  );

  const matches = useMemo(() => {
    const parseDate = (raw) => {
      if (!raw) return null;
      const parts = String(raw).split('/');
      if (parts.length === 3) return new Date(parts[2], parts[0] - 1, parts[1]);
      const d = new Date(raw);
      return isNaN(d) ? null : d;
    };

    // Completed matches from matchResults
    const completed = (matchResults || []).map(match => {
      const matchDate = parseDate(match.matchDate);
      const team1Data = teams.find(t => t.name === match.team1);
      const team2Data = teams.find(t => t.name === match.team2);
      return {
        id: match.id || `match-${match.week}`,
        name: `${match.team1} vs ${match.team2}`,
        matchDate: matchDate || new Date(),
        status: 'Completed',
        score: `${match.team1Score} - ${match.team2Score}`,
        streamLink: { url: '', label: 'Watch' },
        week: match.week,
        matchType: match.matchType,
        participatingTeams: {
          linkedItems: [
            { id: team1Data?.id || match.team1, name: match.team1 },
            { id: team2Data?.id || match.team2, name: match.team2 }
          ]
        }
      };
    });

    // Upcoming/scheduled matches from the Upcoming Matches sheet tab
    const upcoming = (upcomingData || []).map((row, idx) => {
      const team1 = row['Team A'] || row['Team 1'] || row['Home Team'] || '';
      const team2 = row['Team B'] || row['Team 2'] || row['Away Team'] || '';
      if (!team1 && !team2) return null;

      const matchDate = parseDate(row['Match Date'] || row['Date'] || '');
      const rawStatus = row['Match Type'] || row['Status'] || row['status'] || 'Scheduled';
      // "Assigned" in Match Type means it's scheduled
      let status = 'Scheduled';
      if (rawStatus.toLowerCase().includes('live')) status = 'Live';
      else if (rawStatus.toLowerCase().includes('complete')) status = 'Completed';

      const streamUrl = row['Stream Link'] || row['Stream URL'] || '';
      const team1Data = teams.find(t => t.name === team1);
      const team2Data = teams.find(t => t.name === team2);

      return {
        id: row.id || `upcoming-${idx}`,
        name: `${team1} vs ${team2}`,
        matchDate,
        status,
        score: null,
        streamLink: { url: streamUrl, label: 'Watch' },
        week: row['Week'] || row['week'] || '',
        matchType: row['Match Type'] || row['matchType'] || '',
        participatingTeams: {
          linkedItems: [
            { id: team1Data?.id || team1, name: team1 },
            { id: team2Data?.id || team2, name: team2 }
          ]
        }
      };
    }).filter(Boolean);

    return [...completed, ...upcoming].sort((a, b) => (a.matchDate || 0) - (b.matchDate || 0));
  }, [matchResults, upcomingData, teams]);

  return { matches, loading: resultsLoading || upcomingLoading };
};
