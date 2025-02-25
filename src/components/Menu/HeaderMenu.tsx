'use client';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useMenuStore } from '@/store/menuStore';
import { authService } from '@/services/authService';
import type {MenuItem, ModulePermission} from '@/types/menuTypes';
import Image from "next/image";
import logo from '@/../public/logo.svg';
import logodark from '@/../public/logo-dark.svg';
import * as Icons from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AvatarMenu from "@/components/Menu/AvatarMenu";
import NotificationComponent from "@/components/Menu/Notification";


export default function HeaderMenu() {
  const { theme } = useGlobalStore();
  const { isLoggedIn } = useGlobalStore();
  const { menuItems, fetchMenuItems } = useMenuStore();
  const [openMenuIndex, setOpenMenuIndex] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);

  // 客戶端初始化檢測
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 獲取菜單數據
  useEffect(() => {
    if (isClient && isLoggedIn) {
      fetchMenuItems();
    }
  }, [fetchMenuItems, isLoggedIn, isClient]);

  // 過濾菜單項目 - 只在客戶端進行
  useEffect(() => {
    if (isClient) {
      const filtered = menuItems.filter(hasMenuPermission);
      const menuWithLogout = isLoggedIn
        ? [
            ...filtered.filter(item => item.label !== '登出'),
            // { label: '登出', link: '#', onClick: handleLogout }
          ]
        : filtered;

      setFilteredMenuItems(menuWithLogout);
    }
  }, [menuItems, isLoggedIn, isClient]);

  const checkPermission = (required: ModulePermission): boolean => {
    if (!isClient) return false;

    const userRoles = authService.getUserRoles();
    if (!userRoles) return false;

    const modulePermission = userRoles[required.module];
    if (!modulePermission) return false;

    // 簡化比較邏輯
    switch (required.level) {
      case 'Admin':
        return modulePermission === 'Admin';
      case 'Power':
        return ['Admin', 'Power'].includes(modulePermission);
      case 'Edit':
        return ['Admin', 'Power', 'Edit'].includes(modulePermission);
      case 'None':
        return true;
      default:
        return false;
    }
  };

  const hasMenuPermission = (item: MenuItem): boolean => {
    if (!isClient) return false;
    if (!item.permission) return true;

    return Array.isArray(item.permission)
      ? item.permission.some(perm => checkPermission(perm))
      : checkPermission(item.permission);
  };

  const renderMenuItems = (items: MenuItem[], isMobile: boolean = false, parentIndex: string = '') => {
    return items.map((item, index) => {
      if (!hasMenuPermission(item)) return null;

      const currentIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;

      if (item.children) {
        const isOpen = openMenuIndex === currentIndex;

        return (
          <li key={currentIndex}>
            <details
              className={isMobile ? 'collapse collapse-arrow' : ''}
              open={isOpen}
            >
              <summary
                className={isMobile ? 'collapse-title' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  // 切換目前選單的開關狀態
                  setOpenMenuIndex(isOpen ? null : currentIndex);
                }}
              >
                {item.label}
              </summary>
              <ul className={isMobile ? 'collapse-content pl-4' : 'bg-base-200'}>
                {renderMenuItems(item.children, isMobile, currentIndex)}
              </ul>
            </details>
          </li>
        );
      }

      return (
        <li key={currentIndex}>
          {item.onClick ? (
            <a
              href={item.link}
              onClick={item.onClick}
              className={isMobile ? 'block py-2' : ''}
            >
              {item.label}
            </a>
          ) : (
            <Link
              href={item.link || '/'}
              className={isMobile ? 'block py-2' : ''}
            >
              {item.label}
            </Link>
          )}
        </li>
      );
    }).filter(Boolean);
  };

  // 客戶端才渲染的菜單部分
  const renderClientSideMenu = () => {
    if (!isClient) return null;

    return (
      <>
        <div className="hidden flex-none lg:block">
          {isLoggedIn && (
            <ul className="menu lg:menu-horizontal px-6 rounded-box">
              {renderMenuItems(filteredMenuItems, false)}
            </ul>
          )}
        </div>
      </>
    );
  };

  // 客戶端才渲染的右側元素
  const renderClientSideRightElements = () => {
    if (!isClient) return null;

    return (
      <>
        {isLoggedIn && (
          <>
            <div className="mx-4 flex-none sm:block hidden">
              <NotificationComponent
                setOpenMenuIndex={setOpenMenuIndex}
                openMenuIndex={openMenuIndex}
              />
            </div>
            <div className="mx-4 flex-none sm:block hidden">
              <AvatarMenu
                name="foy"
                state={openMenuIndex}
                setState={setOpenMenuIndex}
              />
            </div>
          </>
        )}
      </>
    );
  };

  return (
      <div className="drawer">

        {/*<input id="my-drawer-3" type="checkbox" className="drawer-toggle"/>*/}


        <div className="drawer-content flex flex-col">


          {/* Navbar */}
          <div className="navbar bg-base-200 text-base-content fixed top-0 z-40 shadow-xl">
            <a accessKey="u" href="#u" title="上方功能區塊"
               className="bg-base-200 text-base-300">
              :::
            </a>
            <div className="flex-none lg:hidden">

              <label htmlFor="my-drawer-3" className="btn btn-ghost btn-square" title="大型石化督導資料庫（回首頁）">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 stroke-current"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
            </div>

            <div className="flex-1 px-4">
              <Link rel="preload" href="/" as={'Home'}>
                <Image
                    key={theme ? 'dark-logo' : 'light-logo'} // 強制切換時重新渲染
                    src={theme ? logodark : logo}
                    alt={theme ? "Dark mode logo" : "Light mode logo"}
                    width={400}
                    height={150}
                    quality={75}
                    placeholder="blur"
                    blurDataURL={'loading'}
                    className="btn shadow"
                    style={{cursor: 'pointer'}}
                />
              </Link>
            </div>

            {/* 客戶端才渲染的部分 */}
            {renderClientSideMenu()}

            <div className="">
              <ThemeToggle/>
            </div>

            {/* 客戶端才渲染的右側元素 */}
            {renderClientSideRightElements()}
          </div>
        </div>
      </div>
  );
}
