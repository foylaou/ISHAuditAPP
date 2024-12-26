// types/Selector/citiesName.ts

/**
 * 城市資訊介面
 * 代表台灣的城市層級（如台北市、新北市等）
 */
export interface CityInfo {
  /** 城市唯一識別碼 */
  id: string;
  /** 城市名稱 */
  name: string;
  /** 該城市下的所有鄉鎮區 */
  child: Townships[];
}

/**
 * 鄉鎮區介面
 * 代表城市下的行政區（如信義區、中正區等）
 */
export interface Townships {
  /** 鄉鎮區唯一識別碼 */
  id: string;
  /** 鄉鎮區名稱 */
  name: string;
  /** 該鄉鎮區下的所有工業區 */
  child: IndustrialAreas[];
}

/**
 * 工業區介面
 * 代表鄉鎮區下的工業區
 */
export interface IndustrialAreas {
  /** 工業區唯一識別碼 */
  id: string;
  /** 工業區名稱 */
  name: string;
  // 如果未來需要更多層級可以擴展，例如：
  // child?: SubArea[];  // 子區域
  // address?: string;   // 詳細地址
  // coordinates?: {     // 地理座標
  //   latitude: number;
  //   longitude: number;
  // };
}

export interface CityInfoForm{
  cityInfoId: string;
  townshipsId: string;
  industrialareasId: string;
}
