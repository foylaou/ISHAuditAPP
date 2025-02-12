// services/Test/healthService.ts
import axios, { isAxiosError } from 'axios';
import {SystemStatus, StatusInfo, SystemInfo, HealthCheckResponse} from '@/types/System/systemType';

const api = axios.create({
  baseURL: '/proxy',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 健康檢查並重定向
export async function healthcheck(): Promise<void> {
  try {
    const response = await api.get<HealthCheckResponse>('/System/health');

    if (response.status === 200 && response.data.status === 'Healthy') {
      window.location.href = '/login';
      return;
    }

    window.location.href = '/Maintenance';

  } catch (error: unknown) {
    console.error('Health check failed:', error);

    if (isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    window.location.href = '/Maintenance';
  }
}

// 檢查系統是否健康
export async function isHealthy(): Promise<boolean> {
  try {
    const response = await api.get<HealthCheckResponse>('/System/health');
    return response.status === 200 && response.data.status === 'Healthy';
  } catch (error: unknown) {
    console.error('Health check failed:', error);

    if (isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        message: error.message
      });
    }

    return false;
  }
}

// 獲取系統狀態
export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    const response = await api.get<HealthCheckResponse>('/System/health');

    const status: SystemStatus = {
      isApiAvailable: response.status === 200 && response.data.status === 'Healthy',
      isDatabaseAvailable: response.data.details.database,
      isInMaintenance: response.data.details.maintenance,
      checkTime: response.data.timestamp,
      details: {
        apiLatency: undefined,
        databaseLatency: undefined,
        activeConnections: undefined,
        systemLoad: undefined
      }
    };

    // 記錄系統檢查
    // console.log('System Status Check:', {
    //   timestamp: status.checkTime,
    //   apiStatus: status.isApiAvailable ? 'Available' : 'Unavailable',
    //   dbStatus: status.isDatabaseAvailable ? 'Available' : 'Unavailable',
    //   maintenance: status.isInMaintenance ? 'Yes' : 'No'
    // });

    return status;

  } catch (error) {
    console.error('System status check failed:', error);

    // 發生錯誤時返回保守的狀態評估
    return {
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
    };
  }
}

// 取得狀態訊息
export function getStatusMessage(
  status: SystemStatus,
  systemInfo?: SystemInfo
): StatusInfo {
  // 系統完全不可用
  if (!status.isApiAvailable && !status.isDatabaseAvailable) {
    return {
      severity: 'error',
      title: '系統暫時無法使用',
      description: '系統目前遇到技術問題，所有服務暫時無法使用。我們的技術團隊已收到通知，正在全力搶修中。'
    };
  }

  // API 服務異常
  if (!status.isApiAvailable) {
    return {
      severity: 'error',
      title: 'API 服務異常',
      description: '系統 API 服務目前無法正常運作，部分功能可能無法使用。技術團隊正在處理此問題。'
    };
  }

  // 資料庫異常
  if (!status.isDatabaseAvailable) {
    return {
      severity: 'error',
      title: '資料庫連線異常',
      description: '系統資料庫服務異常，可能影響資料存取相關功能。技術團隊正在積極修復中。'
    };
  }

  // 計畫性維護
  if (status.isInMaintenance) {
    if (systemInfo?.status === 'Maintenance') {
      return {
        severity: 'info',
        title: '系統例行維護中',
        description: '我們正在進行系統例行維護，以提供更好的服務品質。所有服務將在維護完成後自動恢復。'
      };
    }
    return {
      severity: 'warning',
      title: '系統維護中',
      description: '系統正在進行維護作業，部分功能可能暫時無法使用。請稍後再試。'
    };
  }

  // 效能警告
  if (status.details) {
    const { apiLatency, systemLoad, activeConnections } = status.details;

    // 系統負載過高
    if (systemLoad && systemLoad > 80) {
      return {
        severity: 'warning',
        title: '系統負載較高',
        description: '系統目前負載較高，可能造成回應較慢。我們正在持續監控系統狀態。'
      };
    }

    // API 延遲過高
    if (apiLatency && apiLatency > 1000) {
      return {
        severity: 'warning',
        title: '系統回應較慢',
        description: '系統目前回應時間較長，我們正在進行效能優化。'
      };
    }

    // 連線數過高
    if (activeConnections && activeConnections > 1000) {
      return {
        severity: 'warning',
        title: '系統較為繁忙',
        description: '系統目前使用人數較多，可能造成部分功能回應較慢。'
      };
    }
  }

  // 一切正常
  return {
    severity: 'info',
    title: '系統運作正常',
    description: '所有系統服務都在正常運作中。'
  };
}

// 取得詳細狀態描述
export function getDetailedStatusDescription(
  status: SystemStatus,
  systemInfo?: SystemInfo
): string {
  const messages: string[] = [];

  if (systemInfo?.version) {
    messages.push(`系統版本: ${systemInfo.version}`);
  }

  if (systemInfo?.uptime) {
    messages.push(`運行時間: ${systemInfo.uptime}`);
  }

  if (status.details) {
    const { apiLatency, databaseLatency, systemLoad } = status.details;

    if (apiLatency) {
      messages.push(`API 延遲: ${apiLatency}ms`);
    }

    if (databaseLatency) {
      messages.push(`資料庫延遲: ${databaseLatency}ms`);
    }

    if (systemLoad) {
      messages.push(`系統負載: ${systemLoad}%`);
    }
  }

  return messages.join('\n');
}

// 計算狀態嚴重程度
export function getStatusSeverityLevel(status: SystemStatus): number {
  let severityLevel = 0;

  if (!status.isApiAvailable) severityLevel += 3;
  if (!status.isDatabaseAvailable) severityLevel += 3;
  if (status.isInMaintenance) severityLevel += 1;

  if (status.details) {
    const { apiLatency, systemLoad } = status.details;
    if (apiLatency && apiLatency > 1000) severityLevel += 1;
    if (systemLoad && systemLoad > 80) severityLevel += 1;
  }

  return severityLevel;
}
