在 Next.js 中，store 資料夾通常用來存放狀態管理相關的檔案，例如 Zustand、Redux 或其他狀態管理工具的配置檔案。

建議的資料夾結構

將 store 放置在 src 目錄下的 store 資料夾中，這樣專案結構更清晰：

/src
  ├── app            // Next.js 頁面目錄
  ├── components     // 共用組件
  ├── store          // 狀態管理目錄
  │     └── useGlobalStore.ts
  ├── styles         // CSS 檔案
  └── pages          // 如果有 pages router

創建 Zustand 狀態檔案

	1.	創建 store 資料夾
在 src 目錄下新增一個資料夾命名為 store。
	2.	新增 useGlobalStore.ts
在 store 目錄中建立 useGlobalStore.ts 來存放全域狀態。

路徑: src/store/useGlobalStore.ts

引入全域狀態

在 任何組件 中使用 Zustand 的全域狀態時，可以這樣引入：

import { useGlobalStore } from '@/store/useGlobalStore';

export default function ExampleComponent() {
  const { isLoggedIn, login, logout } = useGlobalStore();

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={logout}>登出</button>
      ) : (
        <button
          onClick={() =>
            login({ sys: 'admin', org: 'admin', audit: 'admin' })
          }
        >
          登入
        </button>
      )}
    </div>
  );
}

匯入全域狀態到 RootLayout

你也可以在 RootLayout.tsx 或 app/layout.tsx 中引用全域狀態：

'use client';

import { useGlobalStore } from '@/store/useGlobalStore';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = useGlobalStore((state) => state.theme);

  return (
    <html lang="zh" data-theme={theme ? 'dark' : 'light'}>
      <body>
        {children}
      </body>
    </html>
  );
}

最終資料夾結構範例：

/src
  ├── app
  │     ├── layout.tsx
  │     └── page.tsx
  ├── components
  │     ├── HeaderMenu.tsx
  │     └── Footer.tsx
  ├── store
  │     └── useGlobalStore.ts
  ├── styles
  │     ├── globals.css
  │     └── HeaderMenu.module.css
  └── pages

這樣將 store 放在 src/store 資料夾中，便於管理並符合 Next.js 的結構標準。
