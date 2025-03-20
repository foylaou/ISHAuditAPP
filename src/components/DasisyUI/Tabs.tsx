import React, { useState, ReactNode, useId } from 'react';

export type TabType = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

interface TabsSettings {
  type?: 'bordered' | 'lifted' | 'boxed' | '';
  size?: 'xs' | 'sm' | 'md' | 'lg' | '';
  maxWidth?: string;
  defaultActiveTab?: string;
}

interface TabsProps {
  tabs: TabType[];
  settings?: TabsSettings;
  onChange?: (tabId: string) => void;
  className?: string;
  cardClassName?: string;
}

export default function Tabs(props: TabsProps) {
  const {
    tabs,
    settings = {},
    onChange,
    className = '',
    cardClassName = ''
  } = props;

  const {
    type = 'bordered',
    maxWidth = '100%',
    defaultActiveTab = tabs[0]?.id || ''
  } = settings;

  // 為 radio 組生成唯一名稱
  const radioGroupName = useId();

  // 設置活動標籤的狀態
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab);

  // 處理標籤變更
  const handleTabChange = (tabId: string) => {
    if (!tabs.find(tab => tab.id === tabId)?.disabled) {
      setActiveTab(tabId);
      if (onChange) {
        onChange(tabId);
      }
    }
  };

  // 計算 tabs 容器的 className
  const getTabsClassName = () => {
    let classNames = 'tabs';

    // 添加類型
    if (type) {
      classNames += ` tabs-${type}`;
    }

    // 添加自定義類名
    if (className) {
      classNames += ` ${className}`;
    }

    return classNames;
  };

  return (
    <div className={`card shadow-lg w-full  ${cardClassName}`}>
      <div className="card-body bg-base-200 rounded-box  p-0 sm:p-1 md:p-4">
        <div className="w-full overflow-x-auto">
          <div style={{ width: '100%', maxWidth }}>
            {/* Tabs navigation */}
            <div role="tablist" className={getTabsClassName()}>
              {tabs.map((tab) => (
                <a
                  key={`tab-${tab.id}`}
                  className={`tab tab-xs sm:tab-sm md:tab-md lg:tab-lg 
                    text-xs sm:text-sm md:text-base lg:text-lg 
                    ${activeTab === tab.id ? 'tab-active' : ''} ${tab.disabled ? 'tab-disabled' : ''}`}
                  onClick={() => !tab.disabled && handleTabChange(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-disabled={tab.disabled}
                >
                  {tab.label}
                </a>
              ))}
            </div>

            {/* Tab content */}
            <div className="mt-4 text-base-content">
              {tabs.map((tab) => (
                <div
                  key={`content-${tab.id}`}
                  role="tabpanel"
                  className="tab-content rounded-box bg-base-200 p-2 sm:p-3 md:p-6 bg-base-100"
                  style={{ display: activeTab === tab.id ? 'block' : 'none' }}
                >
                  {tab.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
