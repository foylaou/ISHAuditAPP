// services/authService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { LoginApiRequest, LoginForm } from "@/types/authType";
import Cookies from 'js-cookie';

interface JWTPayload {
  roles: string;
  sub: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  iat: number;
  nbf: number;
  jti: string;
}

interface UserRoles {
  Audit: string;
  KPI: string;
  Sys: string;
  Org: string;
}

const api = axios.create({
  baseURL: '/proxy'
});

// Cookie 配置
const AUTH_COOKIE_OPTIONS = {
  secure: true,                // 強制使用 HTTPS
  sameSite: 'strict' as const, // 強制使用嚴格模式
  httpOnly: false,             // 允許 JavaScript 讀取
  expires: 1,                  // 1天後過期
  path: '/'
};

// 請求攔截器
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let autoRefreshInterval: NodeJS.Timeout | null = null;
let authErrorCallback = () => {};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authService.clearAuth();
      authErrorCallback();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  registerAuthErrorCallback(callback: () => void) {
    authErrorCallback = callback;
  },

  clearAuth() {
    Cookies.remove('auth_token', { path: '/' });
    Cookies.remove('user_roles', { path: '/' });
    Cookies.remove('user_name', { path: '/' });
    Cookies.remove('token_exp', { path: '/' });

    // 清除自動刷新定時器
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      autoRefreshInterval = null;
    }
  },

  async login(formData: LoginForm) {
    const apiData: LoginApiRequest = {
      Username: formData.username,
      Password: formData.password,
    };

    const response = await api.post('/Auth/login', apiData);
    const { token, message } = response.data;

    if (token) {
      const decoded = jwtDecode<JWTPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token has expired');
      }

      const roles: UserRoles = JSON.parse(decoded.roles);
      const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

      // 存儲認證信息
      Cookies.set('auth_token', token, AUTH_COOKIE_OPTIONS);
      Cookies.set('user_roles', JSON.stringify(roles), AUTH_COOKIE_OPTIONS);
      Cookies.set('user_name', userName, AUTH_COOKIE_OPTIONS);
      Cookies.set('token_exp', decoded.exp.toString(), AUTH_COOKIE_OPTIONS);

      // 啟動自動刷新
      this.startAutoRefresh();

      return {
        token,
        roles,
        userName,
        message,
        exp: decoded.exp,
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

  async refreshToken() {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const response = await api.post('/refresh-token', null, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      if (response.data.token) {
        const decoded = jwtDecode<JWTPayload>(response.data.token);

        if (decoded.exp * 1000 < Date.now()) {
          throw new Error('Refreshed token is already expired');
        }

        // 更新所有認證信息
        Cookies.set('auth_token', response.data.token, AUTH_COOKIE_OPTIONS);
        Cookies.set('token_exp', decoded.exp.toString(), AUTH_COOKIE_OPTIONS);

        if (decoded.roles) {
          const roles = JSON.parse(decoded.roles);
          Cookies.set('user_roles', JSON.stringify(roles), AUTH_COOKIE_OPTIONS);
        }

        if (decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']) {
          const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
          Cookies.set('user_name', userName, AUTH_COOKIE_OPTIONS);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      return false;
    }
  },

  startAutoRefresh() {
    // 如果已經有定時器在運行，先清除它
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }

    // 設置新的定時器，每4分鐘檢查一次
    autoRefreshInterval = setInterval(async () => {
      const tokenExp = this.getTokenExpiration();
      if (!tokenExp) return;

      const currentTime = Math.floor(Date.now() / 1000);
      // 如果 token 將在 5 分鐘內過期，就刷新它
      if (tokenExp - currentTime <= 300) {
        try {
          const refreshed = await this.refreshToken();
          if (!refreshed) {
            this.clearAuth();
            authErrorCallback();
          }
        } catch (error) {
          console.error('Auto refresh failed:', error);
          this.clearAuth();
          authErrorCallback();
        }
      }
    }, 4 * 60 * 1000); // 4分鐘檢查一次

    // 返回清理函數
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
      }
    };
  },

  stopAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      autoRefreshInterval = null;
    }
  },

  getToken(): string | undefined {
    return Cookies.get('auth_token');
  },

  getUserRoles(): UserRoles | null {
    const roles = Cookies.get('user_roles');
    return roles ? JSON.parse(roles) : null;
  },

  getUserName(): string | undefined {
    return Cookies.get('user_name');
  },

  getTokenExpiration(): number | null {
    const exp = Cookies.get('token_exp');
    return exp ? parseInt(exp) : null;
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.nbf && decoded.nbf > currentTime) {
        return false;
      }

      if (decoded.exp < currentTime) {
        this.clearAuth();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  logout(redirectCallback?: () => void) {
    this.clearAuth();
    if (redirectCallback) {
      redirectCallback();
    }
  },

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
