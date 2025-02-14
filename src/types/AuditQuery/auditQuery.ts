// types/Audit/auditTypes.ts

/**
 * 審計查詢介面
 * 用於描述審計查詢的請求參數。
 *
 * @interface AuditQuery
 * @member {string} cityInfoId 城市 ID
 * @member {string} townshipsId 鄉鎮 ID
 * @member {string} industrialareasId 工業區 ID
 * @member {string} auditCauseId 企業 ID
 * @member {string} auditItemsId 公司 ID
 * @member {string} disasterType 災害類型 ID（逗號分隔）
 * @member {string} auditDate 督導年份
 * @member {string} enterpriseId 企業 ID
 * @member {string} companyId 公司 ID
 * @member {string} factoryId 工廠 ID
 * @member {string} suggestCategoryId 建議分類大類別 ID
 * @member {string} suggestTypeId 建議分類中類別 ID
 * @member {string} suggestItemId 建議分類小類別 ID
 * @member {string} improveStatus 改善狀態（"是" 或 "否"）
 * @member {string} participate 是否參與（"是" 或 "否"）
 */
export interface AuditQuery {
  cityInfoId: string;
  townshipsId: string;
  industrialareasId: string;
  auditCauseId: string;
  auditItemsId: string;
  disasterType: string;
  auditDate: string;
  enterpriseId: string;
  companyId: string;
  factoryId: string;
  suggestCategoryId: string;
  suggestTypeId: string;
  suggestItemId: string;
  improveStatus: string;
  participate: string;
}

/**
 * 審計查詢回應介面
 * 用於描述審計查詢的回應數據。
 *
 * @interface AuditQueryResponse
 * @member {AuditBasicResult[]} basics 基本信息列表
 * @member {AuditSuggestResult[]} suggests 建議信息列表
 */
export interface AuditQueryResponse {
  basics: AuditBasicResult[];
  suggests: AuditSuggestResult[];
}

/**
 * 審計基本結果介面
 * 描述單個審計的基本信息。
 *
 * @interface AuditBasicResult
 * @member {number} id 督導基本信息的 ID
 * @member {string} uuid 唯一標識
 * @member {string | null} auditCause 督導原因名稱
 * @member {string | null} auditStartDate 督導開始時間 (ISO 格式日期)
 * @member {string | null} enterprise 企業名稱
 * @member {string | null} factory 工廠名稱
 * @member {string | null} company 公司名稱
 * @member {string | null} industrialArea 工業區名稱
 * @member {string | null} auditType 督導類型名稱
 * @member {string | null} disaterTypes 災害類型名稱
 * @member {string | null} incidentDescription 事故描述
 * @member {string | null} penaltyDetail 處罰細節
 * @member {string | null} situation 現場情況
 * @member {string | null} sd 是否停工？（Y/N)
 * @member {string | null} penalty 是否裁罰 （Y/N）
 */
export interface AuditBasicResult {
  id: number;
  uuid: string;
  auditCauseId: number | null;
  auditCause: string | null;
  auditStartDate: string | null;
  enterprise: string | null;
  factory: string | null;
  company: string | null;
  industrialArea: string | null;
  auditType: string | null;
  cityId: number | null;
  townshipId: number | null;
  industrialAreaId: number | null;
  enterpriseId: number | null;
  companyId: number | null;
  factoryId: number | null;
  auditTypeId: number | null;
  disaterTypesId: string | null;
  disaterTypes: string | null;
  incidentDatetime: string | null;
  incidentDescription: string | null;
  sd: string | null; //停工
  penalty: string | null; //裁罰
  penaltyDetail: string | null;
  situation: string | null;
  improveStatusVal: number | null;
}

/**
 * 審計建議結果介面
 * 描述單個審計建議的詳細信息。
 *
 * @interface AuditSuggestResult
 * @member {string} id 建議的唯一標識符 (UUID)
 * @member {string | null} auditType 督導類型名稱
 * @member {string | null} factory 工廠名稱
 * @member {string | null} participate 是否參與
 * @member {string | null} suggestCategory 建議類別名稱
 * @member {string | null} suggestType 建議類型名稱
 * @member {string | null} suggestItem 建議項目名稱
 * @member {string | null} suggest 具體建議內容
 * @member {string | null} action 行動措施
 * @member {string | null} shortTerm 短期計劃
 * @member {string | null} midTerm 中期計劃
 * @member {string | null} longTerm 長期計劃
 * @member {string | null} handlingSituation 處理情況
 * @member {string | null} improveStatus 改善狀態
 * @member {string | null} responsibleUnit 負責單位
 * @member {string | null} budget 預算
 * @member {string | null} remarks 備註
 */
export interface AuditSuggestResult {
  id: string;
  auditType: string | null;
  factory: string | null;
  participate: string | null;
  auditDetailId: number | null;
  suggestCategoryId: number | null;
  suggestTypeId: number | null;
  suggestItemId: number | null;
  suggestCategory: string | null;
  suggestType: string | null;
  suggestItem: string | null;
  suggest: string | null;
  auditBasicId: number | null;
  action: string | null;
  shortTerm: string | null;
  midTerm: string | null;
  longTerm: string | null;
  handlingSituation: string | null;
  improveStatus: string | null;
  responsibleUnit: string | null;
  budget: string | null;
  remarks: string | null;
}
