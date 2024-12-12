

import { create } from 'zustand';
import {MenuItem} from "@/types/menuTypes";

interface MenuState {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  filterMenuByAuth: (items: MenuItem[], role: string) => MenuItem[];
}

const filterMenuByAuthImpl = (items: MenuItem[], role: string): MenuItem[] => {
  return items
    .filter((item) => !item.auth || item.auth === role)
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByAuthImpl(item.children, role) : undefined,
    }));
};

export const useMenuStore = create<MenuState>((set, _get) => ({
  menuItems: [
    { label: '首頁', link: '/' },
    { label: '督導查詢', link: '/Audit' },
    {
      label: '帳號管理',
      auth: 'admin',
      children: [
        { label: '新增帳號', link: '/signup', auth: 'admin' },
        { label: '修改帳號', link: '/edit-user', auth: 'admin' },
      ],
    },
    {
      label: '系統管理',
      auth: 'manager',
      children: [
        {
          label: '設定',
          children: [
            { label: '系統設定', link: '/settings/system', auth: 'admin' },
            { label: '權限設定', link: '/settings/permissions', auth: 'manager' },
          ],
        },
        { label: '紀錄', link: '/logs', auth: 'user' },
      ],
    },
    { label: '登出', link: '/logout' },
  ],
  setMenuItems: (items: MenuItem[]) => set({ menuItems: items }),
  filterMenuByAuth: filterMenuByAuthImpl,
}));
