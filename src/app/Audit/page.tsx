// @app/Audit/page.tsx
'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import SearchBar from '@/components/Audit/SearchBar';
import AuditResult from '@/components/Audit/AuditResult';
import AuditSuggest from '@/components/Audit/AuditSuggest';

export default function AuditPage() {
  // 定義當前分頁狀態
  const [activeTab, setActiveTab] = useState<string>('SearchBar');

  // 處理點擊事件，切換分頁
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <AuthGuard requiredPermission="admin">
      {/* 分頁標籤 */}
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <a
          role="tab"
          className={`tab ${activeTab === 'SearchBar' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('SearchBar')}
        >
          資料查詢
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 'AuditResult' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('AuditResult')}
        >
          督導資訊
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 'AuditSuggest' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('AuditSuggest')}
        >
          執行規劃
        </a>
      </div>

      {/* 根據當前選擇的分頁顯示組件 */}
      <div className="p-4">
        {activeTab === 'SearchBar' && <SearchBar />}
        {activeTab === 'AuditResult' && <AuditResult />}
        {activeTab === 'AuditSuggest' && <AuditSuggest />}
      </div>
    </AuthGuard>
  );
}
