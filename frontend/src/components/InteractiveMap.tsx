import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, ArrowRight, Compass, Mountain, Waves } from 'lucide-react';
import type { Location } from '@/types';
import { Reveal, Magnetic } from '@/components/Motion';

/* Geographic bounds of the archive region (Indian subcontinent + trans-Himalaya) */
const LON_MIN = 67.0;
const LON_MAX = 98.5;
const LAT_MIN = 6.0;
const LAT_MAX = 36.5;

const VB_W = 1000;
const VB_H = 1000;
const PAD_X = 110;
const PAD_Y = 70;

function project(lon: number, lat: number): [number, number] {
  const x = PAD_X + ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (VB_W - PAD_X * 2);
  const y = PAD_Y + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (VB_H - PAD_Y * 2);
  return [x, y];
}

/* Coastline + border silhouette of the archive landmass, in real [lon, lat] pairs,
   projected through the same transform as the location nodes so pins land correctly. */
const LANDMASS: [number, number][] = [
  [68.2, 23.7], [70.0, 20.7], [72.8, 19.1], [73.5, 15.9], [74.8, 12.9],
  [76.5, 8.9], [77.5, 8.1], [79.8, 10.3], [80.3, 13.1], [82.2, 16.8],
  [85.8, 19.9], [87.5, 21.6], [89.1, 22.0], [89.7, 25.3], [88.1, 26.5],
  [90.5, 26.9], [92.0, 26.9], [94.5, 27.5], [96.0, 28.2], [97.4, 28.3],
  [95.5, 29.3], [93.0, 28.3], [89.5, 28.0], [88.0, 27.9], [85.0, 27.9],
  [81.0, 30.3], [79.0, 31.0], [78.5, 32.6], [76.0, 32.9], [74.5, 34.5],
  [76.5, 35.6], [78.2, 35.5], [77.0, 32.5], [75.0, 32.0], [74.0, 31.0],
  [72.0, 28.0], [70.0, 27.5], [68.8, 24.5],
];

/* Himalayan / Western Ghats ridge spines drawn as topographic relief strokes */
const RIDGES: [number, number][][] = [
  [[73.8, 15.5], [74.6, 13.4], [76.2, 11.2], [77.0, 9.4]],
  [[74.0, 34.0], [77.5, 32.3], [80.5, 30.2], [84.0, 28.4], [88.0, 27.6], [92.5, 27.6]],
  [[73.2, 18.6], [73.9, 16.8], [74.4, 14.6]],
];

function toPath(points: [number, number][], close = false): string {
  const d = points
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return close ? `${d} Z` : d;
}

interface InteractiveMapProps {
  locations: Location[];
  onSelectLocation?: (location: Location) => void;
  selectedLocationId?: string;
}

