'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useMenuStore } from '@/store/menuStore';
import ThemeToggle from './ThemeToggle';
import { authService } from '@/services/authService';
import type { MenuItem, ModulePermission } from '@/types/menuTypes';

export default function HeaderMenu() {
  const router = useRouter();
  const { isLoggedIn, logout } = useGlobalStore();
  const { menuItems } = useMenuStore();

  const checkPermission = (required: ModulePermission): boolean => {
    const userRoles = authService.getUserRoles();
    if (!userRoles) return false;
    const modulePermission = userRoles[required.module];

    switch (required.level) {
      case 'admin':
        return modulePermission === 'admin';
      case 'manager':
        return ['admin', 'manager'].includes(modulePermission);
      case 'user':
        return ['admin', 'manager', 'user'].includes(modulePermission);
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
            <details>
              <summary>{item.label}</summary>
              <ul>
                {renderMenuItems(item.children, isMobile)}
              </ul>
            </details>
          </li>
        );
      }

      return (
        <li key={index}>
          {item.onClick ? (
            <a href={item.link} onClick={item.onClick}>
              {item.label}
            </a>
          ) : (
            <Link href={item.link || '/'}>
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
        <div className="navbar bg-neutral text-neutral-content fixed top-0 z-40 shadow-lg">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-ghost btn-square">
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

          <div className="flex-1 px-2">
            <Link href="/" className="btn btn-ghost text-xl normal-case">
              大型石化督導資料庫
            </Link>
          </div>

          <div className="hidden flex-none lg:block">
            {isLoggedIn ? (
              <ul className="menu lg:menu-horizontal px-6 rounded-box ">
                {renderMenuItems(menuWithLogout)}
              </ul>
            ) : (
              <Link href="/Login" className="btn btn-primary btn-sm">
                登入
              </Link>
            )}
          </div>

          <div className="flex-none">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Drawer side */}
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu w-80 min-h-full bg-base-200 p-4">
          {isLoggedIn ? (
            renderMenuItems(menuWithLogout, true)
          ) : (
            <li>
              <Link href="/Login" className="btn btn-primary">
                登入
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
