import { useEffect, useRef, useState } from 'react';
import { X, Play, Volume2, VolumeX, MapPin, ExternalLink } from 'lucide-react';
import { Instagram } from '@/components/SocialIcons';
import type { Media } from '@/types';
import { useLockBodyScroll } from '@/components/Motion';

interface VerticalReelPlayerProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VerticalReelPlayer({
  media,
  isOpen,
  onClose,
}: VerticalReelPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setIsPlaying(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !media) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div
      data-testid="vertical-reel-player-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md h-[82vh] bg-[#0C0E12] border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player */}
        <div className="absolute inset-0 z-0 bg-black" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={media.file_url}
            poster={media.thumbnail_url}
            autoPlay
            muted
            loop
            preload="metadata"
            playsInline
            data-testid="reel-video-element"
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>

        {/* Top Floating Controls */}
        <div className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#D4AF37]">
              REEL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              data-testid="reel-mute-toggle-button"
              className="p-2 rounded-full bg-black/60 border border-white/20 text-white hover:text-[#D4AF37] transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              data-testid="close-reel-player-button"
              className="p-2 rounded-full bg-black/60 border border-white/20 text-white hover:text-white/80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Play Overlay Indicator if paused */}
        {!isPlaying && (
          <div
            className="relative z-20 self-center p-4 rounded-full bg-black/60 border border-white/30 text-white pointer-events-none"
          >
            <Play className="w-8 h-8 fill-white ml-1" />
          </div>
        )}

        {/* Bottom Captions & Instagram Link */}
        <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">@rickysuhas</span>
              {media.location_name && (
                <span className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {media.location_name}
                </span>
              )}
            </div>
            <h4 className="font-serif text-sm text-white font-medium">{media.title}</h4>
            <p className="text-xs text-white/90 leading-relaxed line-clamp-2">
              {media.short_description || media.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="https://www.instagram.com/rickysuhas/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="reel-open-instagram-link"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-amber-600/40 border border-white/20 text-white hover:border-white transition-all"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Watch on Instagram</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <span className="text-[10px] font-mono text-white/50">
              Beauty Seeker Archive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
