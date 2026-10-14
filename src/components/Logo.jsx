'use client';

import React from 'react';
import Link from 'next/link';

export default function Logo({ 
  variant = 'light', // 'light' for white/auto backgrounds, 'dark' for permanently dark backgrounds (footer)
  size = 'default',  // 'compact', 'default', 'large'
  showTagline = true,
  href = '/'
}) {
  const isPermanentlyDark = variant === 'dark';

  // Precision responsive height mappings tailored to the authentic 4.28:1 logo aspect ratio
  const logoHeights = {
    compact: 'h-7 sm:h-8',
    default: 'h-8 sm:h-9 md:h-10 lg:h-11',
    large: 'h-11 sm:h-13 md:h-15'
  };

  const Content = (
    <div className="flex flex-col justify-center select-none group">
      {/* Authentic Master Brand Graphic Lockup (Exact words and symbol from official branding) */}
      <div className="relative inline-flex items-center">
        {isPermanentlyDark ? (
          /* Permanently Dark Surfaces (e.g., Global Footer) */
          <img
            src="/images/logo/logo-dark.png"
            alt="Public Intel Security Africa"
            className={`${logoHeights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]`}
            loading="eager"
            decoding="async"
          />
        ) : (
          /* Responsive to Theme (Seamless Instant Switch with Zero Hydration Mismatch) */
          <>
            <img
              src="/images/logo/logo-light.png"
              alt="Public Intel Security Africa"
              className={`${logoHeights[size]} w-auto object-contain block dark:hidden transition-transform duration-200 group-hover:scale-[1.01]`}
              loading="eager"
              decoding="async"
            />
            <img
              src="/images/logo/logo-dark.png"
              alt="Public Intel Security Africa"
              className={`${logoHeights[size]} w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-[1.01]`}
              loading="eager"
              decoding="async"
            />
          </>
        )}
      </div>

      {/* Shorter, Highly Detailed & Fine Credential Tagline */}
      {showTagline && (
        <div className="mt-1 flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[9px] md:text-[9.5px] uppercase font-mono tracking-wider">
          <span className={`font-bold ${isPermanentlyDark ? 'text-amber-400' : 'text-amber-700 dark:text-amber-400'}`}>
            PLUGINS MEDIA
          </span>
          <span className={`text-[7px] ${isPermanentlyDark ? 'text-slate-600' : 'text-slate-400 dark:text-slate-600'}`}>•</span>
          <span className={`font-medium ${isPermanentlyDark ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
            Security Media Production
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-hidden">
        {Content}
      </Link>
    );
  }

  return Content;
}
