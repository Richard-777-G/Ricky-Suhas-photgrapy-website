import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { Media } from '@/types';
import { Play, MapPin } from 'lucide-react';
import { Instagram } from '@/components/SocialIcons';
import { AnimatedHeading } from '@/components/Motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerticalReelPlayer from '@/components/VerticalReelPlayer';

export default function Reels() {
  const [selectedReel, setSelectedReel] = useState<Media | null>(null);

  const { data: reels = [] } = useQuery<Media[]>({
    queryKey: ['media', 'reels'],
    queryFn: () => apiGet<Media[]>('/media?type=reel'),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Instagram className="w-4 h-4" />
            <span>Vertical Expeditions & Nature Reels</span>
          </div>
          <AnimatedHeading
            text="Moments & Reels"
            accentFrom={1}
            testId="page-title"
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05]"
          />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Short-form vertical visual journeys and field recordings straight from Ricky's Instagram feed (@rickysuhas).
          </p>
        </div>

        {/* Reels Grid */}
        <div data-testid="reels-feed-grid" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              data-testid={`reel-feed-card-${reel.id}`}
              onClick={() => setSelectedReel(reel)}
              className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-card border border-border/40 hover:border-[#D4AF37] transition-colors duration-500 cursor-pointer shadow-xl flex flex-col justify-between p-4"
            >
              <img
                src={reel.thumbnail_url || reel.file_url}
                alt={reel.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1400ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

              {/* Top Bar */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/60 border border-white/20 text-[#D4AF37]">
                  REEL
                </span>
                <div className="p-2 rounded-full bg-black/60 border border-white/20 text-[#D4AF37]">
                  <Play className="w-3.5 h-3.5 fill-[#D4AF37]" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="relative z-10 space-y-1 mt-auto">
                {reel.location_name && (
                  <div className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{reel.location_name.split(' ')[0]}</span>
                  </div>
                )}
                <h3 className="font-serif text-sm sm:text-base text-white font-medium line-clamp-1">
                  {reel.title}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-2">
                  {reel.short_description || reel.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <VerticalReelPlayer
        media={selectedReel}
        isOpen={Boolean(selectedReel)}
        onClose={() => setSelectedReel(null)}
      />

      <Footer />
    </div>
  );
}
