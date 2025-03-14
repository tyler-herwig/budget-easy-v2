import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import theme from './theme';
import { AppProvider } from '@/components/AppProvider'
import './globals.css';
import { CssBaseline } from '@mui/material';

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700"] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
   return (
     <html lang="en">
      <body className={inter.className}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppProvider>
                {props.children}
              </AppProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
       </body>
     </html>
   );
 }