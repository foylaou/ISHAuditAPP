import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {DateRange, Range, RangeKeyDict} from 'react-date-range';
import { useState, useRef, useEffect } from 'react';
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import zhTW from 'date-fns/locale/zh-TW'; // 改用 date-fns 的繁體中文語言包
import {format, startOfYear} from 'date-fns'; // 正確導入 format


interface DateRangeState extends Range {
  startDate: Date| undefined;  // 改為可為 null
  endDate: Date| undefined;  // 改為可為 null
  key: string;
}
interface DateRangePickerProps {
  onChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
}
const DateRangePicker = ({ onChange }: DateRangePickerProps) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeState[]>([
    {
      startDate: undefined,     // 初始值設為 null
      endDate: undefined,       // 初始值設為 null
      key: 'selection',
    },
  ]);

  // 添加點擊外部關閉日曆的功能
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

  // 格式化日期顯示
  const formatDateRange = () => {
    const { startDate, endDate } = dateRange[0];
    if (startDate && endDate) {
      return `${format(startDate, 'yyyy/MM/dd', { locale: zhTW })} - ${format(endDate, 'yyyy/MM/dd', { locale: zhTW })}`;
    }
    return '請選擇日期';  // 當日期為空時顯示的文字
  };

  const handleSelect = (item: RangeKeyDict) => {
    const selection = item.selection;
    const newRange = {
      startDate: selection.startDate || undefined,
      endDate: selection.endDate || undefined,
      key: 'selection'
    };
    setDateRange([newRange]);
    // 觸發回調
    onChange?.(newRange.startDate, newRange.endDate);
  };
return (
  <div className="relative">
    <div className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded-lg"
         onClick={() => setOpenCalendar(!openCalendar)}>
      <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
      <span className="text-sm">{formatDateRange()}</span>
    </div>

    {openCalendar && (
      <div ref={calendarRef}
           className="absolute z-50 mt-1 bg-base-100 shadow-xl rounded-lg overflow-hidden
                     sm:right-0
                     md:right-auto
                     max-w-[calc(100vw-2rem)]
                     md:max-w-none">
        <DateRange
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          months={window.innerWidth >= 768 ? 1 : 1} // 手機顯示1個月，桌面顯示2個月
          direction={window.innerWidth >= 768 ? "horizontal" : "vertical"} // 手機垂直排列，桌面水平排列
          locale={zhTW}
          weekStartsOn={1}
          rangeColors={['#7294ca']}
          minDate={startOfYear(new Date(2016, 0, 1))}
          maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
          className="sm:scale-90 md:scale-100" // 在小螢幕上稍微縮小
        />
      </div>
    )}
  </div>
);
};

export default DateRangePicker;
