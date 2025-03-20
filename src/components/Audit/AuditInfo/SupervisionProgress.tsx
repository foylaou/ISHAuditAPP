import React, { useState, useMemo } from 'react';
import AuditDetailModal from "@/components/Audit/AuditInfo/AuditDetailModal";
import { Button } from "@mantine/core";

// 時間線項目的介面定義
interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  createuesr: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

// 新增督導資料的介面定義
export interface AuditDetail {
  id: number;
  auditBasicId: number;
  startDate: string;
  endDate: string;
  enterTypeId: number;
  enterTypeName: string;
  reportFileId: number | null;
  reportFileName: string | null;
  reportFileUrl: string | null;
  createTime: string;
  createUser: string | null;
}

interface SupervisionProgressProps {
  auditDetails?: AuditDetail[] | null | undefined;
  onCreateDetail?: () => void;
  variant?: 'standard' | 'alternating' | 'compact';
  className?: string;
  cardClassName?: string;
}

// 狀態圖標組件
const StatusIcon = ({ status }: { status?: string }) => {
  // 根據不同狀態返回不同顏色和圖標
  let iconPath;
  let colorClass;

  switch (status) {
    case 'completed':
      colorClass = 'text-success';
      iconPath = (
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd" />
      );
      break;
    case 'failed':
      colorClass = 'text-error';
      iconPath = (
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd" />
      );
      break;
    case 'processing':
      colorClass = 'text-primary';
      iconPath = (
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.59L4.95 9.77a.75.75 0 10.5 1.06l5.25 3.12c.334.199.75-.04.75-.42v-8.5z"
          clipRule="evenodd" />
      );
      break;
    default:
      colorClass = 'text-info';
      iconPath = (
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
          clipRule="evenodd" />
      );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 ${colorClass}`}>
      {iconPath}
    </svg>
  );
};

// 日期格式化函數
const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    console.error('日期格式化錯誤:', error);
    return dateString;
  }
};

export default function SupervisionProgress({
  auditDetails,
  onCreateDetail,
  variant = 'standard',
  className = '',
  cardClassName = ''
}: SupervisionProgressProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 將 AuditDetail 轉換為 TimelineItem
  const convertToTimelineItems = (details: AuditDetail[]): TimelineItem[] => {
    return details.map(detail => {
      // 建立描述文字
      let description = '';
      let createuesr = '';
      // 檢查是否有日期範圍
      if (detail.startDate && detail.endDate) {
        const startDate = formatDate(detail.startDate);
        const endDate = formatDate(detail.endDate);
        const dateText = startDate === endDate
          ? `日期: ${startDate}`
          : `日期範圍: ${startDate} ~ ${endDate}`;

        description += dateText;
      }

      // 檢查是否有報告
      if (detail.reportFileName) {
        description += description ? '\n' : '';
        description += `督導報告: ${detail.reportFileName}`;
      } else {
        description += description ? '\n' : '';
        description += '督導報告: 無';
      }

      // 確定狀態
      let status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending';
      if (detail.reportFileId) {
        status = 'completed';
      } else if (new Date(detail.startDate) < new Date()) {
        status = 'processing';
      }
      if (detail.createUser) {
        createuesr += detail.createUser;
      }else {
        createuesr += "不可考";
      }
      return {
        id: detail.id.toString(),
        date: formatDate(detail.startDate),
        title: detail.enterTypeName,
        description,
        status,
        createuesr,
      };
    });
  };

  // 轉換督導資料為時間線項目，並使用 useMemo 優化計算
  const timelineItems = useMemo(() => {
    if (!auditDetails || auditDetails.length === 0) return [];
    return convertToTimelineItems(auditDetails);
  }, [auditDetails]);

  // 處理新增督導歷程的點擊事件
  const handleCreateDetail = () => {
    // 無論是否提供外部處理函數，都先將模態框設為打開
    setIsModalOpen(true);

    // 如果有提供外部處理函數，也執行它
    if (onCreateDetail) {
      onCreateDetail();
    }
  };

  // 定義表單提交的數據結構
  interface SubmitData {
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    enterTypeId: string | number;
  }

  // 處理 Modal 提交的函數
  const handleSubmit = (data: SubmitData) => {
    console.log("表單數據:", data);
    // 在這裡處理提交的數據，例如發送到後端

    // 完成後關閉 modal
    setIsModalOpen(false);
  };

  // 根據變種選擇適當的時間線類名
  const getTimelineClassName = () => {
    const baseClass = 'timeline timeline-vertical';

    switch(variant) {
      case 'compact':
        return `${baseClass} timeline-snap-icon max-md:timeline-compact`;
      case 'alternating':
        return `${baseClass} max-md:timeline-compact`;
      case 'standard':
      default:
        return `${baseClass} justify-start w-full`;
    }
  };

  // 渲染時間線項目
  const renderTimelineItem = (item: TimelineItem, index: number) => {
    // 判斷是否需要前後分隔線
    const showHrBefore = index !== 0;
    const showHrAfter = index !== timelineItems.length - 1;
    const hrClass = item.status === 'completed' ? 'bg-success' : '';

    switch(variant) {
      case 'alternating':
        // 交替式佈局 - 偶數項在左側，奇數項在右側
        return (
          <li key={item.id}>
            {showHrBefore && <hr className={hrClass} />}

            {index % 2 === 0 ? (
              // 偶數項 - 內容在左
              <>
                <div className="timeline-start timeline-box">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <time className="font-mono text-xs block mt-1">{item.date}</time>
                  <p className="text-sm mt-1 whitespace-pre-line">{item.description}</p>
                </div>
                <div className="timeline-middle">
                  <StatusIcon status={item.status} />
                </div>
              </>
            ) : (
              // 奇數項 - 內容在右
              <>
                <div className="timeline-middle">
                  <StatusIcon status={item.status} />
                </div>
                <div className="timeline-end timeline-box">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <time className="font-mono text-xs block mt-1">{item.date}</time>
                  <p className="text-sm mt-1 whitespace-pre-line">{item.description}</p>
                </div>
              </>
            )}

            {showHrAfter && <hr className={hrClass} />}
          </li>
        );

      case 'compact':
        // 緊湊式佈局 - 所有內容都在右側
        return (
          <li key={item.id}>
            {showHrBefore && <hr className={hrClass} />}

            <div className="timeline-middle">
              <StatusIcon status={item.status} />
            </div>

            <div className="timeline-end">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{item.title}</h3>
                <time className="font-mono text-xs text-gray-500">{item.date}</time>
              </div>
              <p className="text-sm mt-1 whitespace-pre-line">{item.description}</p>
            </div>

            {showHrAfter && <hr className={hrClass} />}
          </li>
        );

      case 'standard':
      default:
        // 標準佈局 - 時間在左，內容在右
        return (
            <li key={item.id} className="relative">
              {showHrBefore && <hr className={hrClass}/>}

              <div className="timeline-start font-mono text-xs md:text-sm">{item.date}</div>

              <div className="timeline-middle">
                <StatusIcon status={item.status}/>
              </div>

              <div className="timeline-end timeline-box w-full md:w-4/5 p-3 md:p-4">
                <h3 className="font-bold text-sm md:text-lg">{item.title}</h3>
                <p className="text-xs md:text-sm mt-1 whitespace-pre-line">{item.description}</p>

                {/* Buttons container */}
                <div className="mt-3 flex flex-col sm:flex-row w-full gap-2 sm:justify-between lg:justify-between">
                  {/* Left buttons group - always aligned to the left */}
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-primary btn-xs sm:btn-xs md:btn-sm w-full sm:w-auto">匯入督導數據</button>
                    <button className="btn btn-error btn-xs sm:btn-xs md:btn-sm w-full sm:w-auto">刪除督導數據</button>
                  </div>

                  {/* Right button - always aligned to the right on desktop */}
                  <button className="btn btn-success btn-xs sm:btn-xs md:btn-sm w-full sm:w-auto ml-auto">上傳督導報告</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs mt-2 md:text-xs text-neutral-content">建立人員：{item.createuesr}</p>
                </div>
              </div>

              {showHrAfter && <hr className={hrClass}/>}
            </li>
        );
    }
  };

  return (
      <div className={`card bg-base-200  ${cardClassName}`}>
        <div className="card-body p-3 md:p-6">
          <div className={`w-full ${className}`}>
            <div className="flex justify-end mb-4">
              <button
                  className="btn btn-primary btn-sm md:btn-md"
                  onClick={handleCreateDetail}
              >
                新增督導歷程
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              {timelineItems.length > 0 ? (
                  <ul className={getTimelineClassName()}>
                    {timelineItems.map((item, index) => renderTimelineItem(item, index))}
                  </ul>
              ) : (
                  <div className="flex justify-center items-center p-8 text-gray-500">
                    尚無督導歷程記錄
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* 使用 AuditDetailModal 組件 */}
        <AuditDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
        />
      </div>
  );
}
