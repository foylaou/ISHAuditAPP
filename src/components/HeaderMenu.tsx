'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useMenuStore } from '@/store/menuStore';
import ThemeToggle from './ThemeToggle';
import { authService } from '@/services/authService';
import type {MenuItem, ModulePermission} from '@/types/menuTypes';
import Image from "next/image";
import logo from '@/../public/logo.svg';
import logodark from '@/../public/logo-dark.svg';


export default function HeaderMenu() {
  const { theme } = useGlobalStore();
  const Login = '/Login';
  const router = useRouter();
  const { isLoggedIn, logout } = useGlobalStore();
  const { menuItems } = useMenuStore();

const checkPermission = (required: ModulePermission): boolean => {
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
      if (!item.permission) return true;
      return Array.isArray(item.permission)
        ? item.permission.some(perm => checkPermission(perm))
        : checkPermission(item.permission);
    };
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
    authService.logout();
    router.push('/Login');
  };

const renderMenuItems = (items: MenuItem[], isMobile: boolean = false) => {
  return items.map((item, index) => {
    if (!hasMenuPermission(item)) return null;

    if (item.children) {
      return (
        <li key={index}>
          <details className={isMobile ? 'collapse collapse-arrow' : ''}>
            <summary className={isMobile ? 'collapse-title' : ''}>
              {item.label}
            </summary>
            <ul className={isMobile ? 'collapse-content pl-4' : 'bg-base-200'}>
              {renderMenuItems(item.children, isMobile)}
            </ul>
          </details>
        </li>
      );
    }

    return (
      <li key={index}>
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

  const filteredMenu = menuItems.filter(hasMenuPermission);
  const menuWithLogout = isLoggedIn
    ? [
        ...filteredMenu.filter(item => item.label !== '登出'),
        { label: '登出', link: '#', onClick: handleLogout }
      ]
    : filteredMenu;

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-200 text-base-content fixed top-0 z-40 shadow-xl">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-ghost btn-square  ">
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
            <Image
                src={theme ? logodark : logo} // 根據主題切換圖片
                alt={theme ? "Dark mode logo" : "Light mode logo"} // 提供清楚的描述
                width={400} // 僅亮色主題設定寬度
                height={150} // 僅亮色主題設定高度
                className="btn shadow" // 統一樣式
                onClick={()=>router.push('/Home')} // 點擊後導航
                style={{cursor: 'pointer'}} // 添加點擊樣式
                priority // 提高加載優先級
            />
          </div>

          <div className="hidden flex-none lg:block">
            {isLoggedIn ? (
                <ul className="menu lg:menu-horizontal px-6 rounded-box ">
                  {renderMenuItems(menuWithLogout, false)}
                </ul>
            ) : (
                <Link href={Login} className="btn btn-primary btn-sm mr-5">
                  登入
                </Link>
            )}
          </div>

          <div className="flex-none sm:block hidden">
            <ThemeToggle/>
          </div>
        </div>
      </div>

      {/* Drawer side */}
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu w-80 min-h-full bg-base-200 p-4">
          {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                {renderMenuItems(menuWithLogout, true)}
              </div>
          ) : (
              <li>
                <Link href={Login} className="btn btn-primary ">
                  登入
                </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
