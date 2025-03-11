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
interface CSPWhitelist {
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  frameSrc: string[];
}

// 定义需要保护的路由及其权限要求
const protectedRoutes: Record<string, { module: string; level: string }> = {
  '/dashboard': { module: 'Sys', level: 'Edit' },
  '/admin': { module: 'Sys', level: 'Admin' },
  '/report': { module: 'Audit', level: 'None' },
  // 添加其他受保护的路由...
};

// 从cookie中获取和解析用户权限信息
function getUserPermissionsFromCookie(request: NextRequest): Record<string, string> | null {
  try {
    // 获取包含权限的cookie
    const permissionsCookie = request.cookies.get('userRoles')?.value;
    if (!permissionsCookie) return null;

    // 解析权限信息 (根据你的应用调整解析逻辑)
    return JSON.parse(permissionsCookie);
  } catch (error) {
    console.error('Error parsing permissions from cookie:', error);
    return null;
  }
}

// 检查用户是否有权限访问指定路由
function hasRequiredPermission(
  userPermissions: Record<string, string> | null,
  requiredPermission: { module: string; level: string }
): boolean {
  if (!userPermissions) return false;

  const modulePermission = userPermissions[requiredPermission.module];
  if (!modulePermission) return false;

  // 取得使用者的實際權限等級
  const actualLevel = modulePermission.replace(requiredPermission.module, '');

  // 權限等級順序（由高至低）
  const permissionLevels = ['Admin', 'Power', 'Edit', 'None'];
  const requiredLevelIndex = permissionLevels.indexOf(requiredPermission.level);
  const actualLevelIndex = permissionLevels.indexOf(actualLevel);

  // 使用者的權限等級需大於或等於要求的權限等級
  return actualLevelIndex !== -1 && actualLevelIndex <= requiredLevelIndex;
}

// 從後端獲取白名單的函數 (這裡使用模擬數據)
function getCSPWhitelist(): CSPWhitelist {
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
  const { pathname } = req.nextUrl;

  // 检查是否为受保护的路由
  const requiredPermissionKey = Object.keys(protectedRoutes).find(
    route => pathname.startsWith(route)
  );

  // 如果是受保护的路由，进行权限验证
  if (requiredPermissionKey) {
    // 获取认证令牌
    const token = req.cookies.get('token')?.value;

    // 如果没有令牌，重定向到登录页面
    if (!token) {
      return NextResponse.redirect(new URL('/Login', req.url));
    }

    // 获取用户权限
    const userPermissions = getUserPermissionsFromCookie(req);

    // 如果没有权限信息，重定向到首页
    if (!userPermissions) {
      return NextResponse.redirect(new URL('/Home', req.url));
    }

    // 检查是否有所需权限
    const requiredPermission = protectedRoutes[requiredPermissionKey];
    if (!hasRequiredPermission(userPermissions, requiredPermission)) {
      return NextResponse.redirect(new URL('/Unauthorized', req.url));
    }
  }

  // 继续处理CSP和其他安全标头
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

// 定义中间件应用的路径，保留原有配置
export const config = {
  matcher: '/:path*',
};
