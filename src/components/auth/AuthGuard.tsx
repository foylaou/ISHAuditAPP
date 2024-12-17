'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/store/useGlobalStore';
import { authService } from '@/services/authService';

interface AuthGuardProps {
  children: React.ReactNode;
  // 要求的權限模塊和級別
  requiredPermissions?: {
    module: 'Audit' | 'KPI' | 'Sys' | 'Org';
    level: 'admin' | 'manager' | 'user';
  };
}

export default function AuthGuard({
  children,
  requiredPermissions = { module: 'Sys', level: 'user' } // 默認檢查系統用戶權限
}: AuthGuardProps) {
  const { isLoggedIn } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // 檢查是否登入
      if (!isLoggedIn || !authService.isAuthenticated()) {
        router.push('/Login');
        return false;
      }

      // 獲取用戶角色
      const userRoles = authService.getUserRoles();
      if (!userRoles) {
        router.push('/Login');
        return false;
      }

      // 檢查特定模塊的權限
      const modulePermission = userRoles[requiredPermissions.module];

      // 權限等級檢查
      const hasRequiredPermission = () => {
        switch (requiredPermissions.level) {
          case 'admin':
            return modulePermission === 'admin';
          case 'manager':
            return modulePermission === 'admin' || modulePermission === 'manager';
          case 'user':
            return modulePermission === 'admin' || modulePermission === 'manager' || modulePermission === 'user';
          default:
            return false;
        }
      };

      if (!hasRequiredPermission()) {
        router.push('/Unauthorized');
        return false;
      }

      return true;
    };

    checkAuth();
  }, [isLoggedIn, router, requiredPermissions]);

  // 如果正在檢查權限，返回 null
  if (!isLoggedIn || !authService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}

// 使用示例：
/*
// 需要審計管理員權限
<AuthGuard requiredPermissions={{ module: 'Audit', level: 'admin' }}>
  <AdminDashboard />
</AuthGuard>

// 需要 KPI 管理者權限
<AuthGuard requiredPermissions={{ module: 'KPI', level: 'manager' }}>
  <KPIManagement />
</AuthGuard>

// 需要組織用戶權限
<AuthGuard requiredPermissions={{ module: 'Org', level: 'user' }}>
  <UserDashboard />
</AuthGuard>
*/
