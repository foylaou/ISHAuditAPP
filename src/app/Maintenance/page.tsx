// //app/Maintenance/page.tsx

export default function page(){
    return(<>
    </>)
}


// "use client";
//
// import { useEffect, useState } from "react";
//
// import {  Clock, AlertCircle, Database, Server } from "lucide-react";
// import { getStatusMessage, getSystemStatus } from "@/services/Test/healthService";
// import { SystemStatus } from "@/types/System/systemType";
// import FloatingImage from "@/components/Image/FloatingImage";
//
// export default function MaintenancePage() {
//   const [status, setStatus] = useState<SystemStatus | null>(null);
//   const [timeLeft, setTimeLeft] = useState<string | null>(null);
//   const [isError, setIsError] = useState(false);
//
//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;
//
//     const checkStatus = async () => {
//       try {
//         const currentStatus = await getSystemStatus();
//         setStatus(currentStatus);
//         setIsError(false);
//
//         // 如果成功獲取狀態，繼續定期檢查
//         if (!intervalId) {
//           intervalId = setInterval(async () => {
//             try {
//               const newStatus = await getSystemStatus();
//               setStatus(newStatus);
//               setIsError(false);
//             } catch (error) {
//               console.error('檢查狀態失敗:', error);
//               setIsError(true);
//               // API 錯誤時仍保留最後的狀態，但標記為不可用
//               setStatus(prev => prev ? {
//                 ...prev,
//                 isApiAvailable: false,
//                 isDatabaseAvailable: false,
//                 checkTime: new Date().toISOString()
//               } : null);
//             }
//           }, 30000);
//         }
//       } catch (error) {
//         console.error('初始檢查狀態失敗:', error);
//         setIsError(true);
//         // API 錯誤時設置預設的錯誤狀態
//         setStatus({
//           isApiAvailable: false,
//           isDatabaseAvailable: false,
//           isInMaintenance: true,
//           checkTime: new Date().toISOString(),
//           details: {
//             apiLatency: undefined,
//             databaseLatency: undefined,
//             activeConnections: undefined,
//             systemLoad: undefined
//           }
//         });
//       }
//     };
//
//     checkStatus();
//
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, []);
//
//   useEffect(() => {
//     if (!status?.isInMaintenance) return;
//
//     const targetTime = new Date();
//     targetTime.setHours(targetTime.getHours() + 2);
//
//     const updateTime = () => {
//       const now = new Date();
//       const diff = targetTime.getTime() - now.getTime();
//
//       if (diff <= 0) {
//         setTimeLeft("維護即將完成");
//         return;
//       }
//
//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       setTimeLeft(`預計還需 ${hours} 小時 ${minutes} 分鐘`);
//     };
//
//     updateTime();
//     const timer = setInterval(updateTime, 60000);
//     return () => clearInterval(timer);
//   }, [status?.isInMaintenance]);
//
//   if (!status) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center text-base-content">
//         <div className="text-gray-600">載入中...</div>
//       </div>
//     );
//   }
//
//   const statusInfo = getStatusMessage(status);
//
//   return (
//     <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 text-base-content">
//       <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
//         <div className="space-y-4">
//           <div className="flex items-center justify-center space-x-2">
//             {statusInfo.severity === 'error' && <AlertCircle className="w-12 h-12 text-accent"/>}
//             {statusInfo.severity === 'warning' && <AlertCircle className="w-12 h-12 text-yellow-600"/>}
//             {statusInfo.severity === 'info' && <Clock className="w-12 h-12 text-blue-600"/>}
//             <h1 className="text-4xl font-bold text-base-content">{statusInfo.title}</h1>
//           </div>
//
//           <p className="text-base-content">{statusInfo.description}</p>
//
//           {status.isInMaintenance && timeLeft && (
//               <div className="inline-block px-4 py-2 bg-blue-50 rounded-lg">
//                 <p className="text-blue-600 font-medium">{timeLeft}</p>
//               </div>
//           )}
//
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//             <div className={`p-4 rounded-lg ${status.isApiAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
//               <Server className={`w-6 h-6 mx-auto ${status.isApiAvailable ? 'text-green-600' : 'text-red-600'}`}/>
//               <p className={`mt-2 font-medium ${status.isApiAvailable ? 'text-green-600' : 'text-red-600'}`}>
//                 API 服務
//               </p>
//               <p className="text-sm text-gray-600">
//                 {status.isApiAvailable ? '正常運作中' : '無法連線'}
//               </p>
//             </div>
//
//             <div className={`p-4 rounded-lg ${status.isDatabaseAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
//               <Database
//                   className={`w-6 h-6 mx-auto ${status.isDatabaseAvailable ? 'text-green-600' : 'text-red-600'}`}/>
//               <p className={`mt-2 font-medium ${status.isDatabaseAvailable ? 'text-green-600' : 'text-red-600'}`}>
//                 資料庫
//               </p>
//               <p className="text-sm text-gray-600">
//                 {status.isDatabaseAvailable ? '正常運作中' : '無法連線'}
//               </p>
//             </div>
//
//             <div className={`p-4 rounded-lg ${!status.isInMaintenance ? 'bg-green-50' : 'bg-blue-50'}`}>
//               <Clock className={`w-6 h-6 mx-auto ${!status.isInMaintenance ? 'text-green-600' : 'text-blue-600'}`}/>
//               <p className={`mt-2 font-medium ${!status.isInMaintenance ? 'text-green-600' : 'text-blue-600'}`}>
//                 系統狀態
//               </p>
//               <p className="text-sm text-gray-600">
//                 {status.isInMaintenance ? '維護中' : '正常運作中'}
//               </p>
//             </div>
//           </div>
//         </div>
//
//         <div className="relative w-full h-64 sm:h-96">
//
//           {/*<Image*/}
//           {/*    src="/500R2.svg"*/}
//           {/*    alt={statusInfo.title}*/}
//           {/*    layout="fill"*/}
//           {/*    objectFit="cover"*/}
//           {/*    objectPosition="center">*/}
//
//           {/*</Image>*/}
//           <FloatingImage
//               src="/500R3.svg"
//               alt={statusInfo.title}
//           />
//
//         </div>
//         {/*<progress className="progress w-56"></progress>*/}
//         <div className="space-y-4">
//
//           <p className="text-sm text-base-content">
//             如有緊急事項，請聯繫我們的客服人員
//           </p>
//           <p className="text-xs text-base-content">
//             最後檢查時間：{new Date(status.checkTime).toLocaleString()}
//           </p>
//           {isError && (
//               <p className="text-xs text-red-500">
//                 目前無法連線到系統，顯示的是最後已知狀態
//               </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
