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
 *
 * @property {React.ReactNode} children - 需要保護的子組件
 * @property {Object} [requiredPermissions] - 所需的權限（預設為 Sys 模組，等級 None）
 * @property {ModuleType} requiredPermissions.module - 權限所屬模組
 * @property {PermissionLevel} requiredPermissions.level - 權限等級
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
 *
 * @param {AuthGuardProps} props - 組件屬性
 * @returns {JSX.Element} 如果權限驗證通過則渲染子組件，否則返回空白內容
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

  // 設置客戶端掛載狀態
  useEffect(() => {
    setMounted(true);
  }, []);

  // 初始化驗證
  useEffect(() => {
    if (!mounted) return;

    let isRedirecting = false;

    const initAuth = async () => {
      if (isRedirecting) return;

      try {
        // 頁面初始化時，先檢查 Cookie 中的 token 是否有效
        if (authService.isAuthenticated()) {
          // 如果 token 有效但狀態為未登入，更新全局狀態
          if (!isLoggedIn) {
            useGlobalStore.setState({ isLoggedIn: true });
          }

          // 獲取使用者權限
          const userPermissions = authService.getUserRoles();
          if (!userPermissions) {
            isRedirecting = true;
            setAuthorized(false);
            router.push('/Home');
            return;
          }

          // 取得指定模組的權限
          const modulePermission = userPermissions[requiredPermissions.module];

          // 檢查權限
          if (!hasRequiredPermission(modulePermission)) {
            isRedirecting = true;
            setAuthorized(false);
            router.push('/Unauthorized');
            return;
          }

          setAuthorized(true);
        } else {
          // 如果 token 無效但狀態為已登入，嘗試刷新 token
          if (isLoggedIn) {
            const refreshed = await authService.refreshToken();
            if (!refreshed) {
              useGlobalStore.setState({ isLoggedIn: false });
              setAuthorized(false);
              isRedirecting = true;
              router.push('/Login');
              return;
            }

            // 重新檢查權限
            const userPermissions = authService.getUserRoles();
            const modulePermission = userPermissions?.[requiredPermissions.module];
            setAuthorized(hasRequiredPermission(modulePermission || ''));
          } else {
            setAuthorized(false);
            isRedirecting = true;
            router.push('/Login');
            return;
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, [mounted, isLoggedIn, router, requiredPermissions, permissions]);

  // 自動刷新機制
  useEffect(() => {
    if (!mounted) return;

    const refreshAuth = async () => {
      if (isLoggedIn && !authService.isAuthenticated()) {
        // Token 已過期但狀態仍為登入中，嘗試刷新 token
        try {
          await authService.refreshToken();
        } catch (error) {
          // 如刷新失敗，重置登入狀態
          useGlobalStore.setState({ isLoggedIn: false });
          setAuthorized(false);
          router.push('/Login');
        }
      }
    };

    const refreshInterval = setInterval(refreshAuth, 5 * 60 * 1000); // 每5分鐘刷新一次

    return () => clearInterval(refreshInterval);
  }, [mounted, isLoggedIn, router]);

  // 提供一致的初始渲染結構，避免水合錯誤
  if (!mounted) {
    return <div className="auth-guard-container">{children}</div>;
  }

  // 客戶端驗證完成後的條件渲染
  return (
    <div className="auth-guard-container">
      {authorized && !isChecking ? children : null}
    </div>
  );
}
