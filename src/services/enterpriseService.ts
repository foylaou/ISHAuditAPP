// services/enterpriseService.ts
import axios from 'axios';
import { Enterprise } from '@/types/enterprise';

const CACHE_KEY = 'enterprises_data';
const CACHE_TIMESTAMP_KEY = 'enterprises_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5238'
});

export const enterpriseService = {
  // 檢查緩存是否過期
  isCacheValid(): boolean {
    if (typeof window === 'undefined') return false;

    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const lastUpdate = parseInt(timestamp, 10);
    const now = Date.now();
    return now - lastUpdate < CACHE_DURATION;
  },

  // 從緩存獲取數據
  getCachedData(): Enterprise[] | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  },

  // 更新緩存
  updateCache(data: Enterprise[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  },

  // 強制刷新緩存
  async forceRefresh(): Promise<Enterprise[]> {
    const response = await api.get<Enterprise[]>('/EnterpriseNameSelector');
    this.updateCache(response.data);
    return response.data;
  },

  // 獲取企業數據（優先使用緩存）
  async getAllEnterprises(): Promise<Enterprise[]> {
    try {
      // 檢查緩存是否可用
      if (this.isCacheValid()) {
        const cachedData = this.getCachedData();
        if (cachedData) {
          console.log('Using cached enterprise data');
          return cachedData;
        }
      }

      // 如果緩存無效或不存在，從API獲取新數據
      console.log('Fetching fresh enterprise data');
      return await this.forceRefresh();
    } catch (error) {
      console.error('Error fetching enterprises:', error);
      // 如果API請求失敗，嘗試使用過期的緩存數據
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('Using expired cache due to API error');
        return cachedData;
      }
      throw error;
    }
  },

  // 根據企業ID獲取公司列表
  getCompaniesByEnterpriseId(enterprises: Enterprise[], enterpriseId: string) {
    const enterprise = enterprises.find(e => e.id === enterpriseId);
    return enterprise?.child || [];
  },

  // 根據公司ID獲取工廠列表
  getFactoriesByCompanyId(enterprises: Enterprise[], companyId: string) {
    for (const enterprise of enterprises) {
      const company = enterprise.child.find(c => c.id === companyId);
      if (company) {
        return company.child;
      }
    }
    return [];
  },

  // 獲取工廠完整路徑名稱
  getFactoryFullPath(enterprises: Enterprise[], factoryId: string): string {
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
  clearCache(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  },
  // 建立選擇器選項
  createSelectorOptions(enterprises: Enterprise[]) {
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
