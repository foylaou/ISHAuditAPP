// services/authService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  roles: string;
  sub: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
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
  const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userName');
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: { username: string; password: string }) {
     const response = await api.post('/login', credentials);  // 移除重複的 proxy 路徑
    const { token, message } = response.data;

    if (token) {
      // 解析 JWT
      const decoded = jwtDecode<JWTPayload>(token);

      // 解析 roles JSON 字符串
      const roles: UserRoles = JSON.parse(decoded.roles);
      const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

      // 存儲信息
      localStorage.setItem('token', token);
      localStorage.setItem('userRoles', JSON.stringify(roles));
      localStorage.setItem('userName', userName);

      return {
        token,
        roles,
        userName,
        message
      };
    }
    throw new Error('Token not found in response');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userName');
    window.location.href = '/Login';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUserRoles(): UserRoles | null {
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles) : null;
  },

  getUserName(): string | null {
    return localStorage.getItem('userName');
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};
