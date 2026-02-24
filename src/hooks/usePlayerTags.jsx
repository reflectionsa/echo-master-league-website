import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch player tags/nameplates
 * Columns: Player Name, Tag, Type, Description
 */
export function usePlayerTags() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'playerTags');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setTags([]);
      return;
    }

    // Parse player tags
    const parsedTags = data.slice(1).map((row, index) => {
      const [
        playerName,
        tag,
        type,
        description
      ] = row;

      return {
        id: index,
        playerName: playerName || 'Unknown',
        tag: tag || '',
        type: type || 'Achievement', // Achievement, Champion, Fun, Legacy, etc.
        description: description || '',
      };
    });

    setTags(parsedTags);
  }, [data]);

  /**
   * Get tags for a specific player
   */
  const getPlayerTags = (playerName) => {
    return tags.filter(
      tag => tag.playerName.toLowerCase() === playerName.toLowerCase()
    );
  };

  /**
   * Get tags by type
   */
  const getTagsByType = (type) => {
    return tags.filter(
      tag => tag.type.toLowerCase() === type.toLowerCase()
    );
  };

  return {
    tags,
    loading,
    error,
    refetch,
    getPlayerTags,
    getTagsByType,
  };
}
