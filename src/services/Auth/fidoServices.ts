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

// WebAuthn Type Definitions
export interface AuthenticatorAssertionResponse {
  clientDataJSON: ArrayBuffer;
  authenticatorData: ArrayBuffer;
  signature: ArrayBuffer;
  userHandle?: ArrayBuffer;
}

export interface MyPublicKeyCredential {
  id: string;
  type: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAssertionResponse;
}

export interface AssertionOptionsRequest {
  Username?: string;
  UserVerification: "required" | "preferred" | "discouraged";
  AuthenticatorSelection: {
    authenticatorAttachment?: "platform" | "cross-platform";
    requireResidentKey?: boolean;
    userVerification?: "required" | "preferred" | "discouraged";
  };
  Extensions: Record<string, unknown>;
}

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

export interface AssertionResult {
  success: boolean;
  message: string;
  assertionOptions?: AssertionOptions;
  sessionData?: Record<string, unknown> | string;
}

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
   * Decode a base64url string to an ArrayBuffer
   * @param base64Url Base64URL encoded string
   * @returns ArrayBuffer
   */
  base64UrlDecode: (base64Url: string): ArrayBuffer => {
    // Replace base64url characters with standard base64 characters
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    // Decode base64
    const binaryString = window.atob(padded);
    // Convert to ArrayBuffer
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },

  /**
   * Encode an ArrayBuffer as a base64url string
   * @param buffer ArrayBuffer to encode
   * @returns Base64URL encoded string
   */
  arrayBufferToBase64Url: (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Convert to base64
    const base64 = window.btoa(binary);
    // Convert to base64url
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
};

/**
 * FIDO2 Service for WebAuthn functionality
 */
export const fidoService = {
  /**
   * Get assertion options from the server to start authentication
   * @param options Options for the assertion request
   * @returns Promise with assertion options
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
   * Request browser credentials
   * @param assertionOptions Options for credential request
   * @returns Promise with credential
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
   * Verify credential with server
   * @param credential The credential to verify
   * @param sessionData Session data from get assertion options
   * @returns Promise with verification result
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
   * Complete passkey login flow
   * @param options Options for the assertion request
   * @returns Promise with verification result
   */
  completePasskeyLogin: async (options: AssertionOptionsRequest): Promise<VerificationResult> => {
    try {
      console.log("Starting Passkey login flow with options:", JSON.stringify(options, null, 2));

      // 1. Get assertion options from server
      const assertionResult = await fidoService.getAssertionOptions(options);

      if (!assertionResult.success || !assertionResult.assertionOptions) {
        console.error("Failed to get assertion options:", assertionResult.message);
        return {
          success: false,
          message: assertionResult.message || '無法獲取驗證選項'
        };
      }

      console.log("Successfully received assertion options:", assertionResult.assertionOptions);
      console.log("Session data:", assertionResult.sessionData);

      // 2. Request credential from browser
      console.log("Requesting credential from browser...");
      const credential = await fidoService.requestCredential(assertionResult.assertionOptions);

      if (!credential) {
        console.error("No credential returned from browser");
        return {
          success: false,
          message: '未能獲取憑證'
        };
      }

      console.log("Successfully received credential");

      // 3. Verify credential with server
      console.log("Verifying credential with server...");
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
