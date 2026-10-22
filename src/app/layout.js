import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { SidebarProvider } from './context/SidebarContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Modul UTS – Algoritma & Rekursi',
  description:
    'Modul pembelajaran interaktif: Menara Hanoi, Palindrom, Bilangan Prima, dan Segitiga Pascal',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0e1a',
};


export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <SidebarProvider>
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <Topbar />
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
