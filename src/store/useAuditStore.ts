import { create } from "zustand/index";
import { AuditQueryResponse } from "@/types/AuditQuery/auditQuery";

/**
 * 督導查詢狀態管理全域介面。
 *
 * @interface AuditStore
 * @property {AuditQueryResponse | null} auditData 查詢結果。
 * @property {(data: AuditQueryResponse) => void} setAuditData 設置查詢結果。
 * @property {() => void} clearAuditData 清空查詢結果。
 */
interface AuditStore {
  auditData: AuditQueryResponse | null;
  setAuditData: (data: AuditQueryResponse) => void;
  clearAuditData: () => void;
}

/**
 * 督導查詢狀態管理 Store。
 *
 * @returns {AuditStore} 返回督導查詢的狀態管理，包含設置查詢結果 setAuditData 以及清除查詢結果 clearAuditData。
 */
export const useAuditStore = create<AuditStore>((set) => ({
  auditData: null,
  setAuditData: (data) => set({ auditData: data }),
  clearAuditData: () => set({ auditData: null }),
}));
