import { create } from 'zustand';
import { AvatarMenuItem, AvatarMenuState, MenuItems, MenuState } from "@/types/Menu/MainMenu";
import axios from "axios";

// Helper function to convert "True"/"False" string to boolean
const parseBoolean = (value: string | boolean | undefined): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
};

// 通用函數：遞歸將 isHidden 轉換為布爾值
const processMenuItemsRecursively = <T extends MenuItems>(items: T[]): T[] => {
  return items.map(item => {
    const processedItem = {
      ...item,
      isHidden: parseBoolean(item.isHidden)
    } as T;

    if (item.children && item.children.length > 0) {
      processedItem.children = processMenuItemsRecursively(item.children);
    }

    return processedItem;
  });
};

// 通用函數：過濾隱藏的項目
const filterHiddenItems = <T extends MenuItems>(items: T[]): T[] => {
  return items.filter(item => !parseBoolean(item.isHidden))
    .map(item => {
      const filteredItem = { ...item } as T;

      if (item.children && item.children.length > 0) {
        filteredItem.children = filterHiddenItems(item.children);
        // 如果過濾後子項目為空數組，則設置為空數組而不是null
        if (filteredItem.children.length === 0) {
          filteredItem.children = [];
        }
      }

      return filteredItem;
    });
};

export const useMenuStore = create<MenuState>((set, get) => ({
  menuItems: [],

  // 設置選單項目的方法
  setMenuItems: (items: MenuItems[]) => set({ menuItems: items }),

  // 為保持向後兼容而添加的方法 - 簡化版本，不再進行權限檢查
  filterMenuByAuth: async (items: MenuItems[]): Promise<MenuItems[]> => {
    return filterHiddenItems(items);
  },

  // 初始化方法，從 API 獲取選單
  fetchMenuItems: async () => {
    try {
      const response = await axios.get('/proxy/System/menuitems');
      const processedData = processMenuItemsRecursively(response.data);

      set({ menuItems: processedData });
      return processedData;
    } catch (error) {
      console.error('取得首頁選單發生錯誤:', error);
      return [];
    }
  },

  // 為保持向後兼容而添加的方法 - 現在與 getProcessedMenuItems 功能相同
  getFilteredMenuItems: async () => {
    return filterHiddenItems(get().menuItems);
  },

  // 獲取處理後的選單項目（僅過濾掉隱藏的項目）
  getProcessedMenuItems: () => {
    return filterHiddenItems(get().menuItems);
  }
}));

export const useAvatarStore = create<AvatarMenuState>((set, get) => ({
  AvatarMenuItems: [], // 初始為空數組

  // 設置選單項目的方法
  setMenuItems: (items: AvatarMenuItem[]) => set({ AvatarMenuItems: items }),

  // 為保持向後兼容而添加的方法 - 簡化版本，不再進行權限檢查
  filterMenuByAuth: async (items: AvatarMenuItem[]): Promise<AvatarMenuItem[]> => {
    return filterHiddenItems(items);
  },

  // 初始化方法，從 API 獲取選單
  fetchMenuItems: async () => {
    try {
      const response = await axios.get('/proxy/System/avataritems');
      const processedData = processMenuItemsRecursively<AvatarMenuItem>(response.data);

      set({ AvatarMenuItems: processedData });
      return processedData;
    } catch (error) {
      console.error('取得個人資料選單頁面錯誤:', error);
      return [];
    }
  },

  // 為保持向後兼容而添加的方法 - 現在與 getProcessedMenuItems 功能相同
  getFilteredMenuItems: async () => {
    return filterHiddenItems(get().AvatarMenuItems);
  },

  // 獲取處理後的選單項目（僅過濾掉隱藏的項目）
  getProcessedMenuItems: () => {
    return filterHiddenItems(get().AvatarMenuItems);
  }
}));
