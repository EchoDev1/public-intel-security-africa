import { computeArticles } from '@/lib/data/articles';
import { SITE_CONFIG } from '@/lib/config/site';

/**
 * RSS 2.0 Feed for Google News, Feedly, and Media Syndication
 */
export async function GET() {
  const articles = computeArticles();
  const baseUrl = SITE_CONFIG.url;

  const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const itemsXml = articles
    .map((article) => {
      const pubDate = new Date(article.publishedAt || Date.now()).toUTCString();
      const articleUrl = `${baseUrl}/article/${article.slug}`;

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.excerpt || article.subtitle || '')}</description>
      <category>${escapeXml(article.categoryName)}</category>
      <author>${escapeXml(article.author?.name || 'Public Intel Africa Editorial Board')}</author>
      ${article.coverImage ? `<enclosure url="${escapeXml(article.coverImage)}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('');

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(feedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
