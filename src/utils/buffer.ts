// utils/buffer.ts
/**
 * Buffer 工具函式
 * 提供 ArrayBuffer 與 Base64URL 字串之間的轉換方法。
 */
export const bufferUtils = {
  /**
   * 將 ArrayBuffer 轉換為 Base64URL 字串
   *
   * @param {ArrayBuffer} buffer 要轉換的 ArrayBuffer
   * @returns {string} Base64URL 格式的字串
   */
  bufferToBase64URLString(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chars: string[] = Array.from(bytes).map(byte => String.fromCharCode(byte));
    const base64 = btoa(chars.join(''));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },
  arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },
  base64UrlDecode(input: string): string {
    // 將 Base64URL 字串還原成標準 Base64 格式
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

    // 如果字串長度不是 4 的倍數，補 `=`（因 Base64 需 4 的倍數）
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }

    // 使用 `atob()` 解碼
    return decodeURIComponent(escape(atob(base64)));
},


  /**
   * 將 Base64URL 字串轉換為 ArrayBuffer
   *
   * @param {string} base64URLString Base64URL 格式的字串
   * @returns {ArrayBuffer} 轉換後的 ArrayBuffer
   */
  base64URLStringToBuffer(base64URLString: string): ArrayBuffer {
    const base64 = base64URLString.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const binary = atob(paddedBase64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
  }
};

/**
 * ArrayBuffer 處理工具
 * 提供從 WebAuthn 響應物件中提取資料的方法。
 */
export const arrayBufferUtils = {
  /**
   * 從 AuthenticatorAttestationResponse 提取數據
   *
   * @param {AuthenticatorAttestationResponse} attestationResponse WebAuthn 註冊回應
   * @returns {{ attestationObject: Uint8Array, clientDataJSON: Uint8Array }} 提取的數據
   */
  getAttestationResponse(attestationResponse: AuthenticatorAttestationResponse) {
    return {
      attestationObject: new Uint8Array(attestationResponse.attestationObject),
      clientDataJSON: new Uint8Array(attestationResponse.clientDataJSON)
    };
  },

  /**
   * 從 AuthenticatorAssertionResponse 提取數據
   *
   * @param {AuthenticatorAssertionResponse} assertionResponse WebAuthn 身分驗證回應
   * @returns {{ authenticatorData: Uint8Array, clientDataJSON: Uint8Array, signature: Uint8Array, userHandle: Uint8Array | null }} 提取的數據
   */
  getAssertionResponse(assertionResponse: AuthenticatorAssertionResponse) {
    return {
      authenticatorData: new Uint8Array(assertionResponse.authenticatorData),
      clientDataJSON: new Uint8Array(assertionResponse.clientDataJSON),
      signature: new Uint8Array(assertionResponse.signature),
      userHandle: assertionResponse.userHandle ? new Uint8Array(assertionResponse.userHandle) : null
    };
  }
};
