// services/Auth/clientAuthService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  LoginApiRequest,
  LoginForm,
  RegisterUserDto,
  AssertionClientParams,
  TokenValidationResponse,
  RegisterResponse,
  DomainQueryResponse,
  AssertionOptionsResponse,
  ValidateEmailTokenResponse,
  UserInfo
} from "@/types/authType";
import getAuthtoken, { storeAuthCookies, clearAuthCookies, isAuthenticated as serverIsAuthenticated } from './serverAuthService';
import {useGlobalStore} from "@/store/useGlobalStore";
import {userInfoStore} from "@/store/useUserinfoStore";

interface JWTPayload {
  role?: string | string[];
  sub: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  iat: number;
  nbf: number;
  jti: string;
  unique_name?: string;
}

// API 客戶端
const api = axios.create({
  baseURL: '/proxy'
});


let authErrorCallback = () => {};

// 請求攔截器
api.interceptors.request.use(async (config) => {
  // 從 server-side cookies 獲取 token
  const isServerSide = typeof window === 'undefined';
  if (isServerSide) {
    // 伺服器端直接透過 server 方法獲取
    const authenticated = await serverIsAuthenticated();
    if (authenticated) {
      // 可以在這裡添加從 server cookies 讀取 token 的邏輯
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearAuthCookies();
      authErrorCallback();
    }
    return Promise.reject(error);
  }
);

export async function isAuthenticated(): Promise<boolean> {
  // 客戶端檢查
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Use validateToken instead of directly calling serverIsAuthenticated
    const tokenValidation = await validateToken();
    return tokenValidation.isValid;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

export async function registerAuthErrorCallback(callback: () => void) {
  authErrorCallback = callback;
}

export async function verifyCaptcha(captchaResponse: string): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const response = await api.post('/Auth/captcha', null, {
      params: { cfTurnstileResponse: captchaResponse }
    });
    return { success: true, message: response.data.Message };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.Message || '驗證失敗',
        errors: error.response.data?.Errors
      };
    }
    return {
      success: false,
      message: '驗證過程發生錯誤',
    };
  }
}

export async function login(formData: LoginForm) {
  const apiData: LoginApiRequest = {
    Username: formData.username,
    Password: formData.password,
  };

  const response = await api.post('/Auth/login', apiData);
  const { accessToken, refreshToken, message } = response.data;

  if (accessToken && refreshToken) {

    // 存儲 Access Token 到 Cookie
    await storeAuthCookies(accessToken);
    const decoded = jwtDecode<JWTPayload>(accessToken);
    const username = (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "未提供名稱")
      .normalize("NFKC") // 標準化 Unicode 字符
      .replace(/[\u200B-\u200D\uFEFF\u00A0\ufffc]/g, "") // 移除不可見字符 (BOM, 零寬度空格, U+FFFC)
      .trim()
      .replace(/\s+/g, " "); // 轉換多個空格為單一空格

    const UserId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"].toUpperCase();
    const email =decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    console.log(username);
    console.log(typeof username);
    // 更新全域狀態
    useGlobalStore.getState().setUserId(UserId);
    useGlobalStore.getState().setUserName(username);
    useGlobalStore.getState().setIsLoggedIn(true);
    userInfoStore.getState().setUsername(username);
    // userInfoStore.getState().setUsername("劉名政");
    userInfoStore.getState().setEmail(email);
    return {
      accessToken,
      refreshToken,
      UserId,
      message
    };
  }

  throw new Error('Token not found in response');
}

export async function refreshToken() {
  try {
    const token = await getAuthtoken();
    if (!token) {
      console.error("無法獲取 `auth_token`，無法刷新 Token");
      return false;
    }

    const decoded = jwtDecode<JWTPayload>(token.value);

    const response = await api.post('/Auth/refresh-token', {
      refreshToken: token.value,  // 傳遞 Refresh Token
      userId: decoded.sub         // 傳遞 UserId
    });

    if (response.data.AccessToken) {
      await storeAuthCookies(response.data.AccessToken);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await clearAuthCookies();
    return false;
  }
}

export async function validateToken(): Promise<TokenValidationResponse> {
  try {
    const token = await getAuthtoken();
    console.log(token);
    // 如果沒有 token，直接返回未驗證
    if (!token) {
      return {
        isValid: false,
        message: '未找到 Token'
      };
    }

    const response = await api.post('/Auth/ValidateAuthorization', null, {
      headers: {
        // 確保加入 Bearer Token
        'Authorization': `Bearer ${token.value}`
      }
    });

    return {
      isValid: true,
      roles: response.data.Roles,
      message: response.data.Message
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        isValid: false,
        message: error.response.data?.Message || '驗證失敗'
      };
    }
    return {
      isValid: false,
      message: '驗證過程發生錯誤'
    };
  }
}

