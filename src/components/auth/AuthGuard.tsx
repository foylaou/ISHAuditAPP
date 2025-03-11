'use client'
import React, { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/store/useGlobalStore';
import { authService } from '@/services/authService';

/** 權限模組類型 */
type ModuleType = 'Audit' | 'KPI' | 'Sys' | 'Org';

/** 權限等級類型 */
type PermissionLevel = 'Admin' | 'Power' | 'Edit' | 'None';

/**
 * AuthGuard 組件的屬性定義
 */
interface AuthGuardProps {
  children?: React.ReactNode;
  requiredPermissions?: {
    module: ModuleType;
    level: PermissionLevel;
  };
}

/**
 * AuthGuard 組件
 *
 * 此組件用於保護受限頁面，確保使用者具有適當的登入狀態與權限。
 * 如果使用者未登入或無權訪問，則會自動導向登入或未授權頁面。
 */
export default function AuthGuard({
  children,
  requiredPermissions = { module: 'Sys', level: 'None' }
}: AuthGuardProps): JSX.Element {
  const { isLoggedIn, permissions } = useGlobalStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // 判斷使用者是否具有所需的權限
  const hasRequiredPermission = (modulePermission: string): boolean => {
    if (!modulePermission) return false;

    // 取得使用者的實際權限等級
    const actualLevel = modulePermission.replace(requiredPermissions.module, '');

    // 權限等級順序（由高至低）
    const permissionLevels: PermissionLevel[] = ['Admin', 'Power', 'Edit', 'None'];
    const requiredLevelIndex = permissionLevels.indexOf(requiredPermissions.level);
    const actualLevelIndex = permissionLevels.indexOf(actualLevel as PermissionLevel);

    // 使用者的權限等級需大於或等於要求的權限等級
    return actualLevelIndex !== -1 && actualLevelIndex <= requiredLevelIndex;
  };

  // 验证并处理重定向逻辑
  const verifyAndRedirect = async () => {
    // 立即检查身份验证状态，在重定向前阻止显示任何内容
    if (!authService.isAuthenticated()) {
      router.replace('/Login');
      return false;
    }

    // 获取用户权限
    const userPermissions = authService.getUserRoles();
    if (!userPermissions) {
      router.replace('/Home');
      return false;
    }

    // 检查模块权限
    const modulePermission = userPermissions[requiredPermissions.module];
    if (!hasRequiredPermission(modulePermission)) {
      router.replace('/Unauthorized');
      return false;
    }

    return true;
  };

  // 初始客户端验证
  useEffect(() => {
    const initialize = async () => {
      setMounted(true);

      // 执行验证，如果验证失败则函数内部会处理重定向
      const isAuthorized = await verifyAndRedirect();

      setAuthorized(isAuthorized);
      setIsChecking(false);
    };

    initialize();
  }, []);

  // 自动刷新机制
  useEffect(() => {
    if (!mounted) return;

    const refreshAuth = async () => {
      if (isLoggedIn && !authService.isAuthenticated()) {
        // Token 已过期但状态仍为登录中，尝试刷新 token
        try {
          const refreshed = await authService.refreshToken();
          if (!refreshed) {
            useGlobalStore.setState({ isLoggedIn: false });
            setAuthorized(false);
            router.replace('/Login');
          }
        } catch (error) {
          useGlobalStore.setState({ isLoggedIn: false });
          setAuthorized(false);
          router.replace('/Login');
        }
      }
    };

    const refreshInterval = setInterval(refreshAuth, 5 * 60 * 1000); // 每5分钟刷新一次

    return () => clearInterval(refreshInterval);
  }, [mounted, isLoggedIn, router]);

  // 验证状态变化时重新验证
  useEffect(() => {
    if (mounted && !isChecking) {
      verifyAndRedirect().then(setAuthorized);
    }
  }, [isLoggedIn, permissions]);

  // 重要：只有在授权成功且不再检查时才渲染子组件
  if (!mounted || isChecking || !authorized) {
    // 显示加载状态或空白页，而不是子组件
    return <div className="auth-guard-loading"></div>;
  }

  // 只有在完全验证通过后才渲染子组件
  return <div className="auth-guard-container">{children}</div>;
}
