# Public Intel Security Africa

> **A Multi-Platform Security Media Production of Plugins Media Limited**
> *Africa's Vanguard in Strategic Security Intelligence, Defense Doctrine, and Investigative Journalism.*

---

## 🛡️ Overview

**Public Intel Security Africa** is an enterprise-grade, solid, and modern news and content publishing platform designed for high-authority security journalism, geopolitical analysis, defense masterclasses, and multimedia broadcasting across Africa.

Built using **Next.js (App Router)**, **Tailwind CSS**, and **JavaScript**, with full **Supabase** backend architecture and curated **Unsplash** photojournalism.

---

## 🌟 Key Features & Scope

### 1. Complete 25 Areas of Security Coverage
- **National Security** & **Internal Security**
- **Geopolitics** & **World News**
- **Forensics** & Scientific Criminal Justice
- **Food Security**, **Data Security**, & **Human Security**
- **Climate Change and Security** & **Environmental Security**
- **Health Security** & **Economic / Financial Security**
- **Cybersecurity & Digital Security**
- **Maritime Security** (Gulf of Guinea, Red Sea, Blue Economy)
- **Textile Security**, **Border Security**, & **Migration**
- **Energy Security** (Critical Mineral Corridors: Cobalt, Lithium, Copper)
- **Election Security**, **Governance and Public Policy**, & **Democracy & Governance**
- **Gender, Women, Peace and Security** (UNSCR 1325 implementation)
- **Youth, Innovation and Security** & **AI / Emerging Technologies**
- **Organized Crime and Transnational Threats**

### 2. Specialized Media Divisions & Hubs
- **Special Investigative Reports**: Deep longform dossiers with data findings and PDF briefing exports.
- **Community Reports**: Grassroots security developments, neighborhood watches, and peace committees.
- **Eye Witness & Whistleblower Portal**: Zero-knowledge encrypted incident reporting with anonymous tracking identifiers (`PISA-EYE-XXXX`).
- **Public Intel Security Africa Radio**: 24/7 continuous live audio stream with persistent player bar, schedule, and on-demand archives.
- **Public Intel Security Africa Television (PI-TV)**: Broadcast studio video player and documentary investigative series.
- **Webinars & Masterclasses**: Strategic dialogues, keynote speakers, and interactive RSVP registration.
- **Security Podcast Network**: Specialized shows with guest interviews and transcripts.
- **Women in Security Leadership Forum**: Spotlighting female military commanders, cyber chiefs, and peace negotiators.
- **Security Training Academy**: Accredited certifications (OSINT, HEAT tactical field awareness, and SCADA cyber defense).
- **News & Photographic Gallery**: Visual photo essays and field photography.
- **Continental Threat Matrix**: Real-time regional risk & stability radar scores.
- **Newsroom CMS Dashboard (`/admin`)**: Article publishing, eyewitness queue management, and Supabase telemetry.

---

## ⚡ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom editorial animations
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security policies)
- **Icons**: Lucide React
- **Audio/Radio Engine**: Global AudioContext with fallback stream resilience
- **Images**: Remote Unsplash photojournalism integration

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Optional for Live DB)
Copy `.env.example` to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Execute the database migration located at `supabase/schema.sql` inside your Supabase SQL Editor.

*(Note: The platform features an automated resilient state engine, operating with 100% functionality even before Supabase keys are configured).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🏢 Organization & Production
**Public Intel Security Africa** is produced by **Plugins Media Limited**.
- Regional Bureaus: Abuja / Lagos (Nigeria), Nairobi (Kenya), Johannesburg (South Africa), Cairo (Egypt).
