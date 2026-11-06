/**
 * Section Banners & Incoming Cards Utility
 * Public Intel Security Africa
 *
 * Dynamically maps categories and sections to professional incoming cards:
 * e.g., "WORLD NEWS & INTERNATIONAL DEFENSE NEWS INCOMING"
 *       "ECONOMIC & FINANCIAL SECURITY NEWS INCOMING"
 */

export function getSectionIncomingTitle(categoryNameOrSlug, article = null) {
  if (article?.isSpecialReport) {
    return 'SPECIAL INVESTIGATION & STRATEGIC DOSSIER INCOMING';
  }

  const raw = String(categoryNameOrSlug || '').toLowerCase().trim();

  // World News / International Desk
  if (raw.includes('world') || raw.includes('international') || raw.includes('geopolitic')) {
    return 'WORLD NEWS & INTERNATIONAL DEFENSE NEWS INCOMING';
  }

  // Economic & Financial Security
  if (raw.includes('economic') || raw.includes('financial') || raw.includes('trade-finance')) {
    return 'ECONOMIC & FINANCIAL SECURITY NEWS INCOMING';
  }

  // Special Reports
  if (raw.includes('special') || raw.includes('investigat') || raw.includes('dossier') || raw.includes('whitepaper')) {
    return 'SPECIAL INVESTIGATION & STRATEGIC DOSSIER INCOMING';
  }

  // Maritime Security
  if (raw.includes('maritime') || raw.includes('naval') || raw.includes('coastal') || raw.includes('gulf-of-guinea')) {
    return 'MARITIME & COASTAL SECURITY NEWS INCOMING';
  }

  // Cybersecurity
  if (raw.includes('cyber') || raw.includes('digital') || raw.includes('telecom') || raw.includes('ransomware')) {
    return 'CYBERSECURITY & DIGITAL THREAT NEWS INCOMING';
  }

  // Energy & Infrastructure
  if (raw.includes('energy') || raw.includes('infrastructure') || raw.includes('mineral') || raw.includes('power-grid')) {
    return 'ENERGY & INFRASTRUCTURE SECURITY NEWS INCOMING';
  }

  // Food Security
  if (raw.includes('food') || raw.includes('agri') || raw.includes('grain') || raw.includes('crop')) {
    return 'FOOD SECURITY & AGRO-DEFENSE NEWS INCOMING';
  }

  // National Security / Counter-Insurgency
  if (raw.includes('national') || raw.includes('defense') || raw.includes('border') || raw.includes('insurgency') || raw.includes('sahel')) {
    return 'NATIONAL SECURITY & DEFENSE NEWS INCOMING';
  }

  // Television / Broadcast Media
  if (raw.includes('tv') || raw.includes('television') || raw.includes('broadcast')) {
    return 'PUBLIC INTEL TELEVISION BROADCAST INCOMING';
  }

  // Podcasts / Radio
  if (raw.includes('podcast') || raw.includes('radio') || raw.includes('audio')) {
    return 'STRATEGIC AUDIO BRIEFING & PODCAST INCOMING';
  }

  // Training Academy
  if (raw.includes('training') || raw.includes('academy') || raw.includes('course')) {
    return 'TRAINING ACADEMY COURSE DISPATCH INCOMING';
  }

  // Photo Gallery
  if (raw.includes('gallery') || raw.includes('photo')) {
    return 'CONTINENTAL PHOTO ARCHIVE & FIELD LENS INCOMING';
  }

  // Community Watch
  if (raw.includes('community') || raw.includes('eyewitness') || raw.includes('grassroots')) {
    return 'COMMUNITY RESILIENCE & WATCH WIRE INCOMING';
  }

  // Women in Security
  if (raw.includes('women') || raw.includes('gender')) {
    return 'WOMEN IN SECURITY & STRATEGY DISPATCH INCOMING';
  }

  // Dynamic uppercase category name fallback
  if (categoryNameOrSlug && typeof categoryNameOrSlug === 'string' && categoryNameOrSlug.trim().length > 0) {
    const clean = categoryNameOrSlug.toUpperCase().trim();
    if (clean.endsWith('NEWS') || clean.endsWith('INCOMING')) {
      return `${clean}`;
    }
    return `${clean} NEWS INCOMING`;
  }

  return 'PUBLIC INTEL SECURITY NEWS INCOMING';
}

export function getSectionIncomingCompact(categoryNameOrSlug, article = null) {
  if (article?.isSpecialReport) {
    return 'SPECIAL INVESTIGATION\nDOSSIER INCOMING';
  }

  const raw = String(categoryNameOrSlug || '').toLowerCase().trim();

  if (raw.includes('world') || raw.includes('international')) {
    return 'WORLD & INTERNATIONAL\nNEWS INCOMING';
  }
  if (raw.includes('economic') || raw.includes('financial')) {
    return 'ECONOMIC & FINANCIAL\nNEWS INCOMING';
  }
  if (raw.includes('maritime') || raw.includes('naval')) {
    return 'MARITIME & COASTAL\nNEWS INCOMING';
  }
  if (raw.includes('cyber') || raw.includes('digital')) {
    return 'CYBER & DIGITAL\nNEWS INCOMING';
  }
  if (raw.includes('energy') || raw.includes('infrastructure')) {
    return 'ENERGY & INFRASTRUCTURE\nNEWS INCOMING';
  }
  if (raw.includes('food') || raw.includes('agri')) {
    return 'FOOD & AGRO-DEFENSE\nNEWS INCOMING';
  }
  if (raw.includes('national') || raw.includes('defense')) {
    return 'NATIONAL DEFENSE\nNEWS INCOMING';
  }
  if (raw.includes('tv') || raw.includes('television')) {
    return 'PUBLIC INTEL TV\nBROADCAST INCOMING';
  }
  if (raw.includes('podcast') || raw.includes('audio')) {
    return 'AUDIO BRIEFING\nPODCAST INCOMING';
  }

  return 'PUBLIC INTEL\nNEWS INCOMING';
}
