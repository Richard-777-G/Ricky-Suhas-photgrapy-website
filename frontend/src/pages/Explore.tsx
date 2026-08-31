import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import type { Media } from '@/types';
import { Search, Camera, Film, Play, MapPin, Sparkles } from 'lucide-react';
import { AnimatedHeading } from '@/components/Motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpatialPhotoModal from '@/components/SpatialPhotoModal';
import CinematicFilmModal from '@/components/CinematicFilmModal';
import VerticalReelPlayer from '@/components/VerticalReelPlayer';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') || 'all';
  const activeCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Media | null>(null);
  const [selectedReel, setSelectedReel] = useState<Media | null>(null);

  const { data: media = [], isLoading } = useQuery<Media[]>({
    queryKey: ['media', activeType, activeCategory, searchQuery],
    queryFn: () => {
      let url = `/media?limit=100`;
      if (activeType !== 'all') url += `&type=${activeType}`;
      if (activeCategory !== 'all') url += `&category=${encodeURIComponent(activeCategory)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      return apiGet<Media[]>(url);
    },
  });

  const categories = ['All', 'Landscape', 'Wildlife', 'Aerial', 'Macro', 'Ocean', 'Travel', 'Other'];
  const mediaTypes = [
    { label: 'All Works', value: 'all' },
    { label: 'Photography', value: 'photo' },
    { label: 'Cinematic Films', value: 'video' },
    { label: 'Vertical Reels', value: 'reel' },
  ];

  const handleTypeChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'all') params.delete('type');
    else params.set('type', val);
    setSearchParams(params);
  };

  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'All') params.delete('category');
    else params.set('category', val);
    setSearchParams(params);
  };

  const photosOnly = media.filter((m) => m.type === 'photo');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Digital Visual Archive</span>
          </div>
          <AnimatedHeading
            text="Explore Creation"
            accentFrom={1}
            testId="page-title"
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-foreground tracking-tight leading-[1.05]"
          />
          <p className="text-sm text-muted-foreground max-w-xl">
            Filter through high-resolution photography, 4K film trailers, and vertical expeditions chronicled by Ricky Suhas.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-4 p-5 rounded-2xl bg-card border border-border/60 shadow-lg">
          {/* Search bar & Type toggles */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search places, species, optics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="explore-search-input"
                className="w-full pl-10 pr-4 py-2 text-xs font-mono rounded-xl bg-background border border-border/60 focus:border-[#D4AF37] focus:outline-none text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Type selector */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {mediaTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleTypeChange(t.value)}
                  data-testid={`filter-type-${t.value}`}
                  className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg transition-all ${
                    activeType === t.value
                      ? 'bg-[#D4AF37] text-black font-semibold'
                      : 'bg-background hover:bg-border/40 text-muted-foreground'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-border/30 pb-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground shrink-0">Category:</span>
            {categories.map((cat) => {
              const isSelected = (activeCategory === 'all' && cat === 'All') || activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  data-testid={`filter-category-${cat.toLowerCase()}`}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-semibold'
                      : 'hover:bg-border/30 text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Results Grid */}
        <div data-testid="explore-results-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => {
            const isVideo = item.type === 'video';
            const isReel = item.type === 'reel';

            return (
              <div
                key={item.id}
                data-testid={`explore-card-${item.id}`}
                onClick={() => {
                  if (isVideo) setSelectedFilm(item);
                  else if (isReel) setSelectedReel(item);
                  else setSelectedPhoto(item);
                }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-[#D4AF37] transition-colors duration-500 cursor-pointer shadow-md hover:shadow-2xl flex flex-col"
              >
                <div className={`relative w-full overflow-hidden ${isReel ? 'aspect-[9/16]' : 'aspect-[16/11]'}`}>
                  <img
                    src={item.thumbnail_url || item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1400ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 border border-white/20 text-[#D4AF37] backdrop-blur-md">
                    {isVideo && <Film className="w-3 h-3" />}
                    {isReel && <Camera className="w-3 h-3" />}
                    <span>{item.type.toUpperCase()}</span>
                  </div>

                  {/* Play icon for videos */}
                  {(isVideo || isReel) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </div>
                    </div>
                  )}

                  {item.duration && (
                    <div className="absolute top-3 right-3 text-[10px] font-mono text-white/80 bg-black/70 px-2 py-0.5 rounded backdrop-blur-md">
                      {item.duration}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37]">
                      <span>{item.category}</span>
                      {item.location_name && (
                        <span className="flex items-center gap-1 opacity-80">
                          <MapPin className="w-2.5 h-2.5" />
                          {item.location_name.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg text-foreground font-medium group-hover:text-[#D4AF37] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.short_description || item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {media.length === 0 && !isLoading && (
          <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl p-8 space-y-2">
            <p className="font-serif text-xl text-foreground">No works found matching this query.</p>
            <p className="text-xs font-mono text-muted-foreground">Try adjusting your filters or search keywords.</p>
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
