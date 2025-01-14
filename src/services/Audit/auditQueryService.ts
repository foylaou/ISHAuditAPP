// services/Audit/auditQueryService.ts
import axios from 'axios';
import {AuditQuery, AuditQueryResponse} from '@/types/AuditQuery/auditQuery';

const api = axios.create({
  baseURL: '/proxy',  // API請求的基礎路徑
  timeout: 10000, // 超時設置
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
