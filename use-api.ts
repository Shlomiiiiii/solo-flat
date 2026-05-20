import { useEffect, useState, useCallback } from 'react';

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stable = useCallback(fetcher, deps);
  useEffect(() => {
    let c = false;
    setLoading(true);
    stable()
      .then((d) => !c && setData(d))
      .catch((e: any) => !c && setError(e.message))
      .finally(() => !c && setLoading(false));
    return () => {
      c = true;
    };
  }, [stable, tick]);
  return { data, loading, error, refetch: () => setTick((t) => t + 1) };
}
