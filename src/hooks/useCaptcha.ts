// hooks/useCaptcha.ts
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
  const [token, setToken] = useState<string | null>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaSuccess = (token: string) => {
    setToken(token);
    setIsCaptchaVerified(true);
  };

  const handleCaptchaError = () => {
    setToken(null);
    setIsCaptchaVerified(false);
  };

  const verifyCaptcha = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch('/api/CAPTCHA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return response.ok;
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
    verifyCaptcha
  };
};
