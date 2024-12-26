//layout
'use client';
import '@/styles/globals.css';
import React, { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import HeaderMenu from '@/components/HeaderMenu';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import {MantineProvider} from "@mantine/core";
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    ModuleRegistry.registerModules([AllEnterpriseModule]);

    LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-067721}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Industrial_Safety_And_Health_Association_(ISHA)_Of_The_R.O.C}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{}_need_to_be_licensed___{}_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{27_October_2025}____[v3]_[0102]_MTc2MTUyMzIwMDAwMA==14fa603063a97c2c3a7a73a15786443e");
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
