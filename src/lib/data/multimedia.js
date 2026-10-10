export const RADIO_STREAM = {
  stationName: 'Public Intel Security Africa Radio',
  tagline: '24/7 Strategic Security Broadcast, Tactical Briefings & Live Continental Intel',
  streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv', // high availability audio stream fallback
  fallbackAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  currentShow: 'The 0600 Hours Continental Intelligence Briefing',
  currentHost: 'Brigadier General (Ret.) Sarah Mwangi & Dr. Amina Touré',
  frequency: 'Online Worldwide • 98.5 FM Regional Relay (Abuja/Lagos/Nairobi)',
  bitrate: '320 kbps High-Fidelity Audio',
  listenersCount: 14280,
  schedule: [
    { time: '06:00 - 08:00 UTC', title: 'The 0600 Hours Continental Intelligence Briefing', host: 'Strategic Desk' },
    { time: '08:00 - 10:30 UTC', title: 'Maritime Watch: Gulf of Guinea & Red Sea Telemetry', host: 'Capt. Tariq Adeleke' },
    { time: '11:00 - 13:00 UTC', title: 'Cyber Vanguard Africa: Live Threat Desk', host: 'Farida Al-Mansoor' },
    { time: '14:00 - 16:30 UTC', title: 'Sahel Security Review & Field Dispatches', host: 'Dr. Amina Touré' },
    { time: '17:00 - 19:00 UTC', title: 'Women in Security Leadership Round-Table', host: 'Ambassador Grace Mensah' },
    { time: '20:00 - 22:00 UTC', title: 'Night Watch: Geopolitical Threat Radar & Live Call-In', host: 'Executive Newsroom' }
  ]
};

export const PODCAST_EPISODES = [
  {
    id: 'pod-001',
    showName: 'The Strategic Frontline',
    episodeNumber: 'EP 48',
    title: 'The Great Minerals Scramble: Defending Africa\'s Critical Green Energy Corridors',
    description: 'A deep-dive investigation into how private military contractors, sovereign defense pacts, and rail security task forces are defending copper, cobalt, and lithium transit from the Katanga Basin to global deepwater ports.',
    duration: '44:18',
    publishDate: 'September 26, 2026',
    host: 'Jerome Mukendi & Dr. Amina Touré',
    guest: 'Hon. Jean-Luc Kalombo (Ministry of Mines & Strategic Resources)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    downloads: '38.4k'
  },
  {
    id: 'pod-002',
    showName: 'Cyber Vanguard Africa',
    episodeNumber: 'EP 34',
    title: 'Anatomy of an APT: Countering State-Sponsored Cyber Incursions into Sovereign African Telecommunications',
    description: 'Forensic breakdown of advanced persistent threat group signatures targeting submarine fiber-optic landing stations and 5G core backbone routers across Eastern and Southern Africa.',
    duration: '52:10',
    publishDate: 'September 24, 2026',
    host: 'Farida Al-Mansoor',
    guest: 'Dr. Kwame Boateng (Director, Regional Cyber Defense Taskforce)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    downloads: '45.1k'
  },
  {
    id: 'pod-003',
    showName: 'Maritime Deep-Blue',
    episodeNumber: 'EP 29',
    title: 'Autonomous Skiffs, Radar Domes, and the New Era of Anti-Piracy in the Gulf of Guinea',
    description: 'How real-time satellite telemetry, multinational naval coordination, and uncrewed patrol vessels brought industrial piracy incidents down by 72% in West African waters.',
    duration: '38:45',
    publishDate: 'September 20, 2026',
    host: 'Capt. (Ret.) Tariq Adeleke',
    guest: 'Rear Admiral Samuel Baffour (CRESMAO Coordination Chief)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    downloads: '29.7k'
  },
  {
    id: 'pod-004',
    showName: 'Women in Security Voices',
    episodeNumber: 'EP 19',
    title: 'From the Frontline to the Peace Table: Female Commanders Shaping Ceasefire Architecture',
    description: 'An inspiring and hard-hitting conversation with female military commanders, police commissioners, and peace negotiators on transforming conflict zones through gender-responsive security reform.',
    duration: '48:30',
    publishDate: 'September 18, 2026',
    host: 'Brig. Gen. (Ret.) Sarah Mwangi',
    guest: 'Col. Fatoumata Keita (AU Peacekeeping Commander)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    downloads: '33.2k'
  }
];

export const TELEVISION_SHOWS = [
  {
    id: 'tv-001',
    title: 'Public Intel Security Africa Live: The Continental Evening Bulletin',
    category: 'Daily News Broadcast',
    duration: '28:40',
    broadcastTime: 'Live at 19:00 UTC Daily',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // or placeholder broadcast iframe
    description: 'Comprehensive daily security rundown: Sahelian troop movements, Gulf of Guinea patrol reports, cyber threat intelligence bulletins, and exclusive studio interviews with continental defense policymakers.',
    isLive: true,
    views: '84.2K views'
  },
  {
    id: 'tv-002',
    title: 'Special Investigation: Inside the High-Tech Forensics Labs Solving Transnational Wildlife Crime',
    category: 'Investigative Documentary',
    duration: '45:15',
    broadcastTime: 'Premiered September 25, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Public Intel Television correspondents go inside top-secret DNA sequencing and isotope testing facilities in Nairobi and Pretoria tracking global ivory and rhino horn trafficking syndicates.',
    isLive: false,
    views: '112.5K views'
  },
  {
    id: 'tv-003',
    title: 'The Diplomatic War Room: African Defense Ministers on Collective Sovereignty and Alliance Realignment',
    category: 'Strategic Panel Debate',
    duration: '54:20',
    broadcastTime: 'Premiered September 22, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'An unvarnished debate between former military chiefs and diplomatic envoys on the shifting architecture of African defense pacts and the exit of traditional foreign military bases.',
    isLive: false,
    views: '67.9K views'
  }
];

export const WEBINARS = [
  {
    id: 'web-001',
    title: 'Executive Summit: Deploying Artificial Intelligence in Sovereign Border Defense & Early Warning',
    date: 'October 14, 2026',
    time: '14:00 - 17:00 UTC',
    platform: 'Public Intel Virtual War Room (WebRTC Secure)',
    status: 'Open for Registration',
    fee: 'Accredited Free for Defense & Media Professionals',
    leadSpeaker: 'Dr. Chidi Okafor & AU Emerging Tech Directorate',
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    attendeesCount: 840,
    keyTopics: [
      'Satellite synthetic aperture radar integration for porous border surveillance',
      'Automated natural language processing for conflict early warning',
      'Civilian privacy safeguards and international humanitarian law compliance'
    ]
  },
  {
    id: 'web-002',
    title: 'Maritime Security Masterclass: Dark Fleet Interdiction and Subsea Infrastructure Defense',
    date: 'October 28, 2026',
    time: '13:00 - 16:30 UTC',
    platform: 'Public Intel Virtual War Room (WebRTC Secure)',
    status: 'Open for Registration',
    fee: 'Accredited Free',
    leadSpeaker: 'Capt. (Ret.) Tariq Adeleke & CRESMAO Naval Analysts',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    attendeesCount: 620,
    keyTopics: [
      'De-cloaking AIS-disabled smuggling tankers with space-based RF geolocation',
      'Protecting undersea telecommunications cables from anchor dragging and sabotage',
      'Legal frameworks for multinational maritime hot-pursuit'
    ]
  }
];
