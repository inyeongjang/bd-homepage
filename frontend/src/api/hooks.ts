/**
 * React Hooks for API calls
 */

import { useState, useEffect } from 'react';
import apiClient from './client';

export function useFetch<T>(
  fetcher: () => Promise<T>
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetcher();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}

export function useActivities() {
  return useFetch(() => apiClient.getActivities());
}

export function useActivityCategories() {
  return useFetch(() => apiClient.getActivityCategories());
}

export function useFaqs() {
  return useFetch(() => apiClient.getFaqs());
}

export function useRecruitInfo() {
  return useFetch(() => apiClient.getRecruitInfo());
}

export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiClient.healthCheck();
        setIsHealthy(true);
      } catch (error) {
        setIsHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return isHealthy;
}