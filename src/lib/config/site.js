/**
 * Site-wide configuration and SEO metadata defaults
 * Public Intel Security Africa (Plugins Media Limited)
 */

export const SITE_CONFIG = {
  name: 'Public Intel Security Africa',
  shortName: 'Public Intel Africa',
  description:
    'Public Intel Security Africa is a leading multi-platform security media production of Plugins Media Limited, dedicated to reshaping public discourse on security through informed journalism, expert analysis, strategic dialogue, and solution-driven events.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://publicintelsecurity.africa',
  ogImage: '/images/logo/logo-dark.png',
  publisher: {
    name: 'Plugins Media Limited',
    legalName: 'Plugins Media Limited',
    url: 'https://pluginsmedia.com',
    logo: '/images/logo/logo-dark.png',
  },
  socials: {
    twitter: 'https://x.com/publicintel_af',
    twitterHandle: '@PublicIntel_AF',
    linkedin: 'https://linkedin.com/company/public-intel-security-africa',
    youtube: 'https://youtube.com/@publicintelsecurityafrica',
    facebook: 'https://facebook.com/publicintelsecurityafrica',
  },
  defaultKeywords: [
    'African Security',
    'National Security Africa',
    'Maritime Security Gulf of Guinea',
    'Sahel Intelligence Counter-Terrorism',
    'Forensics and Biometrics Africa',
    'Cybersecurity Critical Infrastructure',
    'Energy Security Africa',
    'Food Security Africa',
    'Defense Geopolitics',
    'Public Intel Security Africa',
    'Plugins Media Limited',
  ],
};
