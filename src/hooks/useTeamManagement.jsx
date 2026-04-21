import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { emlApi } from './useEmlApi';

export const useTeamManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wrap = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeam = useCallback((data) => wrap(() => emlApi('POST', '/team/create', {
    captainDiscordId: user.id,
    captainUsername: user.username,
    ...data,
  })), [user, wrap]);

  const getTeam = useCallback((teamId) => emlApi('GET', `/team/${teamId}`), []);

  const invitePlayer = useCallback((teamId, targetDiscordId, targetUsername) => wrap(() =>
    emlApi('POST', '/team/invite', { teamId, captainDiscordId: user.id, targetDiscordId, targetUsername })
  ), [user, wrap]);

  const respondToInvite = useCallback((inviteId, accept) => wrap(() =>
    emlApi('POST', '/team/invite/respond', { inviteId, discordId: user.id, accept })
  ), [user, wrap]);

  const kickPlayer = useCallback((teamId, targetDiscordId) => wrap(() =>
    emlApi('POST', '/team/kick', { teamId, captainDiscordId: user.id, targetDiscordId })
  ), [user, wrap]);

  const leaveTeam = useCallback((teamId) => wrap(() =>
    emlApi('POST', '/team/leave', { teamId, discordId: user.id })
  ), [user, wrap]);

  const transferCaptain = useCallback((teamId, newCaptainDiscordId) => wrap(() =>
    emlApi('POST', '/team/transfer', { teamId, captainDiscordId: user.id, newCaptainDiscordId })
  ), [user, wrap]);

  const disbandTeam = useCallback((teamId) => wrap(() =>
    emlApi('POST', '/team/disband', { teamId, captainDiscordId: user.id })
  ), [user, wrap]);

  const registerProfile = useCallback((region) => wrap(() =>
    emlApi('POST', '/player/register', {
      discordId: user.id,
      username: user.username,
      globalName: user.globalName,
      avatar: user.avatar,
      region,
    })
  ), [user, wrap]);

  const getProfile = useCallback((discordId) => emlApi('GET', `/player/${discordId || user?.id}`), [user]);

  return { createTeam, getTeam, invitePlayer, respondToInvite, kickPlayer, leaveTeam, transferCaptain, disbandTeam, registerProfile, getProfile, loading, error };
};
