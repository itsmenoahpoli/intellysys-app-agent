import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@renderer/utils/api';
import { useAppStore } from '@renderer/store/useAppStore';

export interface HealthCheckResponse {
  status: string;
  uptime: number;
}

export function useAgent(serverUrl?: string) {
  const queryClient = useQueryClient();
  const { isConnected, uptime, setConnected, setUptime } = useAppStore();

  const { data, isLoading: isChecking, isError, refetch } = useQuery<HealthCheckResponse>({
    queryKey: ['healthcheck', serverUrl],
    queryFn: async () => {
      if (!serverUrl) throw new Error('No server URL');
      return await api.get<HealthCheckResponse>('/health', {
        customBaseUrl: serverUrl,
      });
    },
    enabled: !!serverUrl,
  });

  useEffect(() => {
    if (data) {
      setConnected(true);
      setUptime(data.uptime);
    }
  }, [data, setConnected, setUptime]);

  useEffect(() => {
    if (isError) {
      setConnected(false);
    }
  }, [isError, setConnected]);

  const checkHealth = async (customUrl?: string) => {
    if (customUrl && customUrl !== serverUrl) {
      try {
        const res = await queryClient.fetchQuery({
          queryKey: ['healthcheck', customUrl],
          queryFn: async () => {
            return await api.get<HealthCheckResponse>('/health', {
              customBaseUrl: customUrl,
            });
          },
        });
        setConnected(true);
        setUptime(res.uptime);
        return res;
      } catch (err) {
        setConnected(false);
        throw err;
      }
    } else {
      const res = await refetch();
      return res.data;
    }
  };

  const reportMetrics = async (metrics: any, customUrl?: string) => {
    try {
      return await api.post<{ success: boolean }>('/agent/metrics', metrics, {
        customBaseUrl: customUrl || serverUrl,
      });
    } catch (err: any) {
      throw err;
    }
  };

  return {
    isConnected,
    isChecking,
    uptime,
    checkHealth,
    reportMetrics,
  };
}
