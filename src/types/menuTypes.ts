// 在 @/types/Menu/MainMenu.ts 中

export interface MenuItems {
  label: string;
  link?: string;
  isHidden?: string | boolean;
  type?: string;
  children?: MenuItems[];
  icon?: string;
  id?: number;

}

// Avatar菜單項目與普通菜單項目結構相同
export type AvatarMenuItem = MenuItems;

export interface MenuState {
  menuItems: MenuItems[];
  setMenuItems: (items: MenuItems[]) => void;
  fetchMenuItems: () => Promise<MenuItems[]>;
  getProcessedMenuItems: () => MenuItems[];
  // 為了向後兼容性保留的方法
  filterMenuByAuth: (items: MenuItems[]) => Promise<MenuItems[]>;
  getFilteredMenuItems: () => Promise<MenuItems[]>;

}

export interface AvatarMenuState {
  AvatarMenuItems: AvatarMenuItem[];
  setMenuItems: (items: AvatarMenuItem[]) => void;
  fetchMenuItems: () => Promise<AvatarMenuItem[]>;
  getProcessedMenuItems: () => AvatarMenuItem[];
  // 為了向後兼容性保留的方法
  filterMenuByAuth: (items: AvatarMenuItem[]) => Promise<AvatarMenuItem[]>;
  getFilteredMenuItems: () => Promise<AvatarMenuItem[]>;
}
