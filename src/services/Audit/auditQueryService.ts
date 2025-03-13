import axios from 'axios';
import { AuditQuery, AuditQueryResponse } from '@/types/AuditQuery/auditQuery';
import getAuthtoken from "@/services/Auth/serverAuthService";

const api = axios.create({
  baseURL: '/proxy',  // API請求的基礎路徑
  timeout: 10000, // 超時設置
});

// 📌 **請求攔截器：自動附加 `Authorization: Bearer <Token>`**
api.interceptors.request.use(async (config) => {
  const token = await getAuthtoken(); // 從 Cookie 取得 Token

  if (token) {
    config.headers.Authorization = `Bearer ${token.value}`;
  } else {
    console.warn("⚠️ 無 Token，請求將不攜帶 Authorization");
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 督導查詢服務
 * 提供企業、公司、工廠等層級數據的管理功能
 */
export const auditQueryService = {
  async queryAudit(query: AuditQuery): Promise<AuditQueryResponse> {
    try {
      const response = await api.post<AuditQueryResponse>('/Audit/Query', query);
      return response.data;
    } catch (error) {
      console.error('查詢失敗:', error);
      throw new Error('無法查詢督導數據，請稍後再試');
    }
  },


};
