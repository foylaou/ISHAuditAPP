"use client"

import {useState, ReactNode, ChangeEvent, useEffect} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"; // 更改為 next/navigation
import { LoginForm } from "@/types/authType";
import {bufferUtils} from "@/utils/buffer";
import axios from "axios";
import {useGlobalStore} from "@/store/useGlobalStore";
import { authService } from "@/services/Auth/authService";
import {clearAuthCookies} from "@/services/Auth/serverAuthService";

/**
 * 標籤觸發器屬性介面
 * 定義標籤（Tab）觸發器的相關屬性。
 *
 * @interface TabTriggerProps
 * @property {string} value 唯一標識標籤的值。
 * @property {string} currentTab 當前選中的標籤值。
 * @property {ReactNode} children 內嵌的子元素。
 * @property {(value: string) => void} onClick 點擊標籤時的處理函式。
 * @property {boolean} useCustomStyles 是否使用自訂樣式。
 * @property {boolean} isMobile 是否為行動裝置模式。
 */
export interface TabTriggerProps {
  value: string;
  currentTab: string;
  children: ReactNode;
  onClick: (value: string) => void;
  useCustomStyles: boolean;
  isMobile: boolean;
}
/**
 * 標籤內容屬性介面
 * 定義標籤（Tab）內容的相關屬性。
 *
 * @interface TabContentProps
 * @property {string} value 唯一標識標籤的值。
 * @property {string} title 標籤的標題。
 * @property {ReactNode} content 標籤的主要內容。
 * @property {string} buttonText 按鈕上顯示的文字。
 * @property {boolean} isActive 是否為當前選中的標籤。
 * @property {boolean} useCustomStyles 是否使用自訂樣式。
 * @property {boolean} isMobile 是否為行動裝置模式。
 * @property {() => void} onButtonClick 按鈕點擊事件的處理函式。
 */
export interface TabContentProps {
  value: string;
  title: string;
  content: ReactNode;
  buttonText: string;
  isActive: boolean;
  useCustomStyles: boolean;
  isMobile: boolean;
  onButtonClick: () => void;
}
/**
 * DaisyUI 標籤屬性介面
 * 定義 DaisyUI 樣式的標籤元件屬性。
 *
 * @interface DaisyUITabsProps
 * @property {string} [defaultTab] 預設選中的標籤值。
 * @property {string} [className] 自訂的 CSS 類別名稱。
 * @property {boolean} [useCustomStyles] 是否使用自訂樣式。
 */
export interface DaisyUITabsProps {
  defaultTab?: string;
  className?: string;
  useCustomStyles?: boolean;
}

// 自定義 WebAuthn 類型定義
interface AuthenticatorAssertionResponse {
  clientDataJSON: ArrayBuffer;
  authenticatorData: ArrayBuffer;
  signature: ArrayBuffer;
  userHandle?: ArrayBuffer;
}

interface MyPublicKeyCredential {
  id: string;
  type: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAssertionResponse;
}


const TabTrigger = ({ value, currentTab, children, onClick, useCustomStyles, isMobile }: TabTriggerProps) => {
  return (
    <button
      className={
        useCustomStyles
          ? "tabs tabs-lg"
          : `tab tab-bordered ${currentTab === value ? 'tab-active' : ''} ${isMobile ? 'text-xs py-2' : ''}`
      }
      onClick={() => onClick(value)}
      data-state={currentTab === value ? 'tab active' : 'tab'}
      role="tab"
      aria-selected={currentTab === value}
      aria-controls={`${value}-panel`}
      id={`${value}-tab`}
    >
      {children}
      {currentTab === value && (
        <motion.div
          className={useCustomStyles ? "tabs-indicator" : ""}
          layoutId="tabs-indicator"
        />
      )}
    </button>
  )
}



const TabContent = ({ value, title, content, buttonText, isActive, useCustomStyles, isMobile, onButtonClick }: TabContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        filter: "blur(5px)",
        transition: { duration: 0.15 },
      }}
      layout="position"
      className={
        useCustomStyles
          ? "tabs-content"
          : `p-3 md:p-5 will-change-[opacity,filter] text-base-content`
      }
      role="tabpanel"
      id={`${value}-panel`}
      aria-labelledby={`${value}-tab`}
      tabIndex={0}
    >
      <h3 className={useCustomStyles ? "" : `text-${isMobile ? 'base' : 'lg'} font-medium mb-2`}>{title}</h3>
      <div className={useCustomStyles ? "content-wrapper" : "mb-4 text-xs md:text-sm text-opacity-70"}>{content}</div>
      <div className={useCustomStyles ? "button-container" : "flex justify-end"}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={
            useCustomStyles
              ? "button large"
              : `btn ${isMobile ? 'btn-sm' : ''} btn-primary text-white w-full sm:w-auto`
          }
          onClick={onButtonClick}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  )
}



