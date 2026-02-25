import { useState, useEffect, useCallback } from "react";

/**
 * Generic data-fetching hook.
 *
 * UserContext, TourContext, and ArtworkContext all previously contained
 * an identical try/catch/finally pattern for loading remote data into state.
 * This hook centralises that pattern so each context only needs to supply
 * the async fetch function.
 */
export function useFetchData<T>(
    fetchFn: () => Promise<T>,
    initial?: T | null
): { data: T | null; loading: boolean; error: string | null; refresh: () => Promise<void> } {
    const [data, setData] = useState<T | null>(initial ?? null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn();
            setData(result);
        } catch (err: unknown) {
            console.error("useFetchData error:", err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, error, refresh: fetch };
}
