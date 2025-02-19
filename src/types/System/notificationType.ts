import React from "react";

/**
 * 通知類型
 * 可用於指定通知的類別，如資訊、成功、警告或危險。
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'danger';

/**
 * 通知介面
 * 用於表示單一通知的詳細資訊。
 *
 * @interface Notification
 * @param {string} id 通知唯一識別碼
 * @param {string} name 通知名稱
 * @param {string} Icon 圖示名稱
 * @param {string} message 通知訊息內容
 * @param {boolean} isRead 是否已讀取
 * @param {string} fromTo 通知發送或接收的對象
 * @param {string} DateTime 通知的日期與時間
 */
export interface Notification {
  id: string;
  name: string;
  Icon: string;
  message: string;
  isRead: boolean;
  fromTo: string;
  DateTime: string;
}

/**
 * 通知狀態介面
 * 用於管理通知列表及其相關狀態。
 *
 * @interface NotificationState
 * @param {Notification[]} notifications 通知列表
 * @param {boolean} closed 通知面板是否關閉
 * @param {boolean} refresh 是否需要刷新通知
 */
export interface NotificationState {
  notifications: Notification[];
  closed: boolean;
  refresh: boolean;
}

/**
 * 通知組件屬性
 * 用於管理通知菜單的開關狀態。
 *
 * @interface NotificationProps
 * @param {string | null} openMenuIndex 當前開啟的菜單索引
 * @param {(index: string | null) => void} setOpenMenuIndex 設定開啟或關閉的菜單索引
 */
export interface NotificationProps {
  openMenuIndex: string | null;
  setOpenMenuIndex: (index: string | null) => void;
}

/**
 * 單個通知項目的屬性
 * 用於控制通知的顯示和交互。
 *
 * @interface NotificationItemProps
 * @param {Notification} notification 通知資料
 * @param {NotificationType} type 通知類型
 * @param {string} bgColor 背景顏色
 * @param {(iconName: string, type: NotificationType) => React.ReactNode} getIconComponent 取得對應的圖示組件
 * @param {(id: string) => void} removeNotification 移除指定的通知
 * @param {(id: string) => void} markAsRead 標記通知為已讀
 */
export interface NotificationItemProps {
  notification: Notification;
  type: NotificationType;
  bgColor: string;
  getIconComponent: (iconName: string, type: NotificationType) => React.ReactNode;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
}
