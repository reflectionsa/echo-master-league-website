import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useTeamRoles } from './useTeamRoles';
import { useStandings } from './useStandings';
import { useMatchResults } from './useMatchResults';

/**
 * Returns the logged-in user's team, their role on it, standings data,
 * and recent match history. Returns { isOnTeam: false } if not on any roster.
 */
export const useMyTeam = () => {
  const { user, isLoggedIn } = useAuth();
  const { teams, loading: teamsLoading } = useTeamRoles();
  const { standings } = useStandings();
  const { matchResults, loading: matchesLoading } = useMatchResults();

  const { team, myRole } = useMemo(() => {
    if (!isLoggedIn || !user || !teams?.length) return { team: null, myRole: null };

    // Match on Discord global name and username (case-insensitive)
    const names = [user.globalName, user.username]
      .filter(Boolean)
      .map(n => n.toLowerCase());

    for (const t of teams) {
      if (names.includes((t.captain || '').toLowerCase())) return { team: t, myRole: 'Captain' };
      if (names.includes((t.coCaptain || '').toLowerCase())) return { team: t, myRole: 'Co-Captain' };
      if ((t.players || []).some(p => names.includes(p.toLowerCase()))) return { team: t, myRole: 'Player' };
    }

    return { team: null, myRole: null };
  }, [user, teams, isLoggedIn]);

  const standingsData = useMemo(() => {
    if (!team) return null;
    return standings.find(s => s.team === team.name) || null;
  }, [team, standings]);

  const matchHistory = useMemo(() => {
    if (!team || !matchResults) return [];
    const teamName = team.name;

    return matchResults
      .filter(m => m.team1 === teamName || m.team2 === teamName)
      .map(match => {
        const isTeam1 = match.team1 === teamName;
        const myScore = isTeam1 ? match.team1Score : match.team2Score;
        const theirScore = isTeam1 ? match.team2Score : match.team1Score;
        const opponent = isTeam1 ? match.team2 : match.team1;

        let matchDate = new Date(0);
        if (match.matchDate) {
          const parts = match.matchDate.split('/');
          if (parts.length === 3) matchDate = new Date(parts[2], parts[0] - 1, parts[1]);
        }

        return {
          opponent,
          myScore,
          theirScore,
          result: myScore > theirScore ? 'W' : myScore < theirScore ? 'L' : 'D',
          date: matchDate,
          week: match.week,
        };
      })
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  }, [team, matchResults]);

  return {
    team,
    myRole,
    isOnTeam: !!team,
    standingsData,
    matchHistory,
    loading: teamsLoading || matchesLoading,
  };
};
