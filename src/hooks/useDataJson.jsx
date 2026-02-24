import { useState, useEffect } from 'react';

// Module-level cache with TTL so a single fetch serves all hooks in the same render cycle
// but stale data is refreshed automatically
let _cache = null;
let _cacheTime = null;
let _promise = null;

const CACHE_TTL_MS = 5 * 60 * 1000;       // Re-fetch data.json every 5 minutes
const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // If lastUpdated > 2 hrs ago → fall through to live Sheets

const isCacheValid = () => {
    if (!_cache || !_cacheTime) return false;
    return (Date.now() - _cacheTime) < CACHE_TTL_MS;
};

const isDataStale = (json) => {
    if (!json?.lastUpdated) return true;
    const updated = new Date(json.lastUpdated).getTime();
    return (Date.now() - updated) > STALE_THRESHOLD_MS;
};

const fetchDataJson = () => {
    if (isCacheValid()) return Promise.resolve(_cache);
    if (_promise) return _promise;

    const base = import.meta.env.BASE_URL || '/';
    // Cache-bust with timestamp so the browser never serves a stale cached copy
    const url = `${base.endsWith('/') ? base : base + '/'}data.json?v=${Date.now()}`;

    _promise = fetch(url, { cache: 'no-cache' })
        .then(res => {
            if (!res.ok) throw new Error(`data.json fetch failed: ${res.status}`);
            return res.json();
        })
        .then(json => {
            _cache = json;
            _cacheTime = Date.now();
            _promise = null;
            return json;
        })
        .catch(err => {
            _promise = null;
            throw err;
        });

    return _promise;
};

/**
 * Returns a single section from public/data.json.
 *
 * @param {string} section  - Top-level key in data.json (e.g. 'teams', 'standings')
 * @returns {{ data: any[], loading: boolean, error: string|null }}
 *
 * Returns empty array (triggering Sheets fallback) when:
 *  - The section is genuinely empty, OR
 *  - data.json.lastUpdated is older than STALE_THRESHOLD_MS (2 hours)
 */
export const useDataJson = (section) => {
    const [data, setData] = useState(null);   // null = not yet loaded
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetchDataJson()
            .then(json => {
                if (cancelled) return;
                // If data.json itself is stale, return empty so hooks fall back to live Sheets
                if (isDataStale(json)) {
                    console.info(`[useDataJson] data.json is stale (lastUpdated: ${json.lastUpdated}), using live Sheets for "${section}"`);
                    setData([]);
                    setLoading(false);
                    return;
                }
                const sectionData = json[section];
                setData(Array.isArray(sectionData) ? sectionData : sectionData ?? null);
                setLoading(false);
            })
            .catch(err => {
                if (cancelled) return;
                setError(err.message);
                setLoading(false);
            });

        return () => { cancelled = true; };
    }, [section]);

    return { data, loading, error };
};

/** Invalidate the module-level cache (useful after the Apps Script pushes a new data.json) */
export const invalidateDataJsonCache = () => {
    _cache = null;
    _cacheTime = null;
    _promise = null;
};

