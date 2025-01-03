'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import SearchBar from '@/components/Audit/SearchBar';
import AuditResult from '@/components/Audit/AuditResult';
import AuditSuggest from '@/components/Audit/AuditSuggest';

type TabType = 'SearchBar' | 'AuditResult' | 'AuditSuggest';

const TAB_CONFIG = {
  SearchBar: { label: '資料查詢', component: SearchBar },
  AuditResult: { label: '督導資訊', component: AuditResult },
  AuditSuggest: { label: '執行規劃', component: AuditSuggest },
} as const;

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<TabType>('SearchBar');

  return (
    <AuthGuard requiredPermissions={{ module: 'Audit', level: 'Admin' }}>
   <div className="px-5 pb-3 ">
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        {/* SearchBar Tab */}
        <input
          type="radio"
          name="audit_tabs"
          role="tab"
          className="tab"
          aria-label="資料查詢"
          checked={activeTab === 'SearchBar'}
          onChange={() => setActiveTab('SearchBar')}
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <SearchBar />
        </div>

        {/* AuditResult Tab */}
        <input
          type="radio"
          name="audit_tabs"
          role="tab"
          className="tab"
          aria-label="督導資訊"
          checked={activeTab === 'AuditResult'}
          onChange={() => setActiveTab('AuditResult')}
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <AuditResult />
        </div>

        {/* AuditSuggest Tab */}
        <input
          type="radio"
          name="audit_tabs"
          role="tab"
          className="tab"
          aria-label="執行規劃"
          checked={activeTab === 'AuditSuggest'}
          onChange={() => setActiveTab('AuditSuggest')}
        />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <AuditSuggest />
        </div>
      </div>
     </div>
    </AuthGuard>
  );
}
