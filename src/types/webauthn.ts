// types/webauthn.ts
/**
 * 公開金鑰憑證創建選項（JSON 格式）
 * 定義 WebAuthn 註冊過程中的參數。
 *
 * @interface PublicKeyCredentialCreationOptionsJSON
 * @property {string} challenge 伺服器提供的挑戰碼
 * @property {PublicKeyCredentialRpEntity} rp 註冊機構資訊
 * @property {Object} user 使用者資訊
 * @property {string} user.id 使用者 ID（Base64Url 編碼）
 * @property {string} user.name 使用者名稱
 * @property {string} user.displayName 顯示名稱
 * @property {PublicKeyCredentialParameters[]} pubKeyCredParams 支援的金鑰參數
 * @property {number} [timeout] 設定操作逾時時間（可選）
 * @property {PublicKeyCredentialDescriptorJSON[]} [excludeCredentials] 排除的憑證清單（可選）
 * @property {AuthenticatorSelectionCriteria} [authenticatorSelection] 驗證器選擇標準（可選）
 * @property {AttestationConveyancePreference} [attestation] 附加驗證策略（可選）
 */
export interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string;
  rp: PublicKeyCredentialRpEntity;
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout?: number;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  attestation?: AttestationConveyancePreference;
}

/**
 * 公開金鑰憑證描述（JSON 格式）
 * 定義 WebAuthn 憑證的基本屬性。
 *
 * @interface PublicKeyCredentialDescriptorJSON
 * @property {string} id 憑證 ID（Base64Url 編碼）
 * @property {PublicKeyCredentialType} type 憑證類型
 * @property {AuthenticatorTransport[]} [transports] 支援的傳輸方式（可選）
 */
export interface PublicKeyCredentialDescriptorJSON {
  id: string;
  type: PublicKeyCredentialType;
  transports?: AuthenticatorTransport[];
}

/**
 * 身分驗證回應（JSON 格式）
 * 定義 WebAuthn 登入回應的結構。
 *
 * @interface AuthenticationResponseJSON
 * @property {string} id 憑證 ID
 * @property {string} rawId 原始憑證 ID（Base64Url 編碼）
 * @property {Object} response 驗證回應數據
 * @property {string} response.authenticatorData 驗證器數據（Base64Url 編碼）
 * @property {string} response.clientDataJSON 用戶端數據（Base64Url 編碼）
 * @property {string} response.signature 簽名（Base64Url 編碼）
 * @property {string | null} response.userHandle 使用者標識符（可能為 null）
 * @property {PublicKeyCredentialType} type 憑證類型
 */
export interface AuthenticationResponseJSON {
  id: string;
  rawId: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string | null;
  };
  type: PublicKeyCredentialType;
}

/**
 * 註冊回應（JSON 格式）
 * 定義 WebAuthn 註冊回應的結構。
 *
 * @interface RegistrationResponseJSON
 * @property {string} id 憑證 ID
 * @property {string} rawId 原始憑證 ID（Base64Url 編碼）
 * @property {Object} response 註冊回應數據
 * @property {string} response.attestationObject 附加驗證物件（Base64Url 編碼）
 * @property {string} response.clientDataJSON 用戶端數據（Base64Url 編碼）
 * @property {PublicKeyCredentialType} type 憑證類型
 */
export interface RegistrationResponseJSON {
  id: string;
  rawId: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
  type: PublicKeyCredentialType;
}
