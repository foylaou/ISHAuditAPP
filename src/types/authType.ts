// types/authType.ts
export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginApiRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

export interface UserRoles {
  Audit: string;
  KPI: string;
  Sys: string;
  Org: string;
}

export interface JWTPayload {
  roles: string;
  sub: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
}
