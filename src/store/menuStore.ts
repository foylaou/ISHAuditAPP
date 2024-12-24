// First, let's define the MenuItem type
interface MenuItem {
  label: string;
  link?: string;
  auth?: string;
  children?: MenuItem[];
}

import { create } from 'zustand';
import { authService } from '@/services/authService';

interface MenuState {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  filterMenuByAuth: (items: MenuItem[]) => MenuItem[];
}

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

const filterMenuByAuthImpl = (items: MenuItem[]): MenuItem[] => {
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

export const useMenuStore = create<MenuState>((set, _get) => ({
  menuItems: [
    { label: '首頁', link: '/' },
    { label: '督導查詢', link: '/Audit', auth: 'audit' },
    {
      label: '帳號管理',
      auth: 'admin',
      children: [
        { label: '新增帳號', link: '/Register', auth: 'admin' },
        { label: '修改帳號', link: '/edit-user', auth: 'admin' },
      ],
    },
    { label: '登出', link: '/logout' },
  ],
  setMenuItems: (items: MenuItem[]) => set({ menuItems: items }),
  filterMenuByAuth: filterMenuByAuthImpl,
}));
