"use client"

import {useState, ReactNode, ChangeEvent} from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * TabTriggerProps 介面
 * 用於定義標籤觸發器的屬性
 *
 * @interface TabTriggerProps
 * @member {string} value 標籤的唯一值
 * @member {string} currentTab 當前選中的標籤值
 * @member {ReactNode} children 標籤內容
 * @member {(value: string) => void} onClick 點擊標籤時的回調函數
 * @member {boolean} useCustomStyles 是否使用自定義樣式
 */
interface TabTriggerProps {
  value: string;
  currentTab: string;
  children: ReactNode;
  onClick: (value: string) => void;
  useCustomStyles: boolean;
}


const TabTrigger = ({ value, currentTab, children, onClick, useCustomStyles }: TabTriggerProps) => {
  return (
    <button
      className={useCustomStyles ? "tabs tabs-lg" : `tab tab-bordered ${currentTab === value ? 'tab-active' : ''}`}
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

/**
 * 標籤內容屬性
 * 用於描述標籤頁的內容與行為。
 *
 * @interface TabContentProps
 * @property {string} value 標籤的唯一值
 * @property {string} title 標籤頁標題
 * @property {ReactNode} content 標籤頁內容
 * @property {string} buttonText 按鈕文字
 * @property {boolean} isActive 是否為當前激活的標籤頁
 * @property {boolean} useCustomStyles 是否使用自定義樣式
 * @property {() => void} onButtonClick 按鈕點擊事件處理函數
 */
interface TabContentProps {
  value: string;
  title: string;
  content: ReactNode;
  buttonText: string;
  isActive: boolean;
  useCustomStyles: boolean;
  onButtonClick: () => void;
}


const TabContent = ({ value, title, content, buttonText, isActive, useCustomStyles, onButtonClick }: TabContentProps) => {
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
      className={useCustomStyles ? "tabs-content" : `p-5 will-change-[opacity,filter] text-base-content`}
      role="tabpanel"
      id={`${value}-panel`}
      aria-labelledby={`${value}-tab`}
      tabIndex={0}
    >
      <h3 className={useCustomStyles ? "" : "text-lg font-medium mb-2.5"}>{title}</h3>
      <div className={useCustomStyles ? "content-wrapper" : "mb-5 text-sm text-opacity-70"}>{content}</div>
      <div className={useCustomStyles ? "button-container" : "flex justify-end"}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={useCustomStyles ? "button large" : "btn btn-primary text-white"}
          onClick={onButtonClick}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  )
}

interface DaisyUITabsProps {
  /** 初始選中的標籤 (可選) */
  defaultTab?: string;
  /** 自定義樣式類名 (可選) */
  className?: string;
  /** 是否使用自定義樣式 (可選) */
  useCustomStyles?: boolean;
}

export default function LoginUITabs({ defaultTab = "一般登入", className = "", useCustomStyles = false }: DaisyUITabsProps = {}) {
  const [tab, setTab] = useState(defaultTab)
  const [sendemail, setSendemail] = useState(false)
  const [emailerror, setEmailerror] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

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
  const handleEmailButton = () => {
    if (!sendemail) {
      // 信箱驗證邏輯
      if (!email) {
        setEmailerror("請輸入信箱")
        return
      }

      // 檢查信箱格式
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email)) {
        setEmailerror("請輸入有效的信箱格式")
        return
      }

      // 如果信箱正確，發送驗證信
      setEmailerror("")
      setSendemail(true)
      // 實際應用中，這裡應該有一個API調用來發送驗證信
      console.log(`發送驗證信至 ${email}`)
    } else {
      // 驗證碼驗證邏輯
      if (!verificationCode) {
        setEmailerror("請輸入驗證碼")
        return
      }

      // 實際應用中，這裡應該有一個API調用來驗證驗證碼
      console.log(`驗證碼 ${verificationCode} 驗證中...`)

      // 假設驗證成功
      setEmailerror("登入成功")
      // 實際應用中，這裡可能會進行頁面跳轉或其他操作
    }
  }

  // 處理一般登入按鈕點擊
  const handleNormalLogin = () => {
    if (!username) {
      // 這裡您可以增加一個錯誤狀態，但由於原始代碼沒有，暫不添加
      console.log("請輸入帳號")
      return
    }

    if (!password) {
      console.log("請輸入密碼")
      return
    }

    // 實際應用中，這裡應該有一個API調用來進行登入驗證
    console.log(`使用帳號 ${username} 和密碼進行登入`)
    // 假設登入成功
    console.log("登入成功")
    // 實際應用中，這裡可能會進行頁面跳轉或其他操作
  }

