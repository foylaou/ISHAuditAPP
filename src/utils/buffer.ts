// utils/buffer.ts
export const bufferUtils = {
  // ArrayBuffer 轉 base64url string
  bufferToBase64URLString(buffer: ArrayBuffer): string {
    // 先轉換成 Uint8Array
    const bytes = new Uint8Array(buffer);
    // 轉換成字符數組
    const chars: string[] = Array.from(bytes).map(byte => String.fromCharCode(byte));
    // 合併成單個字符串並轉換為 base64
    const base64 = btoa(chars.join(''));
    // 轉換為 base64url 格式
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  // base64url string 轉 ArrayBuffer
  base64URLStringToBuffer(base64URLString: string): ArrayBuffer {
    // 將 base64url 轉回標準 base64
    const base64 = base64URLString.replace(/-/g, '+').replace(/_/g, '/');
    // 添加必要的填充
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    // 解碼 base64
    const binary = atob(paddedBase64);
    // 創建 ArrayBuffer 和 視圖
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    // 填充數據
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
  }
};

// 新增類型處理工具
export const arrayBufferUtils = {
  // 從 AuthenticatorAttestationResponse 中提取數據
  getAttestationResponse(attestationResponse: AuthenticatorAttestationResponse) {
    return {
      attestationObject: new Uint8Array(attestationResponse.attestationObject),
      clientDataJSON: new Uint8Array(attestationResponse.clientDataJSON)
    };
  },

  // 從 AuthenticatorAssertionResponse 中提取數據
  getAssertionResponse(assertionResponse: AuthenticatorAssertionResponse) {
    return {
      authenticatorData: new Uint8Array(assertionResponse.authenticatorData),
      clientDataJSON: new Uint8Array(assertionResponse.clientDataJSON),
      signature: new Uint8Array(assertionResponse.signature),
      userHandle: assertionResponse.userHandle ? new Uint8Array(assertionResponse.userHandle) : null
    };
  }
};
