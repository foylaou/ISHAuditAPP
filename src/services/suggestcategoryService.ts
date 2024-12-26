// services/suggestcategoryService.ts
import axios from 'axios';
import { SuggestCategory } from '@/types/Selector/suggestCategory';

// 定義緩存相關常量
const CACHE_KEY = 'suggestCategory_data';           // 緩存數據的key
const CACHE_TIMESTAMP_KEY = 'suggestCategory_timestamp';  // 緩存時間戳的key
const CACHE_DURATION = 24 * 60 * 60 * 1000;    // 緩存時長（24小時）

// 創建axios實例
const api = axios.create({
  baseURL: '/proxy', //  timeout: 10000  // 添加請求超時設置
});

/**
 * 建議分類服務
 * 提供建議類別的層級數據管理功能
 */
export const suggestcategoryService = {
  /**
   * 檢查緩存是否在有效期內
   * @returns {boolean} 返回緩存是否有效
   */
  isCacheValid(): boolean {
    if (typeof window === 'undefined') return false;

    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const lastUpdate = parseInt(timestamp, 10);
    const now = Date.now();
    return now - lastUpdate < CACHE_DURATION;
  },

  /**
   * 從本地存儲獲取緩存的數據
   * @returns {SuggestCategory[] | null} 返回緩存的分類數據
   */
  getCachedData(): SuggestCategory[] | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('錯誤，無法讀取快取:', error);
      return null;
    }
  },

  /**
   * 更新本地存儲中的數據和時間戳
   * @param {SuggestCategory[]} data - 要緩存的分類數據
   */
  updateCache(data: SuggestCategory[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('更新快取失敗:', error);
    }
  },

  /**
   * 強制從API刷新數據並更新緩存
   * @returns {Promise<SuggestCategory[]>} 返回最新的分類數據
   */
  async forceRefresh(): Promise<SuggestCategory[]> {
    const response = await api.get<SuggestCategory[]>('/SuggestCategorySelector');
    this.updateCache(response.data);
    return response.data;
  },

  /**
   * 獲取分類數據，優先使用緩存
   * @returns {Promise<SuggestCategory[]>} 返回分類數據
   */
  async getAllSuggestCategor(): Promise<SuggestCategory[]> {
    try {
      if (this.isCacheValid()) {
        const cachedData = this.getCachedData();
        if (cachedData) {
          console.log('使用既有分類快取資料');
          return cachedData;
        }
      }

      console.log('透過API獲取新數據...');
      return await this.forceRefresh();
    } catch (error) {
      console.error('獲取新數據失敗:', error);
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('因為API錯誤使用既有快取資料');
        return cachedData;
      }
      throw error;
    }
  },

  /**
   * 根據大類別ID獲取中類別列表
   * @param {SuggestCategory[]} SuggestCategorys - 分類數據數組
   * @param {string} SuggestCategoryID - 大類別ID
   * @returns {any[]} 返回中類別列表
   */
  getSuggestTypesBySuggestCategorId(SuggestCategorys: SuggestCategory[], SuggestCategoryID: string) {
    const SuggestCategory = SuggestCategorys.find(c => c.id === SuggestCategoryID);
    return SuggestCategory?.child || [];
  },

  /**
   * 根據中類別ID獲取小類別列表
   * @param {SuggestCategory[]} SuggestCategorys - 分類數據數組
   * @param {string} SuggestTypeID - 中類別ID
   * @returns {any[]} 返回小類別列表
   */
  getSuggestItemsBySuggestTypeId(SuggestCategorys: SuggestCategory[], SuggestTypeID: string) {
    for (const SuggestCategory of SuggestCategorys) {
      const SuggestType = SuggestCategory.child.find(t => t.id === SuggestTypeID);
      if (SuggestType) {
        return SuggestType.child;
      }
    }
    return [];
  },

  /**
   * 根據小類別ID獲取完整的分類路徑
   * @param {SuggestCategory[]} SuggestCategorys - 分類數據數組
   * @param {string} SuggestItemID - 小類別ID
   * @returns {string} 返回完整分類路徑
   */
  getSuggestItemFullPath(SuggestCategorys: SuggestCategory[], SuggestItemID: string): string {
    for (const SuggestCategory of SuggestCategorys) {
      for (const SuggestType of SuggestCategory.child) {
        const SuggestItem = SuggestType.child.find(i => i.id === SuggestItemID);
        if (SuggestItem) {
          return `${SuggestCategory.name} > ${SuggestType.name} > ${SuggestItem.name}`;
        }
      }
    }
    return '';
  },

  /**
   * 清除本地存儲中的緩存數據
   */
  clearCache(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  },

  /**
   * 將分類數據轉換為選擇器所需的選項格式
   * @param {SuggestCategory[]} SuggestCategorys - 分類數據數組
   * @returns {Array} 返回格式化後的選擇器選項
   */
  createSelectorOptions(SuggestCategorys: SuggestCategory[]) {
    return SuggestCategorys.map(SuggestCategory => ({
      label: SuggestCategory.name,
      value: SuggestCategory.id,
      children: SuggestCategory.child.map(SuggestType => ({   // 修正：SuggestTypes.child -> SuggestCategory.child
        label: SuggestType.name,
        value: SuggestType.id,
        children: SuggestType.child.map(SuggestItem => ({    // 修正：SuggestItems.child -> SuggestType.child
          label: SuggestItem.name,
          value: SuggestItem.id
        }))
      }))
    }));
  }
};
