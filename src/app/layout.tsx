//layout
'use client';
import '@/styles/globals.css';
import React, { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import HeaderMenu from '@/components/HeaderMenu';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import {MantineProvider} from "@mantine/core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useGlobalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme ? 'dark' : 'light');
    }
  }, [theme, mounted]);

  return (
      <html lang="zh" data-theme={theme ? 'dark' : 'light'}>
      <head>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>大型石化督導資料庫</title>
      </head>
      <body className="min-h-screen flex flex-col">
      <div className="drawer flex-1 flex flex-col">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle"/>
          <div className="h-screen flex flex-col">
              <HeaderMenu/>
              <main className="flex-1 pt-24 bg-base-100">
                   <MantineProvider>
                  {children}
                       </MantineProvider>
              </main>
              <Footer/>
          </div>
          <Sidebar/>
      </div>
      </body>
      </html>
  );
}
