import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch historical player data across seasons
 * Columns: Player Name, Season, Team, Placement, Stats, Achievements
 */
export function useHistoricalData() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'playerHistory');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setHistory([]);
      return;
    }

    // Parse historical data
    const parsedHistory = data.slice(1).map((row, index) => {
      const [
        playerName,
        season,
        team,
        placement,
        stats,
        achievements,
        notes
      ] = row;

      return {
        id: index,
        playerName: playerName || 'Unknown',
        season: season || 'Unknown',
        team: team || 'Free Agent',
        placement: placement || '-',
        stats: stats || '',
        achievements: achievements || '',
        notes: notes || '',
      };
    });

    setHistory(parsedHistory);
  }, [data]);

  /**
   * Get history for a specific player
   */
  const getPlayerHistory = (playerName) => {
    return history.filter(
      record => record.playerName.toLowerCase() === playerName.toLowerCase()
    );
  };

  /**
   * Get all seasons
   */
  const getSeasons = () => {
    const seasons = [...new Set(history.map(record => record.season))];
    return seasons.sort().reverse(); // Most recent first
  };

  return {
    history,
    loading,
    error,
    refetch,
    getPlayerHistory,
    getSeasons,
  };
}
