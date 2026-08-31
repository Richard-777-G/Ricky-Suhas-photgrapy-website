import { useEffect } from 'react';
import { X, Film, ExternalLink } from 'lucide-react';
import { Youtube } from '@/components/SocialIcons';
import type { Media } from '@/types';
import { useLockBodyScroll } from '@/components/Motion';

interface CinematicFilmModalProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CinematicFilmModal({
  media,
  isOpen,
  onClose,
}: CinematicFilmModalProps) {
  useLockBodyScroll(isOpen);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !media) return null;

  return (
    <div
      data-testid="cinematic-film-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0C0E12] border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#050607]">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
              <Film className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif text-lg text-white font-medium tracking-tight">
                {media.title}
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono text-[#D4AF37]">
                {media.duration && <span>DURATION: {media.duration}</span>}
                {media.location_name && <span>LOC: {media.location_name}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            data-testid="close-film-modal-button"
            className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {/* Ambient Glow */}
          <div
            className="absolute -inset-1 bg-cover bg-center blur-2xl opacity-30 pointer-events-none"
            style={{ backgroundImage: `url(${media.thumbnail_url || media.file_url})` }}
          />

          <video
            src={media.file_url}
            poster={media.thumbnail_url}
            controls
            preload="metadata"
            playsInline
            data-testid="cinematic-video-element"
            className="relative z-10 w-full h-full object-contain"
          />
        </div>

        {/* Bottom Details & Social Channel */}
        <div className="p-5 sm:p-6 bg-[#080A0D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-sm text-[#F2F0EA] leading-relaxed">
              {media.short_description || media.description}
            </p>
            {media.description && media.description !== media.short_description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {media.description}
              </p>
            )}
          </div>

          {media.source_url && (
            <a
              href={media.source_url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="film-source-youtube-button"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full border border-red-500/40 bg-red-950/20 hover:bg-red-600 hover:text-white text-red-400 transition-all shrink-0"
            >
              <Youtube className="w-4 h-4" />
              <span>Watch on YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
