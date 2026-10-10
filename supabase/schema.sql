-- =========================================================================
-- PUBLIC INTEL SECURITY AFRICA - COMPLETE PRODUCTION DATABASE SCHEMA
-- Plugins Media Limited Security Media Platform
-- Execute this entire script directly in your Supabase SQL Editor
-- =========================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 2. CORE TABLES CREATION
-- =========================================================================

-- 2.0 OFFICIAL ADMINISTRATOR REGISTRY (Super Admin & Newsroom Editors)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'super_admin',
    title VARCHAR(150) DEFAULT 'Executive Director & Chief Editor',
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.1 CATEGORIES & COVERAGE VERTICALS (Official 25 Verticals)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    pillar VARCHAR(100) DEFAULT 'General Security',
    icon_name VARCHAR(50),
    featured_image VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 ARTICLES & STRATEGIC INTELLIGENCE DOSSIERS
-- Enhanced with Photo & Video support across all dossiers
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(350) NOT NULL,
    subtitle TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category_slug VARCHAR(100) REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE SET NULL,
    category_name VARCHAR(150) NOT NULL,
    author_name VARCHAR(150) NOT NULL DEFAULT 'Lady Dakore Ekpendu',
    author_role VARCHAR(150) DEFAULT 'Executive Director & Chief Editor',
    author_avatar VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    -- Photo Media Room
    cover_image VARCHAR(500) NOT NULL,
    cover_caption TEXT DEFAULT 'Dispatch photo: Public Intel Security Africa field lens.',
    gallery_images JSONB DEFAULT '[]'::jsonb,
    -- Video Media Room (permits uploaded video files & streaming links)
    video_url VARCHAR(500),
    video_caption TEXT,
    threat_level VARCHAR(30) DEFAULT 'Guarded' CHECK (threat_level IN ('Critical', 'Elevated', 'Guarded', 'Low', 'Advisory')),
    region VARCHAR(100) NOT NULL DEFAULT 'Pan-African',
    country VARCHAR(100),
    read_time VARCHAR(20) DEFAULT '6 min read',
    is_breaking BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_special_report BOOLEAN DEFAULT FALSE,
    is_community_report BOOLEAN DEFAULT FALSE,
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    sources JSONB DEFAULT '[]'::jsonb,
    views_count INT DEFAULT 120,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 EYEWITNESS REPORTS & CONFIDENTIAL WHISTLEBLOWER TELEMETRY
-- Permits photo uploads and gallery video evidence
CREATE TABLE IF NOT EXISTS public.eyewitness_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    location_description VARCHAR(255) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    category_slug VARCHAR(100),
    narrative TEXT NOT NULL,
    media_url VARCHAR(500),
    video_url VARCHAR(500),
    video_file_name VARCHAR(255),
    source_alias VARCHAR(150) DEFAULT 'Anonymous Whistleblower',
    contact_email_encrypted TEXT,
    verification_status VARCHAR(50) DEFAULT 'Under Review' CHECK (verification_status IN ('Under Review', 'Verified & Dispatched', 'Flagged as High Urgency', 'Archived')),
    risk_level VARCHAR(30) DEFAULT 'Medium' CHECK (risk_level IN ('Critical', 'High', 'Medium', 'Low')),
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.4 COMMUNITY SECURITY REPORTS
-- Local community field telemetry with Photo and Video support
CREATE TABLE IF NOT EXISTS public.community_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    location VARCHAR(200) NOT NULL,
    region VARCHAR(100) NOT NULL,
    category_slug VARCHAR(100),
    summary TEXT NOT NULL,
    details TEXT,
    photo_url VARCHAR(500),
    video_url VARCHAR(500),
    author_alias VARCHAR(150) DEFAULT 'Community Observer',
    status VARCHAR(50) DEFAULT 'Published' CHECK (status IN ('Published', 'Pending Review', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.5 MULTIMEDIA & BROADCAST OPERATIONS (Radio, Television, Podcasts)
CREATE TABLE IF NOT EXISTS public.multimedia_episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('radio', 'television', 'podcast', 'webinar', 'video_intel')),
    show_name VARCHAR(200) NOT NULL,
    title VARCHAR(350) NOT NULL,
    description TEXT,
    media_url VARCHAR(500) NOT NULL,
    video_url VARCHAR(500),
    cover_image VARCHAR(500),
    duration VARCHAR(50),
    broadcast_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    host_name VARCHAR(150),
    guest_names JSONB DEFAULT '[]'::jsonb,
    transcript TEXT,
    is_live BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.6 WEBINARS & TRAINING ACADEMY (Masterclasses & Certified Courses)
CREATE TABLE IF NOT EXISTS public.events_and_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('webinar', 'training_course', 'masterclass', 'summit')),
    title VARCHAR(300) NOT NULL,
    theme VARCHAR(255),
    description TEXT,
    instructor_or_lead VARCHAR(200),
    instructor_credentials TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration VARCHAR(50),
    location_or_platform VARCHAR(200) DEFAULT 'Public Intel Virtual War Room (WebRTC Secure)',
    certification_provided BOOLEAN DEFAULT TRUE,
    fee_type VARCHAR(50) DEFAULT 'Accredited Free' CHECK (fee_type IN ('Free', 'Accredited Free', 'Executive Premium')),
    status VARCHAR(50) DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'On-Demand')),
    cover_image VARCHAR(500),
    video_preview_url VARCHAR(500),
    registration_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.7 WOMEN IN SECURITY DIRECTORY & EXECUTIVE PROFILES
