"use client"

import {useState, ReactNode, ChangeEvent, useEffect, useRef} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation";
import { LoginForm } from "@/types/authType";
import { authService } from "@/services/Auth/authService";
import {clearAuthCookies, storeAuthTokens} from "@/services/Auth/serverAuthService";
import fidoService from "@/services/Auth/fidoServices";
import {useTurnstile} from "react-turnstile";
import Capcha from "@/components/auth/Capcha";






  /**
 * 標籤觸發器屬性介面
 * 定義標籤（Tab）觸發器的相關屬性。
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
 */
export interface DaisyUITabsProps {
  defaultTab?: string;
  className?: string;
  useCustomStyles?: boolean;
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

const TabContent = ({ value, title, content, buttonText, useCustomStyles, isMobile, onButtonClick }: TabContentProps) => {
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
  const turnstile = useTurnstile();
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



  // Refs for input fields to focus on error
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const verificationCodeRef = useRef<HTMLInputElement>(null);

  // Validate states
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailFieldError, setEmailFieldError] = useState(false);
  const [verificationCodeError, setVerificationCodeError] = useState(false);


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

  // 重置所有錯誤狀態
  const resetErrors = () => {
    setUsernameError(false);
    setPasswordError(false);
    setEmailFieldError(false);
    setVerificationCodeError(false);
    setError(null);
    setEmailerror("");
  };

