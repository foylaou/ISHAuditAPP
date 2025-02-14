// types/Selector/citiesName.ts

/**
 * 城市資訊介面
 * 代表台灣的城市層級（如台北市、新北市等）
 *
 * @interface CityInfo
 * @member {string} id 城市唯一識別碼
 * @member {string} name 城市名稱
 * @member {Townships[]} child 該城市下的所有鄉鎮區
 */
export interface CityInfo {
  id: string;
  name: string;
  child: Townships[];
}

/**
 * 鄉鎮區介面
 * 代表城市下的行政區（如信義區、中正區等）
 *
 * @interface Townships
 * @member {string} id 鄉鎮區唯一識別碼
 * @member {string} name 鄉鎮區名稱
 * @member {IndustrialAreas[]} child 該鄉鎮區下的所有工業區
 */
export interface Townships {
  id: string;
  name: string;
  child: IndustrialAreas[];
}

/**
 * 工業區介面
 * 代表鄉鎮區下的工業區
 *
 * @interface IndustrialAreas
 * @member {string} id 工業區唯一識別碼
 * @member {string} name 工業區名稱
 */
export interface IndustrialAreas {
  id: string;
  name: string;
  // 更多層級可以擴展的備註
}

/**
 * 城市資訊表單介面
 * 用於儲存或傳遞選擇的城市、鄉鎮區、工業區的識別碼
 *
 * @interface CityInfoForm
 * @member {string} cityInfoId 選擇的城市識別碼
 * @member {string} townshipsId 選擇的鄉鎮區識別碼
 * @member {string} industrialareasId 選擇的工業區識別碼
 */
export interface CityInfoForm{
  cityInfoId: string;
  townshipsId: string;
  industrialareasId: string;
}
