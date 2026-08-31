import { useState } from 'react';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import type { Location } from '@/types';
import { Link } from 'react-router-dom';

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
  const [activeLoc, setActiveLoc] = useState<Location | null>(
    locations.find((l) => l.id === selectedLocationId) || locations[0] || null
  );

  const handleSelect = (loc: Location) => {
    setActiveLoc(loc);
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
  };

  return (
    <div
      data-testid="spatial-interactive-map"
      className="relative rounded-3xl border border-[#D4AF37]/20 bg-[#0C0E12] dark:bg-[#0C0E12] bg-[#E8E4DA] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl transition-colors"
    >
      {/* Top Map HUD Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '20s' }} />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              Geographical Coordinates & Archive
            </span>
          </div>
          <h3 className="font-serif text-2xl text-foreground font-light tracking-tight mt-1">
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
                data-testid={`map-node-button-${loc.id}`}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/25'
                    : 'bg-background/80 border border-border/60 hover:border-[#D4AF37] text-muted-foreground hover:text-foreground'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{loc.place_name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-70">({loc.works_count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Visual Map & Active Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Map Canvas Simulation */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl bg-[#050607] border border-border/40 p-4 overflow-hidden flex items-center justify-center">
          {/* Topographical grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Radar Scanner sweep line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent animate-pulse pointer-events-none" />

          {/* Render Location Pins on canvas relative coordinates */}
          {locations.map((loc, idx) => {
            const isSelected = activeLoc?.id === loc.id;
            // Map latitude & longitude into 0-100% coords for visualization
            // India center approx: Lat 20, Lon 78
            const topPercent = Math.max(15, Math.min(85, 90 - (loc.latitude - 5) * 2.8));
            const leftPercent = Math.max(15, Math.min(85, (loc.longitude - 68) * 3.2 + 20));

            return (
              <div
                key={loc.id}
                onClick={() => handleSelect(loc)}
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                title={`${loc.place_name} (${loc.works_count} works)`}
              >
                {/* Pulsing ring */}
                <div
                  className={`absolute -inset-2 rounded-full transition-all ${
                    isSelected ? 'bg-[#D4AF37]/40 animate-ping' : 'group-hover:bg-[#D4AF37]/20'
                  }`}
                />
                <div
                  className={`relative w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                    isSelected
                      ? 'bg-[#D4AF37] border-white text-black scale-125'
                      : 'bg-black/90 border-[#D4AF37]/60 text-[#D4AF37] group-hover:scale-110'
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Location tooltip pin */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-black/90 border border-[#D4AF37]/40 text-[10px] font-mono text-white whitespace-nowrap transition-all ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {loc.place_name}
                </div>
              </div>
            );
          })}

          {/* Latitude Longitude HUD readouts */}
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground/60 space-y-0.5">
            <div>REGION: INDIAN SUBCONTINENT & ARCTIC</div>
            <div>STATUS: {locations.length} RECORDED EXPEDITIONS</div>
          </div>
        </div>

        {/* Selected Location Card Inspector */}
        {activeLoc && (
          <div
            data-testid="selected-location-hud-card"
            className="lg:col-span-5 bg-background/60 dark:bg-[#14171F]/80 rounded-2xl border border-[#D4AF37]/30 p-6 space-y-4 backdrop-blur-md"
          >
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border/40 group">
              <img
                src={activeLoc.cover_image_url}
                alt={activeLoc.place_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                    {activeLoc.country} · {activeLoc.region}
                  </span>
                  <h4 className="font-serif text-lg text-white font-medium">
                    {activeLoc.place_name}
                  </h4>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeLoc.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-border/30">
              <div className="bg-background/80 p-2 rounded border border-border/40">
                <span className="text-[10px] text-muted-foreground block">COORDINATES</span>
                <span className="text-foreground font-semibold">
                  {activeLoc.latitude.toFixed(4)}°N, {activeLoc.longitude.toFixed(4)}°E
                </span>
              </div>
              <div className="bg-background/80 p-2 rounded border border-border/40">
                <span className="text-[10px] text-muted-foreground block">ALTITUDE</span>
                <span className="text-foreground font-semibold">{activeLoc.altitude || 'Sea Level'}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/places?location=${activeLoc.id}`}
                data-testid="explore-location-archive-button"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all"
              >
                <span>Explore {activeLoc.works_count} Works in {activeLoc.place_name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
