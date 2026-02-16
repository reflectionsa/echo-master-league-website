import { useState, useEffect } from 'react';
import { teamRosters } from '../data/teamRosters';

// Generate random MMR between 800-900
const generateMMR = () => Math.floor(Math.random() * 101) + 800;

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
    const streamPlatform = Math.random() > 0.5 ? 'twitch' : 'youtube';
    
    matches.push({
      id: `match-${teamName}-${i}`,
      opponent: opponent.name,
      score: `${teamScore} - ${opponentScore}`,
      status: teamScore > opponentScore ? 'Won' : teamScore < opponentScore ? 'Lost' : 'Draw',
      matchDate,
      caster: isCasted ? 'CasterName' : null,
      streamLink: isCasted ? {
        url: streamPlatform === 'twitch' 
          ? 'https://www.twitch.tv/echomasterleague' 
          : 'https://www.youtube.com/@EchoMasterLeague',
        label: streamPlatform === 'twitch' ? 'Twitch VOD' : 'YouTube VOD'
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

  useEffect(() => {
    if (!teamName) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate async delay
    setTimeout(() => {
      const foundTeam = teamRosters.find(t => t.name === teamName);

      if (!foundTeam) {
        setError('Team not found');
        setLoading(false);
        return;
      }

      // Mock team data structure matching board schema
      const teamData = {
        id: foundTeam.id.toString(),
        name: foundTeam.name,
        tier: ['Master', 'Diamond', 'Platinum', 'Gold'][Math.floor(Math.random() * 4)],
        leaguePoints: Math.floor(Math.random() * 2000),
        captain: foundTeam.captain,
        coCaptain: foundTeam.coCaptain,
        players: foundTeam.players,
        teamLogo: {
          url: 'https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024',
          label: 'EML Logo'
        }
      };

      setTeam(teamData);
      setMMR(generateMMR());
      setMatchHistory(generateMatchHistory(teamName));
      setLoading(false);
    }, 300);
  }, [teamName]);

  return { team, matchHistory, mmr, loading, error };
};
