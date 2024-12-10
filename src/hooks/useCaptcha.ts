'use client'

import { useState } from 'react';

interface UseCaptchaReturn {
  token: string | null;
  isCaptchaVerified: boolean;
  handleCaptchaSuccess: (token: string) => void;
  handleCaptchaError: () => void;
  verifyCaptcha: () => Promise<boolean>;
}

export const useCaptcha = (): UseCaptchaReturn => {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [token, setToken] = useState<string | null>(null); // 保存 Turnstile 返回的 token

  const handleCaptchaSuccess = (token: string) => {
    setIsCaptchaVerified(true);
    setToken(token); // 保存成功回傳的 token
  };

  const handleCaptchaError = () => {
    setIsCaptchaVerified(false);
    setToken(null);
  };

  const verifyCaptcha = async () => {
    if (!token) {
      console.error('CAPTCHA token is missing');
      return false;
    }

    try {
      const response = await fetch('/api/CAPTCHA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cfTurnstileResponse: token }), // 傳遞 token 給後端
      });

      const result = await response.json();

      if (response.ok) {
        console.log('CAPTCHA 驗證成功:', result);
        return true;
      } else {
        console.error('CAPTCHA 驗證失敗:', result.Errors || '未知錯誤');
        return false;
      }
    } catch (error) {
      console.error('CAPTCHA verification failed:', error);
      return false;
    }
  };

  return {
    token,
    isCaptchaVerified,
    handleCaptchaSuccess,
    handleCaptchaError,
    verifyCaptcha,
  };
};
