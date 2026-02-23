import { useState, useEffect, useCallback } from "react";

/**
 * Generic data-fetching hook.
 *
 * UserContext, TourContext, and ArtworkContext all previously contained
 * an identical try/catch/finally pattern for loading remote data into state.
 * This hook centralises that pattern so each context only needs to supply
 * the async fetch function.
 *
 * @param {Function} fetchFn   - Async function that returns the data to store.
 * @param {*}        [initial] - Initial state value (defaults to null).
 * @returns {{ data, loading, error, refresh }}
 *   - data:    The fetched value (or `initial` before the first fetch).
 *   - loading: True while a fetch is in progress.
 *   - error:   The error message string if the last fetch failed, else null.
 *   - refresh: Call this to manually re-trigger the fetch.
 */
export function useFetchData(fetchFn, initial = null) {
    const [data, setData] = useState(initial);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            console.error("useFetchData error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, error, refresh: fetch };
}
