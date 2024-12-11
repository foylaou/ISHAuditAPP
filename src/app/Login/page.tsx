'use client'

import { useState } from 'react';
import LoginForm from '@/components/Forms/LoginForm';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  // 處理登入邏輯
  const handleLogin = async (username: string, password: string, CAPTCHA: boolean) => {
    try {
      // 驗證 CAPTCHA
      const captchaResponse = await fetch('/api/CAPTCHA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CAPTCHA }),
      });

      if (!captchaResponse.ok) {
        const captchaError = await captchaResponse.json();
        throw new Error(captchaError.message || 'CAPTCHA 驗證失敗');
      }

      // 處理登入請求
      const loginResponse = await fetch('/api/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        const loginError = await loginResponse.json();
        throw new Error(loginError.message || '登入失敗');
      }

      const data = await loginResponse.json();

      // 處理登入成功
      if (data.token) {
        // 儲存 token 到 localStorage 或 cookie
        localStorage.setItem('token', data.token);
        // 導向到首頁或儀表板
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('登入過程發生錯誤');
      }
      throw error; // 重新拋出錯誤讓 LoginForm 可以處理
    }
  };

  // 其他驗證方式的處理函數
  const handleEmailAuth = async () => {
    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('電子郵件驗證失敗');
      }

      // 處理成功回應
      console.log('已發送驗證郵件');
    } catch (error) {
      console.error('電子郵件驗證錯誤:', error);
      setError('電子郵件驗證失敗');
    }
  };

  const handleSmsAuth = async () => {
    try {
      const response = await fetch('/api/auth/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('簡訊驗證失敗');
      }

      // 處理成功回應
      console.log('已發送驗證簡訊');
    } catch (error) {
      console.error('簡訊驗證錯誤:', error);
      setError('簡訊驗證失敗');
    }
  };

  const handleDeviceAuth = async () => {
    try {
      const response = await fetch('/api/auth/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('裝置驗證失敗');
      }

      // 處理成功回應
      console.log('裝置驗證已初始化');
    } catch (error) {
      console.error('裝置驗證錯誤:', error);
      setError('裝置驗證失敗');
    }
  };

  return (
    <div className="min-h-screen">
      <LoginForm
        onLogin={handleLogin}
        onEmailAuth={handleEmailAuth}
        onSmsAuth={handleSmsAuth}
        onDeviceAuth={handleDeviceAuth}
      />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
