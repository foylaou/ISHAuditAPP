'use client';
import { useState, Fragment } from 'react';
import SearchBar from '@/components/Audit/SearchBar';
import AuditResult from '@/components/Audit/AuditResult';
import AuditSuggest from '@/components/Audit/AuditSuggest';
import AuthGuard from '@/components/auth/AuthGuard';

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
      <div className="px-5 pb-3">
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          {Object.entries(TAB_CONFIG).map(([key, { label, component: Component }]) => (
            <Fragment key={key}>
              <input
                type="radio"
                name="audit_tabs"
                role="tab"
                className="tab min-w-[120px] text-center"
                aria-label={label}
                checked={activeTab === key}
                onChange={() => setActiveTab(key as TabType)}
              />
              <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                <Component />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
