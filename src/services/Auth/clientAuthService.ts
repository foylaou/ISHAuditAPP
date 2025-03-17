// services/Auth/clientAuthService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  LoginApiRequest,
  LoginForm,
  TokenValidationResponse,
} from "@/types/authType";
import getAuthtoken, {

  clearAuthCookies,
  isAuthenticated as serverIsAuthenticated, storeAuthTokens,
} from './serverAuthService';
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




export async function SendVerificationEmail(email: string): Promise<{ success: boolean; message: string ;errors?: string[] }> {
  try {
    const response = await api.post('/Auth/SendVerificationEmail', {Email: email},{
            headers: { 'Content-Type': 'application/json' }
    });
    console.log(response);
    if (response.status === 200) {
      return { success: true, message: response.data.Message };
    }
    else {
      return { success: false, message: response.data.Message };
    }
  }catch(error) {
    if (axios.isAxiosError(error) && error.response) {
      return {success: false, message: "錯誤" ,errors: error.response?.data?.errors};
    }
    return { success: false, message: "未知錯誤" };
  }
}

export async function VerifyEmailCode(email: string,code:string): Promise<{ success: boolean; message: string ; }> {
  try {
    const response = await api.post('/Auth/VerifyEmailCode', {Email: email,Code:code},{
            headers: { 'Content-Type': 'application/json' }
    });
    console.log(response);
    if (response.status === 200 && response.data.success) {
      return { success: true, message: response.data.Message };
    }
    else {
      return { success: false, message: response.data.Message };
    }
  }catch(error) {
    console.log(error);
    return { success: false, message: "功能錯誤" };
  }
}
export async function SignUp(username: string,nickname:string,password:string,email:string): Promise<{ success: boolean; message: string ; }> {
  try {
    const response = await api.post('/Auth/SignUp', {userName:username,password:password,nickName:nickname,email:email},{
            headers: { 'Content-Type': 'application/json' }
    });
    console.log(response);
    if (response.status === 200 && response.data.success) {
      return { success: true, message: response.data.Message };
    }
    else {
      return { success: false, message: response.data.Message };
    }
  }catch(error) {
    console.log(error);
    return { success: false, message: "功能錯誤" };
  }
}


export async function DomainQuery(email: string): Promise<{ success: boolean; message: string ;data?:{org: string; type: string[] } }> {
  try {
    const response = await axios.post('/proxy/Auth/DomainQuery', { Email: email }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 200 && response.data.success) {
      return { success: true, message: "此郵件域名已通過組織驗證", data: response.data };
    }
    return { success: false, message: response.data.message ?? "查詢失敗，請稍後再試" };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ API 錯誤回應:", error.response.data);

      if (error.response.status === 403) {
        return { success: false, message: "此郵件域名尚未通過組織驗證" };
      }
    }
    return { success: false, message: "無法驗證電子郵件域名，請稍後再試" };
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
    await storeAuthTokens(accessToken, refreshToken);
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
      await storeAuthTokens(response.data.AccessToken,response.data.RefreshToken);
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




export async function loginWithEmail(email: string): Promise<{
  success: boolean;
  message: string;
  data?: string;
}> {
  try {
    const response = await api.post('/Auth/LoginEmail', { Email: email });
    if( response.data.success ) {
    return {
      success: true,
      message: response.data.message || '驗證郵件已發送',
      data: response.data.data
    };
    }else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    return {
      success: false,
      message: '電子郵件登入過程發生錯誤'
    };
  }
}


export async function validateEmailToken(token: string) {
  try {
    console.log("📥 接收到的驗證 Token:", token);

    // 發送 API 請求
    const response = await api.post('/Auth/ValidateEmailToken', { Token: token });

    const { accessToken, refreshToken, message } = response.data;

    if (!accessToken || !refreshToken) {
      console.error("❌ 伺服器未返回完整 Token:", response.data);
       new Error("後端未返回完整 Token");
    }

    console.log("✅ 從後端取得 Access Token:", accessToken);
    console.log("✅ 從後端取得 Refresh Token:", refreshToken);

    // **確保 accessToken 是標準 JWT**
    if (accessToken.split(".").length !== 3) {
       new Error("無效的 Access Token，格式錯誤");
    }

    // 存儲 Token 到 Cookie
    await storeAuthTokens(accessToken, refreshToken);

    // **只解析 accessToken，不解析 refreshToken**
    let decoded: JWTPayload;
    try {
      decoded = jwtDecode<JWTPayload>(accessToken);
      console.log("✅ 成功解析 JWT:", decoded);
    } catch (decodeError) {
      console.error("❌ 解析 JWT 失敗:", decodeError);
      throw new Error("無法解析 Access Token");
    }

    // 清理 `username`
    const username = (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "未提供名稱")
      .normalize("NFKC")
      .replace(/[\u200B-\u200D\uFEFF\u00A0\ufffc]/g, "")
      .trim()
      .replace(/\s+/g, " ");

    console.log("✅ 清理後的使用者名稱:", `"${username}"`);

    // 取得 UserId
    let userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    if (!userId) {
       new Error("無法取得使用者 ID");
    }
    userId = userId.toUpperCase();
    console.log("✅ 使用者 ID:", userId);

    // 取得 Email
    const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "未提供 Email";
    console.log("✅ 解析出的 Email:", email);

    // 更新全域狀態
    useGlobalStore.getState().setUserId(userId);
    useGlobalStore.getState().setUserName(username);
    useGlobalStore.getState().setIsLoggedIn(true);
    userInfoStore.getState().setUsername(username);
    userInfoStore.getState().setEmail(email);

    console.log("🚀 登入資訊已存儲於 Zustand");

    return {
      success: true,
      username,
      accessToken,
      refreshToken,
      userId,
      message
    };
  } catch (error) {
    console.error("❌ validateEmailToken 失敗:", error);
    throw error;
  }
}



export async function logout() {
  await clearAuthCookies();
}
