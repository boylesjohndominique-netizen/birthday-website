import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function and tracks { data, error, status }.
 * status: 'idle' | 'loading' | 'success' | 'error'
 * Re-runs whenever `deps` change. Safe against setting state after unmount.
 */
export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('loading');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await asyncFn();
      if (!mountedRef.current) return;
      if (result?.error) {
        setError(result.error);
        setStatus('error');
      } else {
        setData(result?.data ?? result);
        setStatus('success');
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError({ message: err.message || 'Something went wrong.' });
      setStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, error, status, isLoading: status === 'loading', isError: status === 'error', refetch: run };
}
