import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import type { Location, Media } from '@/types';
import { Compass, Play } from 'lucide-react';
import { AnimatedHeading } from '@/components/Motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveMap from '@/components/InteractiveMap';
import SpatialPhotoModal from '@/components/SpatialPhotoModal';
import CinematicFilmModal from '@/components/CinematicFilmModal';
import VerticalReelPlayer from '@/components/VerticalReelPlayer';

export default function Places() {
  const [searchParams] = useSearchParams();
  const initialLocId = searchParams.get('location') || undefined;

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Media | null>(null);
  const [selectedReel, setSelectedReel] = useState<Media | null>(null);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => apiGet<Location[]>('/locations'),
  });

  const activeLocId = selectedLocation?.id || initialLocId || locations[0]?.id;

  const { data: locationWorks = [] } = useQuery<Media[]>({
    queryKey: ['media', 'location', activeLocId],
    queryFn: () => {
      if (!activeLocId) return Promise.resolve([]);
      return apiGet<Media[]>(`/media?location_id=${activeLocId}`);
    },
    enabled: Boolean(activeLocId),
  });

  const photosOnly = locationWorks.filter((m) => m.type === 'photo');
  const activeLocationObj = locations.find((l) => l.id === activeLocId) || locations[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Compass className="w-4 h-4" />
            <span>Geographical Dimensions & Expeditions</span>
          </div>
          <AnimatedHeading
            text="Places & Topography"
            accentFrom={1}
            testId="page-title"
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05]"
          />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Ricky treats geography as a first-class dimension. Explore high-altitude passes, ancient rainforests, and coastal cliffs categorized by exact GPS coordinates.
          </p>
        </div>

        {/* Interactive Topographical Map Component */}
        <InteractiveMap
          locations={locations}
          selectedLocationId={activeLocId}
          onSelectLocation={(loc) => setSelectedLocation(loc)}
        />

        {/* Works in Selected Location */}
        {activeLocationObj && (
          <div className="space-y-6 pt-6 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase">
                  Archived Works in {activeLocationObj.place_name}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
                  Location Gallery ({locationWorks.length} Items)
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationWorks.map((item) => {
                const isVideo = item.type === 'video';
                const isReel = item.type === 'reel';

                return (
                  <div
                    key={item.id}
                    data-testid={`place-work-${item.id}`}
                    onClick={() => {
                      if (isVideo) setSelectedFilm(item);
                      else if (isReel) setSelectedReel(item);
                      else setSelectedPhoto(item);
                    }}
                    className="group relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-[#D4AF37] transition-colors duration-500 cursor-pointer shadow-lg aspect-[16/11]"
                  >
                    <img
                      src={item.thumbnail_url || item.file_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1400ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {(isVideo || isReel) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 space-y-1">
                      <div className="text-[10px] font-mono text-[#D4AF37] uppercase">{item.category}</div>
                      <h4 className="font-serif text-lg text-white font-medium group-hover:text-[#D4AF37] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/80 line-clamp-2">
                        {item.short_description || item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <SpatialPhotoModal
        media={selectedPhoto}
        mediaList={photosOnly}
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        onSelectMedia={(m) => setSelectedPhoto(m)}
      />

      <CinematicFilmModal
        media={selectedFilm}
        isOpen={Boolean(selectedFilm)}
        onClose={() => setSelectedFilm(null)}
      />

      <VerticalReelPlayer
        media={selectedReel}
        isOpen={Boolean(selectedReel)}
        onClose={() => setSelectedReel(null)}
      />

      <Footer />
    </div>
  );
}
