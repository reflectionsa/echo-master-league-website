import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch video highlights
 * Columns: Title, URL, Platform, Date, Featured, Player, Description, Thumbnail
 */
export function useHighlights() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'highlights');
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setHighlights([]);
      return;
    }

    // Parse highlights data
    const parsedHighlights = data.slice(1).map((row, index) => {
      const [
        title,
        url,
        platform,
        date,
        featured,
        player,
        description,
        thumbnail
      ] = row;

      return {
        id: index,
        title: title || 'Untitled Highlight',
        url: url || '',
        platform: platform || 'YouTube',
        date: date || '',
        featured: featured?.toLowerCase() === 'true' || featured === '1',
        player: player || '',
        description: description || '',
        thumbnail: thumbnail || '',
      };
    });

    setHighlights(parsedHighlights);
  }, [data]);

  /**
   * Get featured highlights
   */
  const getFeaturedHighlights = () => {
    return highlights.filter(highlight => highlight.featured);
  };

  /**
   * Get highlights by platform
   */
  const getHighlightsByPlatform = (platform) => {
    return highlights.filter(
      highlight => highlight.platform.toLowerCase() === platform.toLowerCase()
    );
  };

  return {
    highlights,
    loading,
    error,
    refetch,
    getFeaturedHighlights,
    getHighlightsByPlatform,
  };
}
