import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch player leaderboard/statistics
 * Columns: Player Name, Team, Wins, Losses, Goals, Assists, Saves, MVPs, Win Rate, etc.
 */
export function usePlayerLeaderboard() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'playerStats');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setPlayers([]);
      return;
    }

    // Parse the player stats
    const parsedPlayers = data.slice(1).map((row, index) => {
      const [
        playerName,
        team,
        wins,
        losses,
        goals,
        assists,
        saves,
        mvps,
        gamesPlayed,
        winRate,
        goalsPerGame,
        assistsPerGame,
        savesPerGame
      ] = row;

      return {
        id: index,
        playerName: playerName || 'Unknown',
        team: team || 'Free Agent',
        wins: parseInt(wins) || 0,
        losses: parseInt(losses) || 0,
        goals: parseInt(goals) || 0,
        assists: parseInt(assists) || 0,
        saves: parseInt(saves) || 0,
        mvps: parseInt(mvps) || 0,
        gamesPlayed: parseInt(gamesPlayed) || 0,
        winRate: parseFloat(winRate) || 0,
        goalsPerGame: parseFloat(goalsPerGame) || 0,
        assistsPerGame: parseFloat(assistsPerGame) || 0,
        savesPerGame: parseFloat(savesPerGame) || 0,
      };
    });

    setPlayers(parsedPlayers);
  }, [data]);

  return {
    players,
    loading,
    error,
    refetch,
  };
}
