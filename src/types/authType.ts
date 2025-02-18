/**
 * 登入表單
 * 定義使用者登入時提交的表單數據結構。
 *
 * @interface LoginForm
 * @property {string} username 使用者名稱
 * @property {string} password 使用者密碼
 */
export interface LoginForm {
  username: string;
  password: string;
}

/**
 * 登入 API 請求
 * 定義發送至伺服器的登入請求格式。
 *
 * @interface LoginApiRequest
 * @property {string} Username 使用者名稱
 * @property {string} Password 使用者密碼
 */
export interface LoginApiRequest {
  Username: string;
  Password: string;
}

/**
 * 登入回應
 * 定義登入成功時伺服器返回的數據結構。
 *
 * @interface LoginResponse
 * @property {string} token JWT 權杖
 * @property {string} message 伺服器返回的訊息
 */
export interface LoginResponse {
  token: string;
  message: string;
}

/**
 * 使用者角色
 * 定義使用者在不同模組中的權限角色。
 *
 * @interface UserRoles
 * @property {string} Audit 稽核模組角色
 * @property {string} KPI 關鍵績效指標模組角色
 * @property {string} Sys 系統管理模組角色
 * @property {string} Org 組織管理模組角色
 */
export interface UserRoles {
  Audit: string;
  KPI: string;
  Sys: string;
  Org: string;
}

/**
 * JWT 負載
 * 定義 JWT 權杖中的負載數據。
 *
 * @interface JWTPayload
 * @property {string} roles 使用者角色資訊（可能為逗號分隔的字串）
 * @property {string} sub 使用者標識符（通常為使用者 ID）
 * @property {number} exp 權杖過期時間（Unix 時間戳記）
 * @property {string} http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name 使用者名稱（基於 WS-身份驗證協議的聲明）
 */
export interface JWTPayload {
  roles: string;
  sub: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
}
