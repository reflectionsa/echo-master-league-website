import { useMatchResults } from './useMatchResults';
import { useTeamRoles } from './useTeamRoles';

export const useSchedule = () => {
  const { matchResults, loading } = useMatchResults();
  const { teams } = useTeamRoles();

  // Transform match results into schedule format
  const matches = (matchResults || []).map(match => {
    // Parse date from sheet (format: M/D/YYYY)
    let matchDate = new Date();
    if (match.matchDate) {
      const dateParts = match.matchDate.split('/');
      if (dateParts.length === 3) {
        matchDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
      }
    }

    // Determine status based on match data
    let status = 'Scheduled';
    if (match.team1Score > 0 || match.team2Score > 0 || match.isForfeit) {
      status = 'Completed';
    } else if (match.matchStatus?.toLowerCase().includes('live')) {
      status = 'Live';
    }

    // Find team IDs from roster
    const team1Data = teams.find(t => t.name === match.team1);
    const team2Data = teams.find(t => t.name === match.team2);

    return {
      id: match.id || `match-${match.week}`,
      name: `${match.team1} vs ${match.team2}`,
      matchDate,
      status,
      score: status === 'Completed' ? `${match.team1Score} - ${match.team2Score}` : null,
      streamLink: { url: 'https://www.twitch.tv/echomasterleague', label: 'Watch' },
      week: match.week,
      matchType: match.matchType,
      participatingTeams: {
        linkedItems: [
          { id: team1Data?.id || match.team1, name: match.team1 },
          { id: team2Data?.id || match.team2, name: match.team2 }
        ]
      }
    };
  }).sort((a, b) => a.matchDate - b.matchDate);

  return { matches, loading };
};