export default function InteractiveMap({
  locations,
  onSelectLocation,
  selectedLocationId,
}: InteractiveMapProps) {
  const [activeId, setActiveId] = useState<string | undefined>(
    selectedLocationId || locations[0]?.id
  );
  const [hoverId, setHoverId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const activeLoc =
    locations.find((l) => l.id === (activeId || selectedLocationId)) || locations[0] || null;

  const landPath = useMemo(() => toPath(LANDMASS, true), []);
  const ridgePaths = useMemo(() => RIDGES.map((r) => toPath(r)), []);

  // Elevation contours: nested scaled copies of the silhouette read as topography
  const contours = useMemo(
    () => [0.94, 0.87, 0.78, 0.68].map((scale, i) => ({ scale, key: i })),
    []
  );

  // Great-circle style connection arcs between consecutive expedition sites
  const arcs = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < locations.length - 1; i++) {
      const [x1, y1] = project(locations[i].longitude, locations[i].latitude);
      const [x2, y2] = project(locations[i + 1].longitude, locations[i + 1].latitude);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.32 - 30;
      out.push(`M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`);
    }
    return out;
  }, [locations]);

  const handleSelect = (loc: Location) => {
    setActiveId(loc.id);
    onSelectLocation?.(loc);
  };

  return (
    <div
      data-testid="spatial-interactive-map"
      className="relative rounded-[28px] border border-[#D4AF37]/20 bg-card/70 backdrop-blur-xl p-5 sm:p-8 lg:p-10 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 border-b border-border/40 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Compass
              className="w-3.5 h-3.5"
              style={reduce ? undefined : { animation: 'spin 26s linear infinite' }}
            />
            <span>Geographical Coordinates & Relief Archive</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-light tracking-tight">
            Topographical World Explorer
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => {
            const isSelected = activeLoc?.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                onMouseEnter={() => setHoverId(loc.id)}
                onMouseLeave={() => setHoverId(null)}
                data-testid={`map-node-button-${loc.id}`}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-300 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/25 scale-[1.03]'
                    : 'bg-background/70 border border-border/60 hover:border-[#D4AF37] text-muted-foreground hover:text-foreground'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{loc.place_name.split(' ')[0]}</span>
                <span className="opacity-60">{loc.works_count}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Map canvas + inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* SVG relief map */}
        <div className="lg:col-span-7 relative rounded-3xl bg-[#04050A] border border-border/40 overflow-hidden min-h-[340px] sm:min-h-[460px]">
          {/* atmospheric depth wash */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(212,175,55,0.10),transparent_62%)]" />
          {/* graticule */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />

          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="relative z-10 w-full h-full"
            data-testid="topographic-map-svg"
            role="img"
            aria-label="Topographical map of Ricky Suhas expedition locations"
          >
            <defs>
              <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C2431" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#121822" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0A0E15" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="coastStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F3E5AB" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#8A6D12" />
              </linearGradient>
              <filter id="coastGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="9" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ocean shelf halo */}
            <path d={landPath} fill="none" stroke="#D4AF37" strokeOpacity="0.10" strokeWidth="26" />
            <path d={landPath} fill="none" stroke="#D4AF37" strokeOpacity="0.14" strokeWidth="12" />

            {/* landmass */}
            <path d={landPath} fill="url(#landFill)" />

            {/* elevation contours */}
            <g
              style={{ transformOrigin: '50% 52%' }}
              stroke="#D4AF37"
              fill="none"
              strokeLinejoin="round"
            >
              {contours.map(({ scale, key }) => (
                <path
                  key={key}
                  d={landPath}
                  strokeOpacity={0.16 - key * 0.028}
                  strokeWidth={1.1}
                  strokeDasharray="5 7"
                  transform={`translate(${(VB_W / 2) * (1 - scale)}, ${(VB_H * 0.52) * (1 - scale)}) scale(${scale})`}
                />
              ))}
            </g>

            {/* mountain ridge relief */}
            {ridgePaths.map((d, i) => (
              <path
                key={`ridge-${i}`}
                d={d}
                fill="none"
                stroke="#F3E5AB"
                strokeOpacity="0.22"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 9"
              />
            ))}

            {/* coastline */}
            <path
              d={landPath}
              fill="none"
              stroke="url(#coastStroke)"
              strokeWidth="2.4"
              strokeLinejoin="round"
              filter="url(#coastGlow)"
            />

            {/* expedition connection arcs */}
            {arcs.map((d, i) => (
              <motion.path
                key={`arc-${i}`}
                d={d}
                fill="none"
                stroke="#D4AF37"
                strokeOpacity="0.4"
                strokeWidth="1.4"
                strokeDasharray="8 12"
                initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
                animate={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.1, delay: 0.35 + i * 0.28, ease: 'easeInOut' }}
              />
            ))}

            {/* location nodes */}
            {locations.map((loc, idx) => {
              const [x, y] = project(loc.longitude, loc.latitude);
              const isSelected = activeLoc?.id === loc.id;
              const isHover = hoverId === loc.id;
              const r = 9 + Math.min(9, loc.works_count * 0.7);

              return (
                <g
                  key={loc.id}
                  transform={`translate(${x},${y})`}
                  className="cursor-pointer"
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() => setHoverId(loc.id)}
                  onMouseLeave={() => setHoverId(null)}
                  data-testid={`map-svg-node-${loc.id}`}
                >
                  {/* sonar pulse */}
                  {!reduce && (
                    <motion.circle
                      r={r}
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="1.6"
                      initial={{ opacity: 0.55, scale: 0.7 }}
                      animate={{ opacity: 0, scale: 2.9 }}
                      transition={{
                        duration: 3.1,
                        repeat: Infinity,
                        delay: idx * 0.55,
                        ease: 'easeOut',
                      }}
                    />
                  )}
                  <circle r={r + 8} fill="#D4AF37" fillOpacity={isSelected ? 0.2 : isHover ? 0.12 : 0.05} />
                  <circle
                    r={r}
                    fill={isSelected ? '#D4AF37' : '#04050A'}
                    stroke={isSelected ? '#FFFFFF' : '#D4AF37'}
                    strokeWidth="2.2"
                  />
                  <text
                    y="4.5"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={isSelected ? '#04050A' : '#D4AF37'}
                    style={{ fontFamily: 'monospace', pointerEvents: 'none' }}
                  >
                    {idx + 1}
                  </text>
                  {(isSelected || isHover) && (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={-96}
                        y={r + 10}
                        width={192}
                        height={34}
                        rx={8}
                        fill="#04050A"
                        fillOpacity="0.94"
                        stroke="#D4AF37"
                        strokeOpacity="0.5"
                      />
                      <text
                        y={r + 25}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#F7F6F3"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {loc.place_name.slice(0, 26)}
                      </text>
                      <text
                        y={r + 38}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#D4AF37"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {loc.latitude.toFixed(2)}°N {loc.longitude.toFixed(2)}°E
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HUD readouts */}
          <div className="absolute bottom-3 left-4 text-[10px] font-mono text-muted-foreground/70 space-y-0.5 z-20">
            <div className="text-[#D4AF37]">RELIEF PROJECTION · EQUIRECTANGULAR</div>
            <div>
              LON {LON_MIN.toFixed(1)}°–{LON_MAX.toFixed(1)}°E · LAT {LAT_MIN.toFixed(1)}°–
              {LAT_MAX.toFixed(1)}°N
            </div>
            <div>{locations.length} RECORDED EXPEDITION SITES</div>
          </div>
        </div>

        {/* Inspector */}
        {activeLoc && (
          <motion.div
            key={activeLoc.id}
            data-testid="selected-location-hud-card"
            initial={reduce ? undefined : { opacity: 0, x: 26, filter: 'blur(8px)' }}
            animate={reduce ? undefined : { opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-background/60 rounded-3xl border border-[#D4AF37]/30 p-6 space-y-4 backdrop-blur-xl flex flex-col"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border/40 group">
              <img
                src={activeLoc.cover_image_url}
                alt={activeLoc.place_name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1400ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                  {activeLoc.country} · {activeLoc.region}
                </span>
                <h4 className="font-serif text-lg text-white font-medium">{activeLoc.place_name}</h4>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{activeLoc.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-background/80 p-2.5 rounded-lg border border-border/40">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Waves className="w-3 h-3 text-[#D4AF37]" /> COORDINATES
                </span>
                <span className="text-foreground font-semibold">
                  {activeLoc.latitude.toFixed(4)}°N, {activeLoc.longitude.toFixed(4)}°E
                </span>
              </div>
              <div className="bg-background/80 p-2.5 rounded-lg border border-border/40">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Mountain className="w-3 h-3 text-[#D4AF37]" /> ELEVATION
                </span>
                <span className="text-foreground font-semibold">
                  {activeLoc.altitude || 'Sea Level'}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-2">
              <Magnetic strength={0.14} className="w-full">
                <Link
                  to={`/places?location=${activeLoc.id}`}
                  data-testid="explore-location-archive-button"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-semibold text-[11px] font-mono uppercase tracking-[0.15em] transition-colors duration-300"
                >
                  <span>
                    Explore {activeLoc.works_count} works · {activeLoc.place_name.split(' ')[0]}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
