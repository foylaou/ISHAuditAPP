/**
 * FidoTool.ts - WebAuthn/FIDO2 Utilities
 *
 * This file contains utility functions for working with WebAuthn/FIDO2
 * authentication, including handling of credentials, encoding/decoding,
 * and communication with the server.
 */

import axios from "axios";

// Create axios instance with proxy baseURL
const api = axios.create({
  baseURL: '/proxy',
  headers: {
    'Content-Type': 'application/json'
  }
});
/**
 * 認證器的斷言回應。
 * @param clientDataJSON 用戶端資料 JSON
 * @param authenticatorData 認證器資料
 * @param signature 簽名值
 * @param userHandle 使用者標識（可選）
 */
export interface AuthenticatorAssertionResponse {
  clientDataJSON: ArrayBuffer;
  authenticatorData: ArrayBuffer;
  signature: ArrayBuffer;
  userHandle?: ArrayBuffer;
}

/**
 * 公開金鑰憑證。
 * @param id 憑證 ID
 * @param type 憑證類型（通常為 "public-key"）
 * @param rawId 原始 ID，以 ArrayBuffer 儲存
 * @param response 認證器的回應
 */
export interface MyPublicKeyCredential {
  id: string;
  type: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAssertionResponse;
}

/**
 * 斷言選項請求。
 * @param Username 使用者名稱（可選）
 * @param UserVerification 使用者驗證要求等級
 * @param AuthenticatorSelection 認證器選擇設定
 * @param Extensions 擴展功能，可擴展的鍵值對
 */
export interface AssertionOptionsRequest {
  Username?: string;
  rpID?: string;
  UserVerification: "required" | "preferred" | "discouraged";
  AuthenticatorSelection: {
    authenticatorAttachment?: "platform" | "cross-platform";
    requireResidentKey?: boolean;
    userVerification?: "required" | "preferred" | "discouraged";
  };
  Extensions: Record<string, unknown>;
}

/**
 * 斷言選項回應。
 * @param challenge 挑戰字串
 * @param timeout 超時時間（毫秒）
 * @param rpId 註冊提供者 ID
 * @param allowCredentials 允許的憑證（可選）
 * @param userVerification 使用者驗證方式（可選）
 * @param extensions 擴展功能（可選）
 */
export interface AssertionOptions {
  challenge: string;
  timeout: number;
  rpId: string;
  allowCredentials?: Array<{
    type: string;
    id: string;
    transports?: string[];
  }>;
  userVerification?: string;
  extensions?: Record<string, unknown>;
}

/**
 * 斷言結果。
 * @param success 是否成功
 * @param message 訊息描述
 * @param assertionOptions 斷言選項（可選）
 * @param sessionData 會話資料（可選）
 */
export interface AssertionResult {
  success: boolean;
  message: string;
  assertionOptions?: AssertionOptions;
  sessionData?: Record<string, unknown> | string;
}

/**
 * 驗證結果。
 * @param success 是否成功
 * @param message 訊息描述
 * @param token 驗證 Token（可選）
 * @param accessToken 存取 Token（可選）
 * @param refreshToken 更新 Token（可選）
 * @param userId 使用者 ID（可選）
 */
export interface VerificationResult {
  success: boolean;
  message: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
}


/**
 * WebAuthn/FIDO2 Buffer Utilities
 */

