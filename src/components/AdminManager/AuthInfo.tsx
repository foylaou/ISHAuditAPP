// 'use client'
// import {useRouter} from "next/navigation";
// import {useGlobalStore} from "@/store/useGlobalStore";
// import React, {useEffect, useState} from "react";
// import {jwtDecode} from "jwt-decode";
// import {Clock, Shield, Star, User} from "lucide-react";
// import { authService } from "@/services/Auth/authService";
//
//
// export default function AuthInfo() {
//   const router = useRouter();
//   const { permissions, isLoggedIn, setIsLoggedIn } = useGlobalStore(); // 添加 setIsLoggedIn
//   // 使用 useState 來管理 userName
//   const [userName, setUserName] = useState<string>('');
//   const [remainingTime, setRemainingTime] = useState<number | null>(null);
//   // 添加一個載入狀態
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     const checkAuthStatus = () => {
//       const token = authService.getToken();
//       // 如果有 token，先驗證它是否有效
//       if (token) {
//         try {
//           const decoded = jwtDecode(token);
//           const currentTime = Math.floor(Date.now() / 1000);
//
//           if (decoded.exp && decoded.exp > currentTime) {
//             // token 有效，設置登入狀態
//             setIsLoggedIn(true);
//             setUserName(authService.getUserName() || '');
//           } else {
//             // token 過期
//             authService.logout();
//             router.push('/Login');
//           }
//         } catch (error) {
//           console.error('Token validation failed:', error);
//           authService.logout();
//           router.push('/Login');
//         }
//       } else {
//         // 沒有 token
//         router.push('/Login');
//       }
//       setIsLoading(false);
//     };
//
//     checkAuthStatus();
//   }, [router, setIsLoggedIn]);
//
//   // 剩餘時間計時器
//   useEffect(() => {
//     if (!isLoggedIn) return;
//
//     let retryCount = 0;
//     const maxRetries = 3;
//     let timer: NodeJS.Timeout | null = null;
//
//     const updateTimer = (expTime: number | null) => {
//       if (expTime === undefined) return;
//
//       const newRemaining = calculateRemainingTime(expTime);
//       if (newRemaining === null || newRemaining <= 0) {
//         authService.logout();
//         setIsLoggedIn(false);
//         router.push('/Login');
//       } else {
//         setRemainingTime(newRemaining);
//       }
//     };
//
//     const tryGetExpiration = () => {
//       const expTime = getExpirationTime();
//       if ((expTime === null || expTime === undefined) && retryCount < maxRetries) {
//         retryCount++;
//         setTimeout(tryGetExpiration, 1000);
//       } else if (expTime !== undefined && expTime !== null) {
//         updateTimer(expTime);
//         timer = setInterval(() => updateTimer(expTime), 1000);
//       }
//     };
//
//     tryGetExpiration();
//
//     return () => {
//       if (timer) {
//         clearInterval(timer);
//       }
//     };
//   }, [isLoggedIn, router, setIsLoggedIn]);
//
//
//   // 更新剩餘時間
//   // 獲取初始過期時間（UNIX 時間戳，秒）
// const getExpirationTime = () => {
//   const token = authService.getToken();
//   if (!token) {
//     console.log('Token not found in localStorage');
//     return null;
//   }
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.exp;
//   } catch (error) {
//     console.error('Failed to decode token:', error);
//     return null;
//   }
// };
//
//   // 計算剩餘時間（秒）
//   const calculateRemainingTime = (expirationTime: number | null): number | null => {
//     if (!expirationTime) return null;
//     const now = Math.floor(Date.now() / 1000);
//     const remaining = expirationTime - now;
//     return remaining > 0 ? remaining : 0;
//   };
//
//
//   // 格式化時間顯示
//   const formatRemainingTime = (seconds: number | null): string => {
//     if (seconds === null) return '未知';
//
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//
//     if (hours > 0) {
//       return `${hours}小時 ${minutes}分鐘 ${secs}秒`;
//     } else if (minutes > 0) {
//       return `${minutes}分鐘 ${secs}秒`;
//     } else {
//       return `${secs}秒`;
//     }
//   };
//
//
//   // 權限映射表
//   const permissionLabels: Record<string, string> = {
//     'Audit': '督導管理',
//     'KPI': '績效管理',
//     'Sys': '系統管理',
//     'Org': '組織管理'
//   };
//
//   // 轉換權限值為可讀文字
//   const getPermissionText = (value: string): string => {
//     // 原本的值可能是 "AuditAdmin" 這樣的格式
//     // 需要先提取出 "Admin" 部分
//     const permissionLevel = value.replace(/(Audit|KPI|Sys|Org)/, '');
//
//     switch (permissionLevel) {
//       case 'Admin':
//         return '最高權限';
//       case 'Power':
//         return '管理權限';
//       case 'Edit':
//         return '編輯權限';
//       case 'None':
//         return '無權限';
//       default:
//         return '未定義權限';
//     }
//   };
//
// if (isLoading) {
//   return (
//     <div className="bg-base-200 rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6">
//       <div className="space-y-6">
//         {/* 用戶資訊區域的 skeleton */}
//         <div className="border-b pb-6">
//           <div className="flex items-center space-x-4">
//             <div className="skeleton w-12 h-12 rounded-full"></div>
//             <div className="space-y-3">
//               <div className="skeleton h-8 w-32"></div>
//               <div className="skeleton h-4 w-24"></div>
//               <div className="skeleton h-4 w-48"></div>
//             </div>
//           </div>
//         </div>
//
//         {/* 權限區域的 skeleton */}
//         <div className="space-y-4">
//           <div className="skeleton h-6 w-24"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* 生成 4 個權限卡片的 skeleton */}
//             {[...Array(4)].map((_, index) => (
//               <div key={index} className="border rounded-lg p-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="skeleton w-5 h-5 rounded"></div>
//                   <div className="space-y-2 w-full">
//                     <div className="skeleton h-4 w-24"></div>
//                     <div className="skeleton h-3 w-16"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//   return (
//
//       <div className=" bg-base-200 rounded-lg shadow-lg w-full max-w-2xl mx-auto ">
//         {/* 頭部區域 */}
//
//         <div className="p-6 border-b  ">
//           <div className="p-6 border-b text-base-content">
//             <div className="flex items-center space-x-4">
//               <div className="p-2 bg-blue-100 rounded-full">
//                 <User className="w-6 h-6 text-blue-600"/>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-semibold text-base-content">歡迎回來</h1>
//                 <p className="text-gray-500">{userName}</p>
//                 <div className="flex items-center mt-2 text-sm text-gray-500">
//                   <Clock className="w-4 h-4 mr-2"/>
//                   <span>登入時效：{formatRemainingTime(remainingTime)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//
//           {/* 內容區域 */}
//           <div className="p-6 text-base-content">
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Shield className="w-5 h-5 text-blue-600"/>
//                 <h3 className="text-lg font-medium">系統權限</h3>
//               </div>
//
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.entries(permissions).map(([key, value]) => {
//                   // 從完整的權限字串中提取權限等級
//                   const permissionLevel = value.replace(/(Audit|KPI|Sys|Org)/, '');
//
//                   return (
//                       <div
//                           key={key}
//                           className="flex items-center p-4 rounded-lg border hover:bg-gray-50 "
//                       >
//                         <Star className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0"/>
//                         <div className="flex-grow">
//                           <div className="font-medium">{permissionLabels[key] || key}</div>
//                           <div className="text-sm text-gray-600">
//                             {getPermissionText(permissionLevel)}
//                           </div>
//                         </div>
//                       </div>
//
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//
//       </div>
//   )
// }
