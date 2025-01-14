import {create} from "zustand/index";
import {AuditQueryResponse} from "@/types/AuditQuery/auditQuery";


// 定義 zustand 狀態
interface AuditStore {
  auditData: AuditQueryResponse | null; // 查詢結果
  setAuditData: (data: AuditQueryResponse) => void; // 設置查詢結果
  clearAuditData: () => void; // 清空查詢結果
}

export const useAuditStore = create<AuditStore>((set) => ({
  auditData: null, // 初始值為 null
  setAuditData: (data) => set({ auditData: data }),
  clearAuditData: () => set({ auditData: null }),
}));