export const bufferUtils = {
  /**
   * 解碼 Base64URL 字串為 ArrayBuffer
   * @param base64Url Base64URL 編碼的字串
   * @returns 轉換後的 ArrayBuffer
   */
  base64UrlDecode: (base64Url: string): ArrayBuffer => {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const binaryString = window.atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },

  /**
   * 將 ArrayBuffer 編碼為 Base64URL 字串
   * @param buffer 要編碼的 ArrayBuffer
   * @returns Base64URL 編碼的字串
   */
  arrayBufferToBase64Url: (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = window.btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
};


/**
 * FIDO2 Service for WebAuthn functionality
 */
export const fidoService = {
  /**
   * 從伺服器獲取驗證選項以開始驗證
   * @param options 驗證請求的選項
   * @returns 包含驗證選項的 Promise
   */
  getAssertionOptions: async (options: AssertionOptionsRequest): Promise<AssertionResult> => {
    try {
      console.log("Sending assertion options request:", JSON.stringify(options, null, 2));

      // Try both endpoint variations
      let response;
      try {
        response = await api.post('/Auth/GetAssertionOptions', options);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.log("First endpoint failed, trying alternative:", error.message);
          response = await api.post('/Auth/GetAssertionOptionsAsync', options);
        }
      }

      if (!response || !response.data) {
        return {
          success: false,
          message: '伺服器回應無效'
        };
      }

      console.log("Server response:", response.data);

      return {
        success: true,
        message: '成功獲取驗證選項',
        assertionOptions: response.data.assertionOptions,
        sessionData: response.data.sessionData
      };
    } catch (error) {
      console.error("獲取驗證選項錯誤:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '無法獲取驗證選項'
      };
    }
  },

  /**
   * 向瀏覽器請求憑證
   * @param assertionOptions 憑證請求的選項
   * @returns 解析為 MyPublicKeyCredential 或 null 的 Promise
   */
  requestCredential: async (assertionOptions: AssertionOptions): Promise<MyPublicKeyCredential | null> => {
    try {
      console.log("Preparing credential request with options:", assertionOptions);

      // Prepare browser credential request parameters
      const publicKeyCredentialRequestOptions = {
        challenge: bufferUtils.base64UrlDecode(assertionOptions.challenge),
        timeout: assertionOptions.timeout,
        rpId: assertionOptions.rpId,
        allowCredentials: assertionOptions.allowCredentials && assertionOptions.allowCredentials.length > 0
          ? assertionOptions.allowCredentials.map(cred => ({
              type: cred.type,
              id: bufferUtils.base64UrlDecode(cred.id),
              transports: cred.transports
            }))
          : undefined, // If empty array, pass undefined instead
        userVerification: assertionOptions.userVerification
      };

      console.log("Calling navigator.credentials.get with options:",
        JSON.stringify({
          ...publicKeyCredentialRequestOptions,
          challenge: "[ArrayBuffer]", // Log placeholder for binary data
          allowCredentials: publicKeyCredentialRequestOptions.allowCredentials
            ? "[Mapped credentials]"
            : undefined
        }, null, 2)
      );

      // Request browser credential
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions as unknown as PublicKeyCredentialRequestOptions
      });

      console.log("Received credential response");

      // Check if credential is a PublicKeyCredential
      if (
        credential &&
        'rawId' in credential &&
        'response' in credential &&
        'type' in credential &&
        credential.type === 'public-key' &&
        credential.response instanceof AuthenticatorResponse &&
        'authenticatorData' in (credential.response as unknown as Record<string, unknown>) &&
        'signature' in (credential.response as unknown as Record<string, unknown>)
      ) {
        console.log("Valid PublicKeyCredential received");
        // Convert to our custom PublicKeyCredential type
        return credential as unknown as MyPublicKeyCredential;
      }

      console.error("Invalid credential format received:", credential);
      return null;
    } catch (error) {
      console.error("請求憑證錯誤:", error);
      throw error;
    }
  },

  /**
   * 驗證憑證與伺服器進行驗證
   * @param credential 要驗證的憑證
   * @param sessionData 來自獲取驗證選項的會話數據（可選）
   * @returns 包含驗證結果的 Promise
   */
  verifyCredentialWithServer: async (
    credential: MyPublicKeyCredential,
    sessionData?: Record<string, unknown> | string
  ): Promise<VerificationResult> => {
    try {
      // Prepare credential data for server
      const credentialData = {
        id: credential.id,
        rawId: bufferUtils.arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: bufferUtils.arrayBufferToBase64Url(credential.response.clientDataJSON),
          authenticatorData: bufferUtils.arrayBufferToBase64Url(credential.response.authenticatorData),
          signature: bufferUtils.arrayBufferToBase64Url(credential.response.signature),
          userHandle: credential.response.userHandle ?
            bufferUtils.arrayBufferToBase64Url(credential.response.userHandle) :
            null
        },
        // Include session data
        sessionData
      };

      console.log("Sending verification data:", JSON.stringify(credentialData, null, 2));

      // Try both endpoint variations
      let response;
      try {
        response = await api.post('/Auth/VerifyAssertion', credentialData);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.log("First verification endpoint failed, trying alternative:", error.message);
          response = await api.post('/Auth/VerifyAssertionAsync', credentialData);
        }
      }

      if (!response || !response.data) {
        return {
          success: false,
          message: `伺服器驗證失敗: ${response?.status || '未知錯誤'}`
        };
      }

      console.log("Verification response:", response.data);
      const result = response.data;

      // Verification successful
      if (result.success) {
        return {
          success: true,
          message: '驗證成功',
          token: result.token,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          userId: result.userId
        };
      }

      return {
        success: false,
        message: result.message || '驗證失敗'
      };
    } catch (error) {
      console.error('憑證驗證錯誤:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '驗證過程中發生錯誤'
      };
    }
  },

  /**
   * 完整的 Passkey 登入流程
   * @param options 驗證請求的選項
   * @returns 包含驗證結果的 Promise
   */
  completePasskeyLogin: async (options: AssertionOptionsRequest): Promise<VerificationResult> => {
    try {
      console.log("開始 Passkey 登入流程，選項:", JSON.stringify(options, null, 2));

      // 1. Get assertion options from server
      const assertionResult = await fidoService.getAssertionOptions(options);

      if (!assertionResult.success || !assertionResult.assertionOptions) {
        console.error("無法獲取驗證選項:", assertionResult.message);
        return {
          success: false,
          message: assertionResult.message || '無法獲取驗證選項'
        };
      }

      console.log("成功接收驗證選項:", assertionResult.assertionOptions);
      console.log("會話數據:", assertionResult.sessionData);

      // 2. Request credential from browser
      console.log("向瀏覽器請求憑證...");
      const credential = await fidoService.requestCredential(assertionResult.assertionOptions);

      if (!credential) {
        console.error("未能獲取憑證");
        return {
          success: false,
          message: '未能獲取憑證'
        };
      }

      console.log("成功接收憑證");

      // 3. Verify credential with server
      console.log("向伺服器驗證憑證...");
      return await fidoService.verifyCredentialWithServer(credential, assertionResult.sessionData);

    } catch (error) {
      console.error('Passkey 登入錯誤:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Passkey 登入過程中發生錯誤'
      };
    }
  }
};

export default fidoService;
