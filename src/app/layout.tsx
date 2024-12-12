//layout
'use client'
import '@/styles/globals.css'; // 引入全局 CSS 檔案
import HeaderMenu from '@/components/HeaderMenu';
import Footer from '@/components/Footer';
import React, {useEffect, useState} from "react";
import {useGlobalStore} from "@/store/useGlobalStore";






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
        <html lang="zh" data-theme={theme}>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>大型石化督導資料庫</title>
        </head>
        <body className="h-screen flex flex-col">
        <HeaderMenu/>
        <div className="flex flex-col flex-1">
            <main className="flex-1 pt-24 bg-base-100">{children}</main>
        </div>
        <Footer/>
        </body>
        </html>
    );
}
