import React, {useEffect, useState, useRef} from "react";
import Link from "next/link";
import {authService} from "@/services/authService";
import {useRouter} from "next/navigation";
import {useGlobalStore} from "@/store/useGlobalStore";
import Image from "next/image";
import {userInfoStore} from "@/store/useUserinfoStore";
import {useAvatarStore} from "@/store/menuStore";
import {AvatarMenuItem} from "@/types/Menu/MainMenu";
import * as Icons from "lucide-react";

interface AvatarMenuProps {
  name: string;
  image?: string;
  state: string | null;
  setState: (state: string | null) => void;
}

export default function AvatarMenu(props: AvatarMenuProps) {
  const { name, image, state, setState } = props;
  const { isLoggedIn, logout } = useGlobalStore();
  const router = useRouter();
  const avatarImage = image || "/avatar_default.svg";
  const { AvatarMenuItems, fetchMenuItems } = useAvatarStore();
  const { Username } = userInfoStore();
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // 用於處理點擊外部關閉

  // 為AvatarMenu生成唯一ID
  const avatarMenuId = "avatar-menu";
  const isAvatarMenuOpen = state === avatarMenuId;

  const handleLogout = (e?: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent) => {
    e?.preventDefault();
    // 使用順序：1. 全局狀態更新 2. 服務登出 3. 關閉選單 4. 導航
    logout(); // 先更新全局狀態
    authService.logout(); // 再調用服務登出
    setState(null); // 關閉選單
    router.push('/Login'); // 導航到登入頁面
  };

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // 防止事件冒泡
    setState(isAvatarMenuOpen ? null : avatarMenuId);
  };

  // 處理鍵盤快捷鍵關閉菜單
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isAvatarMenuOpen) {
      setState(null);
    }
  };

  // 處理菜單項目的鍵盤導航 - 使用更嚴格的類型
  const handleMenuItemKeyDown = (
    e: React.KeyboardEvent,
    action?: (e: React.KeyboardEvent) => void
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action) action(e);
    }
  };

  useEffect(() => {
    const loadMenuItems = async () => {
      if (isLoggedIn) {
        setIsLoading(true);
        try {
          await fetchMenuItems();
        } catch (error) {
          console.error("Failed to fetch menu items:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMenuItems().then();

    // 點擊外部關閉菜單
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isAvatarMenuOpen) {
        setState(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoggedIn, fetchMenuItems, isAvatarMenuOpen, setState]);

  // 處理子選單項目的渲染，添加鍵盤支持
  const renderMenuItems = (items: AvatarMenuItem[] | undefined, parentIndex: string = avatarMenuId) => {
    if (!items || items.length === 0) return [];

    return items.map((item, index) => {
      const currentIndex = `${parentIndex}-${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = state === currentIndex;

      return (
        <li key={`menu-item-${index}`}>
          {item.link ? (
            <Link
              href={item.link}
              className="justify-between flex items-center p-2 hover:bg-base-200 rounded-md"
              onClick={() => setState(null)}
              onKeyDown={(e) => handleMenuItemKeyDown(e, () => {
                setState(null);
                router.push(item.link || '/');
              })}
              role="menuitem"
              tabIndex={0}
            >
              {item.label}
            </Link>
          ) : hasChildren ? (
            <div>
              <span
                className="justify-between cursor-pointer flex items-center p-2 hover:bg-base-200 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState(isOpen ? null : currentIndex);
                }}
                onKeyDown={(e) => handleMenuItemKeyDown(e, () => setState(isOpen ? null : currentIndex))}
                role="menuitem"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`submenu-${currentIndex}`}
              >
                {item.label}
                <span className="ml-2">▾</span>
              </span>
              {isOpen && hasChildren && (
                <ul
                  className="p-2 bg-base-200 rounded-md mt-1"
                  role="menu"
                  id={`submenu-${currentIndex}`}
                >
                  {renderMenuItems(item.children || [], currentIndex)}
                </ul>
              )}
            </div>
          ) : (
            <span
              className="justify-between cursor-pointer p-2 hover:bg-base-200 rounded-md flex items-center"
              tabIndex={0}
              role="menuitem"
              onKeyDown={(e) => handleMenuItemKeyDown(e)}
            >
              {item.label}
            </span>
          )}
        </li>
      );
    });
  };

  return (
    <div ref={menuRef} onKeyDown={handleKeyDown} className="relative">
      <div className="dropdown dropdown-end">
        <button
          aria-haspopup="true"
          aria-expanded={isAvatarMenuOpen}
          aria-controls="avatar-dropdown-menu"
          className="btn btn-ghost btn-circle avatar focus:ring-2 focus:ring-primary focus:outline-none"
          onClick={toggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleMenu();
            }
          }}
        >
          <div className="w-10 rounded-full">
            <Image
              src={avatarImage}
              alt={`${name}'s avatar`}
              width={200}
              height={200}
            />
          </div>
        </button>
        {isAvatarMenuOpen && (
          <ul
            id="avatar-dropdown-menu"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            role="menu"
          >
            {isLoading ? (
              <li className="px-4 py-2" role="none">載入中...</li>
            ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <p className="font-medium text-2xl">
                      {Username}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      您好
                    </p>
                  </div>
                  <div className="divider my-1"></div>
                  {renderMenuItems(AvatarMenuItems)}

                  {/* 默认选项（始终显示） */}
                  {isLoggedIn ? (
                    <>
                      <li className="mt-4" role="none">
                        <Link
                          href="#"
                          className="flex gap-2 cursor-pointer p-2 hover:bg-base-200 rounded-md"
                          onClick={handleLogout}
                          onKeyDown={(e) => handleMenuItemKeyDown(e, () => handleLogout(e))}
                          role="menuitem"
                          tabIndex={0}
                        >
                          <Icons.LogOut size={20} aria-hidden="true" />
                          登出
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li className="mt-4" role="none">
                      <Link
                        href="/Login"
                        className="flex gap-2 p-2 hover:bg-base-200 rounded-md"
                        onKeyDown={(e) => handleMenuItemKeyDown(e, () => router.push('/Login'))}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <Icons.LogIn size={20} aria-hidden="true" />
                        登入
                      </Link>
                    </li>
                  )}
                </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
