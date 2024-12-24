"use client"
import React, {useEffect, useState} from 'react';
import {User, Shield, Star, Clock} from 'lucide-react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { authService } from '@/services/authService';
import {jwtDecode} from "jwt-decode";

const UserProfile = () => {
  const {permissions, isLoggedIn} = useGlobalStore();
  const userName = authService.getUserName();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);


  // 更新剩餘時間
  // 獲取初始過期時間（UNIX 時間戳，秒）
const getExpirationTime = () => {
  const token = authService.getToken();
  if (!token) {
    console.log('Token not found in localStorage');
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.exp;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

  // 計算剩餘時間（秒）
  // 計算剩餘時間（秒）
  const calculateRemainingTime = (expirationTime: number | null): number | null => {
    if (!expirationTime) return null;
    const now = Math.floor(Date.now() / 1000);
    const remaining = expirationTime - now;
    return remaining > 0 ? remaining : 0;
  };

useEffect(() => {
  let retryCount = 0;
  const maxRetries = 3;
  let timer: NodeJS.Timeout | null = null;

  const updateTimer = (expTime: number | null) => {
    // 確保 expTime 不是 undefined
    if (expTime === undefined) return;

    const newRemaining = calculateRemainingTime(expTime);
    if (newRemaining === null || newRemaining <= 0) {
      authService.logout();
    } else {
      setRemainingTime(newRemaining);
    }
  };

  const tryGetExpiration = () => {
    const expTime = getExpirationTime();
    // 明確檢查 expTime 是否為 null 或 undefined
    if ((expTime === null || expTime === undefined) && retryCount < maxRetries) {
      retryCount++;
      setTimeout(tryGetExpiration, 1000);
    } else if (expTime !== undefined && expTime !== null) {
      // 只在 expTime 有效時設置定時器
      updateTimer(expTime);
      timer = setInterval(() => updateTimer(expTime), 1000);
    }
  };

  tryGetExpiration();

  return () => {
    if (timer) {
      clearInterval(timer);
    }
  };
}, []);
  // 格式化時間顯示
  const formatRemainingTime = (seconds: number | null): string => {
    if (seconds === null) return '未知';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}小時 ${minutes}分鐘 ${secs}秒`;
    } else if (minutes > 0) {
      return `${minutes}分鐘 ${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };


  // 權限映射表
  const permissionLabels: Record<string, string> = {
    'Audit': '督導管理',
    'KPI': '績效管理',
    'Sys': '系統管理',
    'Org': '組織管理'
  };

  // 轉換權限值為可讀文字
  const getPermissionText = (value: string): string => {
    // 原本的值可能是 "AuditAdmin" 這樣的格式
    // 需要先提取出 "Admin" 部分
    const permissionLevel = value.replace(/(Audit|KPI|Sys|Org)/, '');

    switch (permissionLevel) {
      case 'Admin':
        return '最高權限';
      case 'Power':
        return '管理權限';
      case 'Edit':
        return '編輯權限';
      case 'None':
        return '無權限';
      default:
        return '未定義權限';
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        {/* 頭部區域 */}
        <div className="p-6 border-b">

          <div className="p-6 border-b text-base-content">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="w-6 h-6 text-blue-600"/>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-base-content">歡迎回來</h2>
                <p className="text-gray-500">{userName}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2"/>
                  <span>登入時效：{formatRemainingTime(remainingTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 內容區域 */}
          <div className="p-6 text-base-content">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600"/>
                <h3 className="text-lg font-medium">系統權限</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissions).map(([key, value]) => {
                  // 從完整的權限字串中提取權限等級
                  const permissionLevel = value.replace(/(Audit|KPI|Sys|Org)/, '');

                  return (
                      <div
                          key={key}
                          className="flex items-center p-4 rounded-lg border hover:bg-gray-50 "
                      >
                        <Star className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0"/>
                        <div className="flex-grow">
                          <div className="font-medium">{permissionLabels[key] || key}</div>
                          <div className="text-sm text-gray-600">
                            {getPermissionText(permissionLevel)}
                          </div>
                        </div>
                      </div>

                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
  )
}
export default UserProfile;
