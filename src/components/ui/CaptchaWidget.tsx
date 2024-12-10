// components/ui/CaptchaWidget.tsx
'use client'

import { Turnstile } from '@marsidev/react-turnstile';

interface CaptchaWidgetProps {
  onSuccess: (token: string) => void;  // 修改為接收 token 參數
  onError: () => void;  // 保持不變
}

const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onSuccess, onError }) => {
  const key = process.env.NEXT_PUBLIC_SIDEKEY; // 從環境變數讀取 siteKey

  return (
    <div className="flex justify-center items-center my-4">
      <Turnstile
        siteKey={key || ""}
        onSuccess={(token) => onSuccess(token)} // 將 token 傳給父組件
        onError={onError}
        // 可選：添加其他 Turnstile 配置
        options={{
          theme: 'light',
          size: 'normal'
        }}
      />
    </div>
  );
};

export default CaptchaWidget;
