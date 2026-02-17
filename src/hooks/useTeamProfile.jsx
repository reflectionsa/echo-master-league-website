import { useState, useEffect } from 'react';
import { teamRosters } from '../data/teamRosters';
import { useStandings } from './useStandings';

// Generate random match history
const generateMatchHistory = (teamName) => {
  const matchCount = Math.floor(Math.random() * 6) + 5; // 5-10 matches
  const otherTeams = teamRosters.filter(t => t.name !== teamName && t.status === 'Active');
  const matches = [];

  for (let i = 0; i < matchCount; i++) {
    const opponent = otherTeams[Math.floor(Math.random() * otherTeams.length)];
    const teamScore = Math.floor(Math.random() * 4); // 0-3
    const opponentScore = Math.floor(Math.random() * 4);
    const daysAgo = Math.floor(Math.random() * 90); // Last 90 days
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() - daysAgo);

    const isCasted = Math.random() > 0.6;

    matches.push({
      id: `match-${teamName}-${i}`,
      opponent: opponent.name,
      score: `${teamScore} - ${opponentScore}`,
      status: teamScore > opponentScore ? 'Won' : teamScore < opponentScore ? 'Lost' : 'Draw',
      matchDate,
      caster: isCasted ? 'CasterName' : null,
      streamLink: isCasted ? {
        url: 'https://www.twitch.tv/echomasterleague',
        label: 'Twitch VOD'
      } : null,
      votes: Math.floor(Math.random() * 51), // 0-50 votes
    });
  }

  return matches.sort((a, b) => b.matchDate - a.matchDate);
};

export const useTeamProfile = (teamName) => {
  const [team, setTeam] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [mmr, setMMR] = useState(800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { standings, loading: standingsLoading } = useStandings();

  useEffect(() => {
    if (!teamName) {
      setLoading(false);
      return;
    }

    if (standingsLoading) {
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    // Find team in roster data
    const foundTeam = teamRosters.find(t => t.name === teamName);

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
    setMatchHistory(generateMatchHistory(teamName));
    setLoading(false);
  }, [teamName, standings, standingsLoading]);

  return { team, matchHistory, mmr, loading, error };
};
