// 匯入 Jest 的型別和 Next.js 提供的 Jest 配置工具
import type { Config } from 'jest'; // Jest 的型別定義
import nextJest from 'next/jest';  // Next.js 的 Jest 配置工具

// 創建一個 Jest 配置，指向專案的根目錄
const createJestConfig = nextJest({
  dir: './', // 根目錄路徑
});

// 自定義 Jest 配置
const customJestConfig: Config = {
  // 指定測試環境，使用模擬瀏覽器的環境（適用於 React 相關測試）
  testEnvironment: 'jest-environment-jsdom',

  // 在每個測試環境設置完成後執行的檔案（用於初始化設定）
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // 模組名稱映射，便於使用簡潔的路徑引入模組
  moduleNameMapper: {
    // 支援絕對路徑的簡化引入，例如 @/components 會對應到 <rootDir>/src/components
    '^@/(.*)$': '<rootDir>/src/$1',
    // 處理 CSS 模組等靜態資源的導入，避免測試時因為樣式導致錯誤
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // 指定檔案轉換器，將 TypeScript 檔案轉換成 Jest 可執行的 JavaScript
  transform: {
    // 對 TypeScript (ts, tsx) 檔案使用 ts-jest 進行編譯
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        // 使用特定的 TypeScript 配置檔案
        tsconfig: 'tsconfig.jest.json',
        // 啟用模組隔離，提升測試性能
        isolatedModules: true,
        // 忽略某些診斷錯誤，避免影響測試（如 TS151001）
        diagnostics: {
          ignoreCodes: ['TS151001'],
        },
      },
    ],
  },

  // 最大工作進程數，設定為 1 可減少記憶體消耗
  maxWorkers: 1,

  // 測試超時時間，避免長時間運行的測試影響執行
  testTimeout: 10000,

  // 最大同時執行測試數，設定為 1 可減少系統資源消耗
  maxConcurrency: 1,

  // 全域變數設定，提供給 ts-jest 使用的參數
  globals: {
    'ts-jest': {
      isolatedModules: true, // 確保模組隔離
    },
  },

  // 設定是否詳細顯示測試過程輸出，`false` 減少輸出
  verbose: false,

  // 當第一個測試失敗時立即停止測試執行
  bail: true,
};

// 將自定義的 Jest 配置傳遞給 Next.js 的 Jest 配置工具
export default createJestConfig(customJestConfig);
