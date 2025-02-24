import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/useGlobalStore";
import Image from "next/image";
import { userInfoStore } from "@/store/useUserinfoStore";
import { useAvatarStore } from "@/store/menuStore";
import { AvatarMenuItem } from "@/types/Menu/MainMenu";
import * as Icons from "lucide-react";
import { motion ,AnimatePresence } from "motion/react"

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
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarMenuId = "avatar-menu";
  const isAvatarMenuOpen = state === avatarMenuId;

  const handleLogout = (e?: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent) => {
    e?.preventDefault();
    logout();
    authService.logout();
    setState(null);
    router.push('/Login');
  };

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setState(isAvatarMenuOpen ? null : avatarMenuId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isAvatarMenuOpen) {
      setState(null);
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

    loadMenuItems();

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

  const renderMenuItems = (items: AvatarMenuItem[] | undefined, parentIndex: string = avatarMenuId) => {
    if (!items || items.length === 0) return [];

    return items.map((item, index) => {
      const currentIndex = `${parentIndex}-${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = state === currentIndex;

      return (
        <motion.li
          key={`menu-item-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          {item.link ? (
            <Link
              href={item.link}
              className="justify-between flex items-center p-2 hover:bg-base-200 rounded-md"
              onClick={() => setState(null)}
              role="menuitem"
              tabIndex={0}
            >
              {item.label}
            </Link>
          ) : hasChildren ? (
            <div>
              <motion.span
                className="justify-between cursor-pointer flex items-center p-2 hover:bg-base-200 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState(isOpen ? null : currentIndex);
                }}
                role="menuitem"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`submenu-${currentIndex}`}
              >
                {item.label}
                <motion.span
                  className="ml-2"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▾
                </motion.span>
              </motion.span>
              <AnimatePresence>
                {isOpen && hasChildren && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 bg-base-200 rounded-md mt-1"
                    role="menu"
                    id={`submenu-${currentIndex}`}
                  >
                    {renderMenuItems(item.children || [], currentIndex)}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <span
              className="justify-between cursor-pointer p-2 hover:bg-base-200 rounded-md flex items-center"
              tabIndex={0}
              role="menuitem"
            >
              {item.label}
            </span>
          )}
        </motion.li>
      );
    });
  };

  return (
    <div ref={menuRef} onKeyDown={handleKeyDown} className="relative">
      <div className="dropdown dropdown-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-haspopup="true"
          aria-expanded={isAvatarMenuOpen}
          aria-controls="avatar-dropdown-menu"
          className="btn btn-ghost btn-circle avatar focus:ring-2 focus:ring-primary focus:outline-none"
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
        </motion.button>

        <AnimatePresence>
          {isAvatarMenuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              id="avatar-dropdown-menu"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              role="menu"
            >
              {isLoading ? (
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-2"
                  role="none"
                >
                  載入中...
                </motion.li>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <p className="font-medium text-2xl">
                      {Username}
                    </p>
                    <p className="text-sm text-gray-600 ml-2">
                      您好
                    </p>
                  </motion.div>
                  <div className="divider my-1"></div>
                  {renderMenuItems(AvatarMenuItems)}

                  {isLoggedIn ? (
                    <motion.li
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                      role="none"
                    >
                      <Link
                        href="#"
                        className="flex gap-2 cursor-pointer p-2 hover:bg-base-200 rounded-md"
                        onClick={handleLogout}
                        role="menuitem"
                        tabIndex={0}
                      >
                        <Icons.LogOut size={20} aria-hidden="true" />
                        登出
                      </Link>
                    </motion.li>
                  ) : (
                    <motion.li
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                      role="none"
                    >
                      <Link
                        href="/Login"
                        className="flex gap-2 p-2 hover:bg-base-200 rounded-md"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <Icons.LogIn size={20} aria-hidden="true" />
                        登入
                      </Link>
                    </motion.li>
                  )}
                </>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

