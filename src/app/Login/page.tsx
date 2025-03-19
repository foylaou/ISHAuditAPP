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
    console.log("Page component mounted")
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
  if (!isLoaded) {
    return <>
        <div className="w-full max-w-md flex flex-col space-y-4 md:space-y-6 p-3 md:p-4 mx-auto">
            <div className="card bg-base-200 shadow-md">
                {/* 頁面標題區塊骨架 */}
                <div className="p-4 border-b border-base-300">
                    <div className="skeleton h-8 w-40 mx-auto"></div>
                </div>

                {/* 標籤區域骨架 */}
                <div
                    className={`tabs tabs-bordered ${isMobile ? 'flex flex-nowrap overflow-x-auto text-xs' : 'tabs-lg'}`}>
                    <div className="skeleton h-10 w-20 mx-1"></div>
                    <div className="skeleton h-10 w-20 mx-1"></div>
                    <div className="skeleton h-10 w-20 mx-1"></div>
                </div>

                {/* 表單區域骨架 */}
                <div className="p-3 md:p-5">
                    <div className="skeleton h-6 w-32 mb-4"></div>

                    <div className="flex flex-col gap-4 md:gap-5">
                        {/* 表單欄位骨架 - 帳號 */}
                        <div className="form-control">
                            <div className="skeleton h-4 w-16 mb-2"></div>
                            <div className="skeleton h-12 w-full"></div>
                        </div>

                                    {/* 表單欄位骨架 - 密碼 */}
            <div className="form-control">
              <div className="skeleton h-4 w-16 mb-2"></div>
              <div className="skeleton h-12 w-full"></div>
            </div>
                                    {/* 驗證區域骨架 */}
            <div className="mt-2">
              <div className="skeleton h-20 w-full md:w-3/4 mx-auto"></div>
            </div>
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
