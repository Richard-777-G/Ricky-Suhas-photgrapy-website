import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Layers, Camera, Maximize2 } from 'lucide-react';
import type { Media } from '@/types';
import { Link } from 'react-router-dom';
import { useLockBodyScroll } from '@/components/Motion';

interface SpatialPhotoModalProps {
  media: Media | null;
  mediaList?: Media[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (media: Media) => void;
}

export default function SpatialPhotoModal({
  media,
  mediaList = [],
  isOpen,
  onClose,
  onSelectMedia,
}: SpatialPhotoModalProps) {
  const [showExif, setShowExif] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && media && mediaList.length > 1 && onSelectMedia) {
        const currentIndex = mediaList.findIndex((m) => m.id === media.id);
        if (currentIndex !== -1 && currentIndex < mediaList.length - 1) {
          onSelectMedia(mediaList[currentIndex + 1]);
        } else if (currentIndex === mediaList.length - 1) {
          onSelectMedia(mediaList[0]);
        }
      } else if (e.key === 'ArrowLeft' && media && mediaList.length > 1 && onSelectMedia) {
        const currentIndex = mediaList.findIndex((m) => m.id === media.id);
        if (currentIndex > 0) {
          onSelectMedia(mediaList[currentIndex - 1]);
        } else if (currentIndex === 0) {
          onSelectMedia(mediaList[mediaList.length - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, media, mediaList, onClose, onSelectMedia]);

  if (!isOpen || !media) return null;

  const currentIndex = mediaList.findIndex((m) => m.id === media.id);
  const totalCount = mediaList.length;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaList.length > 0 && onSelectMedia) {
      const nextIdx = (currentIndex + 1) % mediaList.length;
      onSelectMedia(mediaList[nextIdx]);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaList.length > 0 && onSelectMedia) {
      const prevIdx = (currentIndex - 1 + mediaList.length) % mediaList.length;
      onSelectMedia(mediaList[prevIdx]);
    }
  };

  return (
    <div
      data-testid="spatial-photo-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-all duration-300"
      onClick={onClose}
    >
      {/* Top action bar */}
      <div
        className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#D4AF37]">
            {media.category || 'Landscape'}
          </span>
          {totalCount > 1 && (
            <span className="text-xs font-mono text-white/50">
              [{currentIndex + 1} / {totalCount}]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowExif(!showExif)}
            data-testid="toggle-exif-button"
            className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-all flex items-center gap-1.5 ${
              showExif
                ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-semibold'
                : 'border-white/20 text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EXIF DATA</span>
          </button>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            data-testid="toggle-zoom-button"
            className="p-2 rounded-full border border-white/20 text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            title="Toggle zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            data-testid="close-photo-modal-button"
            className="p-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 lg:p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-full max-h-[80vh] flex items-center justify-center group">
          {/* Ambient Glow */}
          <div
            className="absolute -inset-4 bg-cover bg-center blur-3xl opacity-20 pointer-events-none rounded-3xl"
            style={{ backgroundImage: `url(${media.file_url})` }}
          />

          <img
            src={media.file_url}
            alt={media.title}
            data-testid="spatial-photo-full-image"
            className={`relative z-10 max-h-[75vh] sm:max-h-[80vh] max-w-full object-contain rounded-md shadow-2xl transition-transform duration-300 ${
              isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Prev / Next Arrows */}
        {totalCount > 1 && (
          <>
            <button
              onClick={handlePrev}
              data-testid="photo-modal-prev-button"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] hover:scale-110 transition-all backdrop-blur-md"
              title="Previous photograph (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              data-testid="photo-modal-next-button"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] hover:scale-110 transition-all backdrop-blur-md"
              title="Next photograph (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Metadata Bar with 2-Line Description */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              data-testid="photo-modal-title"
              className="font-serif text-lg sm:text-2xl font-light text-white tracking-tight"
            >
              {media.title}
            </h3>
            {media.location_name && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
                <MapPin className="w-3 h-3" />
                {media.location_name}
              </span>
            )}
          </div>

          {/* Mandatory 2-line Rich Description */}
          <p
            data-testid="photo-modal-short-description"
            className="text-xs sm:text-sm text-[#F2F0EA]/90 leading-relaxed font-normal"
          >
            {media.short_description || media.description}
          </p>
        </div>

        {/* Collection badge link */}
        {media.collection_name && (
          <div className="flex items-center gap-2">
            <Link
              to={`/collections/${media.collection_id}`}
              onClick={onClose}
              data-testid="photo-modal-collection-link"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-white/20 hover:border-[#D4AF37] text-white/80 hover:text-[#D4AF37] transition-all bg-black/40 backdrop-blur-md"
            >
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Collection: {media.collection_name}</span>
            </Link>
          </div>
        )}
      </div>

      {/* EXIF Metadata Drawer Drawer Overlay */}
      {showExif && (
        <div
          data-testid="photo-exif-drawer"
          className="absolute top-20 right-4 sm:right-6 w-80 bg-[#0C0E12]/95 border border-[#D4AF37]/40 rounded-xl p-5 shadow-2xl backdrop-blur-xl z-30 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Optical Telemetry
            </span>
            <button
              onClick={() => setShowExif(false)}
              className="text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-white/5 p-2 rounded">
              <div className="text-white/50 text-[10px]">CAMERA</div>
              <div className="text-white font-medium">{media.exif?.camera || 'Sony Alpha 7R V'}</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-white/50 text-[10px]">LENS</div>
              <div className="text-white font-medium">{media.exif?.lens || 'FE 24-70mm F2.8 GM II'}</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-white/50 text-[10px]">SHUTTER SPEED</div>
              <div className="text-white font-medium">{media.exif?.shutter_speed || '1/800s'}</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-white/50 text-[10px]">APERTURE</div>
              <div className="text-white font-medium">{media.exif?.aperture || 'f/4.0'}</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-white/50 text-[10px]">ISO SENSITIVITY</div>
              <div className="text-white font-medium">{media.exif?.iso || 'ISO 100'}</div>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <div className="text-white/50 text-[10px]">FOCAL LENGTH</div>
              <div className="text-white font-medium">{media.exif?.focal_length || '35mm'}</div>
            </div>
          </div>

          {media.capture_date && (
            <div className="text-[11px] font-mono text-white/60 pt-1 border-t border-white/10">
              Captured: {media.capture_date}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
