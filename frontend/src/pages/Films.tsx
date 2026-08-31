import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { Media } from '@/types';
import { Film, Play, Clock, MapPin } from 'lucide-react';
import { AnimatedHeading } from '@/components/Motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CinematicFilmModal from '@/components/CinematicFilmModal';

export default function Films() {
  const [selectedFilm, setSelectedFilm] = useState<Media | null>(null);

  const { data: films = [] } = useQuery<Media[]>({
    queryKey: ['media', 'films'],
    queryFn: () => apiGet<Media[]>('/media?type=video'),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Film className="w-4 h-4" />
            <span>4K Cinema & Acoustic Documentaries</span>
          </div>
          <AnimatedHeading
            text="Cinematic Films"
            accentFrom={1}
            testId="page-title"
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05]"
          />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            High frame-rate 4K documentary films accompanied by location-recorded acoustic percussion and nature soundscapes.
          </p>
        </div>

        {/* Films Grid */}
        <div data-testid="films-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {films.map((film) => (
            <div
              key={film.id}
              data-testid={`film-card-${film.id}`}
              onClick={() => setSelectedFilm(film)}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border/40 hover:border-[#D4AF37] transition-colors duration-500 cursor-pointer shadow-xl flex flex-col aspect-[16/10]"
            >
              <img
                src={film.thumbnail_url || film.file_url}
                alt={film.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1600ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Play Button Stage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all shadow-2xl shadow-[#D4AF37]/30">
                  <Play className="w-7 h-7 fill-black ml-0.5" />
                </div>
              </div>

              {/* Top Details */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37]">
                  4K CINEMA
                </span>
                {film.duration && (
                  <span className="text-xs font-mono text-white/90 bg-black/70 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {film.duration}
                  </span>
                )}
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                {film.location_name && (
                  <div className="text-xs font-mono text-[#D4AF37] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{film.location_name}</span>
                  </div>
                )}
                <h3 className="font-serif text-2xl text-white font-medium group-hover:text-[#D4AF37] transition-colors">
                  {film.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                  {film.short_description || film.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CinematicFilmModal
        media={selectedFilm}
        isOpen={Boolean(selectedFilm)}
        onClose={() => setSelectedFilm(null)}
      />

      <Footer />
    </div>
  );
}
