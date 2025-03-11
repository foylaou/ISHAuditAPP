'use client';
import React, { useEffect } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import * as Icons from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useGlobalStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme ? 'dark' : 'light');
  }, [theme]);

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
      <div className="">
        <label
            id="toggleLabel"
            className="relative inline-block w-14 h-10 cursor-pointer"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-labelledby="toggleLabel"
        >
          <input
              id="toggleTheme"
              type="checkbox"
              checked={theme}
              onChange={toggleTheme}
              role="switch"
              aria-checked={theme}
              aria-labelledby="toggleLabel"
              className="sr-only" // 隱藏但仍可被輔助技術讀取
              tabIndex={-1} // 防止 input 本身獲取焦點
          />

          {/* 自訂切換按鈕，增加觸控範圍 */}
          <div
              className="absolute inset-x-0 top-2 h-7 rounded-full bg-base-300 dark:bg-base-300 transition-colors duration-300">
            {/* 圓形按鈕與圖示 */}
            <span
                className={`absolute top-1 flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-300
          ${theme ? 'translate-x-8 bg-primary' : 'translate-x-1 bg-white'}`}
            >
        {theme ?
            <Icons.Moon size={12} className="text-white"/> :
            <Icons.Sun size={12} className="text-warning"/>
        }
      </span>
          </div>
        </label>
      </div>
  );
}
