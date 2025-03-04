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

  // 處理Passkey登入按鈕點擊
  const handlePasskeyLogin = () => {
    // 實際應用中，這裡應該調用WebAuthn API進行Passkey認證
    console.log("觸發Passkey認證流程")
    // 實際應用中，這裡可能會進行頁面跳轉或其他操作
  }

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

  return (
    <div className={`w-full max-w-md flex flex-col space-y-6  p-4  mx-auto ${className}`}>
      <div className={useCustomStyles ? "tabs-root" : "card bg-base-200 shadow-md"}>
        <div className={useCustomStyles ? "tabs-list" : "tabs tabs-bordered tabs-lg"}>
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
                  <input
                    type="text"
                    placeholder="帳號"
                    value={username}
                    onChange={handleUsernameChange}
                    className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
                  />
                  <input
                    type="password"
                    placeholder="密碼"
                    value={password}
                    onChange={handlePasswordChange}
                    className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
                  />
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
                  <input
                    type="email"
                    placeholder="信箱"
                    value={email}
                    onChange={handleEmailChange}
                    className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
                  />
                  {sendemail ? (
                    <input
                      type="text"
                      placeholder="驗證碼"
                      value={verificationCode}
                      onChange={handleVerificationCodeChange}
                      className={useCustomStyles ? "input-field" : "input input-bordered w-full text-base-content"}
                    />
                  ) : null}
                  <div className="text-error">{emailerror}</div>
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
      .tabs-root {
          display: flex;
          flex-direction: column;
          width: 400px;
          max-width: 100%;
          background-color: var(--layer);
          border: 1px solid var(--border);
          overflow: hidden;
      }

      .tabs-list {
          display: flex;
          border-bottom: 1px solid var(--border);
      }

      .tabs-trigger {
          font-family: inherit;
          padding: 0 20px;
          height: 45px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          line-height: 1;
          color: var(--feint-text);
          user-select: none;
          cursor: pointer;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          position: relative;
      }

      .tabs-trigger .tabs-indicator {
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #ff0088;
      }

      .tabs-trigger:hover {
          color: var(--text);
      }

      .tabs-trigger[data-state='active'] {
          color: var(--text);
      }

      .tabs-content {
          padding: 20px;
          will-change: opacity, filter;
      }

      .tabs-content h3 {
          margin: 0 0 10px 0;
          color: var(--text);
          font-size: 18px;
          font-weight: 500;
      }

      .content-wrapper {
          margin: 0 0 20px 0;
          color: var(--feint-text);
          font-size: 14px;
          line-height: 1.5;
      }

      .form-fields {
          display: flex;
          flex-direction: column;
          gap: 10px;
      }

      .input-field {
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--layer);
          color: var(--text);
          font-size: 14px;
      }

      .input-field:focus {
          outline: none;
          border-color: #ff0088;
          transition: border-color 0.2s ease;
      }

      .button-container {
          display: flex;
          justify-content: flex-end;
      }

      .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          font-weight: 500;
          user-select: none;
          border: none;
          background: #ff0088;
          color: white;
          cursor: pointer;
      }

      .button.large {
          font-size: 16px;
          padding: 0 20px;
          line-height: 35px;
          height: 35px;
      }
    `}</style>
  )
}
