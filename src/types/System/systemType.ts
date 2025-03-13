// types/System/systemType.ts
export interface SystemStatus {
  isApiAvailable: boolean;
  isDatabaseAvailable: boolean;
  isInMaintenance: boolean;
  checkTime: string;
  details?: {
    apiLatency?: number;
    databaseLatency?: number;
    activeConnections?: number;
    systemLoad?: number;
  };
}

export interface SystemInfo {
  version: string;
  environment: string;
  startTime: string;
  uptime: string;
  serverTime: string;
  status: string;
}

export interface MaintenanceRequest {
  startTime: string;
  endTime: string;
  reason: string;
  affectedServices?: string[];
  notifyUsers: boolean;
}

export interface AnnouncementRequest {
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  priority: 'low' | 'medium' | 'high';
  targetUsers?: string[];
}

export interface StatusInfo {
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}
export interface HealthCheckResponse {
  status: 'Healthy' | 'Unhealthy';  // 明确的状态值
  timestamp: string;
  version: string;
  details: {
    maintenance: boolean;
    database: boolean;
    message?: string;
  };
}
