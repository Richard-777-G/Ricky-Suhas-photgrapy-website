import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { SiteSettings } from '@/types';
import { Camera, Music, Sparkles, ExternalLink } from 'lucide-react';
import { Instagram, Youtube } from '@/components/SocialIcons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: () => apiGet<SiteSettings>('/settings'),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
        {/* Header Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549223565-49541e8416dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
                alt="Ricky Suhas — International Nature Photographer & Percussionist"
                data-testid="about-profile-image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                  Beauty Seeker
                </span>
                <h3 className="font-serif text-2xl font-medium">Ricky Suhas</h3>
                <p className="text-xs text-white/80">Nature Visualist & Percussionist</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-[#D4AF37]/40 text-xs font-mono text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest">Philosophy of Exploration</span>
            </div>

            <h1
              data-testid="about-page-title"
              className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-foreground"
            >
              Take a moment to enjoy God's creation.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {settings?.about_text ||
                "Ricky Suhas travels across pristine wilderness, cloud forests, and high-altitude sanctuaries to chronicle the untamed elegance of the natural world. Combining visual storytelling with the acoustic pulse of live organic percussion, his work captures not merely images, but living atmospheres."}
            </p>

            <div className="p-6 rounded-2xl bg-card border border-border/40 space-y-2">
              <h4 className="font-serif text-lg text-foreground font-medium">The Dual Practice</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "As a photographer, I observe the silent geometry of dawn and fog. As a percussionist, I listen to the acoustic rhythms of falling rain, mountain wind, and ocean surf. When rhythm and optical clarity align, you feel the true heartbeat of creation."
              </p>
            </div>

            {/* Social Channels */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://www.instagram.com/rickysuhas/"
                target="_blank"
                rel="noreferrer"
                data-testid="about-instagram-link"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-[#D4AF37]/40 text-foreground hover:border-[#D4AF37] text-xs font-mono uppercase tracking-wider transition-all"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span>Instagram @rickysuhas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.youtube.com/@Rickysuhas0110"
                target="_blank"
                rel="noreferrer"
                data-testid="about-youtube-link"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-red-500/40 text-foreground hover:border-red-500 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>YouTube @Rickysuhas0110</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Technical Loadout & Percussion Gear */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border/40">
          {/* Optics */}
          <div className="p-8 rounded-3xl bg-card border border-border/40 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
              <Camera className="w-4 h-4" />
              <span>Optical & Cinema Systems</span>
            </div>
            <h3 className="font-serif text-2xl text-foreground font-medium">Camera Loadout</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {settings?.equipment_text ||
                'Sony Alpha 7R V (61MP Full-Frame), Sony FX6 Cinema Line, Sony FE 24-70mm f/2.8 GM II, FE 70-200mm f/2.8 GM OSS II, FE 200-600mm f/5.6-6.3 G OSS, FE 90mm f/2.8 Macro G, DJI Mavic 3 Pro Cine (Apple ProRes 422 HQ), Zoom F6 32-bit Float Field Recorder.'}
            </p>
          </div>

          {/* Percussion */}
          <div className="p-8 rounded-3xl bg-card border border-border/40 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
              <Music className="w-4 h-4" />
              <span>Acoustic Instrumentation</span>
            </div>
            <h3 className="font-serif text-2xl text-foreground font-medium">Percussion & Sound</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {settings?.percussion_text ||
                'Custom Maple Acoustic Drums, Meinl Byzance Cymbals, Handpan in D Celtic Minor, Djembe, West African Udu, and tuned organic shakers recorded on-location in wilderness environments.'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
