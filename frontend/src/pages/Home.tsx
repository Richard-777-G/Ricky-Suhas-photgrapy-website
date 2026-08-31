import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { Media, Collection, Location, Story, SiteSettings } from '@/types';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Play, Camera, Film, Layers, MapPin, Sparkles, ExternalLink, Music, Calendar, Maximize2 } from 'lucide-react';
import { Instagram, Youtube } from '@/components/SocialIcons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpatialPhotoModal from '@/components/SpatialPhotoModal';
import CinematicFilmModal from '@/components/CinematicFilmModal';
import VerticalReelPlayer from '@/components/VerticalReelPlayer';
import InteractiveMap from '@/components/InteractiveMap';

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Media | null>(null);
  const [selectedReel, setSelectedReel] = useState<Media | null>(null);

  // Queries
  const { data: mediaItems = [] } = useQuery<Media[]>({
    queryKey: ['media', 'all'],
    queryFn: () => apiGet<Media[]>('/media?limit=30'),
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => apiGet<Collection[]>('/collections'),
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => apiGet<Location[]>('/locations'),
  });

  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ['stories'],
    queryFn: () => apiGet<Story[]>('/stories'),
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: () => apiGet<SiteSettings>('/settings'),
  });

  // Filtered lists
  const photos = mediaItems.filter((m) => m.type === 'photo');
  const films = mediaItems.filter((m) => m.type === 'video');
  const reels = mediaItems.filter((m) => m.type === 'reel');
  const featuredHero = photos[0] || null;
  const featuredFilm = films[0] || null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-[#D4AF37]/30">
      <Navbar />

      {/* 1. CINEMATIC HERO SECTION */}
      <section
        data-testid="cinematic-hero-section"
        className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Anchor Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              featuredHero?.file_url ||
              'https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400'
            }
            alt="Hero Anchor Nature Visual"
            data-testid="hero-anchor-image"
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-105"
          />
          {/* Subtle gradient overlays for cinematic mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/80" />
        </div>

        {/* Live Optical Telemetry HUD (Top left) */}
        <div
          data-testid="hero-telemetry-hud"
          className="absolute top-24 sm:top-28 left-4 sm:left-8 lg:left-12 z-20 hidden sm:flex flex-col gap-1 text-[11px] font-mono text-white/70 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/15"
        >
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span>OPTICAL TELEMETRY · 4K ARCHIVE</span>
          </div>
          <div>CAMERA: {featuredHero?.exif?.camera || 'Sony Alpha 7R V (61MP)'}</div>
          <div>EXIF: {featuredHero?.exif?.lens || 'FE 24-70mm F2.8 GM II'} · {featuredHero?.exif?.shutter_speed || '1/640s'}</div>
          <div>LOCATION: {featuredHero?.location_name || 'Western Ghats Canopy, India'}</div>
        </div>

        {/* Central Brand Core Statement */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-6">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/40 backdrop-blur-xl text-xs font-mono text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-[0.25em] uppercase">Visual Exploration Universe</span>
          </div>

          {/* Primary Name */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-9xl font-light tracking-tight text-white leading-none">
            RICKY <span className="text-[#D4AF37] font-normal italic">SUHAS</span>
          </h1>

          {/* Philosophy Statement */}
          <div className="max-w-2xl space-y-2">
            <p className="text-xl sm:text-2xl font-serif italic text-[#F2F0EA] tracking-wide">
              "Beauty Seeker — Take a moment to enjoy God's creation 🌍"
            </p>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-lg mx-auto">
              International Nature Photographer, Cinematographer & Percussionist. Chronicling ancient rainforests, high Himalayan frontiers, and coastal cadences.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              data-testid="hero-explore-archive-button"
              className="px-6 sm:px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#050607] font-semibold text-xs sm:text-sm font-mono uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2 group"
            >
              <span>Explore The Archive</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {featuredHero && (
              <button
                onClick={() => setSelectedPhoto(featuredHero)}
                data-testid="hero-view-featured-button"
                className="px-5 sm:px-6 py-3.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-[#D4AF37] text-white font-mono text-xs uppercase tracking-wider transition-all backdrop-blur-md flex items-center gap-2"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Examine Hero Visual</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Scroll Indicator & Social Handle */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-20 flex items-center justify-between text-xs font-mono text-white/60">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37]">INSTAGRAM</span>
            <a
              href="https://www.instagram.com/rickysuhas/"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              @rickysuhas
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span>SCROLL TO DISCOVER</span>
            <span className="w-4 h-0.5 bg-[#D4AF37]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37]">YOUTUBE</span>
            <a
              href="https://www.youtube.com/@Rickysuhas0110"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              @Rickysuhas0110
            </a>
          </div>
        </div>
      </section>

      {/* 2. INFINITE TICKER MARQUEE */}
      <div className="w-full bg-[#0C0E12] border-y border-[#D4AF37]/20 py-3 overflow-hidden text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase flex items-center whitespace-nowrap">
        <div className="animate-marquee flex items-center space-x-8">
          <span>Nature Photography</span>
          <span>·</span>
          <span>4K Cinematic Videography</span>
          <span>·</span>
          <span>Acoustic Percussion & Soundscapes</span>
          <span>·</span>
          <span>High Altitude Expeditions</span>
          <span>·</span>
          <span>God's Creation</span>
          <span>·</span>
          <span>Western Ghats Canopy</span>
          <span>·</span>
          <span>Trans-Himalayan Frontiers</span>
          <span>·</span>
          <span>Beauty Seeker Archive</span>
          <span>·</span>
        </div>
      </div>

      {/* 3. CURATED PHOTOGRAPHY (TETRIS / BENTO ASYMMETRIC GRID WITH 2-LINE CAPTIONS) */}
      <section data-testid="curated-photography-section" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              <Camera className="w-4 h-4" />
              <span>Visual Gallery & Fine Works</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground">
              Master Photographs
            </h2>
          </div>
          <Link
            to="/explore?type=photo"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
          >
            <span>View All {photos.length} Photographs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asymmetric Tetris Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          {photos.slice(0, 6).map((item, idx) => {
            // Asymmetric layout span classes
            const colSpan =
              idx === 0
                ? 'lg:col-span-8 aspect-[16/10]'
                : idx === 1
                ? 'lg:col-span-4 aspect-[4/5]'
                : idx === 2
                ? 'lg:col-span-4 aspect-[4/5]'
                : idx === 3
                ? 'lg:col-span-8 aspect-[16/10]'
                : 'lg:col-span-6 aspect-[16/11]';

            return (
              <div
                key={item.id}
                data-testid={`photo-card-${item.id}`}
                onClick={() => setSelectedPhoto(item)}
                className={`group relative rounded-2xl overflow-hidden bg-[#0C0E12] border border-border/40 hover:border-[#D4AF37]/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10 ${colSpan}`}
              >
                <img
                  src={item.file_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Top tags */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md border border-white/20 text-[#D4AF37]">
                    {item.category}
                  </span>
                  {item.exif?.shutter_speed && (
                    <span className="hidden sm:inline text-[10px] font-mono text-white/60 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      {item.exif.aperture} · {item.exif.shutter_speed}
                    </span>
                  )}
                </div>

                {/* Bottom 2-Line Description & Title */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg sm:text-xl text-white font-medium group-hover:text-[#D4AF37] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  {/* Two-line description */}
                  <p className="text-xs text-[#F2F0EA]/80 line-clamp-2 leading-relaxed">
                    {item.short_description || item.description}
                  </p>
                  {item.location_name && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#D4AF37]/90 pt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location_name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TOPOGRAPHICAL SPATIAL PLACES MAP SECTION */}
      <section data-testid="spatial-map-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveMap locations={locations} />
      </section>

      {/* 5. CINEMATIC 4K FILMS SHOWCASE */}
      {featuredFilm && (
        <section data-testid="cinematic-films-section" className="py-20 bg-[#08090C] border-y border-[#D4AF37]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                  <Film className="w-4 h-4" />
                  <span>Cinematography & Soundscapes</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white">
                  4K Master Films
                </h2>
              </div>
              <Link
                to="/films"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
              >
                <span>Explore All Films</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Featured Hero Cinema Stage */}
            <div
              data-testid="featured-film-stage"
              onClick={() => setSelectedFilm(featuredFilm)}
              className="relative aspect-video lg:aspect-[21/9] rounded-3xl overflow-hidden border border-[#D4AF37]/30 group cursor-pointer shadow-2xl bg-black"
            >
              <img
                src={featuredFilm.thumbnail_url || featuredFilm.file_url}
                alt={featuredFilm.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Center Play Beacon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFF] transition-all shadow-2xl shadow-[#D4AF37]/40">
                  <Play className="w-8 h-8 fill-black ml-1" />
                </div>
              </div>

              {/* Bottom Film Info */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#D4AF37]">
                    <span>4K ULTRA HD</span>
                    <span>·</span>
                    <span>{featuredFilm.duration || '07:45'}</span>
                    <span>·</span>
                    <span>{featuredFilm.location_name || 'Western Ghats'}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-4xl text-white font-medium">
                    {featuredFilm.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                    {featuredFilm.short_description || featuredFilm.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. VERTICAL REELS SPOTLIGHT */}
      <section data-testid="vertical-reels-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              <Instagram className="w-4 h-4" />
              <span>Instagram Reels & Vertical Expeditions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground">
              Moments & Reels
            </h2>
          </div>
          <Link
            to="/reels"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
          >
            <span>All Reels Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 9:16 Vertical Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              data-testid={`reel-card-${reel.id}`}
              onClick={() => setSelectedReel(reel)}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#0C0E12] border border-border/40 hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg hover:shadow-2xl"
            >
              <img
                src={reel.thumbnail_url || reel.file_url}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Play Badge */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 border border-white/20 text-[#D4AF37] backdrop-blur-md">
                <Play className="w-3.5 h-3.5 fill-[#D4AF37]" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 space-y-1">
                <div className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{reel.location_name?.split(' ')[0] || 'Wilderness'}</span>
                </div>
                <h4 className="font-serif text-sm text-white font-medium line-clamp-1">{reel.title}</h4>
                <p className="text-[11px] text-white/80 line-clamp-2">{reel.short_description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CURATED COLLECTIONS */}
      <section data-testid="collections-section" className="py-20 bg-[#0C0E12] dark:bg-[#0C0E12] bg-[#E8E4DA] border-y border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                <Layers className="w-4 h-4" />
                <span>Thematic Archives</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground">
                Expedition Collections
              </h2>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.id}`}
                data-testid={`collection-card-${col.id}`}
                className="group relative rounded-3xl overflow-hidden border border-border/40 hover:border-[#D4AF37] transition-all bg-background aspect-[16/10] shadow-xl"
              >
                <img
                  src={col.cover_image_url}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37]">
                    {col.category}
                  </span>
                  <span className="text-xs font-mono text-white/80 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
                    {col.media_count} Works
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="text-xs font-mono text-[#D4AF37]">{col.location_name}</div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium group-hover:text-[#D4AF37] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2">{col.subtitle || col.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STORIES & FIELD JOURNAL */}
      <section data-testid="journal-stories-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              <Compass className="w-4 h-4" />
              <span>Field Notes & Expedition Journal</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground">
              Stories from the Wild
            </h2>
          </div>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
          >
            <span>Read All Field Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <Link
              key={story.id}
              to={`/stories/${story.id}`}
              data-testid={`story-card-${story.id}`}
              className="group p-6 rounded-3xl border border-border/40 hover:border-[#D4AF37]/50 bg-card/60 backdrop-blur-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <img
                    src={story.cover_image_url}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 border border-white/20 text-[#D4AF37]">
                    {story.read_time}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    <span>{story.date}</span>
                    <span>·</span>
                    <span>{story.location_name}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground font-medium group-hover:text-[#D4AF37] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37] pt-2 border-t border-border/30">
                <span>Read Full Journal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. ABOUT RICKY & SOCIAL HUB */}
      <section data-testid="about-ricky-preview-section" className="py-20 bg-[#0C0E12] dark:bg-[#0C0E12] bg-[#E8E4DA] border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549223565-49541e8416dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
                alt="Ricky Suhas — Nature Visualist & Percussionist"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                  Nature Visualist & Percussionist
                </span>
                <h4 className="font-serif text-xl font-medium">Ricky Suhas</h4>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              <Music className="w-4 h-4" />
              <span>Dual Craft: Vision & Rhythm</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground">
              The Symphony of Wilderness
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {settings?.about_text ||
                "Ricky Suhas travels across pristine wilderness, cloud forests, and high-altitude sanctuaries to chronicle the untamed elegance of the natural world. Blending visual mastery with the organic pulse of rhythm and percussion, his work captures not merely images, but living atmospheres."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                  Primary Cinema Optics
                </span>
                <span className="text-xs font-mono text-foreground block">
                  Sony Alpha 7R V & Cinema FX6
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                  Acoustic Instrumentation
                </span>
                <span className="text-xs font-mono text-foreground block">
                  Maple Kit & D Celtic Handpan
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://www.instagram.com/rickysuhas/"
                target="_blank"
                rel="noreferrer"
                data-testid="home-instagram-hub-link"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-amber-600/20 border border-[#D4AF37]/50 text-foreground hover:border-[#D4AF37] text-xs font-mono uppercase tracking-wider transition-all"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span>Instagram @rickysuhas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.youtube.com/@Rickysuhas0110"
                target="_blank"
                rel="noreferrer"
                data-testid="home-youtube-hub-link"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-950/20 border border-red-500/40 text-foreground hover:border-red-500 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>YouTube @Rickysuhas0110</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <SpatialPhotoModal
        media={selectedPhoto}
        mediaList={photos}
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
