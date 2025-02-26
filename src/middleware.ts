// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface EnvironmentConfig {
  API_URL: string | undefined;
  RAG_API: string | undefined;
  DOMAIN: string;
  NODE_ENV: string;
  isDev: boolean;
}

// 模擬從後端撈取的白名單
// 實際應用中，你可以使用 getStaticProps 或在伺服器啟動時從後端 API 獲取這些白名單
interface CSPWhitelist {
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  frameSrc: string[];
}

// 從後端獲取白名單的函數 (這裡使用模擬數據)
function getCSPWhitelist(): CSPWhitelist {

    // 使用環境變數中的 API URL
  //   const apiUrl = process.env.API || "http://ishabackend:8080";
  //   const response = await fetch(`${apiUrl}/security/csp-whitelist`);
  //
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //
  //   return await response.json();
  // } catch (error) {
  //   console.error("Error fetching CSP whitelist:", error);
  // // 在實際應用中，這里應該是從後端 API 獲取的數據
  return {
    scriptSrc: [
      // 可以添加你需要的外部腳本來源
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:"
    ],
    fontSrc: [
      "'self'",
      "data:"
    ],
    connectSrc: [
      "'self'",
      // 可以添加其他允許的連接來源
    ],
    frameSrc: [
      "'self'"
    ]
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const API_URL = process.env.API || "http://ishabackend:8080";
  const RAG_API = process.env.RAG_API || "http://ishabackend:8080";
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isDev = NODE_ENV === "development";

  return {
    API_URL,
    RAG_API,
    DOMAIN,
    NODE_ENV,
    isDev,
  };
};

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const env = getEnvironmentConfig();

  // 檢查是否來自 ZAP 掃描器
  const userAgent = req.headers.get('user-agent') || '';
  const isZapScan = userAgent.includes('ZAP') || req.url.includes('zap');

  // 獲取域名具體的來源
  const apiUrl = new URL(env.API_URL || '').origin;
  const ragApiUrl = new URL(env.RAG_API || '').origin;
  const domainUrl = new URL(env.DOMAIN).origin;

  // 獲取 CSP 白名單
  const whitelist = getCSPWhitelist();

  // 為不同環境設置 CSP 配置
  let cspDirectives;

  if (isZapScan) {
    // 針對 ZAP 掃描的 CSP - 使用 AG Grid 最小要求，但更寬鬆
    cspDirectives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"], // 允許內聯腳本，沒有 nonce
      'style-src': ["'self'", "'unsafe-inline'"], // AG Grid 需要 unsafe-inline
      'img-src': ["'self'", "data:"],
      'font-src': ["'self'", "data:"], // AG Grid 需要 data: 字體
      'connect-src': ["'self'", apiUrl, ragApiUrl].filter(Boolean),
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': []
    };
  } else if (env.isDev) {
    // 開發環境 CSP - 最寬鬆
    cspDirectives = {
      'default-src': ["'self'", "http:", "https:"],
      'script-src': [...whitelist.scriptSrc, apiUrl, ragApiUrl].filter(Boolean),
      'style-src': whitelist.styleSrc,
      'img-src': whitelist.imgSrc,
      'font-src': whitelist.fontSrc,
      'connect-src': [...whitelist.connectSrc, apiUrl, ragApiUrl, "ws:", "wss:"].filter(Boolean),
      'frame-src': whitelist.frameSrc,
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };
  } else {
    // 生產環境 CSP - 根據白名單配置，寬鬆但仍有保護
    cspDirectives = {
      'default-src': ["'self'"],
      'script-src': [...whitelist.scriptSrc, apiUrl, ragApiUrl].filter(Boolean),
      'style-src': whitelist.styleSrc,
      'img-src': whitelist.imgSrc,
      'font-src': whitelist.fontSrc,
      'connect-src': [...whitelist.connectSrc, apiUrl, ragApiUrl].filter(Boolean),
      'frame-src': whitelist.frameSrc,
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': []
    };
  }

  // 構建 CSP 字串
  const csp = Object.entries(cspDirectives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');

  // 設定安全標頭
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Robots-Tag', "noindex,nofollow, noarchive, nosnippet, notranslate, noimageindex");

  // 使用具體的來源而不是 'null'
  res.headers.set('Access-Control-Allow-Origin', domainUrl);

  return res;
}

export const config = {
  matcher: '/:path*',
};