export default function ResponsiveLoginUITabs({ defaultTab = "一般登入", className = "", useCustomStyles = false }: DaisyUITabsProps = {}) {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [tab, setTab] = useState(defaultTab);
  const [sendemail, setSendemail] = useState(false);
  const [emailerror, setEmailerror] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  // 當視窗大小改變時，檢查是否為行動裝置
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640) // 640px 是 Tailwind 的 sm 斷點
    }

    // 初始檢查
    checkIfMobile()

    // 監聽視窗大小變更
    window.addEventListener('resize', checkIfMobile)

    // 設置路由準備狀態
    setIsRouterReady(true);

    // 清理監聽器
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // 處理信箱輸入變更
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  // 處理帳號輸入變更
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  // 處理密碼輸入變更
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  // 處理驗證碼輸入變更
  const handleVerificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value)
  }


// 處理信箱登入按鈕點擊
const handleEmailButton = async () => {
  if (!isRouterReady) return;

  try {
    setLoading(true);
    setError(null);

    // 如果已經發送過驗證碼且有輸入驗證碼，則進行驗證
    if (sendemail && verificationCode) {
      // 驗證用戶輸入的驗證碼
      const validationResult = await authService.validateEmailToken(verificationCode);

      if (!validationResult.success) {
        setEmailerror(validationResult.message || "驗證碼無效");
        setLoading(false);
        return;
      }

      // 驗證成功，存儲用戶信息
      if (validationResult.user) {
         useGlobalStore.getState().setUserName(validationResult.user.username);
      }

      // 驗證成功後重定向到主頁
      router.push('/Home');
      return;
    }

    // 如果沒有發送過驗證碼或沒有輸入驗證碼，則發送驗證碼
    if (!email) {
      setEmailerror("請輸入信箱");
      setLoading(false);
      return;
    }

    // 發送驗證碼到用戶郵箱
    const emailResult = await authService.loginWithEmail(email);

    if (!emailResult.success) {
      setEmailerror(emailResult.message || "發送驗證碼失敗");
      setLoading(false);
      return;
    }

    // 發送成功
    setEmailerror(emailResult.message || "驗證碼已發送到您的郵箱");
    setSendemail(true);

  } catch (error) {
    if (error instanceof Error) {
      setEmailerror(error.message);
    } else {
      setEmailerror("處理過程中發生錯誤");
    }
    console.error("Email login error:", error);
  } finally {
    setLoading(false);
  }
};

  // 處理一般登入按鈕點擊
