import { useState, useEffect } from 'react';
import { EmlScheduleResultsBoard } from '@api/BoardSDK.js';

const board = new EmlScheduleResultsBoard();

export const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const allMatches = [];
      let cursor = null;

      // Fetch all pages
      do {
        const result = await board.items()
          .withColumns(['matchDate', 'status', 'score', 'streamLink', 'participatingTeams'])
          .withPagination(cursor ? { cursor } : { limit: 100 })
          .execute();

        allMatches.push(...result.items);
        cursor = result.cursor;
      } while (cursor);

      setMatches(allMatches);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return { matches, loading, error, refetch: fetchMatches };
};
