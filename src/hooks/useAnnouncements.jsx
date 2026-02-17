import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch dynamic announcements from Google Sheets
 * Columns: Title, Content, Date, Author, Category, Priority
 */
export function useAnnouncements() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'announcements');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setAnnouncements([]);
      return;
    }

    // Parse announcements data
    const parsedAnnouncements = data.slice(1).map((row, index) => {
      const [
        title,
        content,
        date,
        author,
        category,
        priority
      ] = row;

      return {
        id: index,
        title: title || 'Announcement',
        content: content || '',
        date: date || new Date().toISOString(),
        author: author || 'EML Staff',
        category: category || 'General',
        priority: priority || 'Normal',
      };
    });

    // Sort by date (most recent first)
    parsedAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));

    setAnnouncements(parsedAnnouncements);
  }, [data]);

  /**
   * Get announcements by category
   */
  const getAnnouncementsByCategory = (category) => {
    return announcements.filter(
      announcement => announcement.category.toLowerCase() === category.toLowerCase()
    );
  };

  /**
   * Get high priority announcements
   */
  const getHighPriorityAnnouncements = () => {
    return announcements.filter(
      announcement => announcement.priority.toLowerCase() === 'high'
    );
  };

  return {
    announcements,
    loading,
    error,
    refetch,
    getAnnouncementsByCategory,
    getHighPriorityAnnouncements,
  };
}
