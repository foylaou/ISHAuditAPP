'use client'
import React, {ReactNode, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";

// 定義接口
interface StepsContainerProps {
  children: ReactNode;
  vertical?: boolean;
}

interface StepProps {
  children: ReactNode;
  status?: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
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
  const [Organization, setOrganization] = useState("");
  const [Type,setType] = useState<[]>([]);

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

      const data = { "email": email };

      try {
        setIsLoading(true);
        setError('');
        const response = await axios.post('/proxy/Auth/DomainQuery', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.status === 200) {
          console.log(response);
          setOrganization(response.data.organization);
          setType(response.data.type);
          nextStep();

        }
      } catch (error: unknown) {
        console.error('Email verification error:', error);
        if (axios.isAxiosError(error))
        setError(error.response?.data?.message || '信箱驗證失敗，請稍後再試');
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

  // 第二步：填寫基本資料
  const Step2 = () => {
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    const [errors, setErrors] = useState({
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const validateForm = () => {
      let isValid = true;
      const newErrors = {
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
      };

      if (!formData.name.trim()) {
        newErrors.name = '請輸入您的姓名';
        isValid = false;
      }

      if (!formData.phone.trim()) {
        newErrors.phone = '請輸入您的手機號碼';
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.phone.trim())) {
        newErrors.phone = '請輸入有效的手機號碼';
        isValid = false;
      }

      if (!formData.password) {
        newErrors.password = '請設定密碼';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = '密碼至少需要8個字符';
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '兩次輸入的密碼不一致';
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        nextStep();
      }
    };

    return (
      <div className="card w-full bg-base-200 shadow-md text-base-content">
        <div className="card-title m-10">{Organization} 您好</div>
          {Type && Type.length > 0 ? (
            <div className="m-8">
              <legend>您的單位是：</legend>
              {Type.map((type, index) => (
                <div key={index}>
                  <input type="radio" id={type} name="organizationType" value={type} />
                  <label htmlFor={type}>{type}</label>
                </div>
              ))}
            </div>
          ) : null}

  <div className="card-body">
    <h3 className="card-title text-primary">填寫基本資料</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-control w-full">
        <input
            name="name"
            type="text"
            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
            placeholder="您的姓名"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <label className="label"><span className="label-text-alt text-error">{errors.name}</span></label>}
            </div>
            <div className="form-control w-full">
              <input
                name="phone"
                type="tel"
                className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                placeholder="您的手機號碼"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <label className="label"><span className="label-text-alt text-error">{errors.phone}</span></label>}
            </div>
          </div>
          <div className="form-control w-full mt-2">
            <input
              name="password"
              type="password"
              className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
              placeholder="設定密碼"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <label className="label"><span className="label-text-alt text-error">{errors.password}</span></label>}
          </div>
          <div className="form-control w-full mt-2">
            <input
              name="confirmPassword"
              type="password"
              className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="再次輸入密碼"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <label className="label"><span className="label-text-alt text-error">{errors.confirmPassword}</span></label>}
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={handleSubmit}>
              下一步
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 第三步：驗證電子信箱
  const Step3 = () => {
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // 處理驗證碼輸入
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      // 只允許數字
      const value = e.target.value.replace(/[^0-9]/g, '');
      // 限制最大長度為6
      const truncatedValue = value.substring(0, 6);
      setVerificationCode(truncatedValue);

      // 自動提交當驗證碼達到6位數
      if (truncatedValue.length === 6) {
        verifyCode(truncatedValue);
      }
    };

    // 處理數字框的點擊，將焦點放在輸入框上
    const handleBoxClick = (): void => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // 驗證碼驗證
    const verifyCode = async (code: string) => {
      setIsLoading(true);
      setError('');

      try {
        // 模擬驗證API
        // const response = await axios.post('/proxy/Auth/VerifyCode', { code });
        // if (response.status === 200) {

        // 模擬延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 假設驗證碼 123456 是有效的
        if (code === '888888') {
          nextStep();
        } else {
          setError('驗證碼不正確，請重新輸入');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setError('驗證失敗，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    // 重新發送驗證碼
    const resendCode = () => {
      setResendDisabled(true);
      setCountdown(60);

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

      // 模擬發送新驗證碼
      console.log('Resending verification code...');
    };

    return (
      <div className="card w-full bg-base-200 shadow-md text-base-content">
        <div className="card-body">
          <h3 className="card-title text-primary">驗證電子信箱</h3>
          <div className="flex flex-col items-center">
            <p className="mb-4 text-base-content/80">我們已發送驗證碼到您的電子郵件信箱</p>

            {/* 數字框顯示區域 */}
            <div className="flex justify-center space-x-2 relative" onClick={handleBoxClick}>
              {Array(6).fill(0).map((_, index) => (
                <div
                  key={index}
                  className={`input input-bordered w-12 h-12 flex items-center justify-center text-2xl cursor-text
                  ${error ? 'input-error' : ''}
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
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                className="absolute inset-0 w-full opacity-0 cursor-text"
                autoComplete="one-time-code"
                disabled={isLoading}
              />
            </div>

            <div className="text-sm text-base-content/70 mt-3">
              輸入6位數驗證碼
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
          </div>
          <div className="text-center mt-4">
            <button
              className="btn btn-link text-primary no-underline"
              onClick={resendCode}
              disabled={resendDisabled}
            >
              {resendDisabled
                ? `重新發送驗證碼 (${countdown}s)`
                : '重新發送驗證碼'
              }
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 第四步：註冊PASSKEY
  const Step4 = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegisterPasskey = async () => {
      setIsRegistering(true);

      try {
        // 模擬PASSKEY註冊過程
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('PASSKEY註冊成功！');
        // 這裡可以導向到登入頁面或儀表板頁面
      } catch (error) {
        console.error('PASSKEY registration error:', error);
        alert('PASSKEY註冊失敗，請稍後再試');
      } finally {
        setIsRegistering(false);
      }
    };

    const handleSkip = () => {
      // 這裡可以導向到登入頁面或儀表板頁面
      alert('已跳過PASSKEY註冊，註冊完成！');
    };

    return (
      <div className="card w-full bg-base-200 shadow-md text-base-content">
        <div className="card-body">
          <h3 className="card-title text-primary">註冊PASSKEY（可選）</h3>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-base-content/80 text-center mb-4">
              PASSKEY是一種更安全的登入方式，可以使用指紋、臉部識別或裝置PIN碼快速登入，無需記住複雜的密碼。
            </p>
          </div>
          <div className="card-actions justify-center mt-2">
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
            <button className="btn btn-outline" onClick={handleSkip}>
              稍後再說
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染當前步驟的內容
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-primary">註冊步驟</h1>

      {/* 步驟指示器 */}
      <StepsContainer vertical={false}>
        <Step status={getStepStatus(1)}>確認信箱</Step>
        <Step status={getStepStatus(2)}>填寫資料</Step>
        <Step status={getStepStatus(3)}>驗證信箱</Step>
        <Step status={getStepStatus(4)}>註冊PASSKEY</Step>
      </StepsContainer>

      {/* 當前步驟內容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* 底部導航按鈕 - 只在第四步顯示上一步按鈕 */}
      {currentStep === 4 && (
        <div className="flex justify-start mt-6">
          <button
            onClick={prevStep}
            className="btn btn-outline btn-secondary"
          >
            上一步
          </button>
        </div>
      )}
    </div>
  );
}

// 導出子組件，以便在其他地方使用
export { StepsContainer, Step };
