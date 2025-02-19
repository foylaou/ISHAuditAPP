import React, {useEffect, useState} from "react";
import * as Icons from "lucide-react";
import {initialNotifications} from "@/services/System/notoficationSevices";
import {
  NotificationItemProps,
  NotificationProps,
  NotificationState,
  NotificationType
} from "@/types/System/notificationType";

// 通知項目組件
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  type,
  bgColor,
  getIconComponent,
  removeNotification,
  markAsRead
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLongMessage = notification.message.length > 20;

  // 顯示的消息文本
  const displayMessage = isLongMessage && !expanded
    ? `${notification.message.substring(0, 50)}...`
    : notification.message;

  return (
    <li className={`${bgColor} border-b border-gray-100 last:border-b-0`}>
      <div className="flex items-start p-3 hover:bg-base-200 transition-colors">
        {/* 左側圖標 */}
        <div className="flex-shrink-0 mr-3 pt-1">
          {getIconComponent(notification.Icon, type)}
        </div>

        {/* 中間內容區 */}
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium truncate max-w-[150px]">{notification.name}</h4>

          </div>

          <div>
            <p className="text-sm text-info-content">{displayMessage}</p>

            {isLongMessage && (
              // 4. 顯示更多按鈕
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-secondary mt-1 hover:underline h-11 py-2 px-3"
                aria-label={expanded ? "收起更多內容" : "顯示更多內容"}
              >
                {expanded ? '收起' : '顯示更多'}
              </button>
            )}

            <p className="text-xs text-neutral-content mt-1 truncate">
              通知來源: {notification.fromTo}
            </p>
            <span className="text-xs text-neutral-content flex-shrink-0">時間：{notification.DateTime}</span>
          </div>
        </div>

        {/* 右側操作按鈕 - 左右排列，確保符合無障礙標準 */}
        <div className="flex flex-row items-center space-x-2 flex-shrink-0">
          {!notification.isRead && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="w-11 h-11 flex items-center justify-center bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-full"
              aria-label="標記為已讀"
            >
              <Icons.Eye size={16}/>
            </button>
          )}

          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600 w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="刪除通知"
          >
            <Icons.X size={16}/>
          </button>
        </div>
      </div>
    </li>
  );
};

export default function NotificationComponent(props: NotificationProps) {
  const { openMenuIndex, setOpenMenuIndex } = props;

  const getIconComponent = (iconName: string, type: NotificationType) => {
    const iconColors = {
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      danger: "text-error"
    };

    const color = iconColors[type];

    switch (iconName) {
      case 'Bell':
        return <Icons.Bell className={`${color}`} />;
      case 'Info':
        return <Icons.Info className={`${color}`} />;
      case 'CheckCircle':
        return <Icons.CheckCircle className={`${color}`} />;
      case 'AlertTriangle':
        return <Icons.AlertTriangle className={`${color}`} />;
      case 'AlertCircle':
        return <Icons.AlertCircle className={`${color}`} />;
      case 'MessageSquare':
        return <Icons.MessageSquare className={`${color}`} />;
      default:
        return <Icons.Info className={`${color}`} />;
    }
  };

  // 示例通知數據


  const [notificationState, setNotificationState] = useState<NotificationState>({
    notifications: initialNotifications,
    closed: true,
    refresh: false
  });

  const [notificationCount, setNotificationCount] = useState(0);

  // 菜單ID常量
  const NOTIFICATION_MENU_ID = 'notification';

  // 計算通知面板是否開啟
  const isPanelOpen = openMenuIndex === NOTIFICATION_MENU_ID;

  // 計算未讀通知
  useEffect(() => {
    const unreadCount = notificationState.notifications.filter(n => !n.isRead).length;
    setNotificationCount(unreadCount);
  }, [notificationState.notifications]);

  // 切換通知面板
  const toggleNotifications = () => {
    if (isPanelOpen) {
      setOpenMenuIndex(null);
    } else {
      setOpenMenuIndex(NOTIFICATION_MENU_ID);
    }
  };

  // 標記通知為已讀
  const markAsRead = (id: string) => {
    setNotificationState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    }));
  };

  // 標記所有為已讀
  const markAllAsRead = () => {
    setNotificationState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification => ({ ...notification, isRead: true }))
    }));
  };

  // 刪除通知
  const removeNotification = (id: string) => {
    setNotificationState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(notification => notification.id !== id)
    }));
  };

  // 獲取通知類型
  const getNotificationType = (iconName: string): NotificationType => {
    switch (iconName) {
      case 'CheckCircle':
        return 'success';
      case 'AlertTriangle':
        return 'warning';
      case 'AlertCircle':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
      <div className="relative font-sans">
        {/* 通知按鈕 */}
        <button
            onClick={toggleNotifications}
            className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="開啟通知面板"
        >
          <Icons.Bell size={24}/>
          {notificationCount > 0 && (
              <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {notificationCount}
    </span>
          )}
        </button>

        {/* 通知面板 */}
        {isPanelOpen && (
            <div
                className="absolute right-0 mt-2 w-96 bg-base-200 rounded-lg shadow-lg border border-base-200 overflow-hidden z-50">
              {/* 通知頭部 */}
              <div className="flex items-center justify-between px-4 py-3 bg-base-200 border-b border-base-200">
                <h3 className="font-medium">通知中心</h3>
                <div className="flex space-x-2">
                  {/*// 2. 全部標為已讀按鈕*/}
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="將所有通知標記為已讀"
                  >
                    全部標為已讀
                  </button>
                </div>
              </div>

              {/* 通知列表 */}
              <div className="max-h-96 overflow-y-auto">
                {notificationState.notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      沒有通知
                    </div>
                ) : (
                    <ul>
                      {notificationState.notifications.map(notification => {
                        const type = getNotificationType(notification.Icon);
                        const bgColor = notification.isRead ? 'bg-base-100' : 'bg-base-300';

                        return (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                type={type}
                                bgColor={bgColor}
                                getIconComponent={getIconComponent}
                                removeNotification={removeNotification}
                                markAsRead={markAsRead}
                            />
                        );
                      })}
                    </ul>
                )}
              </div>

              {/* 通知底部 */}
              <div className="px-4 py-3 bg-base-200 border-t border-base-100 text-center">
                {/*// 3. 關閉按鈕*/}
                <button
                  onClick={toggleNotifications}
                  className="text-sm text-base-content hover:text-neutral-content min-h-[44px] min-w-[44px] px-3 py-2"
                  aria-label="關閉通知面板"
                >
                  關閉
                </button>
              </div>
            </div>
        )}
      </div>
  );
}
