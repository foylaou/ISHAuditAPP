import React, {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import {authService} from "@/services/authService";
import {useRouter} from "next/navigation";
import {useGlobalStore} from "@/store/useGlobalStore";
import Image from "next/image";
import {userInfoStore} from "@/store/useUserinfoStore";
import {useAvatarStore} from "@/store/menuStore";
import {AvatarMenuItem} from "@/types/Menu/MainMenu";

interface PermissionInfo {
  module: string;
  level: string;
}

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

  // 為AvatarMenu生成唯一ID
  const avatarMenuId = "avatar-menu";
  const isAvatarMenuOpen = state === avatarMenuId;

  const handleLogout = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    // 使用順序：1. 全局狀態更新 2. 服務登出 3. 關閉選單 4. 導航
    logout(); // 先更新全局狀態
    authService.logout(); // 再調用服務登出
    setState(null); // 關閉選單
    router.push('/Login'); // 導航到登入頁面
  };

  const toggleMenu = () => {
    setState(isAvatarMenuOpen ? null : avatarMenuId);
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

    loadMenuItems();
  }, [isLoggedIn, fetchMenuItems]);

  // 處理子選單項目的渲染
  const renderMenuItems = (items: AvatarMenuItem[] | undefined, parentIndex: string = avatarMenuId) => {
    if (!items || items.length === 0) return [];

    return items.map((item, index) => {
      const currentIndex = `${parentIndex}-${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = state === currentIndex;

      return (
        <li key={`menu-item-${index}`}>
          {item.link ? (
            // 修復Link問題：不再在Link內部使用a標籤
            <Link
              href={item.link}
              className="justify-between"
              onClick={() => setState(null)}
            >
              {item.label}
            </Link>
          ) : hasChildren ? (
            // 有子選單的項目
            <div>
              <span
                className="justify-between cursor-pointer flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState(isOpen ? null : currentIndex);
                }}
              >
                {item.label}
                <span className="ml-2">▾</span>
              </span>
              {isOpen && hasChildren && (
                <ul className="p-2 bg-base-200 rounded-md mt-1">
                  {renderMenuItems(item.children || [], currentIndex)}
                </ul>
              )}
            </div>
          ) : (
            // 普通項目
            <span className="justify-between cursor-pointer">
              {item.label}
            </span>
          )}
        </li>
      );
    });
  };

  return (
    <>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
          onClick={toggleMenu}
        >
          <div className="w-10 rounded-full">
            <Image
              src={avatarImage}
              alt={`${name}'s avatar`}
              width={200}
              height={200}
            />
          </div>
        </div>
        {isAvatarMenuOpen && (
          <ul
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {isLoading ? (
              <li className="px-4 py-2">載入中...</li>
            ) : (
                <>
                  {/* 先渲染API菜单项（即使为空） */}
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

                        <li className="mt-4">
                          <Link
                              href="#"
                              className="cursor-pointer"
                              onClick={handleLogout}
                          >
                            登出
                          </Link>
                        </li>
                      </>
                  ) : (
                      <li className="mt-4">
                        <Link
                            href="/Login"
                            className="block"
                        >
                          登入
                        </Link>
                      </li>
                  )}
                </>
            )}
          </ul>
        )}
      </div>
    </>
  );
}
