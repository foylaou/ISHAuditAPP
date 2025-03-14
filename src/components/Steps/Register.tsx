'use client'
import React, {ReactNode, useState, useRef, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import {
  DomainQuery,
  SendVerificationEmail,
  VerifyEmailCode,
  SignUp
} from "@/services/Auth/clientAuthService";

// 定義接口
interface StepsContainerProps {
  children: ReactNode;
  vertical?: boolean;
}

interface StepProps {
  children: ReactNode;
  status?: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

// 註冊用戶資料傳輸物件
interface RegisterUserDto {
  userName: string;
  nickName: string;
  password: string;
  email: string;
}

// 步驟容器組件
const StepsContainer: React.FC<StepsContainerProps> = ({ children, vertical = false }) => {
  return (
    <ul className={`steps ${vertical ? 'steps-vertical' : ''} w-full`}>
      {children}
    </ul>
  );
};

// 單個步驟組件
const Step: React.FC<StepProps> = ({ children, status = 'default' }) => {
  // 在DaisyUI中，步驟狀態: default, primary, secondary, accent, info, success, warning, error
  const statusClass = status !== 'default' ? `step-${status}` : '';

  return (
    <li className={`step text-neutral-content ${statusClass}`}>
      {children}
    </li>
  );
};

// 主組件
export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [userData, setUserData] = useState<RegisterUserDto>({
    userName: '',
    nickName: '',
    password: '',
    email: ''
  });
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // 根據當前步驟決定每個步驟的狀態
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'success';
    if (stepNumber === currentStep) return 'primary';
    return 'default';
  };

  // 前進到下一步
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // 返回上一步
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // 更新用戶數據
  const updateUserData = (data: Partial<RegisterUserDto>) => {
    setUserData(prev => ({
      ...prev,
      ...data
    }));
  };

  // 第一步：確認信箱
  const Step1 = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
      if (!email) {
        setError('請輸入電子信箱');
        return;
      }

      // 簡單的電子郵件格式驗證
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('請輸入有效的電子信箱格式');
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const result = await DomainQuery(email);

        if (result.success && result.data) {
          console.log("✅ 驗證成功:", result);

          setUserEmail(email);
          setOrganization(result.data.org ?? "未知組織");
          updateUserData({email});

          // 發送驗證碼
          const sendResult = await SendVerificationEmail(email);

          if (sendResult.success) {
            console.log("驗證碼已發送到郵箱:", email);
            nextStep(); // 前進到下一步
            if (!sendResult.success){
              setError(sendResult.message)
            }
          } else {
            setError(sendResult.message || '發送驗證碼失敗，請稍後再試');
          }
        } else {
          setError(result.message);
        }
      } catch (error: unknown) {
        console.error('Email verification error:', error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || '信箱驗證失敗，請稍後再試');
        } else {
          setError('處理請求時發生錯誤，請稍後再試');
        }
        return;
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <div className="card w-full bg-base-200 shadow-md text-base-content">
          <div className="card-body">
            <h3 className="card-title text-primary">請輸入電子信箱</h3>
            <div className="form-control w-full">
              <input
                  name="email"
                  type="email"
                  className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                  placeholder="您的電子郵件地址"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                  }}
              />
              {error && (
                  <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                  </label>
              )}
              <label className="label">
              <span className="label-text-alt text-base-content/70">
                我們將向此郵箱發送驗證碼，請確保能夠接收郵件。
              </span>
              </label>
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
              >
                {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      處理中...
                    </>
                ) : '下一步'}
              </button>
            </div>
          </div>
        </div>
    );
  };

  // 第二步：驗證電子信箱
  const Step2 = () => {
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [errorCount, setErrorCount] = useState(0);
    const [needNewCode, setNeedNewCode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 啟動倒計時
    useEffect(() => {
      // 初始化時啟動倒計時
      setResendDisabled(true);

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    // 處理驗證碼輸入
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      // 如果需要重新獲取驗證碼，則禁止輸入
      if (needNewCode) return;

      // 只允許數字
      const value = e.target.value.replace(/[^0-9]/g, '');
      // 限制最大長度為8
      const truncatedValue = value.substring(0, 8);
      setVerificationCode(truncatedValue);

      // 自動提交當驗證碼達到8位數
      if (truncatedValue.length === 8) {
        verifyCode(truncatedValue);
      }
    };

    // 處理數字框的點擊，將焦點放在輸入框上
    const handleBoxClick = (): void => {
      // 如果需要重新獲取驗證碼，則不聚焦輸入框
      if (needNewCode) return;

      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // 驗證碼驗證
    const verifyCode = async (code: string) => {
      // 如果需要重新獲取驗證碼，則先取得新驗證碼
      if (needNewCode) {
        await resendCode();
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // 調用API驗證驗證碼
        const verifyResult = await VerifyEmailCode(userEmail, code);

        if (verifyResult.success) {
          console.log("驗證碼驗證成功");
          setErrorCount(0); // 重置錯誤計數
          nextStep();
        } else {
          // 增加錯誤計數
          const newErrorCount = errorCount + 1;
          setErrorCount(newErrorCount);

          // 判斷是否達到錯誤上限
          if (newErrorCount >= 3) {
            setNeedNewCode(true);
            setError('已達錯誤次數上限，請重新獲取驗證碼');
            setVerificationCode('');
          } else {
            setError(`驗證碼不正確 (${newErrorCount}/3)，請重新輸入`);
            setVerificationCode('');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        setError('驗證失敗，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    // 重新發送驗證碼
    const resendCode = async () => {
      setResendDisabled(true);
      setCountdown(60);
      setError('');
      setNeedNewCode(false);
      setErrorCount(0);
      setVerificationCode('');

      try {
        // 呼叫重新發送驗證碼API
        const sendResult = await SendVerificationEmail(userEmail);

        if (sendResult.success) {
          console.log('已重新發送驗證碼到', userEmail);
        } else {
          setError(sendResult.message || '無法發送驗證碼，請稍後再試');
          setResendDisabled(false);
          return;
        }

        // 啟動倒計時
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Failed to resend code:', error);
        setError('無法發送驗證碼，請稍後再試');
        setResendDisabled(false);
      }
    };

    return (
        <div className="card w-full bg-base-200 shadow-md text-base-content">
          <div className="card-body">
            <h3 className="card-title text-primary">驗證電子信箱</h3>
            <div className="flex flex-col items-center">
              <p className="mb-4 text-base-content/80">
                我們已發送驗證碼到您的電子郵件信箱 <strong>{userEmail}</strong>
              </p>

              {/* 數字框顯示區域 */}
              <div className="flex flex-wrap justify-center gap-2 relative w-full max-w-md mx-auto"
                   onClick={handleBoxClick}>
                {Array(8).fill(0).map((_, index) => (
                    <div
                        key={index}
                        className={`input input-bordered w-8 sm:w-10 h-12 flex items-center justify-center text-lg sm:text-xl cursor-text
                  ${error ? 'input-error' : ''}
                  ${needNewCode ? 'opacity-50' : ''}
                  ${index < verificationCode.length ? 'bg-base-200' : ''}`}
                    >
                      {verificationCode[index] || ''}
                    </div>
                ))}

                {/* 實際輸入框 - 透明但可接收焦點和輸入 */}
                <input
                    ref={inputRef}
                    type="text"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    maxLength={8}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    autoComplete="one-time-code"
                    disabled={isLoading || needNewCode}
                />
              </div>

              <div className="text-sm text-base-content/70 mt-3">
                輸入8位數驗證碼
              </div>

              {error && (
                  <div className="text-sm text-error mt-2">
                    {error}
                  </div>
              )}

              {isLoading && (
                  <div className="text-sm text-primary mt-2 flex items-center">
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    驗證中...
                  </div>
              )}

              {needNewCode && (
                  <div className="alert alert-warning mt-4 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>驗證碼已失效，請點擊下方按鈕重新發送驗證碼</span>
                  </div>
              )}
            </div>
            <div className="text-center mt-4">
              <button
                  className={`btn ${needNewCode ? 'btn-warning' : 'btn-link text-primary no-underline'}`}
                  onClick={resendCode}
                  disabled={resendDisabled}
              >
                {resendDisabled
                    ? `重新發送驗證碼 (${countdown}s)`
                    : (needNewCode ? '重新發送驗證碼' : '重新發送驗證碼')
                }
              </button>
            </div>
            <div className="card-actions justify-between mt-6">
              <button className="btn btn-outline" onClick={prevStep}>
                上一步
              </button>
            </div>
          </div>
        </div>
    );
  };

  // 第三步：填寫註冊資料
  const Step3 = () => {
    const [formData, setFormData] = useState({
      userName: '',
      nickName: '',
      password: '',
      confirmPassword: ''
    });
    const [errors, setErrors] = useState({
      userName: '',
      nickName: '',
      password: '',
      confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 處理表單數據變更
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    // 表單驗證
    const validateForm = () => {
      let isValid = true;
      const newErrors = {
        userName: '',
        nickName: '',
        password: '',
        confirmPassword: ''
      };

      // 驗證帳號
      if (!formData.userName.trim()) {
        newErrors.userName = '請輸入帳號';
        isValid = false;
      } else if (formData.userName.length < 4) {
        newErrors.userName = '帳號至少需要4個字符';
        isValid = false;
      }

      // 驗證用戶名稱
      if (!formData.nickName.trim()) {
        newErrors.nickName = '請輸入用戶名稱';
        isValid = false;
      }

      // 驗證密碼
      if (!formData.password) {
        newErrors.password = '請設定密碼';
        isValid = false;
      } else {
        if (formData.password.length < 8 || formData.password.length > 128) {
          newErrors.password = '密碼長度必須在 8 到 128 個字符之間';
          isValid = false;
        }
        if (!/[A-Z]/.test(formData.password)) {
          newErrors.password = '密碼需包含至少一個大寫字母';
          isValid = false;
        }
        if (!/[a-z]/.test(formData.password)) {
          newErrors.password = '密碼需包含至少一個小寫字母';
          isValid = false;
        }
        if (!/[0-9]/.test(formData.password)) {
          newErrors.password = '密碼需包含至少一個數字';
          isValid = false;
        }
        if (!/[^A-Za-z0-9]/.test(formData.password)) {
          newErrors.password = '密碼需包含至少一個特殊字符';
          isValid = false;
        }
        if ([...new Set(formData.password)].length < 4) {
          newErrors.password = '密碼需包含至少 4 個不同的字符';
          isValid = false;
        }
        if (formData.password.toLowerCase().includes(formData.userName.toLowerCase())) {
          newErrors.password = '密碼不能包含帳號名稱';
          isValid = false;
        }
      }

      // 驗證確認密碼
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '兩次輸入的密碼不一致';
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    };

    const handleSubmit = async () => {
      if (validateForm()) {
        setIsSubmitting(true);

        try {
          // 更新用戶數據
          updateUserData({
            userName: formData.userName,
            nickName: formData.nickName,
            password: formData.password,
            email: userEmail // 這是已驗證的電子郵件，無法更改
          });

          console.log("註冊用戶資料準備完成，進入 PASSKEY 設置階段");

          // 註冊資料收集完成，標記註冊準備完成
          // 實際註冊API會在PASSKEY步驟中調用
          setRegistrationComplete(true);
          nextStep();

        } catch (error) {
          console.error('Registration preparation error:', error);

          const errorMessage = error instanceof Error
              ? error.message
              : '準備註冊資料時發生錯誤，請稍後再試';

          setIsSubmitting(false);
          alert(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    return (
        <div className="card w-full bg-base-200 shadow-md text-base-content">
          <div className="card-body">
            <h3 className="card-title text-primary flex-wrap">
              <span className="break-all">{organization}</span>
              <span className="text-base-content/70 font-normal ml-2">- 註冊資料</span>
            </h3>

            <div className="alert alert-info mt-2 mb-4 flex flex-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div className="flex-1 min-w-0">
                <div className="font-medium">已驗證電子郵件</div>
                <div className="text-xs opacity-70 truncate">{userEmail}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">帳號</span>
                </label>
                <input
                    name="userName"
                    type="text"
                    className={`input input-bordered w-full ${errors.userName ? 'input-error' : ''}`}
                    placeholder="請設定您的登入帳號"
                    value={formData.userName}
                    onChange={handleChange}
                />
                {errors.userName && <label className="label"><span
                    className="label-text-alt text-error">{errors.userName}</span></label>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">用戶名稱</span>
                </label>
                <input
                    name="nickName"
                    type="text"
                    className={`input input-bordered w-full ${errors.nickName ? 'input-error' : ''}`}
                    placeholder="您的顯示名稱"
                    value={formData.nickName}
                    onChange={handleChange}
                />
                {errors.nickName && <label className="label"><span
                    className="label-text-alt text-error">{errors.nickName}</span></label>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">設定密碼</span>
                </label>
                <input
                    name="password"
                    type="password"
                    className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                    placeholder="密碼至少需要8個字符"

                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <label className="label"><span
                    className="label-text-alt text-error">{errors.password}</span></label>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">確認密碼</span>
                </label>
                <input
                    name="confirmPassword"
                    type="password"
                    className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="再次輸入密碼"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                {errors.confirmPassword &&
                    <label className="label"><span className="label-text-alt text-error">{errors.confirmPassword}</span></label>}
              </div>
            </div>

            <div className="card-actions justify-between mt-6">
              <button className="btn btn-outline" onClick={prevStep}>
                上一步
              </button>
              <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      註冊中...
                    </>
                ) : '下一步'}
              </button>
            </div>
          </div>
        </div>
    );
  };

  // 第四步：註冊PASSKEY
  const Step4 = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const handleRegisterPasskey = async () => {
      setIsRegistering(true);

      try {
        // 模擬PASSKEY註冊過程
        // 實際實現中，這裡應該調用WebAuthn API來註冊生物識別或安全金鑰
        await new Promise(resolve => setTimeout(resolve, 2000));
        setRegisterSuccess(true);
      } catch (error) {
        console.error('PASSKEY registration error:', error);
        alert('PASSKEY註冊失敗，請稍後再試');
      } finally {
        setIsRegistering(false);
      }
    };

    const handleComplete = () => {
      // 註冊完成，這裡可以導向到登入頁面或儀表板頁面
      alert('註冊完成！');
      // 實際應用中，這裡應該重定向到登入頁面
      // window.location.href = '/login';
    };

    // 在註冊PASSKEY前先發送註冊API
    useEffect(() => {
      if (registrationComplete && !registerSuccess) {
        // 呼叫註冊API
        const registerUser = async () => {
          try {
            console.log("提交註冊: ", JSON.stringify(userData, null, 2));

            // 呼叫SignUp API
            const signUpResult = await SignUp(
                userData.userName,
                userData.nickName,
                userData.password,
                userData.email
            );

            if (!signUpResult.success) {
              throw new Error(signUpResult.message || "註冊失敗");
            }

            console.log("註冊成功!", signUpResult.message);
          } catch (error) {
            console.error("註冊API錯誤:", error);
            alert(error instanceof Error ? error.message : "無法完成註冊，請稍後再試");
            prevStep(); // 返回上一步重新嘗試
          }
        };

        registerUser();
      }
    }, [registrationComplete, registerSuccess, userData]);

    return (
        <div className="card w-full bg-base-200 shadow-md text-base-content">
          <div className="card-body">
            <h3 className="card-title text-primary">註冊PASSKEY（可選）</h3>

            {registerSuccess ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium mb-2">PASSKEY 設置成功！</h4>
                  <p className="text-base-content/80 text-center mb-4">
                    你現在可以使用生物識別或裝置安全金鑰來快速登入系統。
                  </p>
                  <button className="btn btn-primary mt-4" onClick={handleComplete}>
                    完成註冊
                  </button>
                </div>
            ) : (
                <>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <p className="text-base-content/80 text-center mb-4">
                      PASSKEY是一種更安全的登入方式，可以使用指紋、臉部識別或裝置PIN碼快速登入，無需記住複雜的密碼。
                    </p>
                    <div className="bg-info/10 p-4 rounded-lg w-full max-w-md mb-4">
                      <h4 className="font-medium text-info mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        使用PASSKEY的優點
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>無需記住複雜密碼</li>
                        <li>更高的安全性，防止釣魚攻擊</li>
                        <li>快速登入，避免輸入密碼的麻煩</li>
                        <li>跨設備同步（取決於您的裝置和瀏覽器）</li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-actions justify-center mt-4">
                    <button
                        className="btn btn-primary"
                        onClick={handleRegisterPasskey}
                        disabled={isRegistering}
                    >
                      {isRegistering ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            設置中...
                          </>
                      ) : '設置PASSKEY'}
                    </button>
                    <button className="btn btn-outline" onClick={handleComplete}>
                      稍後再說
                    </button>
                  </div>
                </>
            )}
          </div>
        </div>
    );
  };

  // 渲染當前步驟的內容
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1/>;
      case 2:
        return <Step2/>;
      case 3:
        return <Step3/>;
      case 4:
        return <Step4/>;
      default:
        return <Step1/>;
    }
  };

  return (
      <div className="flex flex-col space-y-6 w-full p-4 max-w-3xl mx-auto my-8">
        <h1 className="text-xl font-bold text-primary">註冊帳號</h1>

        {/* 步驟指示器 - 在小螢幕上垂直顯示，在中等以上螢幕上水平顯示 */}
        <div className="block md:hidden">
          <StepsContainer vertical={true}>
            <Step status={getStepStatus(1)}>輸入信箱</Step>
            <Step status={getStepStatus(2)}>驗證信箱</Step>
            <Step status={getStepStatus(3)}>填寫資料</Step>
            <Step status={getStepStatus(4)}>設置PASSKEY</Step>
          </StepsContainer>
        </div>

        <div className="hidden md:block">
          <StepsContainer vertical={false}>
            <Step status={getStepStatus(1)}>輸入信箱</Step>
            <Step status={getStepStatus(2)}>驗證信箱</Step>
            <Step status={getStepStatus(3)}>填寫資料</Step>
            <Step status={getStepStatus(4)}>設置PASSKEY</Step>
          </StepsContainer>
        </div>

        {/* 當前步驟內容 */}
        <AnimatePresence mode="wait">
          <motion.div
              key={currentStep}
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              transition={{duration: 0.3}}
              className="mt-6 w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
  );
}
// 導出子組件，以便在其他地方使用
export { StepsContainer, Step };
