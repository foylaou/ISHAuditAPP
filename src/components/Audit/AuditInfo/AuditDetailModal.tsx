import { JSX, useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { startOfYear } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // 主要樣式
import "react-date-range/dist/theme/default.css"; // 主題樣式
import { auditQueryService } from "@/services/Audit/auditQueryService";
import {toast} from 'react-toastify';
import {useGlobalStore} from "@/store/useGlobalStore";

// 修正接口定義
interface AuditDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SubmitData) => void;
}

// 提交數據的接口
interface SubmitData {
    dateRange: {
        start: Date | null;
        end: Date | null;
    };
    enterTypeId: string | number;
}

// 詳細類型定義
export interface DetailType {
    id: number;
    name: string;
}

export default function AuditDetailModal({ isOpen, onClose, onSubmit }: AuditDetailModalProps): JSX.Element {
  // 使用 DateRange 組件的狀態
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const {theme} =useGlobalStore();
  const [enterType, setEnterType] = useState<string>('');
  const [enterTypeOptions, setEnterTypeOptions] = useState<DetailType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 這裡加載督導類型的選項
    const fetchEnterTypes = async () => {
      if (!isOpen) return; // 只有當模態框開啟時才加載數據

      setIsLoading(true);
      setError(null);

      try {
        // 嘗試從服務獲取數據
        const types: DetailType[] = await auditQueryService.GetEnterType();
        setEnterTypeOptions(types);
      } catch (error) {
        console.error('加載督導類型失敗', error);
        setError('無法加載督導類型，請稍後再試');

      } finally {
        setIsLoading(false);
      }
    };

    fetchEnterTypes();
  }, [isOpen]); // 依賴於isOpen，確保每次打開模態框時都重新加載

  // 處理日期範圍的選擇
  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    if (rangesByKey.selection) {
      setDateRange([rangesByKey.selection]);
    }
  };

  const handleCreateAuditDetail = () => {
    // 驗證表單
    if (!dateRange[0].startDate || !dateRange[0].endDate || !enterType) {
      toast.warn('請填寫所有必填欄位')

      return;
    }

    // 提交表單數據
    onSubmit({
      dateRange: {
        start: dateRange[0].startDate,
        end: dateRange[0].endDate
      },
      enterTypeId: enterType
    });

    // 清空表單
    resetForm();
  };

  const resetForm = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    setEnterType('');
  };

  // 如果modal不開啟，不渲染內容
  if (!isOpen) return <></>;

  return (
    <>
      {/* 使用固定定位覆蓋整個屏幕，確保模態框顯示 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-base-100 bg-opacity-50">
        <div className="relative w-full max-w-4xl mx-auto my-6">
          <div className="relative flex flex-col w-full bg-base-200 border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            {/* 標題 */}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-xl font-semibold">建立督導歷程</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-70 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  &times;
                </span>
              </button>
            </div>

            {/* 內容 */}
            <div className="relative p-6 flex-auto">
              {isLoading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">加載中...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">督導起訖時間 (必填)</span>
                  </label>
                  <div className="flex justify-center">
                    <div className={`date-range-wrapper ${theme ? 'dark-mode' : 'light-mode'}`}>
                      <DateRange
                          onChange={handleDateRangeSelect}
                          moveRangeOnFirstSelection={false}
                          ranges={dateRange}
                          months={window.innerWidth >= 768 ? 2 : 1}
                          direction={window.innerWidth >= 768 ? 'horizontal' : 'vertical'}
                          locale={zhTW}
                          weekStartsOn={1}
                          rangeColors={['#7294ca']}
                          minDate={startOfYear(new Date(2016, 0, 1))}
                          maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                          className={`sm:scale-90 md:scale-100 ${theme ? 'date-range-dark' : ''}`}
                      />
                    </div>
                  </div>
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                    <span className="label-text">督導類型 (必填)</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={enterType}
                    onChange={(e) => setEnterType(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">-- 請選擇 --</option>
                    {enterTypeOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 按鈕 */}
            <div className="flex items-center justify-between p-6 border-t border-solid border-gray-300 rounded-b">
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                關閉
              </button>
              <button
                className="btn btn-success"
                type="button"
                onClick={handleCreateAuditDetail}
                disabled={isLoading}
              >
                建立
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
