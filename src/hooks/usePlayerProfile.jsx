import { useState, useEffect } from 'react';
import { useTeamRoles } from './useTeamRoles';

export const usePlayerProfile = (playerName) => {
  const [team, setTeam] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { teams, loading: teamsLoading } = useTeamRoles();

  useEffect(() => {
    if (!playerName || teamsLoading) {
      setLoading(teamsLoading);
      return;
    }

    setLoading(true);

    // Search for player in roster data
    const foundTeam = teams.find(t => {
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
  }, [playerName, teams, teamsLoading]);

  return { team, playerRole, loading };
};