CREATE TABLE IF NOT EXISTS public.women_in_security (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    title_and_role VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    specialization VARCHAR(150),
    featured_quote TEXT,
    image_url VARCHAR(500),
    video_interview_url VARCHAR(500),
    achievements JSONB DEFAULT '[]'::jsonb,
    is_spotlight BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.8 NEWSLETTER & INTEL BRIEFING SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscriber_tier VARCHAR(50) DEFAULT 'Executive Daily Brief',
    interests JSONB DEFAULT '["National Security", "Cybersecurity", "Geopolitics", "Economic Security"]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 PARTNERSHIP & COLLABORATION INQUIRIES
CREATE TABLE IF NOT EXISTS public.partnership_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    partnership_pillar VARCHAR(150) NOT NULL,
    country VARCHAR(100),
    proposal_summary TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Received' CHECK (status IN ('Received', 'In Review', 'Partner Meeting Scheduled', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.10 CONTINENTAL THREAT RADAR INDEX
CREATE TABLE IF NOT EXISTS public.threat_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_name VARCHAR(100) NOT NULL,
    threat_level VARCHAR(30) NOT NULL CHECK (threat_level IN ('Critical', 'Elevated', 'Guarded', 'Low')),
    primary_threat_vector VARCHAR(200) NOT NULL,
    trend VARCHAR(30) DEFAULT 'Stable' CHECK (trend IN ('Escalating', 'Stable', 'De-escalating', 'Volatile')),
    last_assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    briefing_notes TEXT
);

-- =========================================================================
-- 3. PROVISION OFFICIAL SUPER ADMIN: LADY DAKORE EEPENDU
-- =========================================================================

-- 3.1 Insert into public.admin_users registry
INSERT INTO public.admin_users (email, full_name, role, title, status)
VALUES (
    'Ekpendudakore@gmail.com',
    'Lady Dakore Ekpendu',
    'super_admin',
    'Executive Director & Chief Editor',
    'Active'
)
ON CONFLICT (email) DO UPDATE SET
    full_name = 'Lady Dakore Ekpendu',
    role = 'super_admin',
    title = 'Executive Director & Chief Editor',
    status = 'Active';

