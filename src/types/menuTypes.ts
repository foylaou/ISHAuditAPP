// types/menuTypes.ts
/**
 * 模組類型
 * 定義系統中的不同模組類型。
 */
export type ModuleType = 'Audit' | 'KPI' | 'Sys' | 'Org';

/**
 * 權限等級
 * 定義使用者在系統中的權限級別。
 */
export type PermissionLevel = 'Admin' | 'Power' | 'Edit' | 'None';

/**
 * 模組權限
 * 指定使用者對特定模組的存取權限。
 *
 * @interface ModulePermission
 * @property {ModuleType} module 模組類型
 * @property {PermissionLevel} level 權限等級
 */
export interface ModulePermission {
  module: ModuleType;
  level: PermissionLevel;
}

/**
 * 選單項目
 * 定義應用程式中的選單結構。
 *
 * @interface MenuItem
 * @property {string} label 選單項目標籤
 * @property {string} [link] 選單項目連結（可選）
 * @property {(e: React.MouseEvent<HTMLAnchorElement>) => void} [onClick] 點擊事件處理函式（可選）
 * @property {MenuItem[]} [children] 子選單項目（可選）
 * @property {ModulePermission | ModulePermission[]} [permission] 需要的權限（可選）
 */
export interface MenuItem {
  label: string;
  link?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: MenuItem[];
  permission?: ModulePermission | ModulePermission[];
}
