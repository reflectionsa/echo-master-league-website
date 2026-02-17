import { useState, useEffect } from 'react';
import { useTeamRoles } from './useTeamRoles';
import { useStandings } from './useStandings';
import { useMatchResults } from './useMatchResults';

// Get actual match history from Google Sheets for a specific team
const getTeamMatchHistory = (teamName, matchResults) => {
  if (!matchResults || !teamName) return [];

  const teamMatches = matchResults
    .filter(match => match.team1 === teamName || match.team2 === teamName)
    .map(match => {
      const isTeam1 = match.team1 === teamName;
      const teamScore = isTeam1 ? match.team1Score : match.team2Score;
      const opponentScore = isTeam1 ? match.team2Score : match.team1Score;
      const opponent = isTeam1 ? match.team2 : match.team1;

      // Parse date from sheet (format: M/D/YYYY)
      let matchDate = new Date();
      if (match.matchDate) {
        const dateParts = match.matchDate.split('/');
        if (dateParts.length === 3) {
          matchDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
        }
      }

      return {
        id: match.id || `match-${teamName}-${match.week}`,
        opponent: opponent,
        score: `${teamScore} - ${opponentScore}`,
        status: match.isForfeit
          ? (teamScore > opponentScore ? 'FF Win' : 'FF Loss')
          : (teamScore > opponentScore ? 'Won' : teamScore < opponentScore ? 'Lost' : 'Draw'),
        matchDate,
        matchType: match.matchType || 'Regular',
        week: match.week,
        caster: null,
        streamLink: {
          url: 'https://www.twitch.tv/echomasterleague',
          label: 'Twitch VOD'
        },
        votes: 0,
      };
    });

  return teamMatches.sort((a, b) => b.matchDate - a.matchDate);
};

export const useTeamProfile = (teamName) => {
  const [team, setTeam] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [mmr, setMMR] = useState(800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { teams, loading: teamsLoading } = useTeamRoles();
  const { standings, loading: standingsLoading } = useStandings();
  const { matchResults, loading: matchResultsLoading } = useMatchResults();

  useEffect(() => {
    if (!teamName) {
      setLoading(false);
      return;
    }

    if (standingsLoading || matchResultsLoading || teamsLoading) {
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    // Find team in roster data
    const foundTeam = teams.find(t => t.name === teamName);

    if (!foundTeam) {
      setError('Team not found');
      setLoading(false);
      return;
    }

    // Get actual tier and MMR from standings data
    const standingsData = standings.find(s => s.team === teamName);

    // Parse tier from standings (e.g., "Diamond 1" -> "Diamond")
    let tier = 'Unranked';
    if (standingsData?.tier) {
      const tierMatch = standingsData.tier.match(/^(Master|Diamond|Platinum|Gold|Silver|Bronze)/i);
      tier = tierMatch ? tierMatch[1] : standingsData.tier;
    }

    // Team data structure
    const teamData = {
      id: foundTeam.id.toString(),
      name: foundTeam.name,
      tier: tier,
      captain: foundTeam.captain,
      coCaptain: foundTeam.coCaptain,
      players: foundTeam.players,
      teamLogo: {
        url: 'https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024',
        label: 'EML Logo'
      }
    };

    setTeam(teamData);
    setMMR(standingsData?.mmr || 800);
    setMatchHistory(getTeamMatchHistory(teamName, matchResults));
    setLoading(false);
  }, [teamName, standings, standingsLoading, matchResults, matchResultsLoading, teams, teamsLoading]);

  return { team, matchHistory, mmr, loading, error };
};
