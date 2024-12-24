'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/store/useGlobalStore';
import { authService } from '@/services/authService';

// 定義權限類型
type ModuleType = 'Audit' | 'KPI' | 'Sys' | 'Org';
type PermissionLevel = 'Admin' | 'Power' | 'Edit' | 'None';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: {
    module: ModuleType;
    level: PermissionLevel;
  };
}

export default function AuthGuard({
  children,
  requiredPermissions = { module: 'Sys', level: 'None' }
}: AuthGuardProps) {
  const { isLoggedIn, permissions } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // 檢查是否登入
      if (!isLoggedIn || !authService.isAuthenticated()) {
        router.push('/Login');
        return false;
      }

      // 獲取用戶權限
      const userPermissions = authService.getUserRoles();
      if (!userPermissions) {
        router.push('/Login');
        return false;
      }

      // 檢查模組權限
      const modulePermission = userPermissions[requiredPermissions.module];

      // 判斷權限等級
      const hasRequiredPermission = () => {
        // 確保模組權限存在
        if (!modulePermission) return false;

        // 取得實際的權限等級
        const actualLevel = modulePermission.replace(requiredPermissions.module, '');

        // 權限等級對照表（由高至低）
        const permissionLevels = ['Admin', 'Power', 'Edit', 'None'];
        const requiredLevelIndex = permissionLevels.indexOf(requiredPermissions.level);
        const actualLevelIndex = permissionLevels.indexOf(actualLevel);

        // 實際權限等級需要大於等於要求的等級
        return actualLevelIndex !== -1 && actualLevelIndex <= requiredLevelIndex;
      };

      if (!hasRequiredPermission()) {
        router.push('/Unauthorized');
        return false;
      }

      return true;
    };

    checkAuth();
  }, [isLoggedIn, router, requiredPermissions, permissions]);

  // 如果未登入或正在檢查權限，返回 null
  if (!isLoggedIn || !authService.isAuthenticated()) {
    return null;
  }

  // 權限檢查通過，渲染子組件
  return <>{children}</>;
}

/* 使用示例：
<AuthGuard requiredPermissions={{ module: 'Audit', level: 'Admin' }}>
  <AuditDashboard />
</AuthGuard>

<AuthGuard requiredPermissions={{ module: 'KPI', level: 'Power' }}>
  <KPIManagement />
</AuthGuard>

<AuthGuard requiredPermissions={{ module: 'Org', level: 'Edit' }}>
  <OrganizationEditor />
</AuthGuard>
*/
