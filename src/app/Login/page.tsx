"use client"
import { useState, useEffect } from "react"

import Steps from "@/components/Steps/Register"
import { motion, AnimatePresence } from "framer-motion"
import ResponsiveLoginUITabs from "@/components/Login/TabsUi";
import {useGlobalStore} from "@/store/useGlobalStore";
import { useRouter } from "next/navigation"; // 正確的引入方式

export default function Page() {
    const router = useRouter(); // 獲取路由實例
    const {isLoggedIn} = useGlobalStore();
  // 控制顯示登入還是註冊組件
  const [showRegister, setShowRegister] = useState(false)
  // 添加狀態追踪組件是否已加載
  const [isLoaded, setIsLoaded] = useState(false)
const [isMobile, setIsMobile] = useState(false);

  // 檢查是否為行動裝置
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640) // 640px 是 Tailwind 的 sm 斷點
    }

    // 初始檢查
    checkIfMobile()

    // 監聽視窗大小變更
    window.addEventListener('resize', checkIfMobile)

    // 清理監聽器
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])
  // 組件掛載後設置加載狀態
  useEffect(() => {
    setIsLoaded(true)
    if (typeof window !== 'undefined' && isLoggedIn) {
              router.push("/Home")
          }
 }, [isLoggedIn, router]) // 添加依賴項確保效果正確運行

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
  if (isLoaded) {
    return <>
        <div className="flex items-center justify-center min-h-screen bg-base-100 p-4">

                {/* 卡片容器 */}
                <div className="bg-base-200 rounded-2xl shadow-xl overflow-hidden">
                    {/* 頂部裝飾元素 */}
                    <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>

                    {/* 標籤區域 */}
                    <div className="px-4 pt-6 border-b border-base-300">
                        <div className="flex justify-center space-x-4">
                            <div className="skeleton w-24 h-5 rounded-full"></div>
                            <div className="skeleton w-24 h-5 rounded-full opacity-50"></div>
                            <div className="skeleton w-24 h-5 rounded-full opacity-50"></div>
                        </div>
                        {/* 標籤指示器 */}
                        <div className="mt-2 relative flex justify-start">
                            <div className="h-1 w-24 bg-primary rounded"></div>
                        </div>
                    </div>

                    {/* 表單區域 */}
                    <div className="p-6 space-y-6">
                        {/*標題*/}
                        <div className="skeleton w-20 h-10 rounded"></div>
                        {/* 輸入欄位 */}
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <div className="skeleton w-20 h-4 rounded"></div>
                                <div className="skeleton w-full h-12 rounded-lg"></div>
                            </div>

                            <div className="space-y-1">
                                <div className="skeleton w-20 h-4 rounded"></div>
                                <div className="skeleton w-full h-12 rounded-lg"></div>
                            </div>
                            <div className="flex justify-center">
                                {/* 驗證區域 */}
                                <div className="skeleton w-10/12 h-14 rounded-lg mt-4"></div>
                            </div>
                        </div>

                        {/* 按鈕區域 */}
                        <div className=" flex justify-end">
                            <div className="skeleton items-end w-20 h-12 rounded-lg"></div>
                        </div>
                    </div>

                    {/* 底部區域 */}
                    <div className="p-4 flex justify-center border-t border-base-300 bg-base-200/50">
                        <div className="flex items-center space-x-2">
                            <div className="skeleton w-36 h-4 rounded"></div>
                            <div className="skeleton w-20 h-4 rounded bg-primary/30"></div>
                        </div>
                    </div>
                </div>

        </div>
    </>
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
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.3}}
                    >
                        <CustomLoginUITabs/>
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.3}}
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
                                    <Steps/>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    )
                    }
