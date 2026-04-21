import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { emlApi } from './useEmlApi';

export const useNotifications = () => {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!isLoggedIn || !user?.id) return;
    setLoading(true);
    try {
      const data = await emlApi('GET', `/notifications/${user.id}`);
      setNotifications(data.notifications || []);
    } catch {
      // silently fail — notifications are non-critical
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetch]);

  const markRead = useCallback(async (ids) => {
    if (!user?.id) return;
    try {
      await emlApi('POST', '/notifications/read', { userId: user.id, ids });
      setNotifications(prev => prev.map(n => (!ids || ids.includes(n.id)) ? { ...n, read: true } : n));
    } catch { /* ignore */ }
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, markRead, unreadCount, refresh: fetch };
};
