import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, Plus, Minus, Crosshair, ArrowRight, Layers, Mountain } from 'lucide-react';
import type { Location, Collection } from '@/types';
import { Magnetic } from '@/components/Motion';

/* Instagram-style photo-bubble map.
   Familiar interaction model: pinch/scroll to zoom, drag to pan, tap a photo
   bubble to see everything shot in that place. No abstract cartography. */

const LON_MIN = 68;
const LON_MAX = 98;
const LAT_MIN = 6;
const LAT_MAX = 37;

/** Position a place as a percentage of the canvas, from its real coordinates. */
function positionFor(loc: Location) {
  const left = 8 + ((loc.longitude - LON_MIN) / (LON_MAX - LON_MIN)) * 84;
  const top = 10 + ((LAT_MAX - loc.latitude) / (LAT_MAX - LAT_MIN)) * 78;
  return { left: `${Math.min(92, Math.max(8, left))}%`, top: `${Math.min(88, Math.max(10, top))}%` };
}

interface InteractiveMapProps {
  locations: Location[];
  collections?: Collection[];
  onSelectLocation?: (location: Location) => void;
  selectedLocationId?: string;
}

export default function InteractiveMap({
  locations,
  collections = [],
  onSelectLocation,
  selectedLocationId,
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [activeId, setActiveId] = useState<string | undefined>(
    selectedLocationId || locations[0]?.id
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const activeLoc = locations.find((l) => l.id === activeId) || locations[0] || null;

  const relatedCollections = useMemo(
    () => collections.filter((c) => c.location_id === activeLoc?.id),
    [collections, activeLoc]
  );

  const select = (loc: Location) => {
    setActiveId(loc.id);
    onSelectLocation?.(loc);
  };

  const clampZoom = (z: number) => Math.min(2.6, Math.max(1, parseFloat(z.toFixed(2))));

  return (
    <div
      data-testid="spatial-interactive-map"
      className="relative rounded-[28px] border border-[#D4AF37]/20 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="px-5 sm:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.26em] text-[#D4AF37]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Places Ricky has photographed</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-light tracking-tight">
            Tap a place to open its work
          </h3>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => clampZoom(z - 0.35))}
            data-testid="map-zoom-out-button"
            title="Zoom out"
            className="p-2 rounded-full border border-border/60 bg-background/70 text-foreground hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span
            data-testid="map-zoom-level"
            className="px-3 py-1.5 rounded-full border border-border/50 bg-background/70 text-[10px] font-mono text-muted-foreground min-w-[62px] text-center"
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => clampZoom(z + 0.35))}
            data-testid="map-zoom-in-button"
            title="Zoom in"
            className="p-2 rounded-full border border-border/60 bg-background/70 text-foreground hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            data-testid="map-reset-button"
            title="Reset view"
            className="p-2 rounded-full border border-border/60 bg-background/70 text-foreground hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bubble canvas */}
      <div
        ref={canvasRef}
        data-testid="photo-bubble-canvas"
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => clampZoom(z + (e.deltaY < 0 ? 0.14 : -0.14)));
        }}
        className="relative h-[420px] sm:h-[520px] overflow-hidden cursor-grab active:cursor-grabbing bg-[#070A0F]"
      >
        {/* soft world wash + grid so panning reads as movement */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(212,175,55,0.10),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <motion.div
          className="absolute inset-0"
          drag
          dragMomentum={false}
          dragElastic={0.12}
          dragConstraints={{ left: -260, right: 260, top: -200, bottom: 200 }}
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, mass: 0.9 }}
          style={{ transformOrigin: 'center center' }}
        >
          {locations.map((loc, idx) => {
            const isActive = activeLoc?.id === loc.id;
            const pos = positionFor(loc);
            const size = 74 + Math.min(46, loc.works_count * 4);

            return (
              <motion.button
                key={loc.id}
                onClick={() => select(loc)}
                data-testid={`map-bubble-${loc.id}`}
                title={`${loc.place_name} — ${loc.works_count} works`}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ ...pos, width: size, height: size }}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.9,
                  delay: reduce ? 0 : 0.18 + idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.08, zIndex: 30 }}
              >
                {/* halo */}
                <span
                  className={`absolute -inset-2 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-[#D4AF37]/30 blur-[6px]' : 'bg-transparent group-hover:bg-[#D4AF37]/15'
                  }`}
                />
                {!reduce && isActive && (
                  <motion.span
                    className="absolute -inset-1 rounded-full border border-[#D4AF37]"
                    animate={{ opacity: [0.7, 0], scale: [1, 1.55] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}

                {/* photo bubble */}
                <span
                  className={`relative block w-full h-full rounded-full overflow-hidden border-2 transition-colors duration-500 ${
                    isActive ? 'border-[#D4AF37]' : 'border-white/25 group-hover:border-[#D4AF37]/70'
                  }`}
                  style={{ boxShadow: '0 14px 34px -10px rgba(0,0,0,0.9)' }}
                >
                  <img
                    src={loc.cover_image_url}
                    alt={loc.place_name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                  />
                  <span
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive ? 'bg-black/10' : 'bg-black/45 group-hover:bg-black/20'
                    }`}
                  />
                  {/* work count pill */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-[1px] rounded-full bg-black/75 border border-[#D4AF37]/40 text-[9px] font-mono text-[#D4AF37]">
                    {loc.works_count}
                  </span>
                </span>

                {/* place label */}
                <span
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono transition-all duration-400 ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-semibold opacity-100'
                      : 'bg-black/75 text-white/85 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {loc.place_name.split(' ').slice(0, 2).join(' ')}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* hint */}
        <div className="absolute bottom-3 left-4 text-[9px] font-mono text-white/40 pointer-events-none">
          DRAG TO PAN · SCROLL TO ZOOM · TAP A PLACE
        </div>
      </div>

      {/* Selected place — related collections */}
      {activeLoc && (
        <motion.div
          key={activeLoc.id}
          data-testid="selected-location-hud-card"
          initial={reduce ? undefined : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 sm:p-8 border-t border-border/30 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
              {activeLoc.country} · {activeLoc.region}
            </span>
            <h4 className="font-serif text-2xl text-foreground font-medium leading-tight">
              {activeLoc.place_name}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{activeLoc.description}</p>

            <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
              <span className="px-2.5 py-1 rounded-full bg-background/70 border border-border/50 text-muted-foreground">
                {activeLoc.latitude.toFixed(2)}°N, {activeLoc.longitude.toFixed(2)}°E
              </span>
              <span className="px-2.5 py-1 rounded-full bg-background/70 border border-border/50 text-muted-foreground flex items-center gap-1">
                <Mountain className="w-3 h-3 text-[#D4AF37]" />
                {activeLoc.altitude || 'Sea level'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/40 text-[#D4AF37]">
                {activeLoc.works_count} works
              </span>
            </div>

            <Magnetic strength={0.14}>
              <Link
                to={`/places?location=${activeLoc.id}`}
                data-testid="explore-location-archive-button"
                className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-semibold text-[10px] font-mono uppercase tracking-[0.18em] transition-colors duration-300"
              >
                <span>Open this place</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Magnetic>
          </div>

          {/* Related collections shot in this place */}
          <div className="lg:col-span-7 space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#D4AF37]" />
              Collections from {activeLoc.place_name.split(' ')[0]}
            </span>

            {relatedCollections.length === 0 ? (
              <p
                data-testid="location-no-collections"
                className="text-xs text-muted-foreground/70 py-4 px-4 rounded-xl border border-dashed border-border/50"
              >
                No dedicated collection here yet — open the place to browse its individual works.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedCollections.map((col) => (
                  <Link
                    key={col.id}
                    to={`/collections/${col.id}`}
                    data-testid={`location-collection-${col.id}`}
                    className="group relative rounded-2xl overflow-hidden border border-border/40 hover:border-[#D4AF37]/70 transition-colors duration-500 aspect-[16/9]"
                  >
                    <img
                      src={col.cover_image_url}
                      alt={col.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-[1400ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#D4AF37]">
                        {col.media_count} works
                      </div>
                      <div className="font-serif text-base text-white font-medium leading-snug group-hover:text-[#D4AF37] transition-colors duration-300">
                        {col.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
