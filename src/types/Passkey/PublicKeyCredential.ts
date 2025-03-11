// PublicKeyCredential 介面
export interface PublicKeyCredential extends Credential {
    readonly rawId: ArrayBuffer;
    readonly response: AuthenticatorResponse;
    readonly authenticatorAttachment?: AuthenticatorAttachment;
    getClientExtensionResults(): AuthenticationExtensionsClientOutputs;
}

// Credential 基礎介面
export interface Credential {
    readonly id: string;
    readonly type: string;
}

// AuthenticatorResponse 介面
export interface AuthenticatorResponse {
    readonly clientDataJSON: ArrayBuffer;
}

// AuthenticatorAssertionResponse 介面 (用於登入)
export interface AuthenticatorAssertionResponse extends AuthenticatorResponse {
    readonly authenticatorData: ArrayBuffer;
    readonly signature: ArrayBuffer;
    readonly userHandle: ArrayBuffer | null;
}

// AuthenticatorAttestationResponse 介面 (用於註冊)
export interface AuthenticatorAttestationResponse extends AuthenticatorResponse {
    readonly attestationObject: ArrayBuffer;
}

// 認證選項介面
export interface CredentialRequestOptions {
    mediation?: CredentialMediationRequirement;
    publicKey?: PublicKeyCredentialRequestOptions;
    signal?: AbortSignal;
}

// PublicKey 認證請求選項
export interface PublicKeyCredentialRequestOptions {
    challenge: BufferSource;  // 必須項: 挑戰值
    timeout?: number;         // 選項項: 操作超時時間 (毫秒)
    rpId?: string;            // 選項項: 依賴方 ID (通常是網域)
    allowCredentials?: PublicKeyCredentialDescriptor[];  // 選項項: 允許的憑證列表
    userVerification?: UserVerificationRequirement;  // 選項項: 用戶驗證要求
    extensions?: AuthenticationExtensionsClientInputs;  // 選項項: 擴展
}

// 憑證描述符
export interface PublicKeyCredentialDescriptor {
    type: "public-key";
    id: BufferSource;
    transports?: AuthenticatorTransport[];
}

// 用戶驗證要求類型
export type UserVerificationRequirement = "required" | "preferred" | "discouraged";

// 憑證中介類型
export type CredentialMediationRequirement = "silent" | "optional" | "required" | "conditional";

// 驗證器傳輸選項
export type AuthenticatorTransport = "usb" | "nfc" | "ble" | "internal";

// 驗證器附件類型
export type AuthenticatorAttachment = "platform" | "cross-platform";
