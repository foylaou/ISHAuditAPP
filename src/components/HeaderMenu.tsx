'use client';
import Link from 'next/link';
import React, {useEffect} from 'react';
import { useGlobalStore } from '@/store/useGlobalStore'; // 調整路徑至你的 store 檔案位置



//主題模式元件
function ThemeToggle() {
  const { theme, toggleTheme } = useGlobalStore();

  // 當 theme 狀態改變時更新 HTML data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme ? 'dark' : 'light');
  }, [theme]);

   return (
    <label className="flex cursor-pointer gap-2">
      {/* 明亮模式圖示 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>

      {/* 切換主題的 checkbox */}
      <input
        type="checkbox"
        checked={theme}
        onChange={toggleTheme}
        className="toggle theme-controller"
      />

      {/* 黑暗模式圖示 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  );
}




// 權限項目介面
interface MenuItem {
  label: string;
  link?: string;
  children?: MenuItem[];
  auth?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// 假設選單項目
const menuItems: MenuItem[] = [
  { label: '首頁', link: '/' },
  { label: '督導查詢' , link: '/Audit' },
  {
    label: '帳號管理',
    auth: 'admin',
    children: [
      { label: '新增帳號', link: '/signup', auth: 'admin' },
      { label: '修改帳號', link: '/edit-user', auth: 'admin' },
    ],
  },
  {
    label: '系統管理',
    auth: 'manager',
    children: [
      {
        label: '設定',
        children: [
          { label: '系統設定', link: '/settings/system', auth: 'admin' },
          { label: '權限設定', link: '/settings/permissions', auth: 'manager' },
        ],
      },
      { label: '紀錄', link: '/logs', auth: 'user' },
    ],
  },
  { label: '登出', link: '/logout' },
];

// 過濾選單權限
const filterMenuByAuth = (items: MenuItem[], role: string): MenuItem[] => {
  return items
    .filter((item) => !item.auth || item.auth === role)
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByAuth(item.children, role) : undefined,
    }));
};

// DropdownMenu 組件
const DropdownMenu = ({ items }: { items: MenuItem[] }) => {
  const renderMenu = (menuItems: MenuItem[]) => {
    return menuItems.map((item, index) => (
      <li key={index}>
        {item.children ? (
          <details>
            <summary>{item.label}</summary>
            <ul className="bg-base-100 rounded-t-none p-2">
              {renderMenu(item.children)}
            </ul>
          </details>
        ) : (
          <a
            href={item.link}
            onClick={item.onClick}
          >
            {item.label}
          </a>
        )}
      </li>
    ));
  };

  return <ul className="menu menu-horizontal px-1">{renderMenu(items)}</ul>;
};


// HeaderMenu 組件
export default function HeaderMenu() {
  const { permissions, isLoggedIn, logout } = useGlobalStore();

  const getAuthLevel = () => {
    permissions.sys='admin';
    if (permissions.sys === 'admin') return 'admin';
    if (permissions.org === 'manager') return 'manager';
    return 'user';
  };

  const filteredMenu = filterMenuByAuth(menuItems, getAuthLevel());

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  const menuWithLogout = isLoggedIn
    ? [...filteredMenu.filter(item => item.label !== '登出'),
       { label: '登出', link: '#', onClick: handleLogout }]
    : filteredMenu;

  // Menu rendering function
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
          // 如果有 onClick 處理程序（例如登出），使用 <a>
          <a href={item.link} onClick={item.onClick}>
            {item.label}
          </a>
        ) : (
          // 否則使用 Next.js Link
          <Link href={item.link || '/'}>
            {item.label}
          </Link>
        )
      )}
    </li>
  ));
};

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-neutral text-neutral-content">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16">
                </path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">
           <Link href='/' className="btn btn-ghost text-xl">大型石化督導資料庫</Link>
          </div>
          <div className="hidden flex-none lg:block">
            {isLoggedIn ? (
              <ul className="menu menu-horizontal px-1">
                {renderMenuItems(menuWithLogout)}
              </ul>
            ) : (
              <a href="/Login" className="btn btn-ghost">登入</a>
            )}
          </div>
          <div className="flex-none">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {isLoggedIn ? (
            renderMenuItems(menuWithLogout)
          ) : (
            <li><a href="/Login">登入</a></li>
          )}
        </ul>
      </div>
    </div>
  );
}
