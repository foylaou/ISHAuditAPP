



// 使用您提供的介面
export interface Notification {
  id: string;
  name: string;
  Icon: string;
  message: string;
  isRead: boolean;
  fromTo: string;
  DateTime: string;
}

export type NotificationType = "info" | "success" | "warning" | "danger";

export interface NotificationState {
  notifications: Notification[];
  closed: boolean;
  refresh: boolean;
}
