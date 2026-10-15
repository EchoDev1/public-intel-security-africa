import { SITE_CONFIG } from '@/lib/config/site';

/**
 * Dynamic robots.txt generation for Next.js App Router
 */
export default function robots() {
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/account',
          '/account/',
          '/dashboard',
          '/dashboard/',
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/admin/', '/account/', '/dashboard/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
