

/**
 * 將 ISO 格式的日期字串轉換為台灣地區的日期時間格式（YYYY/MM/DD HH:mm）。
 *
 * @param {string} isoString - ISO 格式的日期字串（例如 "2024-02-14T15:30:00Z"）。
 * @returns {string} 格式化後的日期時間字串（例如 "2024/02/14"）。
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false
  }).format(date);
};


/**
 * 將 ISO 格式的日期字串轉換為台灣地區的日期時間格式（YYYY/MM/DD HH:mm）。
 *
 * @param {string} isoString - ISO 格式的日期字串（例如 "2024-02-14T15:30:00Z"）。
 * @returns {string} 格式化後的日期時間字串（例如 "2024/02/14 23:30"）。
 */
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};


/**
 * 將 ISO 格式的日期字串轉換為台灣民國年格式的日期時間（YYY/MM/DD HH:mm）。
 *
 * @param {string} isoString - ISO 格式的日期字串（例如 "2024-02-14T15:30:00Z"）。
 * @returns {string} 格式化後的民國年日期時間字串（例如 "113/02/14 23:30"）。
 */
export const formatDateTimeROC = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear() - 1911; // 轉換為民國年
  const formattedDate = new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);

  return `${year}/${formattedDate}`;
};

/**
 * 將 ISO 格式的日期（YYYY-MM-DD）轉換為台灣民國年格式（民國YYY年M月D日）。
 *
 * @param {string} isoDate - ISO 格式的日期字串（例如 "2021-05-10"）。
 * @returns {string} 格式化後的民國年日期字串（例如 "民國110年5月10日"）。
 */
export const formatISOToROC = (isoDate: string): string => {
  const date = new Date(isoDate);
  const rocYear = date.getFullYear() - 1911; // 計算民國年
  const month = date.getMonth() + 1; // getMonth() 從 0 開始，所以 +1
  const day = date.getDate();

  return `民國${rocYear}年${month}月${day}日`;
};
