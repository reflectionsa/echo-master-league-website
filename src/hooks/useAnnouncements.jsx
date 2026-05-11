import { useState, useEffect, useCallback, useRef } from 'react';
import { emlApi } from './useEmlApi';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // matches worker cache TTL

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const timerRef = useRef(null);

  const doFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emlApi('GET', '/announcements');
      setAnnouncements(data.announcements || []);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doFetch();
    timerRef.current = setInterval(doFetch, REFRESH_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [doFetch]);

  return { announcements, loading, error, refresh: doFetch, lastFetched };
};