-- 3.2 Provision Lady Dakore directly into Supabase Auth with Pre-Confirmed Email
-- Uses safe conditional check to prevent 42P10 index mismatch errors across Supabase versions
DO $$
DECLARE
    dakore_user_id UUID := gen_random_uuid();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE LOWER(email) = 'ekpendudakore@gmail.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            dakore_user_id,
            'authenticated',
            'authenticated',
            'Ekpendudakore@gmail.com',
            crypt('ladydakore@artellium90', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Lady Dakore Ekpendu","role":"super_admin"}'::jsonb,
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );

        -- Optional identity record
        BEGIN
            INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                provider_id,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                dakore_user_id,
                dakore_user_id,
                format('{"sub":"%s","email":"%s"}', dakore_user_id::text, 'Ekpendudakore@gmail.com')::jsonb,
                'email',
                dakore_user_id::text,
                NOW(),
                NOW(),
                NOW()
            );
        EXCEPTION WHEN OTHERS THEN
            -- Ignore identity table schema differences if managed by Supabase Auth hook
            NULL;
        END;
    ELSE
        -- Update existing user credentials safely without ON CONFLICT
        UPDATE auth.users
        SET encrypted_password = crypt('ladydakore@artellium90', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            raw_user_meta_data = '{"full_name":"Lady Dakore Ekpendu","role":"super_admin"}'::jsonb
        WHERE LOWER(email) = 'ekpendudakore@gmail.com';
    END IF;
END $$;

-- 3.4 Helper Security Function: is_admin()
-- Grants administrative permissions to Lady Dakore or any registered active super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'ekpendudakore@gmail.com' OR
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')) 
      AND status = 'Active'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- 4. STORAGE BUCKETS (FOR PHOTOS, GALLERIES & VIDEOS)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('articles-media', 'articles-media', true),
    ('eyewitness-media', 'eyewitness-media', true),
    ('videos', 'videos', true),
    ('community-media', 'community-media', true),
    ('multimedia', 'multimedia', true),
    ('training-media', 'training-media', true),
    ('women-in-security', 'women-in-security', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Security Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Articles Media') THEN
        CREATE POLICY "Public Access for Articles Media" ON storage.objects FOR SELECT USING (bucket_id = 'articles-media');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Videos') THEN
        CREATE POLICY "Public Access for Videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Eyewitness Media') THEN
        CREATE POLICY "Public Access for Eyewitness Media" ON storage.objects FOR SELECT USING (bucket_id = 'eyewitness-media');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Upload for Eyewitness Media') THEN
        CREATE POLICY "Public Upload for Eyewitness Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'eyewitness-media');
    END IF;
    -- Full Storage Access for Lady Dakore & Admins
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Full Storage Control') THEN
        CREATE POLICY "Admin Full Storage Control" ON storage.objects FOR ALL 
        USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;
END $$;

-- =========================================================================
-- 5. HIGH-PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON public.articles(is_breaking);
CREATE INDEX IF NOT EXISTS idx_articles_special_report ON public.articles(is_special_report);
CREATE INDEX IF NOT EXISTS idx_eyewitness_tracking ON public.eyewitness_reports(tracking_code);
CREATE INDEX IF NOT EXISTS idx_multimedia_type ON public.multimedia_episodes(type);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events_and_training(event_date ASC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- =========================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eyewitness_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multimedia_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_and_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.women_in_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_indicators ENABLE ROW LEVEL SECURITY;

-- 6.1 Public Read Policies
DROP POLICY IF EXISTS "Public read for categories" ON public.categories;
CREATE POLICY "Public read for categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for articles" ON public.articles;
CREATE POLICY "Public read for articles" ON public.articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for community reports" ON public.community_reports;
CREATE POLICY "Public read for community reports" ON public.community_reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for multimedia" ON public.multimedia_episodes;
CREATE POLICY "Public read for multimedia" ON public.multimedia_episodes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for events and training" ON public.events_and_training;
CREATE POLICY "Public read for events and training" ON public.events_and_training FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for women in security" ON public.women_in_security;
CREATE POLICY "Public read for women in security" ON public.women_in_security FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for threat indicators" ON public.threat_indicators;
CREATE POLICY "Public read for threat indicators" ON public.threat_indicators FOR SELECT USING (true);

-- 6.2 Public Insert Policies (Public Submissions)
DROP POLICY IF EXISTS "Public submit eyewitness reports" ON public.eyewitness_reports;
CREATE POLICY "Public submit eyewitness reports" ON public.eyewitness_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public submit community reports" ON public.community_reports;
CREATE POLICY "Public submit community reports" ON public.community_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public submit partnership inquiries" ON public.partnership_inquiries;
CREATE POLICY "Public submit partnership inquiries" ON public.partnership_inquiries FOR INSERT WITH CHECK (true);

-- 6.3 Dedicated Admin Permissions (Empowered by is_admin())
DROP POLICY IF EXISTS "Admin write access for articles" ON public.articles;
CREATE POLICY "Admin write access for articles" ON public.articles FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for categories" ON public.categories;
CREATE POLICY "Admin write access for categories" ON public.categories FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for eyewitness" ON public.eyewitness_reports;
CREATE POLICY "Admin write access for eyewitness" ON public.eyewitness_reports FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for community reports" ON public.community_reports;
CREATE POLICY "Admin write access for community reports" ON public.community_reports FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for multimedia" ON public.multimedia_episodes;
CREATE POLICY "Admin write access for multimedia" ON public.multimedia_episodes FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for events" ON public.events_and_training;
CREATE POLICY "Admin write access for events" ON public.events_and_training FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for women in security" ON public.women_in_security;
CREATE POLICY "Admin write access for women in security" ON public.women_in_security FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for threat indicators" ON public.threat_indicators;
CREATE POLICY "Admin write access for threat indicators" ON public.threat_indicators FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin write access for admin_users" ON public.admin_users;
CREATE POLICY "Admin write access for admin_users" ON public.admin_users FOR ALL 
USING (public.is_admin() OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- =========================================================================
-- 7. OFFICIAL 25 SECURITY VERTICALS SEED DATA
-- =========================================================================
INSERT INTO public.categories (slug, name, pillar, description, display_order) VALUES
('national-security', 'National Security', 'Defense & Sovereignty', 'Strategic military assessments, defense doctrine, sovereignty defense, intelligence capabilities, and continental peace operations.', 1),
('internal-security', 'Internal Security', 'Defense & Sovereignty', 'Homeland security architectures, counter-insurgency, civil defense, urban policing reforms, and emergency response frameworks.', 2),
('geopolitics', 'Geopolitics', 'Diplomacy & Strategy', 'Great power competition in Africa, bilateral security pacts, African Union peace protocols, and regional alliance dynamics.', 3),
('forensics', 'Forensics', 'Technical & Investigative', 'Ballistic evidence, biometric technologies, digital forensic laboratories, post-blast investigations, and criminal justice science.', 4),
('food-security', 'Food Security', 'Human Security', 'Agricultural resilience, agro-pastoral conflict mitigation, grain corridor disruptions, supply chain vulnerabilities, and famine early warning.', 5),
('data-security', 'Data Security', 'Technology & Cyber', 'Sovereign data protection frameworks, biometric privacy, critical national registry defenses, and surveillance governance.', 6),
('human-security', 'Human Security', 'Human Security', 'Refugee protection, civilian defense in conflict zones, internally displaced persons tracking, human rights monitors, and humanitarian access.', 7),
('climate-change-and-security', 'Climate Change and Security', 'Environmental Security', 'Desertification in the Sahel, Lake Chad basin shrinkage, climate migration, resource-driven ethnic clashes, and environmental defense.', 8),
('health-security', 'Health Security', 'Biological & Health', 'Epidemic surveillance, bio-threat counter-measures, porous border quarantine, pharmaceutical supply security, and health infrastructure resilience.', 9),
('economic-and-financial-security', 'Economic and Financial Security', 'Financial & Sovereign', 'Anti-money laundering, illicit financial flows, trade corridor resilience, sovereign debt vulnerabilities, and macroeconomic defense.', 10),
('cybersecurity-and-digital-security', 'Cybersecurity and Digital Security', 'Technology & Cyber', 'Critical national infrastructure protection, state-sponsored cyber warfare, ransomware tracking against banking switches, and defense telecommunications.', 11),
('maritime-security', 'Maritime Security', 'Territorial & Marine', 'Gulf of Guinea anti-piracy, Red Sea choke-points, illegal fishing interdiction, offshore oil rig protection, and port security.', 12),
('textile-security', 'Textile Security', 'Industrial & Supply Chain', 'Cotton and textile supply chain integrity, anti-counterfeiting in military apparel, industrial sabotage, and local manufacturing defense.', 13),
('aviation-security', 'Aviation Security', 'Critical Infrastructure', 'Airspace surveillance, airport perimeter defense, drone threat mitigation, air traffic management resilience, and counter-hijacking protocols.', 14),
('border-security', 'Border Security', 'Territorial & Marine', 'Smart border technologies, biometric checkpoints, counter-smuggling corridors, integrated border management, and pastoral transit zones.', 15),
('energy-security', 'Energy Security', 'Critical Infrastructure', 'Power grid cyber-physical protection, oil pipeline sabotage defense, renewable transition security, and energy corridor resilience.', 16),
('intelligence-and-counter-terrorism', 'Intelligence and Counter-Terrorism', 'Intelligence & Operations', 'Clandestine intelligence gathering, terror cell infiltration, terrorist financing disruption, SIGINT analysis, and deradicalization.', 17),
('critical-infrastructure-protection', 'Critical Infrastructure Protection', 'Critical Infrastructure', 'Hardening bridges, dams, telecommunications nodes, electrical switches, and government digital platforms against asymmetric attacks.', 18),
('mining-and-natural-resources-security', 'Mining and Natural Resources Security', 'Resource & Environmental', 'Artisanal mining regulation, conflict mineral interdiction (coltan, gold, diamonds), critical minerals defense, and concession protection.', 19),
('wildlife-and-environmental-security', 'Wildlife and Environmental Security', 'Resource & Environmental', 'Anti-poaching ranger taskforces, illicit ivory syndicate tracking, forestry reserve protection, and transboundary park sovereignty.', 20),
('chemical-biological-radiological-nuclear-security', 'CBRN Security', 'Defense & Sovereignty', 'CBRN incident preparedness, radioactive source tracking, dual-use chemical monitoring, lab biosecurity, and emergency decontamination.', 21),
('space-and-satellite-security', 'Space and Satellite Security', 'Strategic Frontiers', 'Orbital defense, sovereign Earth observation satellites, dual-use communication links, geospatial intelligence, and space asset protection.', 22),
('telecommunications-security', 'Telecommunications Security', 'Technology & Cyber', 'Subsea fiber-optic cable defense, 5G security architectures, satellite ground station hardening, and telecom outage mitigation.', 23),
('water-security', 'Water Security', 'Resource & Environmental', 'Transboundary river treaties (Nile, Niger, Zambezi), dam safety, groundwater depletion monitoring, and hydro-political dispute resolution.', 24),
('corporate-and-industrial-security', 'Corporate and Industrial Security', 'Private & Enterprise', 'Executive physical protection, supply chain risk management, enterprise espionage defense, and private security regulation.', 25)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    pillar = EXCLUDED.pillar,
    description = EXCLUDED.description;
