import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { apiGet } from '@/lib/api';
import type { Media, Collection, Location, Story, SiteSettings } from '@/types';
import {
  Compass,
  ArrowRight,
  Play,
  Camera,
  Film,
  Layers,
  MapPin,
  Sparkles,
  ExternalLink,
  Music,
  Calendar,
  Frame,
  Mountain,
} from 'lucide-react';
import { Instagram, Youtube } from '@/components/SocialIcons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpatialPhotoModal from '@/components/SpatialPhotoModal';
import CinematicFilmModal from '@/components/CinematicFilmModal';
import VerticalReelPlayer from '@/components/VerticalReelPlayer';
import InteractiveMap from '@/components/InteractiveMap';
import { Reveal, AnimatedHeading, Magnetic, TiltCard, ParallaxLayer } from '@/components/Motion';

/* ---------- Section heading: shared editorial rhythm ---------- */
function SectionHead({
  eyebrow,
  icon: Icon,
  title,
  accentFrom,
  link,
  linkLabel,
  onDark,
}: {
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accentFrom?: number;
  link?: string;
  linkLabel?: string;
  onDark?: boolean;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-12">
      <div className="space-y-3 max-w-2xl">
        <Reveal y={18}>
          <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#D4AF37]">
            <Icon className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
            <span className="hidden sm:block h-[1px] w-16 bg-gradient-to-r from-[#D4AF37]/60 to-transparent" />
          </div>
        </Reveal>
        <AnimatedHeading
          text={title}
          accentFrom={accentFrom}
          className={`font-serif text-3xl sm:text-5xl lg:text-[3.4rem] font-light tracking-tight leading-[1.05] ${
            onDark ? 'text-white' : 'text-foreground'
          }`}
        />
      </div>

      {link && (
        <Reveal delay={0.15} y={14}>
          <Magnetic strength={0.16}>
            <Link
              to={link}
              className="group inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] pb-1 border-b border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors duration-400"
            >
              <span>{linkLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-500" />
            </Link>
          </Magnetic>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Count-up statistic ---------- */
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const reduce = useReducedMotion();
  const numeric = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const [shown, setShown] = useState(reduce ? numeric : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    const total = 58;
    const tick = () => {
      frame += 1;
      const p = frame / total;
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(numeric * eased));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, numeric, reduce]);

  return (
    <div ref={ref} className="space-y-1.5" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="font-serif text-4xl sm:text-5xl font-light text-[#D4AF37] tabular-nums">
        {shown}
        {suffix}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Media | null>(null);
  const [selectedReel, setSelectedReel] = useState<Media | null>(null);
  const reduce = useReducedMotion();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(heroProgress, [0, 1], ['0%', '22%']);
  const heroTextY = useTransform(heroProgress, [0, 1], ['0%', '-38%']);
  const heroFade = useTransform(heroProgress, [0, 0.75], [1, 0]);

  const { data: mediaItems = [] } = useQuery<Media[]>({
    queryKey: ['media', 'all'],
    queryFn: () => apiGet<Media[]>('/media?limit=40'),
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

  const photos = mediaItems.filter((m) => m.type === 'photo');
  const films = mediaItems.filter((m) => m.type === 'video');
  const reels = mediaItems.filter((m) => m.type === 'reel');
  const featuredHero = photos[0] || null;
  const featuredFilm = films[0] || null;
  const quotePhoto = photos[3] || photos[1] || featuredHero;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ============ 1 · CINEMATIC HERO ============ */}
      <section
        ref={heroRef}
        data-testid="cinematic-hero-section"
        className="relative min-h-[94vh] sm:min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Anchor visual — one exceptional photograph, slow drift + parallax */}
        <motion.div className="absolute inset-0 z-0" style={reduce ? undefined : { y: heroImgY }}>
          <img
            src={
              featuredHero?.file_url ||
              'https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400'
            }
            alt={featuredHero?.title || 'Western Ghats cloud canopy at first light'}
            data-testid="hero-anchor-image"
            className="w-full h-full object-cover animate-hero-drift will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(0,0,0,0.72)_100%)]" />
        </motion.div>

        {/* Telemetry HUD */}
        <motion.div
          data-testid="hero-telemetry-hud"
          initial={{ opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.3, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={reduce ? undefined : { opacity: heroFade }}
          className="absolute top-28 left-4 sm:left-8 lg:left-12 z-20 hidden sm:flex flex-col gap-1 text-[10px] font-mono text-white/65 bg-black/35 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10"
        >
          <span className="flex items-center gap-2 text-[#D4AF37]">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            OPTICAL TELEMETRY · MASTER ARCHIVE
          </span>
          <span>BODY · {featuredHero?.exif?.camera || 'Sony Alpha 7R V'}</span>
          <span>
            OPTIC · {featuredHero?.exif?.lens || 'FE 24-70mm F2.8 GM II'} ·{' '}
            {featuredHero?.exif?.shutter_speed || '1/640s'} · {featuredHero?.exif?.aperture || 'f/5.6'}
          </span>
          <span>SITE · {featuredHero?.location_name || 'Western Ghats Rainforests'}</span>
        </motion.div>

        {/* Core statement */}
        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
          style={reduce ? undefined : { y: heroTextY, opacity: heroFade }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 border border-[#D4AF37]/35 backdrop-blur-xl text-[10px] font-mono text-[#D4AF37] mb-7"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-[0.3em] uppercase">Visual Exploration Universe</span>
          </motion.div>

          {/* Name — letter-level emergence */}
          <h1 className="font-serif text-[3.2rem] leading-[0.92] sm:text-7xl lg:text-[8.5rem] font-light tracking-tight text-white">
            {'RICKY'.split('').map((ch, i) => (
              <motion.span
                key={`r-${i}`}
                className="inline-block"
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 60, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch}
              </motion.span>
            ))}
            <span className="inline-block w-[0.28em]" />
            {'SUHAS'.split('').map((ch, i) => (
              <motion.span
                key={`s-${i}`}
                className="inline-block text-[#D4AF37] italic"
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 60, filter: 'blur(16px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, delay: 0.95 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-2xl space-y-3"
          >
            <p className="text-lg sm:text-2xl font-serif italic text-[#F2F0EA]/95 tracking-wide">
              "{settings?.motto || 'Beauty Seeker — Take a moment to enjoy God\'s creation'}"
            </p>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-lg mx-auto">
              International nature photographer, cinematographer and percussionist. Ancient
              rainforests, high Himalayan frontiers, and coastal cadences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.05 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnetic strength={0.22}>
              <Link
                to="/explore"
                data-testid="hero-explore-archive-button"
                className="group px-7 sm:px-9 py-4 rounded-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#050607] font-semibold text-[11px] font-mono uppercase tracking-[0.22em] transition-colors duration-400 shadow-[0_18px_45px_-14px_rgba(212,175,55,0.6)] flex items-center gap-2.5"
              >
                <span>Enter the Archive</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" />
              </Link>
            </Magnetic>

            {featuredHero && (
              <Magnetic strength={0.18}>
                <button
                  onClick={() => setSelectedPhoto(featuredHero)}
                  data-testid="hero-view-featured-button"
                  className="px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#D4AF37]/70 text-white font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-400 backdrop-blur-md"
                >
                  Examine this photograph
                </button>
              </Magnetic>
            )}
          </motion.div>
        </motion.div>

        {/* Footer rail */}
        <motion.div
          style={reduce ? undefined : { opacity: heroFade }}
          className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-20 flex items-center justify-between text-[10px] font-mono text-white/55"
        >
          <a
            href={settings?.instagram_url || 'https://www.instagram.com/rickysuhas/'}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            <span className="text-[#D4AF37]">IG</span> @rickysuhas
          </a>

          <span className="hidden sm:flex items-center gap-3">
            <span className="tracking-[0.3em]">SCROLL</span>
            <motion.span
              className="block w-10 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent"
              animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: 0 }}
            />
          </span>

          <a
            href={settings?.youtube_url || 'https://www.youtube.com/@Rickysuhas0110'}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            <span className="text-[#D4AF37]">YT</span> @Rickysuhas0110
          </a>
        </motion.div>
      </section>

      {/* ============ 2 · TICKER ============ */}
      <div className="w-full bg-[#0A0C11] border-y border-[#D4AF37]/15 py-3.5 overflow-hidden text-[10px] font-mono tracking-[0.32em] text-[#D4AF37]/85 uppercase flex items-center whitespace-nowrap">
        <div className="animate-marquee flex items-center gap-8 pr-8">
          {[
            'Nature Photography',
            '4K Cinematic Videography',
            'Acoustic Percussion & Soundscapes',
            'High Altitude Expeditions',
            "God's Creation",
            'Western Ghats Canopy',
            'Trans-Himalayan Frontiers',
            'Beauty Seeker Archive',
          ]
            .concat([
              'Nature Photography',
              '4K Cinematic Videography',
              'Acoustic Percussion & Soundscapes',
              'High Altitude Expeditions',
              "God's Creation",
              'Western Ghats Canopy',
              'Trans-Himalayan Frontiers',
              'Beauty Seeker Archive',
            ])
            .map((t, i) => (
              <span key={i} className="flex items-center gap-8">
                {t}
                <span className="text-[#D4AF37]/40">/</span>
              </span>
            ))}
        </div>
      </div>

      {/* ============ 3 · MASTER PHOTOGRAPHS (editorial rhythm) ============ */}
      <section
        data-testid="curated-photography-section"
        className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <SectionHead
          eyebrow="Visual Gallery · Fine Works"
          icon={Camera}
          title="Master Photographs"
          accentFrom={1}
          link="/explore?type=photo"
          linkLabel={`All ${photos.length} photographs`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
          {photos.slice(0, 7).map((item, idx) => {
            /* deliberate editorial rhythm: wide / portrait / portrait / wide / trio */
            const spans = [
              'lg:col-span-7 aspect-[16/10]',
              'lg:col-span-5 aspect-[4/5]',
              'lg:col-span-5 aspect-[4/5]',
              'lg:col-span-7 aspect-[16/10]',
              'lg:col-span-4 aspect-[3/4]',
              'lg:col-span-4 aspect-[3/4]',
              'lg:col-span-4 aspect-[3/4]',
            ];
            return (
              <Reveal
                key={item.id}
                delay={Math.min(idx * 0.06, 0.4)}
                className={`${spans[idx] ?? 'lg:col-span-4 aspect-[3/4]'}`}
              >
                <TiltCard
                  max={6}
                  testId={`photo-card-${item.id}`}
                  onClick={() => setSelectedPhoto(item)}
                  className="group h-full w-full rounded-2xl overflow-hidden bg-[#0A0C11] border border-border/40 hover:border-[#D4AF37]/60 cursor-pointer shadow-lg hover:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-600"
                >
                  <img
                    src={item.file_url}
                    alt={item.title}
                    loading={idx > 2 ? 'lazy' : 'eager'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-[1600ms] ease-out will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-[0.16em] bg-black/55 backdrop-blur-md border border-white/15 text-[#D4AF37]">
                      {item.category}
                    </span>
                    {item.exif?.aperture && (
                      <span className="hidden sm:block text-[9px] font-mono text-white/50 bg-black/50 px-2 py-0.5 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.exif.aperture} · {item.exif.shutter_speed} · {item.exif.iso}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-medium group-hover:text-[#D4AF37] transition-colors duration-400 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#F2F0EA]/75 leading-relaxed line-clamp-2 max-w-md">
                      {item.short_description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37]/90 pt-0.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location_name || 'Unmapped site'}</span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ 4 · PARALLAX PHILOSOPHY QUOTE ============ */}
      <section
        data-testid="philosophy-parallax-section"
        className="relative h-[80vh] flex items-center justify-center overflow-hidden border-y border-[#D4AF37]/15"
      >
        <ParallaxLayer distance={110} className="absolute inset-0 -top-24 -bottom-24">
          {quotePhoto?.file_url ? (
            <img
              src={quotePhoto.file_url}
              alt=""
              loading="lazy"
              className="w-full h-[130%] object-cover"
            />
          ) : (
            <div className="w-full h-[130%] bg-[#0A0C11]" />
          )}
        </ParallaxLayer>
        <div className="absolute inset-0 bg-black/72" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-7">
          <Reveal y={26}>
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#D4AF37]">
              The philosophy
            </span>
          </Reveal>
          <AnimatedHeading
            text="Take a moment. Look closer."
            accentFrom={2}
            testId="philosophy-quote-heading"
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight"
          />
          <Reveal delay={0.25}>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
              Explore the places, the light and the life that caught my eye — an evolving record of
              where I went, what I saw, and how it sounded.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-white/10 max-w-2xl mx-auto">
              <StatCounter value={settings?.stats?.posts_archived || '372+'} label="Works archived" />
              <StatCounter value={settings?.stats?.countries_documented || '12+'} label="Regions" />
              <StatCounter value={settings?.stats?.expeditions || '45+'} label="Expeditions" />
              <StatCounter value={settings?.stats?.master_films || '18+'} label="Master films" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 5 · TOPOGRAPHIC MAP ============ */}
      <section
        data-testid="spatial-map-section"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <SectionHead
          eyebrow="Geography as a dimension"
          icon={Mountain}
          title="Where the work was made"
          accentFrom={2}
          link="/places"
          linkLabel="Open full atlas"
        />
        <Reveal y={30}>
          <InteractiveMap locations={locations} />
        </Reveal>
      </section>

      {/* ============ 6 · CINEMATIC FILMS ============ */}
      {featuredFilm && (
        <section
          data-testid="cinematic-films-section"
          className="py-24 bg-[#07080B] border-y border-[#D4AF37]/15"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Cinematography & soundscapes"
              icon={Film}
              title="4K Master Films"
              accentFrom={1}
              link="/films"
              linkLabel="All films"
              onDark
            />

            <Reveal y={30}>
              <div
                data-testid="featured-film-stage"
                onClick={() => setSelectedFilm(featuredFilm)}
                className="relative aspect-[16/10] lg:aspect-[21/9] rounded-3xl overflow-hidden border border-[#D4AF37]/25 group cursor-pointer shadow-2xl bg-black"
              >
                <img
                  src={featuredFilm.thumbnail_url || featuredFilm.file_url}
                  alt={featuredFilm.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#D4AF37]/92 text-black flex items-center justify-center shadow-[0_0_70px_-8px_rgba(212,175,55,0.75)]"
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  >
                    <Play className="w-8 h-8 fill-black ml-1" />
                  </motion.div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-2.5 max-w-2xl">
                  <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                    <span>4K Ultra HD</span>
                    <span className="w-8 h-[1px] bg-[#D4AF37]/50" />
                    <span>{featuredFilm.duration || '07:45'}</span>
                    <span className="w-8 h-[1px] bg-[#D4AF37]/50" />
                    <span>{featuredFilm.location_name}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white font-light">
                    {featuredFilm.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 line-clamp-2">
                    {featuredFilm.short_description}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* secondary films strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {films.slice(1, 3).map((film, i) => (
                <Reveal key={film.id} delay={0.1 + i * 0.1}>
                  <div
                    onClick={() => setSelectedFilm(film)}
                    data-testid={`home-film-card-${film.id}`}
                    className="group relative aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 hover:border-[#D4AF37]/60 cursor-pointer transition-colors duration-500"
                  >
                    <img
                      src={film.thumbnail_url || film.file_url}
                      alt={film.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1500ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                          {film.duration}
                        </div>
                        <h4 className="font-serif text-lg text-white font-medium group-hover:text-[#D4AF37] transition-colors duration-400">
                          {film.title}
                        </h4>
                      </div>
                      <span className="w-9 h-9 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-400">
                        <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ 7 · VERTICAL REELS ============ */}
      <section
        data-testid="vertical-reels-section"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <SectionHead
          eyebrow="Vertical moments"
          icon={Camera}
          title="Reels from the field"
          accentFrom={1}
          link="/reels"
          linkLabel="Full reels feed"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reels.map((reel, idx) => (
            <Reveal key={reel.id} delay={Math.min(idx * 0.08, 0.35)}>
              <TiltCard
                max={7}
                testId={`reel-card-${reel.id}`}
                onClick={() => setSelectedReel(reel)}
                className="group aspect-[9/16] w-full rounded-2xl overflow-hidden bg-[#0A0C11] border border-border/40 hover:border-[#D4AF37]/70 cursor-pointer shadow-lg transition-colors duration-500"
              >
                <img
                  src={reel.thumbnail_url || reel.file_url}
                  alt={reel.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-[1400ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/35" />

                <span className="absolute top-3 right-3 p-2 rounded-full bg-black/55 border border-white/15 text-[#D4AF37] backdrop-blur-md group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-400">
                  <Play className="w-3 h-3 fill-current" />
                </span>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1">
                  <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#D4AF37] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {reel.location_name?.split(' ')[0] || 'Wilderness'}
                  </div>
                  <h4 className="font-serif text-sm text-white font-medium line-clamp-2">
                    {reel.title}
                  </h4>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 8 · COLLECTIONS ============ */}
      <section
        data-testid="collections-section"
        className="py-24 bg-card/40 border-y border-[#D4AF37]/15"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Thematic archives"
            icon={Layers}
            title="Expedition Collections"
            accentFrom={1}
            link="/collections"
            linkLabel="All collections"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {collections.map((col, idx) => (
              <Reveal key={col.id} delay={Math.min(idx * 0.08, 0.3)}>
                <Link
                  to={`/collections/${col.id}`}
                  data-testid={`collection-card-${col.id}`}
                  className="group relative block rounded-3xl overflow-hidden border border-border/40 hover:border-[#D4AF37]/70 transition-colors duration-500 aspect-[16/10] shadow-xl"
                >
                  <img
                    src={col.cover_image_url}
                    alt={col.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1600ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.18em] bg-black/55 backdrop-blur-md border border-[#D4AF37]/35 text-[#D4AF37]">
                      {col.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/70 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">
                      {col.media_count} works
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                      {col.location_name} · {col.date_from}–{col.date_to}
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-light group-hover:text-[#D4AF37] transition-colors duration-400">
                      {col.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 line-clamp-2">
                      {col.subtitle || col.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] pt-1 group-hover:gap-3.5 transition-all duration-500">
                      Enter this world <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 9 · FINE ART PRINTS TEASER ============ */}
      <section
        data-testid="prints-teaser-section"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#D4AF37]">
              <Frame className="w-3.5 h-3.5" />
              <span>Archival Giclée · Signed & numbered</span>
            </div>
            <AnimatedHeading
              text="Take a piece of the wild home"
              accentFrom={4}
              className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-[1.08]"
            />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Museum-grade cotton rag prints in five sizes and four framing finishes. Choose a
              photograph, preview it framed, and Ricky confirms the edition and shipping personally.
            </p>
            <Magnetic strength={0.18}>
              <Link
                to="/prints"
                data-testid="home-prints-cta"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-foreground text-background hover:bg-[#D4AF37] hover:text-black font-semibold text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-400"
              >
                <span>Browse the print room</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" />
              </Link>
            </Magnetic>
          </Reveal>

          <div className="lg:col-span-6 grid grid-cols-2 gap-5">
            {photos.slice(1, 5).map((p, i) => (
              <Reveal key={p.id} delay={0.1 + i * 0.09}>
                <TiltCard
                  max={8}
                  className="rounded-xl overflow-hidden bg-[#12151C] p-3 border border-border/40 shadow-xl"
                >
                  <div className="aspect-square overflow-hidden shadow-[0_14px_30px_-10px_rgba(0,0,0,0.9)]">
                    <img
                      src={p.thumbnail_url || p.file_url}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 10 · JOURNAL ============ */}
      <section
        data-testid="journal-stories-section"
        className="py-24 bg-card/40 border-y border-[#D4AF37]/15"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Field notes & expedition journal"
            icon={Compass}
            title="Stories from the wild"
            accentFrom={1}
            link="/stories"
            linkLabel="Read all notes"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {stories.map((story, idx) => (
              <Reveal key={story.id} delay={idx * 0.1}>
                <Link
                  to={`/stories/${story.id}`}
                  data-testid={`story-card-${story.id}`}
                  className="group block p-6 rounded-3xl border border-border/40 hover:border-[#D4AF37]/60 bg-background/60 backdrop-blur-md transition-colors duration-500 h-full"
                >
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-5">
                    <img
                      src={story.cover_image_url}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1400ms] ease-out"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.16em] bg-black/60 border border-white/15 text-[#D4AF37] backdrop-blur-md">
                      {story.read_time}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      {story.date}
                      <span className="text-[#D4AF37]">·</span>
                      {story.location_name}
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-foreground font-medium group-hover:text-[#D4AF37] transition-colors duration-400">
                      {story.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] pt-2 group-hover:gap-3.5 transition-all duration-500">
                      Read the journal <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 11 · ABOUT + SOCIAL ============ */}
      <section
        data-testid="about-ricky-preview-section"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-5">
            <TiltCard max={5} className="rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1549223565-49541e8416dc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
                alt="Ricky Suhas — nature visualist and percussionist"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-[#D4AF37]">
                  Nature visualist & percussionist
                </span>
                <h4 className="font-serif text-xl text-white font-medium">Ricky Suhas</h4>
              </div>
            </TiltCard>
          </Reveal>

          <div className="lg:col-span-7 space-y-6">
            <Reveal y={18}>
              <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#D4AF37]">
                <Music className="w-3.5 h-3.5" />
                <span>Dual craft · vision & rhythm</span>
              </div>
            </Reveal>

            <AnimatedHeading
              text="The symphony of wilderness"
              accentFrom={2}
              className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground leading-[1.08]"
            />

            <Reveal delay={0.18}>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {settings?.about_text}
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="grid grid-cols-2 gap-6 pt-5 border-t border-border/40">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-[0.22em] block">
                    Primary cinema optics
                  </span>
                  <span className="text-xs font-mono text-foreground block">
                    Sony Alpha 7R V · Cinema FX6
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-[0.22em] block">
                    Acoustic instrumentation
                  </span>
                  <span className="text-xs font-mono text-foreground block">
                    Maple kit · D Celtic handpan
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="flex flex-wrap gap-3.5 pt-3">
                <Magnetic strength={0.15}>
                  <a
                    href={settings?.instagram_url || 'https://www.instagram.com/rickysuhas/'}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="home-instagram-hub-link"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/8 text-foreground hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors duration-400"
                  >
                    <Instagram className="w-4 h-4 text-[#D4AF37]" />
                    <span>@rickysuhas</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </Magnetic>

                <Magnetic strength={0.15}>
                  <a
                    href={settings?.youtube_url || 'https://www.youtube.com/@Rickysuhas0110'}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="home-youtube-hub-link"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/40 bg-red-950/15 text-foreground hover:border-red-500 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors duration-400"
                  >
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span>@Rickysuhas0110</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Media viewers */}
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
