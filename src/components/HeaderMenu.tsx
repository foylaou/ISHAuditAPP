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
import AvatarMenu from "@/components/Avatar/AvatarMenu";
import ThemeToggle from "@/components/ThemeToggle";


export default function HeaderMenu() {
  const { theme } = useGlobalStore();
  const { isLoggedIn } = useGlobalStore();
  const { menuItems, fetchMenuItems } = useMenuStore();
  const [openMenuIndex, setOpenMenuIndex] = useState<string | null>(null);


    useEffect(() => {
      if (isLoggedIn) {
        fetchMenuItems();
      }
    }, [fetchMenuItems, isLoggedIn]);

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

  // const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   logout();
  //   authService.logout();
  //   router.push('/Login');
  // };

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


  const filteredMenu = menuItems.filter(hasMenuPermission);
  const menuWithLogout = isLoggedIn
    ? [
        ...filteredMenu.filter(item => item.label !== '登出'),
        // { label: '登出', link: '#', onClick: handleLogout }
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
          <Link rel="preload" href="/" as={'Home'} >
            <Image
              key={theme ? 'dark-logo' : 'light-logo'} // 強制切換時重新渲染
              src={theme ? logodark : logo}
              alt={theme ? "Dark mode logo" : "Light mode logo"}
              width={400}
              height={150}
              quality={75}
              placeholder="blur"
              blurDataURL={'loading.gif'}
              className="btn shadow"
              style={{ cursor: 'pointer' }}
            />
          </Link>
          </div>

          <div className="hidden flex-none lg:block">
            {isLoggedIn ? (
                <ul className="menu lg:menu-horizontal px-6 rounded-box ">
                  {renderMenuItems(menuWithLogout, false)}
                </ul>
            ) : (
                <>
                </>
                // <Link href={Login} className="btn btn-primary btn-sm mr-5">
                //   登入
                // </Link>
            )}
          </div>
          <div className="">
            <ThemeToggle/>
          </div>
          {isLoggedIn ? (
              <>
                        <div className="mx-4 flex-none sm:block hidden">
            <AvatarMenu
              name="foy"
              state={openMenuIndex}
              setState={setOpenMenuIndex}

              ></AvatarMenu>
            </div>
            </>
          ):(
              <>
              </>
          )}



          </div>
        </div>
    </div>
  )
}
