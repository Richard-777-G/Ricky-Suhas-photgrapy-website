import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Camera, Film, Layers, MapPin, CornerDownLeft, Tag } from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { SearchResults, DiscoveryFacets } from '@/types';
import { useLockBodyScroll } from '@/components/Motion';

export default function SearchPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const navigate = useNavigate();
  useLockBodyScroll(isOpen);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(term), 220);
    return () => window.clearTimeout(t);
  }, [term]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const { data: facets } = useQuery<DiscoveryFacets>({
    queryKey: ['discovery-facets'],
    queryFn: () => apiGet<DiscoveryFacets>('/discovery/facets'),
    enabled: isOpen,
  });

  const { data: results, isFetching } = useQuery<SearchResults>({
    queryKey: ['discovery-search', debounced],
    queryFn: () => apiGet<SearchResults>(`/discovery/search?q=${encodeURIComponent(debounced)}`),
    enabled: isOpen && debounced.trim().length > 0,
  });

  const go = (path: string) => {
    onClose();
    setTerm('');
    navigate(path);
  };

  const hasQuery = debounced.trim().length > 0;
  const suggestions = useMemo(
    () => results?.suggested_tags ?? facets?.tags.slice(0, 12).map((t) => t.name) ?? [],
    [results, facets]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="search-palette-overlay"
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-xl flex items-start justify-center pt-20 sm:pt-28 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-3xl border border-[#D4AF37]/30 bg-[#0C0E12]/95 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: -22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                data-testid="search-palette-input"
                placeholder="Search places, species, light conditions, optics…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none font-sans"
              />
              {isFetching && (
                <span className="text-[10px] font-mono text-[#D4AF37] animate-pulse">SEARCHING</span>
              )}
              <button
                onClick={onClose}
                data-testid="search-palette-close"
                className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Smart tag suggestions */}
            <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#D4AF37]" />
                {hasQuery ? 'Related' : 'Popular'}
              </span>
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTerm(tag)}
                  data-testid={`search-tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono border border-white/15 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-[52vh] overflow-y-auto" data-testid="search-palette-results">
              {!hasQuery && (
                <div className="px-5 py-8 space-y-4">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                    Browse by category
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(facets?.categories ?? []).map((c) => (
                      <button
                        key={c.name}
                        onClick={() => go(`/explore?category=${encodeURIComponent(c.name)}`)}
                        data-testid={`search-category-${c.name.toLowerCase()}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/15 text-white/75 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300"
                      >
                        {c.name} <span className="opacity-50">{c.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasQuery && results && (
                <>
                  {results.total === 0 && (
                    <div className="px-5 py-10 text-center space-y-1">
                      <p className="font-serif text-lg text-white">No works match "{results.query}"</p>
                      <p className="text-xs font-mono text-white/40">
                        Try a place, a species, or a light condition.
                      </p>
                    </div>
                  )}

                  {results.media.length > 0 && (
                    <Group label={`Works · ${results.media.length}`}>
                      {results.media.map((m) => (
                        <Row
                          key={m.id}
                          testId={`search-result-media-${m.id}`}
                          onClick={() =>
                            go(
                              m.type === 'video'
                                ? '/films'
                                : m.type === 'reel'
                                ? '/reels'
                                : `/explore?category=${encodeURIComponent(m.category)}`
                            )
                          }
                          thumb={m.thumbnail_url || m.file_url}
                          icon={m.type === 'video' ? Film : m.type === 'reel' ? Camera : Camera}
                          title={m.title}
                          sub={`${m.category} · ${m.location_name || 'Unmapped'}`}
                        />
                      ))}
                    </Group>
                  )}

                  {results.collections.length > 0 && (
                    <Group label={`Collections · ${results.collections.length}`}>
                      {results.collections.map((c) => (
                        <Row
                          key={c.id}
                          testId={`search-result-collection-${c.id}`}
                          onClick={() => go(`/collections/${c.id}`)}
                          thumb={c.cover_image_url}
                          icon={Layers}
                          title={c.title}
                          sub={`${c.media_count} works · ${c.location_name || c.category}`}
                        />
                      ))}
                    </Group>
                  )}

                  {results.locations.length > 0 && (
                    <Group label={`Places · ${results.locations.length}`}>
                      {results.locations.map((l) => (
                        <Row
                          key={l.id}
                          testId={`search-result-location-${l.id}`}
                          onClick={() => go(`/places?location=${l.id}`)}
                          thumb={l.cover_image_url}
                          icon={MapPin}
                          title={l.place_name}
                          sub={`${l.country} · ${l.region} · ${l.works_count} works`}
                        />
                      ))}
                    </Group>
                  )}
                </>
              )}
            </div>

            <div className="px-5 py-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/35">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="w-3 h-3" /> Select
              </span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <div className="px-5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({
  thumb,
  icon: Icon,
  title,
  sub,
  onClick,
  testId,
}: {
  thumb: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="w-full px-5 py-2.5 flex items-center gap-3 hover:bg-white/[0.05] transition-colors duration-200 text-left group"
    >
      <img
        src={thumb}
        alt=""
        loading="lazy"
        className="w-11 h-11 rounded-lg object-cover border border-white/10 shrink-0"
      />
      <span className="flex-1 min-w-0">
        <span className="block text-sm text-white font-medium truncate group-hover:text-[#D4AF37] transition-colors">
          {title}
        </span>
        <span className="block text-[11px] font-mono text-white/45 truncate">{sub}</span>
      </span>
      <Icon className="w-3.5 h-3.5 text-white/30 group-hover:text-[#D4AF37] transition-colors" />
    </button>
  );
}
