import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { RadioProvider } from '@/context/RadioContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BreakingTicker from '@/components/BreakingTicker';
import RadioPlayerBar from '@/components/RadioPlayerBar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/config/site';

const baseUrl = new URL(SITE_CONFIG.url);

export const metadata = {
  metadataBase: baseUrl,
  title: {
    default: `${SITE_CONFIG.name} | Multi-Platform Security Intelligence Media`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.defaultKeywords,
  authors: [{ name: 'Public Intel Security Africa Editorial Board', url: SITE_CONFIG.url }],
  creator: 'Plugins Media Limited',
  publisher: SITE_CONFIG.publisher.name,
  applicationName: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/images/logo/favicon-symbol.png',
    apple: '/images/logo/favicon-symbol.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | Multi-Platform Security Intelligence Media`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/images/logo/logo-dark.png',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Official Intelligence Banner`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    site: SITE_CONFIG.socials.twitterHandle,
    creator: SITE_CONFIG.socials.twitterHandle,
    images: ['/images/logo/logo-dark.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const globalSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['NewsMediaOrganization', 'Organization'],
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      legalName: SITE_CONFIG.publisher.legalName,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo/logo-dark.png`,
        width: 600,
        height: 120,
      },
      sameAs: [
        SITE_CONFIG.socials.twitter,
        SITE_CONFIG.socials.linkedin,
        SITE_CONFIG.socials.youtube,
        SITE_CONFIG.socials.facebook,
      ],
      publishingPrinciples: `${SITE_CONFIG.url}/about`,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'editorial desk',
        url: `${SITE_CONFIG.url}/contacts`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.url}/#website`,
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
      publisher: {
        '@id': `${SITE_CONFIG.url}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.url}/coverage?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
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
        <JsonLd data={globalSchema} />
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
