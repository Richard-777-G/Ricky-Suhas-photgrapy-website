import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Pause, Play, ChevronLeft, ChevronRight, MapPin, Compass } from 'lucide-react';
import type { Media } from '@/types';
import AmbientScore from '@/components/AmbientScore';
import { useLockBodyScroll } from '@/components/Motion';

/* Guided Expedition Tour — a slow, hands-free journey through one collection.
   Each photograph holds for ~7s with a Ken Burns drift and a soft crossfade,
   while the collection's ambient percussion score plays underneath. */

const SLIDE_MS = 7000;

export default function ExpeditionTour({
  isOpen,
  onClose,
  works,
  collectionTitle,
  category,
}: {
  isOpen: boolean;
  onClose: () => void;
  works: Media[];
  collectionTitle: string;
  category?: string;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  useLockBodyScroll(isOpen);

  const total = works.length;

  // Reset whenever the tour opens
  useEffect(() => {
    if (isOpen) {
      setIndex(0);
      setPlaying(true);
      setProgress(0);
    }
  }, [isOpen]);

  // Auto-advance + progress bar
  useEffect(() => {
    if (!isOpen || !playing || total === 0) return;
    setProgress(0);
    const started = Date.now();
    const ticker = window.setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - started) / SLIDE_MS) * 100));
    }, 60);
    const advance = window.setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, SLIDE_MS);
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(advance);
    };
  }, [isOpen, playing, index, total]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % total);
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, total]);

  if (!isOpen || total === 0) return null;
  const current = works[index];

  return (
    <div
      data-testid="expedition-tour-overlay"
      className="fixed inset-0 z-[70] bg-black flex flex-col"
    >
      {/* Slide stage */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.09 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2.2, ease: [0.42, 0, 0.58, 1] },
              scale: { duration: SLIDE_MS / 1000 + 2, ease: 'linear' },
            }}
          >
            <img
              src={current.file_url}
              alt={current.title}
              data-testid="tour-slide-image"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-black/70" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 p-4 sm:p-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.26em] text-[#D4AF37]">
            <Compass className="w-3.5 h-3.5" />
            Guided expedition
          </span>
          <span className="block font-serif text-base sm:text-lg text-white font-light">
            {collectionTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <AmbientScore category={category} collectionTitle={collectionTitle} />
          </div>
          <button
            onClick={() => setPlaying((p) => !p)}
            data-testid="tour-play-pause-button"
            title={playing ? 'Pause tour' : 'Resume tour'}
            className="p-2.5 rounded-full border border-white/25 bg-black/50 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={onClose}
            data-testid="close-tour-button"
            title="Exit tour"
            className="p-2.5 rounded-full border border-white/25 bg-black/50 text-white hover:bg-white/10 transition-colors duration-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="relative z-10 mt-auto p-5 sm:p-10 max-w-3xl space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={`cap-${current.id}`}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2.5"
          >
            <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#D4AF37]">
              <MapPin className="w-3 h-3" />
              {current.location_name || 'Unmapped site'}
              <span className="text-white/35">·</span>
              {current.category}
            </span>
            <h3
              data-testid="tour-slide-title"
              className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white font-light leading-tight"
            >
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-2xl">
              {current.short_description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Controls + progress */}
        <div className="flex items-center gap-4 pt-3">
          <button
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            data-testid="tour-prev-button"
            className="p-2 rounded-full border border-white/20 text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % total)}
            data-testid="tour-next-button"
            className="p-2 rounded-full border border-white/20 text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-1.5">
            {works.map((w, i) => (
              <span
                key={w.id}
                className="relative h-[3px] flex-1 rounded-full bg-white/18 overflow-hidden"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-[#D4AF37] transition-[width] duration-100 ease-linear"
                  style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }}
                />
              </span>
            ))}
          </div>

          <span className="text-[10px] font-mono text-white/50 tabular-nums shrink-0">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
