'use client';
import Link from 'next/link';
import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useMenuStore } from '@/store/menuStore';
import ThemeToggle from './ThemeToggle';
import { MenuItem } from '@/types/menuTypes';

export default function HeaderMenu() {
  const { permissions, isLoggedIn, logout } = useGlobalStore();
  const { menuItems, filterMenuByAuth } = useMenuStore();

  const getAuthLevel = () => {
    if (permissions.sys === 'admin') return 'admin';
    if (permissions.org === 'manager') return 'manager';
    return 'user';
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => (
      <li key={index}>
        {item.children ? (
          <details>
            <summary>{item.label}</summary>
            <ul className="p-2 text-base-content">
              {renderMenuItems(item.children)}
            </ul>
          </details>
        ) : (
          item.onClick ? (
            <a href={item.link} onClick={item.onClick}>
              {item.label}
            </a>
          ) : (
            <Link href={item.link || '/'}>
              {item.label}
            </Link>
          )
        )}
      </li>
    ));
  };

  const filteredMenu = filterMenuByAuth(menuItems, getAuthLevel());
  const menuWithLogout = isLoggedIn
    ? [
        ...filteredMenu.filter((item: { label: string; }) => item.label !== '登出'),
        { label: '登出', link: '#', onClick: handleLogout }
      ]
    : filteredMenu;

  return (
      <div className="navbar bg-neutral text-neutral-content fixed top-0 z-40 shadow-lg">
          {/* 手機版選單按鈕 */}
          <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3"
                     className="btn btn-square btn-ghost text-neutral-content hover:bg-primary/20">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-5 w-5 stroke-current"
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                      />
                  </svg>
              </label>
          </div>

          {/* Logo */}
          <div className="flex-1 px-2">
              <Link
                  href="/"
                  className="btn btn-ghost normal-case text-lg font-bold text-neutral-content hover:bg-primary/20"
              >
                  大型石化督導資料庫
              </Link>
          </div>

          {/* 選單項目 */}
          <div className=" dropdown flex-none hidden lg:block">
              {isLoggedIn ? (
                  <ul className="menu menu-horizontal gap-1">
                      {renderMenuItems(menuWithLogout)}
                  </ul>
              ) : (
                  <Link
                      href="/Login"
                      className="btn btn-primary btn-sm text-neutral-content hover:bg-primary-focus"
                  >
                      登入
                  </Link>
              )}
          </div>

          {/* 主題切換 */}
          <div className="flex-none ml-2">
              <ThemeToggle/>
          </div>
      </div>
  );
}
