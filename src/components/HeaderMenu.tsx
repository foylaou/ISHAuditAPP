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
            <ul className="p-2">
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
    <div className="navbar bg-neutral text-neutral-content fixed top-0 z-40">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
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
      <div className="mx-2 flex-1 px-2">
        <Link href="/" className="btn btn-ghost text-xl">
          大型石化督導資料庫
        </Link>
      </div>
      <div className="hidden flex-none lg:block">
        {isLoggedIn ? (
          <ul className="menu menu-horizontal px-1">
            {renderMenuItems(menuWithLogout)}
          </ul>
        ) : (
          <Link href="/Login" className="btn btn-ghost">
            登入
          </Link>
        )}
      </div>
      <div className="flex-none">
        <ThemeToggle />
      </div>
    </div>
  );
}
