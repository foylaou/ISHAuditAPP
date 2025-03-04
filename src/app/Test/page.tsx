"use client"

import { useState } from "react"
import LoginUITabs from "@/components/Test/TabsUi"
import Steps from "@/components/Steps/Register"
import { motion, AnimatePresence } from "framer-motion"

export default function Page() {
  // 控制顯示登入還是註冊組件
  const [showRegister, setShowRegister] = useState(false)

  // 切換到註冊流程
  const handleRegister = () => {
    setShowRegister(true)
  }

  // 返回登入頁面
  const handleBackToLogin = () => {
    setShowRegister(false)
  }

  // 自定義修改 LoginUITabs 的註冊按鈕行為
const CustomLoginUITabs = () => {
  console.log("CustomLoginUITabs rendering"); // 添加日誌

  return (
    <div className="max-w-md flex flex-col space-y-6 p-4 mx-auto ">
      <LoginUITabs />
      <div className="text-center text-neutral-content " style={{ position: "relative", zIndex: 10 }}> {/* 添加樣式確保可見 */}
        <span className="text-sm">還沒有帳號？</span>
        <button
          onClick={handleRegister}
          className="text-primary ml-2 text-sm font-bold" // 增強按鈕樣式
        >
          立即註冊
        </button>
      </div>
    </div>
  )
}

  return (
    <div className=" flex items-center justify-center p-12">
      <AnimatePresence mode="wait" initial={false}>
        {!showRegister ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-[400px] p-10"
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
            <div className="">
              <button
                onClick={handleBackToLogin}
                className="flex items-center text-base-content hover:text-neutral-content"
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
