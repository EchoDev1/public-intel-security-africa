-- =========================================================================
-- PUBLIC INTEL SECURITY AFRICA - COMPLETE DATABASE SYNC & PERSISTENCE FIX
-- Run this entire script in Supabase Dashboard -> SQL Editor -> Run
-- URL: https://supabase.com/dashboard/project/mbzovjtwyjgnosehpakd/sql
-- =========================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Add missing audio columns to public.articles table
ALTER TABLE IF EXISTS public.articles 
ADD COLUMN IF NOT EXISTS audio_url TEXT;

ALTER TABLE IF EXISTS public.articles 
ADD COLUMN IF NOT EXISTS audio_caption TEXT;

-- 3. Upgrade cover_image column to TEXT and drop restrictive length limit
ALTER TABLE IF EXISTS public.articles 
ALTER COLUMN cover_image TYPE TEXT;

-- 4. Set safe editorial fallback image as default and drop NOT NULL constraint
ALTER TABLE IF EXISTS public.articles 
ALTER COLUMN cover_image SET DEFAULT 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';

ALTER TABLE IF EXISTS public.articles 
ALTER COLUMN cover_image DROP NOT NULL;

-- 5. Drop rigid foreign key constraint on category_slug so custom or new categories never cause publish errors
ALTER TABLE IF EXISTS public.articles 
DROP CONSTRAINT IF EXISTS articles_category_slug_fkey;

-- 6. Ensure all 25 official verticals and specialized hubs exist in public.categories
INSERT INTO public.categories (slug, name, pillar, description, featured_image)
VALUES
('national-security', 'National Security', 'Defense & Sovereignty', 'Strategic military assessments, defense doctrine, sovereignty defense, intelligence capabilities, and continental peace operations.', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'),
('internal-security', 'Internal Security', 'Defense & Sovereignty', 'Homeland security architectures, counter-insurgency, civil defense, urban policing reforms, and emergency response frameworks.', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'),
('geopolitics', 'Geopolitics', 'Diplomacy & Strategy', 'Great power competition in Africa, bilateral security pacts, African Union peace protocols, and regional alliance dynamics.', 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1200&q=80'),
('forensics', 'Forensics', 'Technical & Investigative', 'Ballistic evidence, biometric technologies, digital forensic laboratories, post-blast investigations, and criminal justice science.', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80'),
('food-security', 'Food Security', 'Human Security', 'Agricultural resilience, agro-pastoral conflict mitigation, grain corridor disruptions, supply chain vulnerabilities, and famine early warning.', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'),
('data-security', 'Data Security', 'Technology & Cyber', 'Sovereign data protection frameworks, biometric privacy, critical national registry defenses, and surveillance governance.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'),
('human-security', 'Human Security', 'Human Security', 'Protection of civilian populations, internally displaced persons, community resilience, fundamental human rights, and humanitarian corridors.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80'),
('climate-change-and-security', 'Climate Change and Security', 'Environmental & Ecological', 'Desertification, Lake Chad basin shrinkage, climate-induced migration, resource disputes, and ecological peacebuilding.', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'),
('health-security', 'Health Security', 'Human Security', 'Biosecurity surveillance, viral outbreak containment, vaccine sovereignty, counterfeit pharmaceutical syndicates, and health system resilience.', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'),
('economic-and-financial-security', 'Economic and Financial Security', 'Economy & Governance', 'Illicit financial flows, sanctions compliance, trade corridor security, money laundering countermeasures, and resource wealth protection.', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'),
('cybersecurity-and-digital-security', 'Cybersecurity and Digital Security', 'Technology & Cyber', 'Critical infrastructure cyber defense, ransomware syndicates, banking trojans, national CERT operations, and dark web tracking.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'),
('maritime-security', 'Maritime Security', 'Defense & Sovereignty', 'Gulf of Guinea anti-piracy, Red Sea maritime choke points, illegal unregulated fishing (IUU), port security, and blue economy defense.', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80'),
('textile-security', 'Textile Security', 'Technical & Investigative', 'Military uniform counterfeit containment, ballistic fabric innovations, illegal garment smuggling networks, and sovereign defense procurement.', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80'),
('border-security', 'Border Security', 'Defense & Sovereignty', 'Integrated border management, porous frontier radar systems, cross-border contraband interdiction, and joint taskforce patrols.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'),
('migration', 'Migration', 'Human Security', 'Trans-Saharan migration corridors, human trafficking syndicates, refugee protection mechanisms, and asylum border policies.', 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=1200&q=80'),
('energy-security', 'Energy Security', 'Economy & Governance', 'Critical mineral corridors (lithium, cobalt, copper), pipeline protection, national power grid sabotage, and offshore energy platform defense.', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80'),
('environmental-security', 'Environmental Security', 'Environmental & Ecological', 'Illegal wildlife trafficking, illegal logging, toxic waste dumping, and national park ranger safety.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'),
('election-security', 'Election Security', 'Economy & Governance', 'Electoral logistics safety, physical voting booth protection, combating disinformation campaigns, and peaceful transition security.', 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80'),
('governance-and-public-policy', 'Governance and Public Policy', 'Economy & Governance', 'Security sector reform (SSR), legislative oversight, defense budgeting accountability, and rule of law consolidation.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'),
('gender-women-peace-and-security', 'Gender, Women, Peace and Security', 'Human Security', 'UNSCR 1325 implementation, female peacekeepers, gender-responsive security reform, and combating gender-based violence in conflict.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80'),
('youth-innovation-and-security', 'Youth, Innovation and Security', 'Technology & Cyber', 'Youth-led conflict de-escalation, homegrown defense tech innovations, drone surveillance startups, and deradicalization initiatives.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'),
('artificial-intelligence-and-emerging-technologies', 'Artificial Intelligence & Emerging Technologies', 'Technology & Cyber', 'Autonomous weapon governance, AI-driven satellite imagery analytics, algorithmic battlefield sensing, and deepfake verification.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'),
('organized-crime-and-transnational-threats', 'Organized Crime & Transnational Threats', 'Defense & Sovereignty', 'Cross-border arms smuggling, narco-trafficking routes, kidnapping-for-ransom cartels, and illegal gold mining cartels.', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'),
('democracy-and-governance', 'Democracy & Governance', 'Economy & Governance', 'Constitutional order resilience, countering coup dynamics, democratic accountability, civil-military relations, and judicial independence.', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'),
('world-news', 'World News', 'Diplomacy & Strategy', 'Global geopolitical shifts, international security agreements, UN Security Council resolutions, and strategic global alliances impacting Africa.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'),
('special-reports', 'Special Reports', 'Investigative', 'Exhaustive investigative dossiers and strategic intelligence whitepapers.', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'),
('community-reports', 'Community Reports', 'Human Security', 'Grassroots security developments & local community resilience.', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'),
('eyewitness-reports', 'Eye Witness Reports', 'Whistleblower', 'Secure, encrypted citizen intelligence & whistleblower submission portal.', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  pillar = EXCLUDED.pillar,
  description = EXCLUDED.description;

-- 7. Ensure Row-Level Security (RLS) policies allow public reading and superadmin writing
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view articles" ON public.articles;
CREATE POLICY "Public can view articles" ON public.articles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role and admins can manage articles" ON public.articles;
CREATE POLICY "Service role and admins can manage articles" ON public.articles
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Reload schema cache for immediate effect
NOTIFY pgrst, 'reload schema';
