import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, MapPin, ArrowRight } from 'lucide-react';

export default function CommunityReportsPage() {
  const communityStories = [
    {
      id: 'comm-01',
      title: 'Local Vigilante & Hunter Guilds Forge Unified Border Watch along Lake Chad Riparian Towns',
      location: 'Borno / Diffa Border Sector',
      date: 'September 26, 2026',
      readTime: '4 min read',
      author: 'Mallam Ibrahim Kolo (Community Liaison)',
      coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      summary: 'How traditional hunter associations and civilian joint taskforces established solar-powered communication relays to protect farming settlements from nocturnal cattle rustling syndicates.'
    },
    {
      id: 'comm-02',
      title: 'Market Women Peace Committees Mediate Market Access in Disputed North-Central Pastoral Zones',
      location: 'Benue Valley Riparian Corridor',
      date: 'September 24, 2026',
      readTime: '5 min read',
      author: 'Grace Terhemba (Peacebuilding Lead)',
      coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      summary: 'An inspiring grassroots initiative where female grain traders established shared market arbitration councils, successfully reopening 12 rural weekly trade markets.'
    },
    {
      id: 'comm-03',
      title: 'Youth-Led Drone Mapping Prevents Illegal Riverbed Sand Mining in Coastal Estuaries',
      location: 'Badagry Littoral Creek',
      date: 'September 21, 2026',
      readTime: '4 min read',
      author: 'Tobi Adeleke (Eco-Security Youth)',
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      summary: 'Young technical apprentices deploy open-source aerial surveying to document shoreline erosion and unauthorized commercial dredging, safeguarding coastal fishing villages.'
    }
  ];

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest">
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          <span>Grassroots Resilience</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          Community Security Reports
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          Amplifying local voices, grassroots peace committees, community vigilante coordination, and civic resilience strategies across African neighborhoods and rural frontiers.
        </p>
      </div>

      {/* Community Spotlight Banner */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-bold text-slate-900 font-serif">
            Share Your Community&apos;s Peace & Security Initiatives
          </h3>
          <p className="text-xs md:text-sm text-slate-600">
            Are local peacebuilders, neighborhood watches, or elders resolving disputes in your region? Submit your community story to our editorial correspondents.
          </p>
        </div>
        <Link
          href="/contacts"
          className="px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 shrink-0 shadow-sm"
        >
          <span>Submit Community Story</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Community Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {communityStories.map((story) => (
          <div
            key={story.id}
            className="group rounded-2xl bg-white border border-slate-200 hover:border-amber-600 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-white/90 text-[10px] font-mono text-amber-800 font-bold border border-slate-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>{story.location}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug font-serif">
                {story.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {story.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="truncate max-w-[150px]">{story.author}</span>
              <span className="font-mono text-amber-800 font-bold">{story.readTime}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
