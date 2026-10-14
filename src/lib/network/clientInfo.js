/**
 * Client and Network Information Utility
 * Supports Cloudflare edge proxy headers, standard proxies, and local development.
 */

const COUNTRY_NAMES = {
  NG: 'Nigeria',
  KE: 'Kenya',
  ZA: 'South Africa',
  GH: 'Ghana',
  EG: 'Egypt',
  RW: 'Rwanda',
  ET: 'Ethiopia',
  TZ: 'Tanzania',
  UG: 'Uganda',
  CI: "Côte d'Ivoire",
  SN: 'Senegal',
  CM: 'Cameroon',
  CD: 'DR Congo',
  SD: 'Sudan',
  MA: 'Morocco',
  DZ: 'Algeria',
  TN: 'Tunisia',
  MZ: 'Mozambique',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  AO: 'Angola',
  US: 'United States',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  CA: 'Canada',
  AE: 'United Arab Emirates'
};

export function getClientInfo(request) {
  // 1. Cloudflare True Client IP & Country Headers
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const cfCountry = request.headers.get('cf-ipcountry');
  const cfRay = request.headers.get('cf-ray');

  // 2. Standard Forwarded Proxy Headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  let ip = 'Secured / Private IP';
  if (cfConnectingIp) {
    ip = cfConnectingIp.trim();
  } else if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  }

  // Sanitize loopback / localhost for clarity
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = 'Local Development IP';
  }

  const userAgent = request.headers.get('user-agent') || 'Public Intel Web Portal';

  // Format Country Name
  let countryFormatted = null;
  if (cfCountry && cfCountry !== 'XX' && cfCountry !== 'T1') {
    const code = cfCountry.toUpperCase();
    const name = COUNTRY_NAMES[code] || code;
    countryFormatted = `${name} (${code})`;
  }

  return {
    ip,
    country: countryFormatted,
    userAgent,
    cfRay,
    isCloudflare: Boolean(cfConnectingIp || cfRay)
  };
}
