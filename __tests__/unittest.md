目錄結構：


__tests__/: 所有測試文件放在這個目錄下
測試文件通常按照源碼的目錄結構進行組織，如 components/, pages/, utils/ 等
測試文件命名規則為 *.test.tsx 或 *.test.ts


主要配置文件：


jest.config.js: Jest 的主要配置文件，設置測試環境、文件轉換規則等
jest.setup.js: 測試環境的全局設置，如引入 @testing-library/jest-dom


常用的測試工具：


@testing-library/react: React 元件測試的主要工具
@testing-library/jest-dom: 提供額外的 DOM 斷言方法
@testing-library/user-event: 模擬用戶事件


如何寫測試：


元件測試：主要測試渲染結果和互動行為
API 測試：測試 API 路由的請求處理
工具函數測試：測試純函數的輸入輸出
