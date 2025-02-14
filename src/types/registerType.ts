/**
 * 註冊表單介面
 * 用於描述用戶註冊時提交的表單數據。
 *
 * @interface RegisterForm
 * @member {string} username 用戶名
 * @member {string} password 密碼
 * @member {string} name 姓名
 * @member {string} enterpriseId 企業 ID
 * @member {string} companyId 公司 ID
 * @member {string} factoryId 工廠 ID
 * @member {string} auditRole 督導角色
 * @member {string} kpiRole KPI 角色
 * @member {string} sysRole 系統角色
 * @member {string} orgRole 組織角色
 */
export interface RegisterForm {
  username: string;
  password: string;
  name: string;
  enterpriseId: string;
  companyId: string;
  factoryId: string;
  auditRole: string;
  kpiRole: string;
  sysRole: string;
  orgRole: string;
}

/**
 * 註冊 API 請求介面
 * 用於描述發送至後端 API 的用戶註冊請求數據。
 *
 * @interface RegisterApiRequest
 * @member {string} Username 用戶名
 * @member {string} Password 密碼
 * @member {string} Nickname 暱稱
 * @member {string} Audit 督導角色
 * @member {string} KPI KPI 角色
 * @member {string} Sys 系統角色
 * @member {string} Org 組織角色
 * @member {number} EnterpriseId 企業 ID
 * @member {number} CompanyId 公司 ID
 * @member {number} FactoryId 工廠 ID
 */
export interface RegisterApiRequest {
  Username: string;
  Password: string;
  Nickname: string;
  Audit: string;
  KPI: string;
  Sys: string;
  Org: string;
  EnterpriseId: number;
  CompanyId: number;
  FactoryId: number;
}
