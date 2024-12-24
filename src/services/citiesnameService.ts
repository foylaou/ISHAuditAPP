// services/citiesnameService.ts
import axios from 'axios';
import {CityInfo, Townships} from '@/types/Selector/citiesName';

// 定義緩存相關的常量
const CACHE_KEY = 'citiesName_data';           // 緩存數據的key
const CACHE_TIMESTAMP_KEY = 'citiesName_timestamp';  // 緩存時間戳的key
const CACHE_DURATION = 24 * 60 * 60 * 1000;    // 緩存有效期為24小時（毫秒）

// 創建axios實例，設置基礎URL
const api = axios.create({
  baseURL: '/proxy'  // 設置API請求的基礎路徑
});

/**
 * 城市區域名稱服務
 * 提供城市、鄉鎮區、工業區等地理位置數據的管理功能
 */
export const citiesnameService = {
  /**
   * 檢查緩存是否有效
   * @returns {boolean} 返回緩存是否在有效期內
   */
  isCacheValid(): boolean {
    // 檢查是否在服務器端運行
    if (typeof window === 'undefined') return false;

    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;

    // 比較當前時間和上次更新時間的差異
    const lastUpdate = parseInt(timestamp, 10);
    const now = Date.now();
    return now - lastUpdate < CACHE_DURATION;
  },

  /**
   * 從本地存儲獲取緩存的數據
   * @returns {CityInfo[] | null} 返回緩存的城市信息，如果沒有則返回null
   */
  getCachedData(): CityInfo[] | null {
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
   * @param {CityInfo[]} data - 要緩存的城市數據
   */
  updateCache(data: CityInfo[]): void {
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
   * @returns {Promise<CityInfo[]>} 返回最新的城市數據
   */
  async forceRefresh(): Promise<CityInfo[]> {
    const response = await api.get<CityInfo[]>('/CitiesNameSelector');
    this.updateCache(response.data);
    return response.data;
  },

  /**
   * 獲取城市數據，優先使用緩存，如果緩存無效則從API獲取
   * @returns {Promise<CityInfo[]>} 返回城市數據
   */
  async getAllCityInfo(): Promise<CityInfo[]> {
    try {
      if (this.isCacheValid()) {
        const cachedData = this.getCachedData();
        if (cachedData) {
          console.log('使用既有地區快取資料');
          return cachedData;
        }
      }

      console.log('透過API獲取新數據...');
      return await this.forceRefresh();
    } catch (error) {
      console.error('獲取新數據失敗:', error);
      // 如果API請求失敗，嘗試使用緩存數據（即使已過期）
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('因為API錯誤使用既有快取資料');
        return cachedData;
      }
      throw error;
    }
  },

  /**
   * 根據城市ID查找對應的鄉鎮區列表
   * @param {CityInfo[]} CityInfos - 城市數據數組
   * @param {string} CityInfoId - 城市ID
   * @returns {Townships[]} 返回鄉鎮區列表
   */
  getTownshipsByCityInfoId(CityInfos: CityInfo[], CityInfoId: string) {
    const enterprise = CityInfos.find(e => e.id === CityInfoId);
    return enterprise?.child || [];
  },

  /**
   * 根據鄉鎮區ID查找對應的工業區列表
   * @param {CityInfo[]} CityInfos - 城市數據數組
   * @param {string} companyId - 鄉鎮區ID
   * @returns {any[]} 返回工業區列表
   */
  getIndustrialAreasByTownshipId(CityInfos: CityInfo[], companyId: string) {
    for (const CityInfo of CityInfos) {
      const Township = CityInfo.child.find(c => c.id === companyId);
      if (Township) {
        return Township.child;
      }
    }
    return [];
  },

  /**
   * 根據工業區ID獲取完整的地理位置路徑
   * @param {CityInfo[]} CityInfos - 城市數據數組
   * @param {string} IndustrialAreaId - 工業區ID
   * @returns {string} 返回完整的地理位置路徑（例：台北市 > 信義區 > 某工業區）
   */
  getIndustrialAreaFullPath(CityInfos: CityInfo[], IndustrialAreaId: string): string {
    for (const CityInfo of CityInfos) {
      for (const Township of CityInfo.child) {
        const IndustrialArea = Township.child.find(a => a.id === IndustrialAreaId);
        if (IndustrialArea) {
          return `${CityInfo.name} > ${Township.name} > ${IndustrialArea.name}`;
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
   * 將城市數據轉換為層級選擇器所需的選項格式
   * @param {CityInfo[]} CityInfos - 城市數據數組
   * @returns {Array} 返回格式化後的選擇器選項
   */
  createSelectorOptions(CityInfos: CityInfo[]) {
    return CityInfos.map(CityInfo => ({
      label: CityInfo.name,
      value: CityInfo.id,
      children: CityInfo.child.map(Townships => ({
        label: Townships.name,
        value: Townships.id,
        children: Townships.child.map(IndustrialAreas => ({
          label: IndustrialAreas.name,
          value: IndustrialAreas.id
        }))
      }))
    }));
  }
};
