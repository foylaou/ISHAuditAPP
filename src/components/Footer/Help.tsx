"use client"

import { useState } from "react";

export default function Instructions() {
  const [activeTab, setActiveTab] = useState('general');

  // 這部分在實際應用中會從用戶會話中獲取，這裡簡化處理
  const userRole = 'government'; // 模擬用戶角色，實際應用中應該從會話獲取

  return (
    <div className="container mx-auto px-4 py-8 text-base-content">
      <h1 className="text-3xl font-bold mb-6">操作說明</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 分頁選單 */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'general' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('general')}
          >
            基本操作
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'reports' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('reports')}
          >
            報告管理
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'tracking' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('tracking')}
          >
            問題追蹤
          </button>
          {userRole === 'government' || userRole === 'expert' ? (
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('analytics')}
            >
              統計分析
            </button>
          ) : null}
        </div>

        {/* 內容區域 */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">基本操作說明</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">登入系統</h3>
                <p className="mb-3">1. 在首頁輸入您的帳號和密碼</p>
                <p className="mb-3">2. 首次登入需要變更密碼並設定雙因素認證</p>
                <p className="mb-3">3. 如忘記密碼，請點擊「忘記密碼」並依照指示進行</p>
                <div className="my-4 border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 p-3">登入介面示意</div>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">登入畫面示意圖</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">導覽說明</h3>
                <p className="mb-3">• 左側選單提供主要功能導覽</p>
                <p className="mb-3">• 頂部選單顯示通知、個人資料和登出選項</p>
                <p className="mb-3">• 儀表板提供系統概覽和快速連結</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">帳戶管理</h3>
                <p className="mb-3">• 點擊右上角的個人頭像進入帳戶設定</p>
                <p className="mb-3">• 在帳戶設定中可以更新個人資料和密碼</p>
                <p className="mb-3">• 設定通知偏好和雙因素認證</p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">報告管理說明</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">上傳報告</h3>
                <p className="mb-4">1. 進入「報告管理」頁面，點擊「上傳新報告」按鈕</p>
                <p className="mb-4">2. 選擇報告類型並填寫基本資訊</p>
                <p className="mb-4">3. 上傳報告檔案（支援 PDF、DOCX、XLSX 格式）</p>
                <p className="mb-4">4. 設定報告可見範圍和權限</p>
                <p className="mb-4">5. 點擊「提交」完成上傳</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">查詢和下載報告</h3>
                <p className="mb-4">• 使用搜尋功能查找特定報告</p>
                <p className="mb-4">• 利用篩選器按日期、類型、企業等條件篩選</p>
                <p className="mb-4">• 點擊報告標題查看詳情</p>
                <p className="mb-4">• 在報告詳情頁面點擊「下載」按鈕可下載報告</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">報告審核流程</h3>
                <p className="mb-4">• 報告上傳後需經過審核才能正式發布</p>
                <p className="mb-4">• 審核人員可在「審核區」查看待審核報告</p>
                <p className="mb-4">• 審核通過或退回會通知報告上傳者</p>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">問題追蹤說明</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">登記新問題</h3>
                <p className="mb-2">1. 在「問題追蹤」頁面點擊「新增問題」按鈕</p>
                <p className="mb-2">2. 填寫問題詳情表單，包括：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>問題類型（製程安全、環保合規、設備狀況等）</li>
                  <li>嚴重程度評估</li>
                  <li>問題描述和現場照片</li>
                  <li>相關設備和位置</li>
                  <li>發現日期和預計改善日期</li>
                </ul>
                <p className="mb-2">3. 選擇負責單位</p>
                <p className="mb-2">4. 點擊「提交」完成登記</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">問題狀態追蹤</h3>
                <p className="mb-2">• 問題狀態包括：初始登記、評估中、改善中、待驗證、已結案</p>
                <p className="mb-2">• 在問題詳情頁面可查看完整的狀態變更歷史</p>
                <p className="mb-2">• 負責人可新增進度更新和上傳改善證明文件</p>
                <p className="mb-2">• 督導人員可在系統中提供回饋和建議</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">設定提醒和通知</h3>
                <p className="mb-2">• 為問題設定截止日期提醒</p>
                <p className="mb-2">• 設定狀態變更和進度更新通知</p>
                <p className="mb-2">• 設定優先級和升級規則</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">統計分析說明</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">報表生成</h3>
                <p className="mb-3">• 在「統計分析」頁面選擇報表類型</p>
                <p className="mb-3">• 設定時間範圍、公司、問題類型等篩選條件</p>
                <p className="mb-3">• 點擊「生成報表」按鈕</p>
                <p className="mb-3">• 系統支援多種圖表和表格格式</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">資料匯出</h3>
                <p className="mb-3">• 報表可匯出為 Excel、PDF 或 CSV 格式</p>
                <p className="mb-3">• 點擊報表上方的「匯出」按鈕選擇格式</p>
                <p className="mb-3">• 設定是否包含圖表和原始資料</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">趨勢分析工具</h3>
                <p className="mb-3">• 使用「趨勢分析」標籤查看長期趨勢</p>
                <p className="mb-3">• 支援按季度、年度的比較視圖</p>
                <p className="mb-3">• 可進行跨公司或跨區域的對比分析</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
