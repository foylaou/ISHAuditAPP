
import '@/styles/globals.css'; // 引入全局 CSS 檔案
import HeaderMenu from '@/components/HeaderMenu';
import Footer from '@/components/Footer';
// ✅ Correct order - your styles will override Mantine styles
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';


import { createTheme, MantineProvider, rem } from '@mantine/core';

const theme = createTheme({
  colors: {
    // Add your color
    deepBlue: [
      '#eef3ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc1',
      '#5f7cb8',
      '#5474b4',
      '#44639f',
      '#39588f',
      '#2d4b81',
    ],
    // or replace default theme color
    blue: [
      '#eef3ff',
      '#dee2f2',
      '#bdc2de',
      '#98a0ca',
      '#7a84ba',
      '#6672b0',
      '#5c68ac',
      '#4c5897',
      '#424e88',
      '#364379',
    ],
  },

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <MantineProvider theme={theme}>
          <div className="min-h-screen flex-col ">
            <HeaderMenu  />
            <main className="pt-16">{children}</main>
            <Footer />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