  // 處理信箱輸入變更
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailFieldError) setEmailFieldError(false);
  }

  // 處理帳號輸入變更
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    if (usernameError) setUsernameError(false);
  }

  // 處理密碼輸入變更
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError) setPasswordError(false);
  }

  // 處理驗證碼輸入變更
  const handleVerificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value)
    if (verificationCodeError) setVerificationCodeError(false);
  }

  // 處理信箱登入按鈕點擊
  const handleEmailButton = async () => {
    if (!isRouterReady) return;

    try {
      resetErrors();
      setLoading(true);



      // 如果已經發送過驗證碼且有輸入驗證碼，則進行驗證
      if (sendemail && verificationCode) {
        // 驗證用戶輸入的驗證碼
        if (!verificationCode.trim()) {
          setEmailerror("請輸入驗證碼");
          setVerificationCodeError(true);
          verificationCodeRef.current?.focus();
          setLoading(false);
          return;
        }

        const validationResult = await authService.validateEmailToken(verificationCode);

        if (!validationResult) {
          setEmailerror("驗證碼無效");
          setVerificationCodeError(true);
          verificationCodeRef.current?.focus();
          setLoading(false);
          return;
        }
        // 驗證成功後重定向到主頁
        router.push('/Home');
        return;
      }

      // 如果沒有發送過驗證碼或沒有輸入驗證碼，則發送驗證碼
      if (!email.trim()) {
        setEmailerror("請輸入信箱");
        setEmailFieldError(true);
        emailRef.current?.focus();
        setLoading(false);
        return;
      }

      // 檢查信箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailerror("請輸入有效的信箱格式");
        setEmailFieldError(true);
        emailRef.current?.focus();
        setLoading(false);
        return;
      }
      // 發送驗證碼到用戶郵箱
      const emailResult = await authService.loginWithEmail(email);
      try {
        if (!emailResult.success) {
          setEmailerror(emailResult.message || "發送驗證碼失敗");
          setEmailFieldError(true);
          emailRef.current?.focus();
          setLoading(false);

          // 發送成功
          setEmailerror(emailResult.message || "驗證碼已發送到您的郵箱");
          setSendemail(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          setEmailerror(error.message);
        } else {
          setEmailerror("處理過程中發生錯誤");
        }
        console.error("Email login error:", error);
        // 重置 Turnstile
      }

    }finally {
      setLoading(false);
    }
  };

  // 處理一般登入按鈕點擊
  const handleNormalLogin = async () => {
    if (!isRouterReady) return;
    try {
      resetErrors();
      setLoading(true);



      if (!username.trim()) {
        setError("請輸入帳號");
        setUsernameError(true);
        usernameRef.current?.focus();
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setError("請輸入密碼");
        setPasswordError(true);
        passwordRef.current?.focus();
        setLoading(false);
        return;
      }

      const formData: LoginForm = {
        username,
        password,
      };

      // 進行登入
      const loginResult = await authService.login(formData);

      // 登入成功後的處理
      console.log('登入成功:', loginResult);
      if (loginResult.accessToken && loginResult.refreshToken && loginResult.UserId) {
        // 根據角色導航到不同頁面
        router.push('/Home');
      } else {
        setError("登入失敗，請重試");
        // 重置 Turnstile
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "登入失敗");
      console.error("登入錯誤:", error);
      await clearAuthCookies(); // 清除 Token 以確保安全
      // 重置 Turnstile
    } finally {
      setLoading(false);
    }
  };

  // 處理 Passkey 登入
  const handlePasskeyLogin = async () => {
    if (!isRouterReady) return;
    try {
      resetErrors();
      setLoading(true);



      // Use the complete passkey login flow from fidoService
      const loginResult = await fidoService.completePasskeyLogin({
        UserVerification: 'preferred',
        AuthenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: false,
          userVerification: 'preferred'
        },
        Extensions: {
          example: true
        },
      });

      if (loginResult.success) {
        // Store tokens if needed
        if (loginResult.accessToken && loginResult.refreshToken) {
          await storeAuthTokens(loginResult.accessToken, loginResult.refreshToken);
        }

        // Login successful, redirect
        router.push('/Home');
      } else {
        setError(loginResult.message || 'Passkey 驗證失敗');
        // 重置 Turnstile

      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '處理 Passkey 登入時出錯');
      console.error('Passkey login error:', error);
      // 重置 Turnstile

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
    resetErrors();
    setTab(newTab)

    // 重置 Turnstile

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
    <>


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
                        ref={usernameRef}
                        type="text"
                        placeholder="請輸入帳號"
                        value={username}
                        onChange={handleUsernameChange}
                        className={
                          useCustomStyles
                            ? `input-field ${usernameError ? 'border-error' : ''}`
                            : `input input-bordered w-full text-base-content text-sm md:text-base ${usernameError ? 'input-error border-error focus:border-error focus:ring-error' : ''}`
                        }
                        aria-invalid={usernameError}
                      />
                    </div>
                    <div className="form-control">
                      <label htmlFor="password" className="label">
                        <span className="label-text">密碼</span>
                      </label>
                      <input
                        id="password"
                        ref={passwordRef}
                        type="password"
                        placeholder="請輸入密碼"
                        value={password}
                        onChange={handlePasswordChange}
                        className={
                          useCustomStyles
                            ? `input-field ${passwordError ? 'border-error' : ''}`
                            : `input input-bordered w-full text-base-content text-sm md:text-base ${passwordError ? 'input-error border-error focus:border-error focus:ring-error' : ''}`
                        }
                        aria-invalid={passwordError}
                      />
                    </div>
                    <div className="flex items-center">
                    {/* Cloudflare Turnstile container */}
                    <Capcha/>
                  </div>
                    {error && <div className="text-error text-xs md:text-sm mt-1" role="alert">{error}</div>}
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
                        ref={emailRef}
                        type="email"
                        placeholder="請輸入信箱"
                        value={email}
                        onChange={handleEmailChange}
                        className={
                          useCustomStyles
                            ? `input-field ${emailFieldError ? 'border-error' : ''}`
                            : `input input-bordered w-full text-base-content text-sm md:text-base ${emailFieldError ? 'input-error border-error focus:border-error focus:ring-error' : ''}`
                        }
                        aria-invalid={emailFieldError}
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
                              ref={verificationCodeRef}
                              type="text"
                              placeholder="驗證碼"
                              value={verificationCode}
                              onChange={handleVerificationCodeChange}
                              className={
                                useCustomStyles
                                  ? `input-field ${verificationCodeError ? 'border-error' : ''}`
                                  : `input input-bordered w-full text-base-content text-sm md:text-base ${verificationCodeError ? 'input-error border-error focus:border-error focus:ring-error' : ''}`
                              }
                              aria-invalid={verificationCodeError}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Cloudflare Turnstile container */}
                    <div id="turnstile-container" className="w-full mt-2"></div>

                    {emailerror && <div className="text-error text-xs md:text-sm" aria-live="polite" role="alert">{emailerror}</div>}
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
                    <p className="text-xs md:text-sm">點擊底下按鈕進行裝置認證</p>

                    {/* Cloudflare Turnstile container */}
                    <div id="turnstile-container" className="w-full mt-2"></div>

                    {error && <div className="text-error text-xs md:text-sm mt-1" role="alert">{error}</div>}
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
    </>
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
