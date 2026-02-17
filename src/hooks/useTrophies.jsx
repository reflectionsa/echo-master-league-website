import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch team trophies and achievements
 * Columns: Team Name, Tournament, Season, Placement, Date, Trophy Type
 */
export function useTrophies() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'trophies');
  const [trophies, setTrophies] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setTrophies([]);
      return;
    }

    // Parse trophy data
    const parsedTrophies = data.slice(1).map((row, index) => {
      const [
        teamName,
        tournament,
        season,
        placement,
        date,
        trophyType
      ] = row;

      return {
        id: index,
        teamName: teamName || 'Unknown',
        tournament: tournament || 'EML',
        season: season || 'Unknown',
        placement: placement || '-',
        date: date || '',
        trophyType: trophyType || placement || '1st', // Fall back to placement
      };
    });

    setTrophies(parsedTrophies);
  }, [data]);

  /**
   * Get trophies for a specific team
   */
  const getTeamTrophies = (teamName) => {
    return trophies.filter(
      trophy => trophy.teamName.toLowerCase() === teamName.toLowerCase()
    );
  };

  /**
   * Get championship count for a team
   */
  const getChampionshipCount = (teamName) => {
    return trophies.filter(
      trophy => 
        trophy.teamName.toLowerCase() === teamName.toLowerCase() &&
        (trophy.placement === '1st' || trophy.trophyType === '1st')
    ).length;
  };

  return {
    trophies,
    loading,
    error,
    refetch,
    getTeamTrophies,
    getChampionshipCount,
  };
}
