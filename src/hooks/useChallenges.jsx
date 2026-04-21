import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { emlApi } from './useEmlApi';

export const useChallenges = (teamId) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const data = await emlApi('GET', `/challenges/${teamId}`);
      setChallenges(data.challenges || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => { refresh(); }, [refresh]);

  const sendChallenge = useCallback(async (challengerTeamId, challengedTeamId) => {
    setError(null);
    try {
      const result = await emlApi('POST', '/challenge/send', {
        challengerTeamId,
        challengedTeamId,
        captainDiscordId: user?.id,
      });
      await refresh();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user, refresh]);

  const respondToChallenge = useCallback(async (challengeId, accept) => {
    setError(null);
    try {
      await emlApi('POST', '/challenge/respond', { challengeId, captainDiscordId: user?.id, accept });
      await refresh();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user, refresh]);

  return { challenges, loading, error, sendChallenge, respondToChallenge, refresh };
};
