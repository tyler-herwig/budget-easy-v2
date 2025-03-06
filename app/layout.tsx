import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import theme from './theme';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider'
import './globals.css';
import { CssBaseline } from '@mui/material';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
   return (
     <html lang="en">
      <body className={roboto.variable}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ReactQueryClientProvider>
                {props.children}
              </ReactQueryClientProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
       </body>
     </html>
   );
 }