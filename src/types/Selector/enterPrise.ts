// types/Selector/enterPrise.ts

/**
 * 企業集團介面
 * 代表最高層級的企業實體（控股公司/集團企業）
 *
 * @interface EnterPrise
 * @member {string} id 企業唯一識別碼
 * @member {string} name 企業名稱
 * @member {Company[]} child 該企業下的所有子公司
 */
export interface EnterPrise {
  id: string;
  name: string;
  child: Company[];
  // 可擴展欄位
  // establishedYear?: number;  // 成立年份
  // industryType?: string;    // 產業類型
  // stockCode?: string;       // 股票代碼
}

/**
 * 公司介面
 * 代表企業集團下的子公司
 *
 * @interface Company
 * @member {string} id 公司唯一識別碼
 * @member {string} name 公司名稱
 * @member {Factory[]} child 該公司下的所有工廠
 */
export interface Company {
  id: string;
  name: string;
  child: Factory[];
  // 可擴展欄位
  // parentId?: string;       // 母公司ID
  // registeredCapital?: number; // 註冊資本
  // location?: string;       // 公司所在地
}

/**
 * 工廠介面
 * 代表公司下的生產工廠
 *
 * @interface Factory
 * @member {string} id 工廠唯一識別碼
 * @member {string} name 工廠名稱
 */
export interface Factory {
  id: string;
  name: string;
  // 未來可擴展的欄位
  // companyId?: string;      // 所屬公司ID
  // address?: string;        // 工廠地址
  // employeeCount?: number;  // 員工數量
  // productionLines?: string[]; // 生產線
}

/**
 * 企業表單介面
 * 用於儲存或傳遞選擇的企業集團、公司、工廠的識別碼
 *
 * @interface EnterPriseForm
 * @member {string} enterpriseId 選擇的企業集團識別碼
 * @member {string} companyId 選擇的公司識別碼
 * @member {string} factoryId 選擇的工廠識別碼
 */
export interface EnterPriseForm {
  enterpriseId: string;
  companyId: string;
  factoryId: string;
}
