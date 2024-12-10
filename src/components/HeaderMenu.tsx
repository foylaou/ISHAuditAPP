'use client'

import { IconChevronDown, IconSearch, IconMenu2, IconX } from '@tabler/icons-react';
import { Menu, Autocomplete } from '@mantine/core';
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { useState } from "react";

interface NavigationLink {
  link: string;
  label: string;
  links?: NavigationLink[];
}

const navigationLinks: NavigationLink[] = [
  { link: '/Home', label: '首頁' },
  { link: '/Login', label: '登入' },
  {
    link: '#1',
    label: '帳號管理',
    links: [
      { link: '/SignUp', label: '新增帳號' },
      { link: '/UserEdit', label: '修改人員帳號' },
    ],
  },
];

const HeaderMenu: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMenuItems = (links: NavigationLink[]): React.ReactNode => {
    return links.map((item) => (
      <Menu.Item
        key={item.link}
        className="hover:bg-gray-100 px-4 py-2 text-sm"
      >
        <Link href={item.link} className="block w-full text-gray-700 hover:text-gray-900">
          {item.label}
        </Link>
      </Menu.Item>
    ));
  };

  const renderNavigationItems = navigationLinks.map((link: NavigationLink) => {
    if (link.links) {
      const menuItems = renderMenuItems(link.links);

      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <button
              type="button"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              <span className="mr-1">{link.label}</span>
              <IconChevronDown size={14} stroke={1.5} />
            </button>
          </Menu.Target>
          <Menu.Dropdown className="bg-white rounded-lg shadow-lg">
            {menuItems}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        key={link.link}
        href={link.link}
        className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
      >
        {link.label}
      </Link>
    );
  });

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {renderNavigationItems}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-[15rem] ml-4">
            <Autocomplete
              placeholder="搜尋..."
              leftSection={<IconSearch size={16} />}
              data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
              value={searchValue}
              onChange={setSearchValue}
              className="w-full"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <IconX size={24} />
            ) : (
              <IconMenu2 size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-200 ease-in-out ${
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-1 pointer-events-none'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {/* Mobile Search */}
            <div className="p-2">
              <Autocomplete
                placeholder="搜尋..."
                leftSection={<IconSearch size={16} />}
                data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                value={searchValue}
                onChange={setSearchValue}
                className="w-full"
              />
            </div>

            {/* Mobile Navigation Links */}
            {navigationLinks.map((link: NavigationLink) => {
              if (link.links) {
                return (
                  <div key={link.label} className="space-y-1">
                    <div className="px-3 py-2 text-gray-600 font-medium">
                      {link.label}
                    </div>
                    {link.links.map((subLink) => (
                      <Link
                        key={subLink.link}
                        href={subLink.link}
                        className="block px-3 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md ml-4"
                        onClick={() => setIsMobileMenuOpen(false)} // 添加這行
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                );
              }

              return (
                <Link
                  key={link.link}
                  href={link.link}
                  className="block px-3 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)} // 添加這行
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderMenu;
