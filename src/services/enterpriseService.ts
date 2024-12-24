// services/enterpriseService.ts
import axios from 'axios';
import { EnterPrise } from '@/types/Selector/enterPrise';

// 定義緩存相關常量
const CACHE_KEY = 'enterprises_data';           // 存儲企業數據的鍵名
const CACHE_TIMESTAMP_KEY = 'enterprises_timestamp';  // 存儲時間戳的鍵名
const CACHE_DURATION = 24 * 60 * 60 * 1000;     // 緩存有效期為24小時（毫秒）

// 創建axios實例並設置基礎URL
const api = axios.create({
  baseURL: '/proxy'  // API請求的基礎路徑
});

/**
 * 企業服務
 * 提供企業、公司、工廠等層級數據的管理功能
 */
export const enterpriseService = {
  /**
   * 檢查緩存是否在有效期內
   * @returns {boolean} 返回緩存是否有效
   */
  isCacheValid(): boolean {
    // 確保代碼運行在瀏覽器環境
    if (typeof window === 'undefined') return false;

    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;

    // 檢查緩存是否過期
    const lastUpdate = parseInt(timestamp, 10);
    const now = Date.now();
    return now - lastUpdate < CACHE_DURATION;
  },

  /**
   * 從本地存儲中獲取緩存的企業數據
   * @returns {EnterPrise[] | null} 返回緩存的企業數據，如果不存在則返回null
   */
  getCachedData(): EnterPrise[] | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  },

  /**
   * 更新本地存儲中的企業數據和時間戳
   * @param {EnterPrise[]} data - 要緩存的企業數據
   */
  updateCache(data: EnterPrise[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  },

  /**
   * 強制從API獲取最新數據並更新緩存
   * @returns {Promise<EnterPrise[]>} 返回最新的企業數據
   */
  async forceRefresh(): Promise<EnterPrise[]> {
    const response = await api.get<EnterPrise[]>('/EnterpriseNameSelector');
    this.updateCache(response.data);
    return response.data;
  },

  /**
   * 獲取企業數據，優先使用緩存，緩存無效時從API獲取
   * @returns {Promise<EnterPrise[]>} 返回企業數據
   */
  async getAllEnterprises(): Promise<EnterPrise[]> {
    try {
      if (this.isCacheValid()) {
        const cachedData = this.getCachedData();
        if (cachedData) {
          console.log('Using cached enterprise data');
          return cachedData;
        }
      }

      console.log('Fetching fresh enterprise data');
      return await this.forceRefresh();
    } catch (error) {
      console.error('Error fetching enterprises:', error);
      // API請求失敗時的降級策略：使用過期緩存
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('Using expired cache due to API error');
        return cachedData;
      }
      throw error;
    }
  },

  /**
   * 根據企業ID獲取其下屬公司列表
   * @param {EnterPrise[]} enterprises - 企業數據數組
   * @param {string} enterpriseId - 企業ID
   * @returns {any[]} 返回公司列表
   */
  getCompaniesByEnterpriseId(enterprises: EnterPrise[], enterpriseId: string) {
    const enterprise = enterprises.find(e => e.id === enterpriseId);
    return enterprise?.child || [];
  },

  /**
   * 根據公司ID獲取其下屬工廠列表
   * @param {EnterPrise[]} enterprises - 企業數據數組
   * @param {string} companyId - 公司ID
   * @returns {any[]} 返回工廠列表
   */
  getFactoriesByCompanyId(enterprises: EnterPrise[], companyId: string) {
    for (const enterprise of enterprises) {
      const company = enterprise.child.find(c => c.id === companyId);
      if (company) {
        return company.child;
      }
    }
    return [];
  },

  /**
   * 根據工廠ID獲取完整的組織層級路徑
   * @param {EnterPrise[]} enterprises - 企業數據數組
   * @param {string} factoryId - 工廠ID
   * @returns {string} 返回完整路徑（例：XX企業 > XX公司 > XX工廠）
   */
  getFactoryFullPath(enterprises: EnterPrise[], factoryId: string): string {
    for (const enterprise of enterprises) {
      for (const company of enterprise.child) {
        const factory = company.child.find(f => f.id === factoryId);
        if (factory) {
          return `${enterprise.name} > ${company.name} > ${factory.name}`;
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
   * 將企業數據轉換為級聯選擇器所需的選項格式
   * @param {EnterPrise[]} enterprises - 企業數據數組
   * @returns {Array} 返回格式化後的選擇器選項
   */
  createSelectorOptions(enterprises: EnterPrise[]) {
    return enterprises.map(enterprise => ({
      label: enterprise.name,
      value: enterprise.id,
      children: enterprise.child.map(company => ({
        label: company.name,
        value: company.id,
        children: company.child.map(factory => ({
          label: factory.name,
          value: factory.id
        }))
      }))
    }));
  }
};
