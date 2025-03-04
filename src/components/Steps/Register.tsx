'use client'
import React, {ReactNode, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// 第一步：確認信箱
const Step1 = () => {
  return (
    <div className="card w-full bg-base-200 shadow-md text-base-content">
      <div className="card-body">
        <h3 className="card-title text-primary">請輸入電子信箱</h3>
        <div className="form-control w-full">
          <input
            name="email"
            type="email"
            className="input input-bordered w-full"
            placeholder="您的電子郵件地址"
          />
          <label className="label">
            <span className="label-text-alt text-base-content/70">
              我們將向此郵箱發送驗證碼，請確保能夠接收郵件。
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

// 第二步：填寫基本資料
const Step2 = () => {
  return (
    <div className="card w-full bg-base-200 shadow-md text-base-content">
      <div className="card-body">
        <h3 className="card-title text-primary">填寫基本資料</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <input
              name="name"
              type="text"
              className="input input-bordered w-full"
              placeholder="您的姓名"
            />
          </div>
          <div className="form-control w-full">
            <input
              name="phone"
              type="tel"
              className="input input-bordered w-full"
              placeholder="您的手機號碼"
            />
          </div>
        </div>
        <div className="form-control w-full mt-2">
          <input
            name="password"
            type="password"
            className="input input-bordered w-full"
            placeholder="設定密碼"
          />
        </div>
        <div className="form-control w-full mt-2">
          <input
            name="confirmPassword"
            type="password"
            className="input input-bordered w-full"
            placeholder="再次輸入密碼"
          />
        </div>
      </div>
    </div>
  );
};
// 第三步：驗證電子信箱
const Step3 = () => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 處理驗證碼輸入
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // 只允許數字
    const value = e.target.value.replace(/[^0-9]/g, '');
    // 限制最大長度為6
    const truncatedValue = value.substring(0, 6);
    setVerificationCode(truncatedValue);
  };

  // 處理數字框的點擊，將焦點放在輸入框上
  const handleBoxClick = (): void => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
            />
          </div>

          <div className="text-sm text-base-content/70 mt-3">
            輸入6位數驗證碼
          </div>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-link text-primary no-underline">重新發送驗證碼</button>
        </div>
      </div>
    </div>
  );
};


// 第四步：註冊PASSKEY
const Step4 = () => {
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
          <button className="btn btn-primary">設置PASSKEY</button>
          <button className="btn btn-outline">稍後再說</button>
        </div>
      </div>
    </div>
  );
};

// 主組件
export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);

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

      {/* 導航按鈕 */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className={`btn btn-secondary ${currentStep === 1 ? 'btn-disabled' : ""}`}
          disabled={currentStep === 1}
        >
          上一步
        </button>
        <button
          onClick={nextStep}
          className={`btn btn-primary ${currentStep === 4 ? 'btn-disabled' : ''}`}
          disabled={currentStep === 4}
        >
          {currentStep === 4 ? '完成' : '下一步'}
        </button>
      </div>
    </div>
  );
}

// 你也可以導出子組件，以便在其他地方使用
export { StepsContainer, Step };
