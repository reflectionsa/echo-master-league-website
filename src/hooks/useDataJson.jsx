import { useState, useEffect } from 'react';

// Module-level cache so a single fetch serves all hooks that call this on the same render cycle
let _cache = null;
let _promise = null;

const fetchDataJson = () => {
    if (_cache) return Promise.resolve(_cache);
    if (_promise) return _promise;

    const base = import.meta.env.BASE_URL || '/';
    const url = base.endsWith('/') ? `${base}data.json` : `${base}/data.json`;

    _promise = fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`data.json fetch failed: ${res.status}`);
            return res.json();
        })
        .then(json => {
            _cache = json;
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
 * If the section is empty ([]) the caller should treat this as a signal to fall back
 * to the Google Sheets API.
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
    _promise = null;
};
