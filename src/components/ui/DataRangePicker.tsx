import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import zhTW from 'date-fns/locale/zh-TW'; // 使用 date-fns 的繁體中文語言包
import { format, startOfYear } from 'date-fns';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // 正確導入 format
import {
  faCalendarDays,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";

interface DateRangeState extends Range {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

interface DateRangePickerProps {
  onChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const DateRangePicker = ({ onChange }: DateRangePickerProps) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeState[]>([
    {
      startDate: undefined,
      endDate: undefined,
      key: 'selection',
    },
  ]);
  const [isDetailTimeOn, setIsDetailTimeOn] = useState(false); // 開關狀態
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setOpenCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpenCalendar(!openCalendar);
    }
    if (event.key === 'Escape' && openCalendar) {
      setOpenCalendar(false);
    }
  };

  const formatDateRange = () => {
    const { startDate, endDate } = dateRange[0];
    if (startDate && endDate) {
      return `${format(startDate, 'yyyy/MM/dd', { locale: zhTW })} - ${format(endDate, 'yyyy/MM/dd', { locale: zhTW })}`;
    }
    return '請選擇日期';
  };

  const handleSelect = (item: RangeKeyDict) => {
    const selection = item.selection;
    const newRange = {
      startDate: selection.startDate || undefined,
      endDate: selection.endDate || undefined,
      key: 'selection',
    };
    setDateRange([newRange]);
    onChange?.(newRange.startDate, newRange.endDate);
  };

  const yearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2017; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years;
  };

  return (
      <div>
        <div className="flex items-center gap-4 mt-4 mb-4">
          <label htmlFor="toggle-detail-time" className="flex cursor-pointer items-center gap-2">
            <FontAwesomeIcon icon={faCalendarWeek} />
            <input
                id="toggle-detail-time"
                type="checkbox"
                checked={isDetailTimeOn}
                onChange={() => setIsDetailTimeOn(!isDetailTimeOn)}
                className="toggle theme-controller"
            />
          <FontAwesomeIcon icon={faCalendarDays} />
          </label>
        </div>


        {isDetailTimeOn ? (

            <div className="relative">
              <label htmlFor="year-selector">督導年份範圍</label>
              <div
                  tabIndex={0}
                  role="button"
                  aria-label="選擇日期範圍"
                  onKeyDown={handleKeyDown}
                  className="input input-bordered flex items-center gap-2 cursor-pointer hover:bg-base-200 w-full"
                  onClick={() => setOpenCalendar(!openCalendar)}
              >
                <Calendar className="h-4 w-4 text-base-content opacity-70"/>
                <span className="flex-1 text-base-content">{formatDateRange()}</span>
                按下
<kbd className="kbd kbd-sm">Enter</kbd>
選擇

              </div>

              {openCalendar && (
                  <div
                      ref={calendarRef}
                      className="mb-4 absolute z-50 mt-1 bg-base-100 shadow-xl rounded-lg overflow-hidden sm:right-0 md:right-auto max-w-[calc(100vw-2rem)] md:max-w-none"
                  >
                    <DateRange
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        months={window.innerWidth >= 768 ? 2 : 1}
                        direction={window.innerWidth >= 768 ? 'horizontal' : 'vertical'}
                        locale={zhTW}
                        weekStartsOn={1}
                        rangeColors={['#7294ca']}
                        minDate={startOfYear(new Date(2016, 0, 1))}
                        maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                        className="sm:scale-90 md:scale-100"
                    />
                  </div>
              )}
              <div className="m-4">
              按下
<kbd className="kbd kbd-sm">Esc</kbd>
退出
                </div>
            </div>

        ) : (
            <div>
              <label htmlFor="year-selector" className="block mb-2">選擇年份</label>
              <select id="year-selector" className="select select-bordered w-full" defaultValue="">
                <option value="" disabled>
                  --請選擇--
                </option>
                {yearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year} 年
                    </option>
                ))}
              </select>
            </div>
        )}
      </div>

  );
};

export default DateRangePicker;
