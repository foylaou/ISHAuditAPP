import {Notification} from  "@/types/System/notificationType";

export const initialNotifications: Notification[] = [
    {
      id: '1',
      name: '系統通知',
      Icon: 'Info',
      message: '您的帳戶已成功更新',
      isRead: false,
      fromTo: '系統',
      DateTime: '02-19 09:30'
    },
    {
      id: '2',
      name: '任務完成',
      Icon: 'CheckCircle',
      message: '您的文件已成功上傳',
      isRead: true,
      fromTo: '文件系統',
      DateTime: '02-19 08:15'
    },
    {
      id: '3',
      name: '警告',
      Icon: 'AlertTriangle',
      message: '您的儲存空間即將用完，請及時清理檔案或升級您的儲存方案。如需協助，請聯繫客服團隊，我們將竭誠為您服務。idjiodjoqwjdwqjodjqw',
      isRead: false,
      fromTo: '存儲管理器',
      DateTime: '02-18 23:45'
    },
    {
      id: '4',
      name: '錯誤報告',
      Icon: 'AlertCircle',
      message: '您的上一個操作未能完成',
      isRead: false,
      fromTo: '錯誤監控',
      DateTime: '02-18 17:20'
    },
    {
      id: '5',
      name: '新消息',
      Icon: 'MessageSquare',
      message: '您有一條來自管理員的新消息',
      isRead: false,
      fromTo: '管理員',
      DateTime: '02-18 14:10'
    }
  ];
