'use client';
import Link from 'next/link';
import React, {useState, useEffect, useRef} from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useMenuStore } from '@/store/menuStore';
import { authService } from '@/services/authService';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {userInfoStore} from "@/store/useUserinfoStore";

interface MenuItem {
  label: string;
  link?: string;
  auth?: string;
  children?: MenuItem[];
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Sidebar() {
  const { isLoggedIn, logout } = useGlobalStore();
  const { menuItems, filterMenuByAuth } = useMenuStore();
  const [openMenuIndex, setOpenMenuIndex] = useState<string | null>(null);
  const router = useRouter();
  const {Username} = userInfoStore();
  const sidebarLinkRef = useRef<HTMLAnchorElement>(null);

  // Track client-side mounting status
  const [mounted, setMounted] = useState(false);
  const [localIsLoggedIn, setLocalIsLoggedIn] = useState(false);
  const [clientMenuItems, setClientMenuItems] = useState<MenuItem[]>([]);

  // Only run on client-side after hydration
  useEffect(() => {
    setMounted(true);
    setLocalIsLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      const filtered = filterMenuByAuth(menuItems);
      setClientMenuItems(filtered.filter(item => item.label !== '登出'));
    }
  }, [isLoggedIn, menuItems, filterMenuByAuth]);

  // 添加鍵盤快捷鍵功能
  useEffect(() => {
    if (!mounted) return;

    // 為快捷鍵添加事件處理
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt+L 快捷鍵 (對應 accessKey="l")
      if (e.altKey && e.key === 'l') {
        // 找到 checkbox 並切換其狀態
        const checkbox = document.getElementById('my-drawer-3') as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          e.preventDefault(); // 防止默認的瀏覽器行為
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [mounted]);

  // 當側邊欄鏈接被點擊時的處理
  const handleSidebarLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const checkbox = document.getElementById('my-drawer-3') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
    authService.logout();
    setLocalIsLoggedIn(false);
    router.push('/Login');
  };

  const renderMenuItems = (items: MenuItem[], parentIndex: string = '') => {
    return items.map((item, index) => {
      const currentIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;
      const isOpen = openMenuIndex === currentIndex;

      return (
        <li key={`${item.label}-${index}`}>
          {item.children ? (
            <details
              open={isOpen}
            >
              <summary
                className="hover:bg-base-300 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenMenuIndex(isOpen ? null : currentIndex);
                }}
              >
                {item.label}
              </summary>
              <ul className="menu menu-compact pl-4">
                {renderMenuItems(item.children, currentIndex)}
              </ul>
            </details>
          ) : (
            item.onClick ? (
              <span
                className="hover:bg-base-300 rounded-lg cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                  const anchorEvent = e as unknown as React.MouseEvent<HTMLAnchorElement>;
                  if (item.onClick) {
                    item.onClick(anchorEvent);
                  }
                  setOpenMenuIndex(null);
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.link || '/'}
                className="hover:bg-base-300 rounded-lg"
                onClick={() => setOpenMenuIndex(null)}
              >
                {item.label}
              </Link>
            )
          )}
        </li>
      );
    });
  };

  const renderCustomAvatarContent = () => {
    return (
      <div className="flex flex-col items-center p-4">
        <div className="avatar mb-4">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <Image
              src="/avatar_default.svg"
              alt="User avatar"
              width={96}
              height={96}
            />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-1">{Username}</h3>
        <p className="text-sm text-base-content/70 mb-4">您好</p>

        <div className="divider"></div>

        <div className="w-full space-y-2">
          <Link href="/profile" className="btn btn-sm btn-ghost w-full justify-start" onClick={() => setOpenMenuIndex(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            個人資料
          </Link>
          <Link href="/settings" className="btn btn-sm btn-ghost w-full justify-start" onClick={() => setOpenMenuIndex(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            設定
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-ghost w-full justify-start text-error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            登出
          </button>
        </div>
      </div>
    );
  };

  // Return a consistent initial UI for server rendering
  if (!mounted) {
    return (
      <div className="drawer-side pt-16">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <div className="w-80 min-h-full bg-base-200 text-base-content flex flex-col">
          {/* Empty sidebar shell for initial render */}
        </div>
      </div>
    );
  }

  // Client-side conditional rendering after hydration is complete
  return (
      <div className="drawer-side pt-16">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>

        {localIsLoggedIn ? (
            // 登入後顯示的內容
            <div className="w-80 min-h-full bg-base-200 text-base-content flex flex-col">
              {/* 客製化的用戶檔案區塊 - 行動版顯示 */}
              <a
                accessKey="l"
                href="#l"
                title="左側功能區塊"
                className="bg-base-200 text-base-300 ml-2"
                ref={sidebarLinkRef}
                onClick={handleSidebarLinkClick}
              >
                :::
              </a>
              <div className="sm:hidden border-b border-base-300">
                {renderCustomAvatarContent()}
              </div>

              {/* 一般選單項目 */}
              <ul className="menu p-4 w-full">
                {renderMenuItems(clientMenuItems)}
              </ul>
            </div>
        ) : (
            // 未登入時顯示的內容 - 只有登入按鈕
            <div
                className="w-80 min-h-full bg-base-200 text-base-content flex flex-col items-center justify-center p-8">
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium mb-2">請先登入</h3>
                <p className="text-sm text-base-content/70">登入後查看完整選單</p>
              </div>
              <Link
                  href="/Login"
                  className="btn btn-primary w-full"
              >
                登入系統
              </Link>
            </div>
        )}
      </div>
  );
}
