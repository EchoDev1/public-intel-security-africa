import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { RadioProvider } from '@/context/RadioContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BreakingTicker from '@/components/BreakingTicker';
import RadioPlayerBar from '@/components/RadioPlayerBar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Public Intel Security Africa | Multi-Platform Security Intelligence Media',
  description: 'Public Intel Security Africa is a leading multi-platform security media production of Plugins Media Limited, dedicated to reshaping public discourse on security through informed journalism, expert analysis, strategic dialogue and solution-driven events.',
  keywords: [
    'African Security', 'National Security', 'Maritime Security', 'Forensics', 'Cybersecurity Africa',
    'Sahel Intelligence', 'Energy Security', 'Food Security', 'Plugins Media Limited', 'Public Intel Security'
  ],
  authors: [{ name: 'Public Intel Security Africa Editorial Board' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('pi-theme');
                if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <RadioProvider>
            <AuthProvider>
              <BreakingTicker />
              <Navbar />
              <main className="flex-1 w-full bg-white dark:bg-slate-950">
                {children}
              </main>
              <Footer />
              <RadioPlayerBar />
            </AuthProvider>
          </RadioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
