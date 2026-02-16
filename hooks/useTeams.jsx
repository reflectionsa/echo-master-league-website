import { useState, useEffect } from 'react';
import { EmlTeamsBoard } from '@api/BoardSDK.js';

const board = new EmlTeamsBoard();

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const allTeams = [];
      let cursor = null;

      // Fetch all pages
      do {
        const result = await board.items()
          .withColumns(['region', 'tier', 'captain', 'leaguePoints', 'teamLogo'])
          .withPagination(cursor ? { cursor } : { limit: 100 })
          .execute();

        allTeams.push(...result.items);
        cursor = result.cursor;
      } while (cursor);

      setTeams(allTeams);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { teams, loading, error, refetch: fetchTeams };
};
