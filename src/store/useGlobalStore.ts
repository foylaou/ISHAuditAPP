//@store/useGlobalStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';  // 需要引入 persist middleware

interface Permissions {
  Audit:string;
  KPI: string;
  Sys: string;
  Org: string;
}

interface GlobalState {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  permissions: Permissions;
  theme: boolean;
  login: (permissions: Permissions) => void;
  logout: () => void;
  toggleTheme: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
        setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      permissions: { Audit: 'none', KPI: 'none', Sys: 'none' ,Org:'none'},
      theme: false,  // 預設為 light mode

      login: (permissions) =>
        set(() => ({ isLoggedIn: true, permissions })),

      logout: () =>
        set(() => ({
          isLoggedIn: false,
          permissions: { Audit: 'none', KPI: 'none', Sys: 'none' ,Org:'none' },
        })),

      toggleTheme: () =>
        set((state) => ({ theme: !state.theme })),
    }),
    {
      name: 'global-store', // localStorage 的 key 名稱
    }
  )
);
