import { useState, useEffect } from 'react';
import { teamRosters } from '../data/teamRosters';

const generateMatches = () => {
  const activeTeams = teamRosters.filter(t => t.status === 'Active');
  const matches = [];
  const matchCount = 12;

  for (let i = 0; i < matchCount; i++) {
    // Pick two random different teams
    const team1 = activeTeams[Math.floor(Math.random() * activeTeams.length)];
    let team2 = activeTeams[Math.floor(Math.random() * activeTeams.length)];
    while (team2.id === team1.id) {
      team2 = activeTeams[Math.floor(Math.random() * activeTeams.length)];
    }

    const daysFromNow = i < 6 ? Math.floor(Math.random() * 30) : -Math.floor(Math.random() * 30); // Future or past
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() + daysFromNow);

    const statuses = ['Scheduled', 'Live', 'Completed'];
    const status = daysFromNow > 0 ? 'Scheduled' : (Math.random() > 0.9 ? 'Live' : 'Completed');
    
    const team1Score = status === 'Completed' ? Math.floor(Math.random() * 4) : null;
    const team2Score = status === 'Completed' ? Math.floor(Math.random() * 4) : null;

    matches.push({
      id: `match-${i}`,
      name: `${team1.name} vs ${team2.name}`,
      matchDate,
      status,
      score: team1Score !== null ? `${team1Score} - ${team2Score}` : null,
      streamLink: Math.random() > 0.3 ? { url: 'https://www.twitch.tv/echomasterleague', label: 'Watch' } : null,
      participatingTeams: {
        linkedItems: [
          { id: team1.id, name: team1.name },
          { id: team2.id, name: team2.name }
        ]
      }
    });
  }

  return matches.sort((a, b) => a.matchDate - b.matchDate);
};

export const useSchedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate async delay
    setTimeout(() => {
      setMatches(generateMatches());
      setLoading(false);
    }, 300);
  }, []);

  return { matches, loading };
};
