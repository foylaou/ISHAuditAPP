"use client"
import { useState } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('windows');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-base-content">無障礙說明</h1>

      {/* 網站架構說明 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-base-content">網站架構</h2>
        <p className="mb-4 text-base-content">本網站依無障礙網頁設計原則建置，網站的主要內容分為四大區塊：</p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-base-content">
          <li>上方功能區塊：包含網站 Logo、主選單及功能選單</li>
          <li>中央內容區塊：為本頁主要內容區</li>
          <li>下方功能區塊：包含網站導覽及相關說明</li>
          <li>左側功能區塊：包含次選單及相關連結</li>
        </ul>
      </section>

      {/* 快速鍵說明 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-base-content">快速鍵設定</h2>
        <p className="mb-4 text-base-content">本網站的快速鍵﹝Accesskey﹞設定如下：</p>
        <ul className="list-disc pl-6 space-y-2 text-base-content">
          <li><kbd className="kbd kbd-sm bg-base-200 text-base-content">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-200 text-base-content">U</kbd>：上方功能區塊</li>
          <li><kbd className="kbd kbd-sm bg-base-200 text-base-content">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-200 text-base-content">C</kbd>：中央內容區塊</li>
          <li><kbd className="kbd kbd-sm bg-base-200 text-base-content">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-200 text-base-content">Z</kbd>：下方功能區塊</li>
          <li><kbd className="kbd kbd-sm bg-base-200 text-base-content">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-200 text-base-content">L</kbd>：左側選單區塊</li>
          <li><kbd className="kbd kbd-sm bg-base-200 text-base-content">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-200 text-base-content">S</kbd>：網站搜尋</li>
        </ul>
      </section>

      {/* 操作說明 */}
      <section className="mb-8 text-base-content">
        <h2 className="text-xl font-semibold mb-4 text-base-content">快速鍵使用說明</h2>

        {/* 操作系統切換按鈕 */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'windows' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content hover:bg-base-300'}`}
            onClick={() => setActiveTab('windows')}
          >
            Windows 使用者
          </button>
          <button
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'mac' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content hover:bg-base-300'}`}
            onClick={() => setActiveTab('mac')}
          >
            Mac OS X 使用者
          </button>
          <button
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'linux' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content hover:bg-base-300'}`}
            onClick={() => setActiveTab('linux')}
          >
            Linux 使用者
          </button>
        </div>

        {/* Windows 說明 */}
        {activeTab === 'windows' && (
          <div className="bg-base-200 p-4 rounded">
            <p className="mb-2">Windows 作業系統使用者：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Internet Explorer：請按 <kbd className="kbd kbd-sm bg-base-100">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
              <li>
                Firefox：請按 <kbd className="kbd kbd-sm bg-base-100">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-100">Shift</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
              <li>
                Chrome：請按 <kbd className="kbd kbd-sm bg-base-100">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
            </ul>
          </div>
        )}

        {/* Mac 說明 */}
        {activeTab === 'mac' && (
          <div className="bg-base-200 p-4 rounded">
            <p className="mb-2">Mac OS X 作業系統使用者：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Safari：請按 <kbd className="kbd kbd-sm bg-base-100">Control</kbd> + <kbd className="kbd kbd-sm bg-base-100">Option</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
              <li>
                Firefox：請按 <kbd className="kbd kbd-sm bg-base-100">Control</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
              <li>
                Chrome：請按 <kbd className="kbd kbd-sm bg-base-100">Control</kbd> + <kbd className="kbd kbd-sm bg-base-100">Option</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
            </ul>
          </div>
        )}

        {/* Linux 說明 */}
        {activeTab === 'linux' && (
          <div className="bg-base-200 p-4 rounded">
            <p className="mb-2">Linux 作業系統使用者：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Firefox：請按 <kbd className="kbd kbd-sm bg-base-100">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-100">Shift</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
              <li>
                Chrome：請按 <kbd className="kbd kbd-sm bg-base-100">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
              <li>
                Opera：請按 <kbd className="kbd kbd-sm bg-base-100">Alt</kbd> + <kbd className="kbd kbd-sm bg-base-100">快速鍵</kbd>
              </li>
            </ul>
          </div>
        )}
      </section>

      {/* 其他協助工具 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-base-content">其他協助工具</h2>
        <ul className="list-disc pl-6 space-y-2 text-base-content">
          <li>
            如需要閱讀 PDF 文件，可下載免費的
            <a
              href="https://get.adobe.com/tw/reader/"
              className="text-primary hover:text-primary/80 hover:underline ml-1 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adobe Reader
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.print();
              }}
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              列印本頁
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
