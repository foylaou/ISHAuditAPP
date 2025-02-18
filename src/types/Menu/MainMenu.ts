import {useAvatarStore} from "@/store/menuStore";

/**
 * 選單項目
 * 定義應用程式中的選單結構。
 *
 * @interface MenuItems
 * @property {string} label 選單項目標籤
 * @property {string} [link] 選單項目連結（可選）
 * @property {string} [auth] 需要的權限（可選）
 * @property {MenuItems[]} [children] 子選單項目（可選）
 */
export interface MenuItems {
  label: string;
  link?: string;
  auth?: string;
  children?: MenuItems[];
}

/**
 * 選單狀態
 * 定義應用程式中的選單管理狀態。
 *
 * @interface MenuState
 * @property {MenuItems[]} menuItems 當前選單項目
 * @property {(items: MenuItems[]) => void} setMenuItems 設定選單項目
 * @property {(items: MenuItems[]) => MenuItems[]} filterMenuByAuth 根據權限過濾選單
 */
export interface MenuState {
  menuItems: MenuItems[];
  setMenuItems: (items: MenuItems[]) => void;
  fetchMenuItems: () => void;
  filterMenuByAuth: (items: MenuItems[]) => MenuItems[];
}


export interface AvatarMenuItem {
  label: string;
  link?: string;
  auth?: string;
  children?: AvatarMenuItem[];
}

export interface AvatarMenuState {
  AvatarMenuItems: AvatarMenuItem[];
  setMenuItems: (items: AvatarMenuItem[]) => void;
  fetchMenuItems: () => Promise<void>;
  filterMenuByAuth: (items: AvatarMenuItem[]) => AvatarMenuItem[];
}
