// types/Suggest/suggestCategory.ts

/**
 * 建議分類大類別介面
 * 用於描述建議系統中的最高層次分類。
 *
 * @interface SuggestCategory
 * @member {string} id 分類的唯一識別碼
 * @member {string} name 建議大類別的名稱
 * @member {SuggestType[]} child 子分類清單，包含多個中類別建議
 */
export interface SuggestCategory {
  id: string;
  name: string;
  child: SuggestType[];
}

/**
 * 建議分類中類別介面
 * 用於描述建議系統中的中間層次分類。
 *
 * @interface SuggestType
 * @member {string} id 分類的唯一識別碼
 * @member {string} name 建議中類別的名稱
 * @member {SuggestItem[]} child 子分類清單，包含多個小類別建議
 */
export interface SuggestType {
  id: string;
  name: string;
  child: SuggestItem[];
}

/**
 * 建議分類小類別介面
 * 用於描述建議系統中的最底層分類。
 *
 * @interface SuggestItem
 * @member {string} id 分類的唯一識別碼
 * @member {string} name 建議小類別的名稱
 */
export interface SuggestItem {
  id: string;
  name: string;
}

/**
 * 建議分類表單介面
 * 用於儲存或傳遞選擇的大類別、中類別、小類別的識別碼。
 *
 * @interface SuggestCategoryForm
 * @member {string} suggestCategoryId 選擇的大類別識別碼
 * @member {string} suggestTypeId 選擇的中類別識別碼
 * @member {string} suggestItemId 選擇的小類別識別碼
 */
export interface SuggestCategoryForm{
  suggestCategoryId: string;
  suggestTypeId: string;
  suggestItemId: string;
}
