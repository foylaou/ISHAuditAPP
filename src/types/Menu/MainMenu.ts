// @/types/Menu/MainMenu.ts

export interface MenuItems {
  label: string;
  link?: string;
  isHidden?: string;
  children?: MenuItems[];
  auth?: string;
}

export interface AvatarMenuItem {
  label: string;
  link?: string;
  children?: AvatarMenuItem[];
  auth?: string;
}

export interface MenuState {
  menuItems: MenuItems[];
  setMenuItems: (items: MenuItems[]) => void;
  filterMenuByAuth: (items: MenuItems[]) => Promise<MenuItems[]>; // Updated to async
  fetchMenuItems: () => Promise<MenuItems[]>;
  getFilteredMenuItems: () => Promise<MenuItems[]>;
}

export interface AvatarMenuState {
  AvatarMenuItems: AvatarMenuItem[];
  setMenuItems: (items: AvatarMenuItem[]) => void;
  filterMenuByAuth: (items: MenuItems[]) => Promise<MenuItems[]>; // Updated to async
  fetchMenuItems: () => Promise<AvatarMenuItem[]>;
  getFilteredMenuItems: () => Promise<AvatarMenuItem[]>;
}