// 處理一般登入按鈕點擊
const handleNormalLogin = async () => {
  if (!isRouterReady) return;

  try {
    setLoading(true);
    setError(null);

    if (!username || !password) {
      setError("請輸入帳號和密碼");
      return;
    }

    const formData: LoginForm = {
      username,
      password
    };

    // 進行登入
    const loginResult = await authService.login(formData);

    // 登入成功後的處理
    console.log('登入成功:', loginResult);

    if (loginResult.accessToken && loginResult.refreshToken && loginResult.UserId) {

      // 儲存 Access Token
      await authService.processAndStoreToken(loginResult.accessToken);

      // 根據角色導航到不同頁面
      router.push('/Home');
    } else {
      setError("登入失敗，請重試");
    }
  } catch (error) {
    setError(error instanceof Error ? error.message : "登入失敗");
    console.error("登入錯誤:", error);
    await clearAuthCookies(); // 清除 Token 以確保安全
  } finally {
    setLoading(false);
  }
};

  // 輔助函數: Base64URL 解碼
  const base64UrlDecode = (base64Url: string): ArrayBuffer => {
    // 將 base64url 轉為 base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // 解碼 base64
    const binaryString = window.atob(base64);
    // 轉換為 ArrayBuffer
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // 輔助函數: ArrayBuffer 轉 Base64URL
  const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // 轉換為 base64
    const base64 = window.btoa(binary);
    // 轉換為 base64url
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  // 驗證憑證
  const verifyCredentialWithServer = async (
    credential: MyPublicKeyCredential,
    sessionData?: Record<string, unknown>
  ): Promise<{ success: boolean; message: string; token?: string }> => {
    try {
      // 準備發送給服務器的憑證數據
      const credentialData = {
        id: credential.id,
        rawId: arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
          authenticatorData: arrayBufferToBase64Url(credential.response.authenticatorData),
          signature: arrayBufferToBase64Url(credential.response.signature),
          userHandle: credential.response.userHandle ?
            arrayBufferToBase64Url(credential.response.userHandle) :
            null
        },
        // 包含會話數據
        sessionData
      };

      // 向服務器端發送驗證請求
     const response = await axios.post('/proxy/Auth/VerifyAssertion', credentialData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response || !response.data) {
    return {
      success: false,
      message: `伺服器驗證失敗: ${response?.status || '未知錯誤'}`
    };
  }

  const result = response.data;

  // 驗證成功，保存 token
  if (result.token) {
    // 使用 authService 處理 token，而不是直接儲存
    // 這將確保正確處理 JWT 解碼、儲存和自動刷新
    await authService.processAndStoreToken(result.token);

    return {
      success: true,
      message: '驗證成功',
      token: result.token
    };
  }

  return {
    success: true,
    message: result.message || '驗證成功'
  };
} catch (error) {
  console.error('Credential verification error:', error);
  return {
    success: false,
    message: error instanceof Error ? error.message : '驗證過程中發生錯誤'
  };
}

  };

  // 處理 Passkey 登入
  const handlePasskeyLogin = async () => {
    if (!isRouterReady) return;

    try {
      setLoading(true);
      setError(null);

      if (!username) {
        setError("請先輸入帳號");
        return;
      }

      // 1. 獲取 FIDO2 驗證選項
      const assertionResult = await authService.getAssertionOptions({
        username,
        userVerification: 'preferred'
      });

      if (!assertionResult.success || !assertionResult.assertionOptions) {
        setError(assertionResult.message || '無法獲取驗證選項');
        return;
      }

      console.log('獲取到驗證選項:', assertionResult);

      // 2. 準備瀏覽器憑證請求參數
      const publicKeyCredentialRequestOptions = {
        challenge: bufferUtils.base64UrlDecode(assertionResult.assertionOptions.challenge),
        timeout: assertionResult.assertionOptions.timeout,
        rpId: assertionResult.assertionOptions.rpId,
        allowCredentials: assertionResult.assertionOptions.allowCredentials?.map(cred => ({
          type: cred.type,
          id: base64UrlDecode(cred.id),
          transports: cred.transports
        })),
        userVerification: assertionResult.assertionOptions.userVerification
      };

      // 3. 請求瀏覽器憑證
      const credential = await navigator.credentials.get({
        // 使用強制類型轉換確保類型兼容
        publicKey: publicKeyCredentialRequestOptions as unknown as PublicKeyCredentialRequestOptions
      });

      // 檢查是否為 PublicKeyCredential 類型
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
        // 轉換為我們自定義的 PublicKeyCredential 類型
        const publicKeyCredential = credential as unknown as MyPublicKeyCredential;

        // 4. 驗證憑證
        const verificationResult = await verifyCredentialWithServer(publicKeyCredential, assertionResult.sessionData);

        if (verificationResult.success) {
          // 登入成功
          router.push('/Home');
        } else {
          setError(verificationResult.message || 'Passkey 驗證失敗');
        }
      } else {
        setError('獲取的憑證類型不正確或不是 PublicKeyCredential');
      }

      if (!credential) {
        setError('未能獲取憑證');
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('處理 Passkey 登入時出錯');
      }
      console.error('Passkey login error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 處理標籤切換
   * @param newTab 新選中的標籤值
   */
  const handleTabChange = (newTab: string): void => {
    // 切換標籤時重置狀態
    setSendemail(false)
    setEmailerror("")
    setError(null)
    setTab(newTab)
  }

  // 驗證碼輸入框的動畫變體
  const verificationInputVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      height: 0,
      marginBottom: 0
    },
    visible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      marginBottom: '10px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      height: 0,
      marginBottom: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <div className={`w-full max-w-md flex flex-col space-y-4 md:space-y-6 p-3 md:p-4 mx-auto ${className}`}>
      <div className={useCustomStyles ? "tabs-root" : "card bg-base-200 shadow-md"}>
        <div
          className={
            useCustomStyles
              ? "tabs-list"
              : `tabs tabs-bordered ${isMobile ? 'flex flex-nowrap overflow-x-auto' : 'tabs-lg'}`
          }
          role="tablist"
        >
          <TabTrigger value="一般登入" currentTab={tab} onClick={handleTabChange} useCustomStyles={useCustomStyles} isMobile={isMobile}>
            一般登入
          </TabTrigger>
          <TabTrigger value="信箱登入" currentTab={tab} onClick={handleTabChange} useCustomStyles={useCustomStyles} isMobile={isMobile}>
            信箱登入
          </TabTrigger>
          <TabTrigger value="Passkey登入" currentTab={tab} onClick={handleTabChange} useCustomStyles={useCustomStyles} isMobile={isMobile}>
            Passkey登入
          </TabTrigger>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "一般登入" && (
            <TabContent
              key="一般登入"
              value="一般登入"
              isActive={true}
              title="一般登入"
              content={
                <div className={useCustomStyles ? "form-fields" : "flex flex-col gap-2 md:gap-2.5 text-base-content"}>
                  <div className="form-control">
                    <label htmlFor="username" className="label">
                      <span className="label-text">帳號</span>
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="請輸入帳號"
                      value={username}
                      onChange={handleUsernameChange}
                      className={
                        useCustomStyles
                          ? "input-field"
                          : "input input-bordered w-full text-base-content text-sm md:text-base"
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label htmlFor="password" className="label">
                      <span className="label-text">密碼</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="請輸入密碼"
                      value={password}
                      onChange={handlePasswordChange}
                      className={
                        useCustomStyles
                          ? "input-field"
                          : "input input-bordered w-full text-base-content text-sm md:text-base"
                      }
                    />
                  </div>
                  {error && <div className="text-error text-xs md:text-sm mt-1">{error}</div>}
                </div>
              }
              buttonText={loading ? "登入中..." : "登入"}
              useCustomStyles={useCustomStyles}
              isMobile={isMobile}
              onButtonClick={handleNormalLogin}
            />
          )}
          {tab === "信箱登入" && (
            <TabContent
              key="信箱登入"
              value="信箱登入"
              isActive={true}
              title="信箱登入"
              content={
                <div className={useCustomStyles ? "form-fields" : "flex flex-col gap-2 md:gap-2.5 text-base-content"}>
                  <h3 className={`text-${isMobile ? 'xs' : 'sm'} mb-1`}>請輸入信箱登入</h3>
                  <div className="form-control">
                    <label htmlFor="email" className="label">
                      <span className="label-text display">信箱</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="請輸入信箱"
                      value={email}
                      onChange={handleEmailChange}
                      className={
                        useCustomStyles
                          ? "input-field"
                          : "input input-bordered w-full text-base-content text-sm md:text-base"
                      }
                    />
                  </div>
                  <AnimatePresence>
                    {sendemail && (
                      <motion.div
                        key="verification-input"
                        variants={verificationInputVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="form-control">
                          <label htmlFor="verificationCode" className="label">
                            <span className="label-text">驗證碼</span>
                          </label>
                          <input
                            id="verificationCode"
                            type="text"
                            placeholder="驗證碼"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            className={
                              useCustomStyles
                                ? "input-field"
                                : "input input-bordered w-full text-base-content text-sm md:text-base"
                            }
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {emailerror && <div className="text-error text-xs md:text-sm" aria-live="polite">{emailerror}</div>}
                </div>
              }
              buttonText={loading ? "處理中..." : (sendemail ? "驗證登入" : "寄送驗證信")}
              useCustomStyles={useCustomStyles}
              isMobile={isMobile}
              onButtonClick={handleEmailButton}
            />
          )}
          {tab === "Passkey登入" && (
            <TabContent
              key="Passkey登入"
              value="Passkey登入"
              isActive={true}
              title="Passkey登入"
              content={
                <div className="flex flex-col gap-2">
                  <p className="text-xs md:text-sm">輸入帳號後點底下按鈕進行裝置認證</p>
                  <div className="form-control">
                    <label htmlFor="passkey-username" className="label">
                      <span className="label-text">帳號</span>
                    </label>
                    <input
                      id="passkey-username"
                      type="text"
                      placeholder="請輸入帳號"
                      value={username}
                      onChange={handleUsernameChange}
                      className={
                        useCustomStyles
                          ? "input-field"
                          : "input input-bordered w-full text-base-content text-sm md:text-base"
                      }
                    />
                  </div>
                  {error && <div className="text-error text-xs md:text-sm mt-1">{error}</div>}
                </div>
              }
              buttonText={loading ? "驗證中..." : "Passkey 登入"}
              useCustomStyles={useCustomStyles}
              isMobile={isMobile}
              onButtonClick={handlePasskeyLogin}
            />
          )}
        </AnimatePresence>
      </div>
      {useCustomStyles && <StyleSheet isMobile={isMobile} />}
    </div>
  )
}

/**
 * 自定義樣式表組件
 */
function StyleSheet({ isMobile }: { isMobile: boolean }) {
  return (
    <style>{`
      /* 這裡可以根據需要添加自定義樣式 */
      ${isMobile ? `
        /* 行動裝置樣式 */
        .tabs-list {
          font-size: 0.875rem;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 4px;
        }
        .tabs-content {
          padding: 0.75rem;
        }
        .input-field {
          font-size: 0.875rem;
          padding: 0.5rem;
        }
        .button.large {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
      ` : `
        /* 桌面樣式 */
        .tabs-list {
          font-size: 1rem;
        }
        .tabs-content {
          padding: 1.25rem;
        }
        .input-field {
          font-size: 1rem;
          padding: 0.75rem;
        }
        .button.large {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }
      `}
    `}</style>
  )
}
