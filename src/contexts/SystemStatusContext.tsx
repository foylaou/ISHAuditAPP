// contexts/SystemStatusContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSystemStatus } from "@/services/Test/healthService";
import { SystemStatus } from "@/types/System/systemType";

interface SystemStatusContextType {
  status: SystemStatus | null;
  isLoading: boolean;
  lastChecked: Date | null;
  checkStatus: () => Promise<void>;
  error: string | null;
}

const SystemStatusContext = createContext<SystemStatusContextType>({
  status: null,
  isLoading: true,
  lastChecked: null,
  checkStatus: async () => {},
  error: null
});

export function SystemStatusProvider({
  children,
  redirectOnError = true
}: {
  children: React.ReactNode;
  redirectOnError?: boolean;
}) {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 直接獲取系統狀態
      const systemStatus = await getSystemStatus();
      setStatus(systemStatus);
      setLastChecked(new Date());

      // 如果在維護頁面以外的頁面且系統不健康，則重定向
      if (redirectOnError &&
          !systemStatus.isApiAvailable &&
          window.location.pathname !== '/Maintenance') {
        router.push('/Maintenance');
        return;
      }

    } catch (error: unknown) {
      // 錯誤處理
      const errorMessage = error instanceof Error ? error.message : '系統檢查失敗';
      setError(errorMessage);
      console.error('Failed to check system status:', error);

      // 在發生錯誤時設置保守的系統狀態
      setStatus({
        isApiAvailable: false,
        isDatabaseAvailable: false,
        isInMaintenance: true,
        checkTime: new Date().toISOString(),
        details: {
          apiLatency: undefined,
          databaseLatency: undefined,
          activeConnections: undefined,
          systemLoad: undefined
        }
      });

      // 只在非維護頁面時重定向
      if (redirectOnError && window.location.pathname !== '/Maintenance') {
        router.push('/Maintenance');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 如果在維護頁面，將 redirectOnError 設為 false
    const isMaintenancePage = window.location.pathname === '/Maintenance';
    const shouldRedirect = redirectOnError && !isMaintenancePage;

    const performCheck = async () => {
      try {
        setIsLoading(true);
        const systemStatus = await getSystemStatus();
        setStatus(systemStatus);
        setLastChecked(new Date());
        setError(null);

        if (shouldRedirect && !systemStatus.isApiAvailable) {
          router.push('/Maintenance');
        }
      } catch (error) {
        console.error('Status check failed:', error);
        setError(error instanceof Error ? error.message : '系統檢查失敗');

        setStatus({
          isApiAvailable: false,
          isDatabaseAvailable: false,
          isInMaintenance: true,
          checkTime: new Date().toISOString(),
          details: {}
        });

        if (shouldRedirect) {
          router.push('/Maintenance');
        }
      } finally {
        setIsLoading(false);
      }
    };

    performCheck();
    const interval = setInterval(performCheck, 30000);

    return () => clearInterval(interval);
  }, [redirectOnError, router]);

  return (
    <SystemStatusContext.Provider
      value={{
        status,
        isLoading,
        lastChecked,
        checkStatus,
        error
      }}
    >
      {children}
    </SystemStatusContext.Provider>
  );
}

export function useSystemStatus() {
  const context = useContext(SystemStatusContext);
  if (context === undefined) {
    throw new Error('useSystemStatus must be used within a SystemStatusProvider');
  }
  return context;
}

export type { SystemStatusContextType };
