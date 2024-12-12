// src/components/auth/AuthGuard.tsx
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/store/useGlobalStore';

export default function AuthGuard({
  children,
  requiredPermission = 'user' // 預設最低權限
}: {
  children: React.ReactNode;
  requiredPermission?: 'admin' | 'manager' | 'user';
}) {
  const { isLoggedIn, permissions } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    // 檢查是否登入
    if (!isLoggedIn) {
      router.push('/Login');
      return;
    }

    // 檢查權限
    const hasPermission = () => {
      switch (requiredPermission) {
        case 'admin':
          return permissions.sys === 'admin';
        case 'manager':
          return permissions.org === 'manager' || permissions.sys === 'admin';
        case 'user':
          return true; // 所有登入用戶都有基本權限
        default:
          return false;
      }
    };

    if (!hasPermission()) {
      router.push('/unauthorized');
    }
  }, [isLoggedIn, permissions, router, requiredPermission]);

  // 未登入或無權限時不渲染內容
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
