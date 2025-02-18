//store/menuStore.ts
import { create } from 'zustand';
import { authService } from '@/services/authService';
import {AvatarMenuItem, AvatarMenuState, MenuItems, MenuState} from "@/types/Menu/MainMenu";
import axios from "axios";




// Helper function to check if user has required permission
const hasPermission = (requiredAuth: string | undefined): boolean => {
  if (!requiredAuth) return true;

  const userRoles = authService.getUserRoles();
  if (!userRoles) return false;

  // Map auth requirements to role properties
  const roleMapping: Record<string, keyof typeof userRoles> = {
    'admin': 'Sys',
    'manager': 'Org',
    'audit': 'Audit',
    'kpi': 'KPI'
  };

  const requiredRole = roleMapping[requiredAuth.toLowerCase()];
  if (!requiredRole) return false;

  return userRoles[requiredRole] === '1';
};

const filterMenuByAuthImpl = (items: MenuItems[]): MenuItems[] => {
  return items
    .filter((item) => hasPermission(item.auth))
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByAuthImpl(item.children) : undefined,
    }))
    .filter((item) => {
      // Remove items with empty children arrays
      return !(item.children && item.children.length === 0);

    });
};


export const useMenuStore = create<MenuState>((set) => ({
  menuItems: [], // 初始為空數組

  // 設置選單項目的方法
  setMenuItems: (items: MenuItems[]) => set({ menuItems: items }),

  // 過濾選單的方法
  filterMenuByAuth: filterMenuByAuthImpl,

  // 初始化方法，從 API 獲取選單
  fetchMenuItems: async () => {
    try {
      const response = await axios.get('/proxy/System/menuitems');
      set({ menuItems: response.data });
    } catch (error) {
      console.error('取得首頁選單發生錯誤:', error);
      // 可選: 設置錯誤狀態
      // set({ error: 'Failed to load menu' });
    }
  }
}));

export const useAvatarStore = create<AvatarMenuState>((set) => ({
  AvatarMenuItems: [],
  setMenuItems: (items: AvatarMenuItem[]) => set({ AvatarMenuItems: items }),
  filterMenuByAuth: filterMenuByAuthImpl,
  fetchMenuItems: async () => {
    try {
      const response = await axios.get('/proxy/System/avataritems');
      set({ AvatarMenuItems: response.data });
    } catch (error) {
      console.error('取得個人資料選單頁面錯誤:', error);
    }
  }
}));
