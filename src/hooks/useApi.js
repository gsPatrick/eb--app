import { useCallback, useEffect, useState } from 'react';
import { usePanelLoading } from '../context/AuthContext';

export function useApi(fetcher, deps = [], options = {}) {
  const { setPanelLoading } = usePanelLoading();
  const { initialData = null, enabled = true } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return null;
    setLoading(true);
    setPanelLoading?.(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
      setPanelLoading?.(false);
    }
  }, [enabled, fetcher, setPanelLoading]);

  useEffect(() => {
    refetch();
  }, [refetch, ...deps]);

  return { data, setData, loading, error, refetch };
}