const handlePasskeyLogin = async () => {
  try {
    // 創建認證選項
    const options: CredentialRequestOptions = {
      publicKey: {
        // 必須項: 挑戰值 (通常由服務器生成)
        challenge: new Uint8Array(32), // 在實際應用中，這應該是從服務器獲取的隨機挑戰值

        // 不指定用戶名稱，讓瀏覽器顯示所有可用的passkeys
        rpId: window.location.hostname,

        // 要求使用者驗證（例如指紋或面容識別）
        userVerification: 'preferred',

        // 可以為空陣列，表示接受任何憑證
        allowCredentials: []
      },

      // mediation 應該在 publicKey 外面
      mediation: 'required'
    };

    // 請求憑證
    const credential = await navigator.credentials.get(options);

    // 獲取到憑證後處理
    if (credential && credential.type === 'public-key') {
      // 確保憑證是 PublicKeyCredential 類型
      const pkCredential = credential as PublicKeyCredential;

      // 將憑證發送到伺服器進行驗證
      const response = await verifyCredentialWithServer(pkCredential);

      if (response.success) {
        console.log("Passkey登入成功");
        // 導向至登入後頁面
        window.location.href = "/dashboard";
      } else {
        console.error("Passkey驗證失敗");
      }
    } else {
      console.error("未獲取到有效的PublicKey憑證");
    }
  } catch (error) {
    console.error("Passkey登入過程發生錯誤:", error);
  }
}; // 這裡添加了缺少的大括號

const verifyCredentialWithServer = async (credential: PublicKeyCredential) => {
  // 將 response 轉換為 AuthenticatorAssertionResponse 類型
  const assertionResponse = credential.response as AuthenticatorAssertionResponse;

  // 將憑證轉換為JSON
  const authenticatorData = {
    id: credential.id,
    rawId: Array.from(new Uint8Array(credential.rawId)),
    type: credential.type,
    response: {
      authenticatorData: Array.from(new Uint8Array(assertionResponse.authenticatorData)),
      clientDataJSON: Array.from(new Uint8Array(assertionResponse.clientDataJSON)),
      signature: Array.from(new Uint8Array(assertionResponse.signature)),
      userHandle: assertionResponse.userHandle ?
        Array.from(new Uint8Array(assertionResponse.userHandle)) : null
    }
  };

  // 發送到伺服器
  const serverResponse = await fetch('/api/verify-credential', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ credential: authenticatorData })
  });

  return await serverResponse.json();
};
  /**
   * 處理標籤切換
   * @param newTab 新選中的標籤值
   */
  const handleTabChange = (newTab: string): void => {
    // 切換標籤時重置狀態
    setSendemail(false)
    setEmailerror("")
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
    <div className={`w-full max-w-md flex flex-col space-y-6 p-4 mx-auto ${className}`}>
      <div className={useCustomStyles ? "tabs-root" : "card bg-base-200 shadow-md"}>
        <div className={useCustomStyles ? "tabs-list" : "tabs tabs-bordered tabs-lg"} role="tablist">
          <TabTrigger value="一般登入" currentTab={tab} onClick={handleTabChange} useCustomStyles={useCustomStyles}>
            一般登入
          </TabTrigger>
          <TabTrigger value="信箱登入" currentTab={tab} onClick={handleTabChange} useCustomStyles={useCustomStyles}>
            信箱登入
          </TabTrigger>
          <TabTrigger value="Passkey登入" currentTab={tab} onClick={handleTabChange} useCustomStyles={useCustomStyles}>
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
                <div className={useCustomStyles ? "form-fields" : "flex flex-col gap-2.5 text-base-content"}>
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
                      className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
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
                      className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
                    />
                  </div>
                </div>
              }
              buttonText="登入"
              useCustomStyles={useCustomStyles}
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
                <div className={useCustomStyles ? "form-fields" : "flex flex-col gap-2.5 text-base-content"}>
                  <h3>請輸入信箱登入</h3>
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
                      className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
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
                            className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="text-error" aria-live="polite">{emailerror}</div>
                </div>
              }
              buttonText={sendemail ? "驗證登入" : "寄送驗證信"}
              useCustomStyles={useCustomStyles}
              onButtonClick={handleEmailButton}
            />
          )}
          {tab === "Passkey登入" && (
            <TabContent
              key="Passkey登入"
              value="Passkey登入"
              isActive={true}
              title="Passkey登入"
              content="請點底下按鈕進行裝置認證"
              buttonText="Passkey"
              useCustomStyles={useCustomStyles}
              onButtonClick={handlePasskeyLogin}
            />
          )}
        </AnimatePresence>
      </div>
      {useCustomStyles && <StyleSheet />}
    </div>
  )
}

/**
 * 自定義樣式表組件
 */
function StyleSheet() {
  return (
    <style>{`

    `}</style>
  )
}
