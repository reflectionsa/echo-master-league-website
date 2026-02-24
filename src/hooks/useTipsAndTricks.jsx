import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch tips and tricks videos
 * Columns: Title, URL, Category, Date, Description, Thumbnail, Duration
 */
export function useTipsAndTricks() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'tipsAndTricks');
  const [tips, setTips] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setTips([]);
      return;
    }

    // Parse tips data
    const parsedTips = data.slice(1).map((row, index) => {
      const [
        title,
        url,
        category,
        date,
        description,
        thumbnail,
        duration
      ] = row;

      return {
        id: index,
        title: title || 'Tip',
        url: url || '',
        category: category || 'General', // Humorous, Instructional, Strategy
        date: date || '',
        description: description || '',
        thumbnail: thumbnail || '',
        duration: duration || '',
      };
    });

    // Sort by date (most recent first), handling invalid dates
    parsedTips.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // Check for invalid dates
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
      if (isNaN(dateA.getTime())) return 1; // Invalid dates go to end
      if (isNaN(dateB.getTime())) return -1;
      
      return dateB - dateA;
    });

    setTips(parsedTips);
  }, [data]);

  /**
   * Get tips by category
   */
  const getTipsByCategory = (category) => {
    return tips.filter(
      tip => tip.category.toLowerCase() === category.toLowerCase()
    );
  };

  return {
    tips,
    loading,
    error,
    refetch,
    getTipsByCategory,
  };
}
