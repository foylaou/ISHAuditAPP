// types/authType.ts
// 登入表單數據
export interface LoginForm {
  username: string;
  password: string;
  captchaToken?: string;
}

// 登入 API 請求數據
export interface LoginApiRequest {
  Username: string;
  Password: string;
}

export interface RegisterUserDto {
  Username: string;
  Password: string;
  Email: string;
  FullName?: string;
  PhoneNumber?: string;
  Department?: string;
  Position?: string;
  // 可以根據實際需求添加更多字段
}
// 錯誤響應
export interface ErrorResponse {
  message: string;
  errors?: string[];
}

// 登入響應
export interface LoginResponse {
  token: string;
  message: string;
}

// Token 驗證響應
export interface TokenValidationResponse {
  isValid: boolean;
  roles?: string[];
  message: string;
}

// 用戶信息
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  roles?: string[];
  [key: string]: unknown; // 允許其他後端可能返回的字段
}

// 註冊響應
export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: UserInfo;
}

// 域名查詢響應
export interface DomainQueryResponse {
  success: boolean;
  organization?: string;
  organizationType?: string;
  message?: string;
}


export interface ValidateEmailTokenResponse {
  success?: boolean;
  message: string;
  accessToken:string
  refreshToken: string;
  UserId: string;
}
