'use client';
import Link from 'next/link';
import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useMenuStore } from '@/store/menuStore';
import { authService } from '@/services/authService';
import ThemeToggle from "@/components/ThemeToggle";

interface MenuItem {
  label: string;
  link?: string;
  auth?: string;
  children?: MenuItem[];
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Sidebar() {
  const { isLoggedIn } = useGlobalStore();
  const { menuItems, filterMenuByAuth } = useMenuStore();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    authService.logout();
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => (
      <li key={`${item.label}-${index}`}>
        {item.children ? (
          <details>
            <summary className="hover:bg-base-300 rounded-lg">
              {item.label}
            </summary>
            <ul className="menu menu-compact pl-4">
              {renderMenuItems(item.children)}
            </ul>
          </details>
        ) : (
          item.onClick ? (
            <a
              href={item.link}
              onClick={item.onClick}
              className="hover:bg-base-300 rounded-lg"
            >
              {item.label}
            </a>
          ) : (
            <Link
              href={item.link || '/'}
              className="hover:bg-base-300 rounded-lg"
            >
              {item.label}
            </Link>
          )
        )}
      </li>
    ));
  };

  // Filter menu and add logout
  const filteredMenu = filterMenuByAuth(menuItems);
  const menuWithLogout = isLoggedIn
    ? [
        ...filteredMenu.filter(item => item.label !== '登出'),
        { label: '登出', link: '#', onClick: handleLogout }
      ]
    : filteredMenu;

  return (
    <div className="drawer-side pt-16">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {isLoggedIn ? (
                renderMenuItems(menuWithLogout)
            ) : (
                <li>
                    <Link
                        href="/Login"
                        className="hover:bg-base-300 rounded-lg"
                    >
                        登入
                    </Link>
                </li>
            )}
            <li className="mt-4 sm:hidden">
                <ThemeToggle/>
            </li>
        </ul>
    </div>
  );
}
