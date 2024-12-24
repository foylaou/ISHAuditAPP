// services/authService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {LoginApiRequest, LoginForm} from "@/types/authType";

interface JWTPayload {
  roles: string;
  sub: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  // 新增更多 JWT 相關欄位
  iat: number;  // 發行時間
  nbf: number;  // Not Before
  jti: string;  // JWT ID
}

interface UserRoles {
  Audit: string;
  KPI: string;
  Sys: string;
  Org: string;
}

const api = axios.create({
  baseURL: '/proxy'  // 基礎路徑
});

// 請求攔截器
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
//
// 響應攔截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {


  async login(formData: LoginForm) {

    const apiData: LoginApiRequest = {
      Username: formData.username,
      Password: formData.password,

    };
     const response = await api.post('/login', apiData);  // 移除重複的 proxy 路徑
    const { token, message } = response.data;

    if (token) {
      // 解析 JWT
      const decoded = jwtDecode<JWTPayload>(token);

      // 檢查 token 是否過期
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token has expired');
      }

      // 解析 roles
      const roles: UserRoles = JSON.parse(decoded.roles);
      const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

      // 存儲資訊，包括過期時間
      localStorage.setItem('token', token);
      localStorage.setItem('userRoles', JSON.stringify(roles));
      localStorage.setItem('userName', userName);
      localStorage.setItem('tokenExp', decoded.exp.toString());
      return {
        token,
        roles,
        userName,
        message,
        exp: decoded.exp,
        // 可以加入更多 JWT 資訊
        tokenInfo: {
          issuedAt: new Date(decoded.iat * 1000).toISOString(),
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
          notBefore: decoded.nbf ? new Date(decoded.nbf * 1000).toISOString() : null,
          jwtId: decoded.jti
        }
      };
    }
    throw new Error('Token not found in response');
  },

    // 新增獲取 token 過期時間的方法
  getTokenExpiration(): number | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const exp = localStorage.getItem('tokenExp');
      return exp ? parseInt(exp) : null;
    }
    return null;
  },

  logout() {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userName');
    }
    window.location.href = '/Login';
  },

  getToken() {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem('token');
    }
  },

  getUserRoles(): UserRoles | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const roles = localStorage.getItem('userRoles');
      return roles ? JSON.parse(roles) : null;
    }
    return null; // 伺服器端預設返回 null
  },

getUserName(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const userName = localStorage.getItem('userName');
    return userName ? userName : null; // 若找不到則返回 null
  }
  return null; // 伺服器端環境返回 null
},

  // 改進版的身份驗證檢查方法
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000; // 轉換為秒

      // 檢查 token 是否在有效期內
      if (decoded.nbf && decoded.nbf > currentTime) {
        return false; // token 尚未生效
      }

      if (decoded.exp < currentTime) {
        // token 已過期，清除存儲的資訊
        this.logout();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },
    // 獲取 token 剩餘有效時間（分鐘）
  getTokenRemainingTime(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const remainingSeconds = decoded.exp - Date.now() / 1000;
      return Math.max(0, Math.floor(remainingSeconds / 60));
    } catch {
      return null;
    }
  }

};
