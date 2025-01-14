export interface AuditQuery {
  cityInfoId: string; // 城市 ID
  townshipsId: string; // 鄉鎮 ID
  industrialareasId: string; // 工業區 ID
  auditCauseId: string; // 企業 ID
  auditItemsId: string; // 公司 ID
  disasterType: string; // 災害類型 ID（逗號分隔）
  auditDate: string; // 督導年份
  enterpriseId:string;
  companyId:string;
  factoryId: string; // 工廠 ID
  suggestCategoryId: string;
  suggestTypeId: string;
  suggestItemId: string;
  improveStatus: string; // 改善狀態（"Y" 或 "N"）
  participate: string; // 是否參與（"Y" 或 "N"）
}

export interface AuditQueryResponse {
  basics: AuditBasicResult[]; // 基本信息列表
  suggests: AuditSuggestResult[]; // 建議信息列表
}

export interface AuditBasicResult {
  id: number; // 督導基本信息的 ID
  uuid: string; // 唯一標識
  auditCauseId: number | null; // 督導原因 ID
  auditCause: string | null; // 督導原因名稱
  auditStartDate: string | null; // 督導開始時間 (ISO 格式日期)
  enterprise: string | null; // 企業名稱
  factory: string | null; // 工廠名稱
  company: string | null; // 公司名稱
  industrialArea: string | null; // 工業區名稱
  auditType: string | null; // 督導類型名稱
  cityId: number | null; // 城市 ID
  townshipId: number | null; // 鄉鎮 ID
  industrialAreaId: number | null; // 工業區 ID
  enterpriseId: number | null; // 企業 ID
  companyId: number | null; // 公司 ID
  factoryId: number | null; // 工廠 ID
  auditTypeId: number | null; // 督導類型 ID
  disaterTypesId: string | null; // 災害類型 ID 列表
  disaterTypes: string | null; // 災害類型名稱
  incidentDatetime: string | null; // 事故發生時間
  incidentDescription: string | null; // 事故描述
  sd: string | null; // 是否涉及 SD
  penalty: string | null; // 是否處罰
  penaltyDetail: string | null; // 處罰細節
  situation: string | null; // 現場情況
  improveStatusVal: number | null; // 改善狀態值
}

export interface AuditSuggestResult {
  id: string; // 建議的唯一標識符 (UUID)
  auditType: string | null; // 督導類型名稱
  factory: string | null; // 工廠名稱
  participate: string | null; // 是否參與
  auditDetailId: number | null; // 督導詳情 ID
  suggestCategoryId: number | null; // 建議類別 ID
  suggestTypeId: number | null; // 建議類型 ID
  suggestItemId: number | null; // 建議項目 ID
  suggestCategory: string | null; // 建議類別名稱
  suggestType: string | null; // 建議類型名稱
  suggestItem: string | null; // 建議項目名稱
  suggest: string | null; // 具體建議內容
  auditBasicId: number | null; // 對應的基本信息 ID
  action: string | null; // 行動措施
  shortTerm: string | null; // 短期計劃
  midTerm: string | null; // 中期計劃
  longTerm: string | null; // 長期計劃
  handlingSituation: string | null; // 處理情況
  improveStatus: string | null; // 改善狀態
  responsibleUnit: string | null; // 負責單位
  budget: string | null; // 預算
  remarks: string | null; // 備註
}
