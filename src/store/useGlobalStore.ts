import { create } from 'zustand';
import { persist } from 'zustand/middleware';  // 需要引入 persist middleware

interface Permissions {
  sys: string;
  org: string;
  audit: string;
}

interface GlobalState {
  isLoggedIn: boolean;
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
      permissions: { sys: 'none', org: 'none', audit: 'none' },
      theme: false,  // 預設為 light mode

      login: (permissions) =>
        set(() => ({ isLoggedIn: true, permissions })),

      logout: () =>
        set(() => ({
          isLoggedIn: false,
          permissions: { sys: 'none', org: 'none', audit: 'none' },
        })),

      toggleTheme: () =>
        set((state) => ({ theme: !state.theme })),
    }),
    {
      name: 'global-store', // localStorage 的 key 名稱
    }
  )
);