export async function register(userData: RegisterUserDto): Promise<RegisterResponse> {
  try {
    const response = await api.post('/Auth/Register', userData);
    return {
      success: true,
      message: response.data.message,
      user: response.data.user
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || '註冊失敗'
      };
    }
    return {
      success: false,
      message: '註冊過程發生錯誤'
    };
  }
}

export async function signUp(userData: RegisterUserDto): Promise<{
  success: boolean;
  message: string;
  data?: string;
}> {
  try {
    const response = await api.post('/Auth/SignUp', userData);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.error || '註冊失敗'
      };
    }
    return {
      success: false,
      message: '註冊過程發生錯誤'
    };
  }
}

export async function getAssertionOptions(clientParams: AssertionClientParams): Promise<AssertionOptionsResponse> {
  try {
    const response = await api.post('/Auth/GetAssertionOptionsAsync', clientParams);
    return {
      success: response.data.success,
      message: response.data.message,
      assertionOptions: response.data.assertionOptions,
      sessionData: response.data.sessionData
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || '獲取驗證選項失敗'
      };
    }
    return {
      success: false,
      message: '獲取驗證選項過程發生錯誤'
    };
  }
}

export async function queryEmailDomain(email: string): Promise<DomainQueryResponse> {
  try {
    const response = await api.post('/Auth/DomainQuery', { Email: email });
    return {
      success: true,
      organization: response.data.org,
      organizationType: response.data.type
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.message || '域名查詢失敗'
      };
    }
    return {
      success: false,
      message: '域名查詢過程發生錯誤'
    };
  }
}

export async function loginWithEmail(email: string): Promise<{
  success: boolean;
  message: string;
  data?: string;
}> {
  try {
    const response = await api.post('/Auth/LoginEmail', { Email: email });
    return {
      success: true,
      message: response.data.message || '驗證郵件已發送',
      data: response.data.data
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.error || '電子郵件登入請求失敗'
      };
    }
    return {
      success: false,
      message: '電子郵件登入過程發生錯誤'
    };
  }
}

export async function validateEmailToken(token: string): Promise<ValidateEmailTokenResponse> {
  try {
    const response = await api.post('/Auth/ValidateEmailToken', { Token: token });

    if (response.data.token) {
      const jwtToken = response.data.token;
      await processAndStoreToken(jwtToken);

      const decoded = jwtDecode<JWTPayload>(jwtToken);

      const user: UserInfo = {
        id: decoded.sub,
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email: decoded.sub,
        roles: Array.isArray(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
          ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          : decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            ? [decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']]
            : []
      };

      return {
        success: true,
        message: response.data.message || '驗證成功',
        token: jwtToken,
        user
      };
    }

    return {
      success: false,
      message: response.data.message || '驗證失敗，未返回有效令牌'
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data?.error || '驗證碼驗證失敗'
      };
    }
    return {
      success: false,
      message: '驗證碼處理過程發生錯誤'
    };
  }
}

export async function processAndStoreToken(token: string) {
  if (!token) {
    throw new Error('未提供 token');
  }

  try {
    const authInfo = await storeAuthCookies(token);

    const decoded = jwtDecode<JWTPayload>(token);

    return {
      token,
      ...authInfo,
      tokenInfo: {
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString(),
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
        notBefore: decoded.nbf && !isNaN(decoded.nbf) ? new Date(decoded.nbf * 1000).toISOString() : null,
        jwtId: decoded.jti
      }
    };
  } catch (error) {
    console.error('處理 token 時發生錯誤:', error);
    await clearAuthCookies();
    throw error;
  }
}

export async function logout() {
  await clearAuthCookies();
}
