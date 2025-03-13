'use client';
import { useState, Fragment } from 'react';
import SearchBar from '@/components/Audit/SearchBar';

import BasicResult from "@/components/Audit/AuditResult";
import SuggestResult from "@/components/Audit/AuditSuggest";

type TabType = 'SearchBar' | 'AuditResult' | 'AuditSuggest';

const TAB_CONFIG = {
  SearchBar: { label: '資料查詢', component: SearchBar },
  AuditResult: { label: '督導資訊', component: BasicResult },
  AuditSuggest: { label: '執行規劃', component: SuggestResult },
} as const;

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<TabType>('SearchBar');

  return (

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

  );
}
