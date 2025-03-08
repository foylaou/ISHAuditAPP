import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
      <footer className="bg-footer-bg text-white py-4">
        {/* 導盲磚 */}
        <a accessKey="z" href="#z" title="頁尾內容區塊"
           className="bg-footerbg text-base-300 ml-2">
          :::
        </a>

        <div className="container mx-auto px-4">
          <div className="space-y-2">
            {/* 主要資訊區 */}
            <div className="space-y-2 border-b border-white/10 pb-2">
              <p className="text-xs text-gray-300">
                ※本網所提供之電子檔案部分為 .PDF 格式，如無法閱讀，請自行下載安裝免費軟體
                <a href="https://get.adobe.com/tw/reader/"
                   className="inline-block text-blue-300 hover:text-blue-200 underline transition-colors py-3 px-2 -my-3 -mx-2" // 增加內邊距但抵消外部間距
                   target="_blank"
                   rel="noopener noreferrer">
                  「中文版 Adobe PDF Reader」
                </a>。
              </p>

              <div className="text-xs text-gray-300">
                <p className="py-1">
                  本網站由經濟部產業發展署「工業安全智慧化輔導計畫」之委辦單位「中華民國工業安全衛生協會」維護管理。
                </p>
                <p className="italic py-1">
                  This site, sponsored by IDA/MOEA, was created and is maintained by the ISHA.
                </p>
              </div>

              <p className="text-xs text-gray-300 py-1">
                本網站最佳瀏覽環境為 1024 x 768 視窗模式以上，支援 IE 11.0 含以上版本、Firefox、Chrome、Safari 等最新版本瀏覽器。
              </p>
            </div>

            {/* 導覽連結區 */}
            <div className="flex justify-between items-center pt-1">
              <Link
                  href="/sitemap"
                  className="text-xs text-gray-300 hover:text-white transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-white/50 rounded-sm min-h-[44px] min-w-[44px] flex items-center px-3" // 確保最小點擊區域
              >
                網站導覽
              </Link>
              <Link
                  href="/help"
                  className="text-xs text-gray-300 hover:text-white transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-white/50 rounded-sm min-h-[44px] min-w-[44px] flex items-center px-3" // 確保最小點擊區域
              >
                操作說明
              </Link>
              <Link
                  href="/about"
                  className="text-xs text-gray-300 hover:text-white transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-white/50 rounded-sm min-h-[44px] min-w-[44px] flex items-center px-3" // 確保最小點擊區域
              >
                關於我們
              </Link>
              <Link
                  href="/contect"
                  className="text-xs text-gray-300 hover:text-white transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-white/50 rounded-sm min-h-[44px] min-w-[44px] flex items-center px-3" // 確保最小點擊區域
              >
                聯絡我們
              </Link>
            </div>
          </div>
        </div>
      </footer>
  );
}
