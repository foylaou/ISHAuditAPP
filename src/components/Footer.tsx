import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-footerbg text-white py-4">
      {/* 導盲磚 */}
      <a href="#d"
         accessKey="d"
         className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:p-4 focus:text-black hover:bg-gray-100 transition-colors">
        頁尾區塊
      </a>

      <div className="container mx-auto px-4">
        <div className="space-y-2">
          {/* 主要資訊區 */}
          <div className="space-y-2 border-b border-white/10 pb-2">
            <p className="text-xs text-gray-300">
              ※本網所提供之電子檔案部分為 .PDF 格式，如無法閱讀，請自行下載安裝免費軟體
              <a href="https://get.adobe.com/tw/reader/"
                 className="text-blue-300 hover:text-blue-200 underline transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                「中文版 Adobe PDF Reader」
              </a>。
            </p>

            <div className="text-xs text-gray-300">
              <p>
                本網站由經濟部產業發展署「工業安全智慧化輔導計畫」之委辦單位「中華民國工業安全衛生協會」維護管理。
              </p>
              <p className="italic">
                This site, sponsored by IDA/MOEA, was created and is maintained by the ISHA.
              </p>
            </div>

            <p className="text-xs text-gray-300">
              本網站最佳瀏覽環境為 1024 x 768 視窗模式以上，支援 IE 11.0 含以上版本、Firefox、Chrome、Safari 等最新版本瀏覽器。
            </p>
          </div>

          {/* 導覽連結區 */}
          <div className="flex justify-between items-center pt-1">
            <Link
              href="/sitemap"
              className="text-xs text-gray-300 hover:text-white transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-white/50 rounded-sm px-1"
            >
              網站導覽
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
