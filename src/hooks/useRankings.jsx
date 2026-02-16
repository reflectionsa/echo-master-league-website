import { useState, useEffect } from 'react';
import { teamRosters } from '../data/teamRosters';

const generateRankings = () => {
  const activeTeams = teamRosters.filter(t => t.status === 'Active');
  
  return activeTeams.map(team => ({
    id: team.id,
    name: team.name,
    captain: team.captain,
    tier: ['Master', 'Diamond', 'Gold', 'Silver', 'Bronze'][Math.floor(Math.random() * 5)],
    mmr: Math.floor(Math.random() * 101) + 800, // 800-900
    region: team.region || 'North America',
    teamLogo: {
      url: 'https://cdn.discordapp.com/avatars/1461558413971554392/791aa1c1bae16f1a423fa2e008279e39.webp?size=1024',
      label: 'EML Logo'
    }
  })).sort((a, b) => b.mmr - a.mmr);
};

export const useRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate async delay
    setTimeout(() => {
      setRankings(generateRankings());
      setLoading(false);
    }, 300);
  }, []);

  return { rankings, loading };
};
