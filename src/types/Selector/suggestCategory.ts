/**
 * 建議分類大類別介面
 * @interface SuggestCategory
 */
export interface SuggestCategory {
  /**
   * 分類的唯一識別碼
   * @type {string}
   */
  id: string;

  /**
   * 建議大類別
   * @type {string}
   */
  name: string;

  /**
   * 子分類清單，包含多個中類別建議
   * @type {SuggestType[]}
   */
  child: SuggestType[];
}
/**
 * 建議分類中類別介面
 * @interface SuggestType
 */
export interface SuggestType {
    /**
   * 分類的唯一識別碼
   * @type {string}
   */
  id: string;
    /**
   * 建議中類別
   * @type {string}
   */
  name: string;
    /**
   * 子分類清單，包含多個小類別建議
   * @type {SuggestType[]}
   */
  child: SuggestItem[];
}

/**
 * 建議分類小類別介面
 * @interface SuggestItem
 */
export interface SuggestItem {
  /**
   * 分類的唯一識別碼
   * @type {string}
   */
  id: string;
  /**
   * 建議小類別
   * @type {string}
   */
  name: string;

}

export interface SuggestCategoryForm{
  suggestCategoryId: string;
  suggestTypeId: string;
  suggestItemId: string;
}
