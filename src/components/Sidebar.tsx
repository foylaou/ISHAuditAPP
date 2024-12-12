'use client';
import Link from 'next/link';
import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useMenuStore } from '@/store/menuStore';
import { MenuItem } from '@/types/menuTypes';

export default function Sidebar() {
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
            <ul className="menu menu-compact">
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
        ...filteredMenu.filter(item => item.label !== '登出'),
        { label: '登出', link: '#', onClick: handleLogout }
      ]
    : filteredMenu;

return (
  <div className="drawer-side pt-16">
    <label htmlFor="my-drawer-3" className="drawer-overlay p-5"></label>
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      {isLoggedIn ? (
        renderMenuItems(menuWithLogout)
      ) : (
        <li>
          <Link href="/Login">登入</Link>
        </li>
      )}
    </ul>
  </div>
);
}
