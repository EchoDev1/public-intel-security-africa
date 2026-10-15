import React from 'react';

/**
 * Renders JSON-LD structured data for Google Rich Results.
 * Uses Next.js recommended XSS sanitization (escaping '<' to '\u003c').
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
