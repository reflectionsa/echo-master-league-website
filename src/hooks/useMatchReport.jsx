import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { emlApi } from './useEmlApi';

export const useMatchReport = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportMatch = useCallback(async (matchId, reporterTeam, rounds, forfeit, forfeitTeam) => {
    setLoading(true);
    setError(null);
    try {
      return await emlApi('POST', '/match/report', {
        matchId,
        reporterDiscordId: user?.id,
        reporterTeam,
        rounds,
        forfeit: !!forfeit,
        forfeitTeam: forfeitTeam || null,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const disputeMatch = useCallback(async (matchId, reason) => {
    setLoading(true);
    setError(null);
    try {
      return await emlApi('POST', '/match/dispute', { matchId, reporterDiscordId: user?.id, reason });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { reportMatch, disputeMatch, loading, error };
};
