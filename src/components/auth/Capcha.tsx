import React, { useEffect, useRef } from 'react';
import {authService} from "@/services/Auth/authService";


// 定義全局 Turnstile 類型
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId?: string) => string;
      isExpired: (widgetId?: string) => boolean;
    };
    onloadTurnstileCallback: () => void;
  }
}

export default function Capcha() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');

  useEffect(() => {
    // 確保全局回調函數只設置一次
    if (!window.onloadTurnstileCallback) {
      window.onloadTurnstileCallback = function() {
        if (containerRef.current && window.turnstile) {
          console.log("Turnstile 初始化中...");
          try {
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
              sitekey: "0x4AAAAAAA14QimSGf0ZahP7",
              callback: handleSuccess,
              "refresh-expired": "auto",
              theme: "light"
            });
            console.log("Turnstile widgetId:", widgetIdRef.current);
          } catch (error) {
            console.error("Turnstile 初始化失敗:", error);
          }
        }
      };
    }

    // 如果 turnstile 已經載入但回調還未觸發
    if (window.turnstile && containerRef.current && !widgetIdRef.current) {
      window.onloadTurnstileCallback();
    }

    return () => {
      // 清理組件
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  // Token 驗證回調
  const handleSuccess = async (token: string) => {
    console.log("Turnstile 驗證成功，獲得 token:", token);
    try {
      const response = await authService.captcha(token);
      console.log("後端驗證結果:", response);

      if (!response.success && window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      console.error("後端驗證失敗:", error);
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  };

  return (
    <div className="turnstile-container">
      <div id="turnstile-widget" ref={containerRef}></div>
    </div>
  );
}
