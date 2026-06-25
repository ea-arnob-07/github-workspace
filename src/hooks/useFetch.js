import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for data fetching with loading, error, and caching.
 *
 * @param {Function} fetchFn - Async function that returns the data
 * @param {Array} deps - Dependencies array (re-fetches when these change)
 * @param {Object} options - { enabled, initialData }
 * @returns {{ data, loading, error, refetch }}
 */
export function useFetch(fetchFn, deps = [], options = {}) {
  const { enabled = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use ref to track if component is still mounted
  const mountedRef = useRef(true);
  // Store the latest fetchFn to avoid stale closures
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'An error occurred');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
