import { useState, useEffect } from 'react';
import { teamRosters } from '../data/teamRosters';

export const usePlayerProfile = (playerName) => {
  const [team, setTeam] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerName) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Search for player in roster data
    const foundTeam = teamRosters.find(t => {
      if (t.captain === playerName) {
        setPlayerRole('Captain');
        return true;
      }
      if (t.coCaptain === playerName) {
        setPlayerRole('Co-Captain');
        return true;
      }
      if (t.players.includes(playerName)) {
        setPlayerRole('Player');
        return true;
      }
      return false;
    });

    setTeam(foundTeam);
    setLoading(false);
  }, [playerName]);

  return { team, playerRole, loading };
};
