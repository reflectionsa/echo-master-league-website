import { useState, useEffect } from 'react';
import { useGoogleSheets } from './useGoogleSheets';

/**
 * Hook to fetch team interviews
 * Columns: Title, Team, Date, URL, Interviewer, Description, Thumbnail
 */
export function useInterviews() {
  const { data, loading, error, refetch } = useGoogleSheets('roster', 'interviews');
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setInterviews([]);
      return;
    }

    // Parse interviews data
    const parsedInterviews = data.slice(1).map((row, index) => {
      const [
        title,
        team,
        date,
        url,
        interviewer,
        description,
        thumbnail
      ] = row;

      return {
        id: index,
        title: title || 'Team Interview',
        team: team || '',
        date: date || '',
        url: url || '',
        interviewer: interviewer || 'EML Staff',
        description: description || '',
        thumbnail: thumbnail || '',
      };
    });

    // Sort by date (most recent first)
    parsedInterviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    setInterviews(parsedInterviews);
  }, [data]);

  /**
   * Get interviews for a specific team
   */
  const getTeamInterviews = (teamName) => {
    return interviews.filter(
      interview => interview.team.toLowerCase() === teamName.toLowerCase()
    );
  };

  return {
    interviews,
    loading,
    error,
    refetch,
    getTeamInterviews,
  };
}
