"use client"
import { useState, useEffect } from "react"

import Steps from "@/components/Steps/Register"
import { motion, AnimatePresence } from "framer-motion"
import ResponsiveLoginUITabs from "@/components/Login/TabsUi";

export default function Page() {
  // 控制顯示登入還是註冊組件
  const [showRegister, setShowRegister] = useState(false)
  // 添加狀態追踪組件是否已加載
  const [isLoaded, setIsLoaded] = useState(false)

  // 組件掛載後設置加載狀態
  useEffect(() => {
    setIsLoaded(true)
    console.log("Page component mounted")
  }, [])

  // 切換到註冊流程
  const handleRegister = () => {
    console.log("Register")
    console.log(isLoaded)
    if(isLoaded){
      console.log("handleRegister called")
    setShowRegister(true)
    }

  }

  // 返回登入頁面
  const handleBackToLogin = () => {
    console.log("handleBackToLogin called")
    setShowRegister(false)
  }

  // 自定義修改 LoginUITabs 的註冊按鈕行為 - 將其移到外部避免閉包問題
  const CustomLoginUITabs = () => {
    console.log("CustomLoginUITabs rendering")

    return (

        <div className="flex flex-col space-y-2 p-2 sm:p-3 w-full max-w-md mx-auto">
          <div className="w-full">
            <ResponsiveLoginUITabs/>
          </div>
          <div className="text-center text-base-content mt-2" style={{position: "relative", zIndex: 10}}>
            <span className="text-xs sm:text-sm">還沒有帳號？</span>
            <button
                onClick={() => {
                  console.log("註冊按鈕被點擊")
                  handleRegister()
                }}
                className="text-primary ml-2 text-xs sm:text-sm font-bold"
                type="button" // 明確指定按鈕類型
            >
              立即註冊
            </button>
          </div>
        </div>
    )
  }

  // 如果組件尚未加載，返回加載狀態
  if (!isLoaded) {
    return <span className="loading loading-dots loading-lg"></span>
  }

  return (
      <div className="flex items-center justify-center p-12">
        {/* 添加調試信息 */}
        <div className="hidden">當前狀態: {showRegister ? '註冊' : '登入'}</div>

        <AnimatePresence mode="wait" initial={false}>
          {!showRegister ? (
              <motion.div
                  key="login"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CustomLoginUITabs />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-[400px]"
          >
            <div className="p-4">
              <button
                onClick={handleBackToLogin}
                className="flex items-center text-base-content hover:text-neutral-content"
                type="button" // 明確指定按鈕類型
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                返回登入
              </button>
            </div>
            <Steps />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
