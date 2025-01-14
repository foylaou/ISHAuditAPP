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
const COOKIE_OPTIONS = {
  secure: true,        // 只在 HTTPS 下傳輸
  sameSite: 'strict' as const,  // 防止 CSRF 攻擊
  expires: 1           // 1天後過期
};

// 請求攔截器
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 響應攔截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authService.clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  clearAuth() {
    Cookies.remove('token');
    Cookies.remove('userRoles');
    Cookies.remove('userName');
    Cookies.remove('tokenExp');
  },

  async login(formData: LoginForm) {
    const apiData: LoginApiRequest = {
      Username: formData.username,
      Password: formData.password,
    };

    const response = await api.post('/login', apiData);
    const { token, message } = response.data;

    if (token) {
      const decoded = jwtDecode<JWTPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token has expired');
      }

      const roles: UserRoles = JSON.parse(decoded.roles);
      const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

      // 使用 Cookies 存儲資訊
      Cookies.set('token', token, COOKIE_OPTIONS);
      Cookies.set('userRoles', JSON.stringify(roles), COOKIE_OPTIONS);
      Cookies.set('userName', userName, COOKIE_OPTIONS);
      Cookies.set('tokenExp', decoded.exp.toString(), COOKIE_OPTIONS);

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

  getTokenExpiration(): number | null {
    const exp = Cookies.get('tokenExp');
    return exp ? parseInt(exp) : null;
  },

  logout() {
    this.clearAuth();
    window.location.href = '/Login';
  },

  getToken(): string | undefined {
    return Cookies.get('token');
  },

  getUserRoles(): UserRoles | null {
    const roles = Cookies.get('userRoles');
    return roles ? JSON.parse(roles) : null;
  },

  getUserName(): string | undefined {
    return Cookies.get('userName');
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
