import { useState, useEffect } from 'react';
import { teamRosters } from '../data/teamRosters';

const tiers = ['Master', 'Diamond', 'Platinum', 'Gold'];
const regions = ['NA', 'EU', 'APAC', 'LATAM'];

const generateStandings = () => {
  const activeTeams = teamRosters.filter(t => t.status === 'Active');
  
  return activeTeams.map((team, idx) => ({
    id: team.id,
    position: idx + 1,
    tier: tiers[Math.floor(Math.random() * tiers.length)],
    team: team.name,
    region: regions[Math.floor(Math.random() * regions.length)],
    wins: Math.floor(Math.random() * 15),
    losses: Math.floor(Math.random() * 10),
    mmr: Math.floor(Math.random() * 101) + 800, // 800-900
  })).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.mmr - a.mmr;
  }).map((team, idx) => ({ ...team, position: idx + 1 }));
};

export const useStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStandings(generateStandings());
      setLoading(false);
    }, 300);
  }, []);

  return { standings, loading };
};
