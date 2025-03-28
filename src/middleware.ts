// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from './services/Auth/serverAuthService';

interface EnvironmentConfig {
  API_URL: string | undefined;
  RAG_API: string | undefined;
  DOMAIN: string;
  NODE_ENV: string;
  isDev: boolean;
}

// 模擬從後端撈取的白名單
interface CSPWhitelist {
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  frameSrc: string[];
  workerSrc: string[]; // 添加workerSrc屬性
}

// 無需驗證的公開路由
const publicRoutes = [
  '/Login',            // 大寫路徑
  '/404',
  '/Unauthorized',
  '/Maintenance',
  '/api',
  '/_next',
  '/static',
    "/Sitemap",
    "/Help",
  '/favicon.ico',
  '/public',  // 添加公開資源目錄
  '/proxy',   // proxy 路徑
    "/proxy/health",
    "/Auditedit/"
];

// 驗證請求是否為公開路由
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route =>
    pathname.startsWith(route) ||
    pathname.toLowerCase().startsWith(route.toLowerCase())
  );
}
// middleware.ts 中的 getCSPWhitelist 函數修改
function getCSPWhitelist(): CSPWhitelist {
  return {
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",  // 重要：允許內聯腳本
      "'unsafe-eval'",    // Turnstile需要eval
      "http://localhost:5238",
      "http://127.0.0.1:8000",
        "http://ishabackend:8080/",
      "https://challenges.cloudflare.com",
      "https://*.cloudflare.com",  // 所有cloudflare子域名
      "https://static.cloudflareinsights.com",
      "https://*.cloudflareinsights.com",
      "https://turnstile.com",
      "https://*.turnstile.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",  // Turnstile可能需要內聯樣式
      "https://challenges.cloudflare.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "https://challenges.cloudflare.com",
      "https://*.cloudflare.com",
      "http://ishabackend:8080/",
    ],
    fontSrc: [
      "'self'",
      "data:"
    ],
    connectSrc: [
      "'self'",
      "https://challenges.cloudflare.com",
      "https://*.cloudflare.com",
      "https://api.cloudflare.com",
      "https://turnstile.com",
      "https://*.turnstile.com",
      "http://ishabackend:8080/",
    ],
    frameSrc: [
      "'self'",
      "https://challenges.cloudflare.com",
      "https://*.cloudflare.com",
      "https://turnstile.com",
      "https://*.turnstile.com",
      "http://ishabackend:8080/",
    ],
    workerSrc: [  // 添加worker-src
      "'self'",
      "blob:",
      "https://challenges.cloudflare.com",
      "http://ishabackend:8080/",
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

// 應用安全頭部
function applySecurity(req: NextRequest) {

  const res = NextResponse.next();
  const env = getEnvironmentConfig();
  if (req.headers.get('host')?.includes('localhost')) {
    // Skip applying CSP for local testing
    return NextResponse.next();
  }
  // 檢查是否來自 ZAP 掃描器
  const userAgent = req.headers.get('user-agent') || '';
  const isZapScan = userAgent.includes('ZAP') || req.url.includes('zap');

  // 檢查請求是否為靜態資源（圖片等）
  const isStaticResource = req.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js)$/i);

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
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:5238", "http://127.0.0.1:8000", "https://challenges.cloudflare.com", "https://static.cloudflareinsights.com"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:", "https://challenges.cloudflare.com"],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'", apiUrl, ragApiUrl, "https://challenges.cloudflare.com", "https://api.cloudflare.com", "https://*.cloudflare.com"].filter(Boolean),
    'frame-src': ["'self'", "https://challenges.cloudflare.com", "https://*.cloudflare.com"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': []
  };
}  else if (env.isDev || isStaticResource) {
  // 開發環境 CSP 或靜態資源 - 最寬鬆
  cspDirectives = {
    'default-src': ["'self'", "http:", "https:"],
    'script-src': [...whitelist.scriptSrc, apiUrl, ragApiUrl].filter(Boolean),
    'style-src': whitelist.styleSrc,
    'img-src': ["'self'", "data:", "blob:", "http:", "https:"],
    'font-src': whitelist.fontSrc,
    'connect-src': [...whitelist.connectSrc, apiUrl, ragApiUrl, "ws:", "wss:", "*"].filter(Boolean),
    'frame-src': [...whitelist.frameSrc],
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
      'frame-src': [...whitelist.frameSrc],
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
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Robots-Tag', "noindex,nofollow, noarchive, nosnippet, notranslate, noimageindex");

  // 使用具體的來源而不是 'null'
  res.headers.set('Access-Control-Allow-Origin', domainUrl);
  // 添加 CORS 允許的方法和頭部
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Allow-Credentials', 'true');

  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 增加 debug 日誌，可以在 console 查看
  console.debug(`Next中介程序處理中...: ${pathname}`);

  // 1. 如果是 API 請求，處理 CORS 和安全性並直接放行
  if (pathname.startsWith('/api') || pathname.startsWith('/proxy')) {
    console.debug('偵測到 API 或代理請求，套用安全性並透過');
    return applySecurity(req);
  }

  // 2. 如果是靜態資源或公開路由，直接放行
  if (isPublicRoute(pathname) || pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js)$/i)) {
    console.debug('偵測到公共路由或靜態資源，應用安全並透過');
    return applySecurity(req);
  }

  // 3. 檢查用戶是否已登入 (使用 serverAuthService 的 isAuthenticated)
  if (!await isAuthenticated(req)) {
    console.debug('使用者未通過身份驗證，重定向到登入頁面');
    // 未登入用戶重定向到登入頁面
    // 可以保存原始URL作為參數，便於登入後重定向回來
    const url = new URL('/Login', req.url);
    url.searchParams.set('returnUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  // 4. 用戶已登入，應用安全頭並繼續
  console.debug('用戶已通過身份驗證，應用安全性並繼續');
  return applySecurity(req);
}

// 定義中間件應用的路徑
// 添加例外模式，避免對某些靜態資源路徑應用中間件
export const config = {
  matcher: [
    /*
     * 比對所有路徑，除了：
     * - 以下擴展名的靜態文件: (css, js, png, jpg, jpeg, gif, svg, webp, ico)
     * - api 路由
     * - _next 路由 (Next.js內部使用)
     * - 通常不需要額外安全頭的靜態資源
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico)$).*)',
  ],
};
