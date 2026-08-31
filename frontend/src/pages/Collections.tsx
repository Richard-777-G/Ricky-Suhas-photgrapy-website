import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import type { Collection } from '@/types';
import { Layers, MapPin, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Collections() {
  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => apiGet<Collection[]>('/collections'),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Layers className="w-4 h-4" />
            <span>Curated Expedition Bodies of Work</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-foreground tracking-tight">
            Thematic Collections
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Each collection represents a multi-year expedition into unique ecosystems, studying the interplay between light, elevation, and atmospheric moisture.
          </p>
        </div>

        {/* Collections Grid */}
        <div data-testid="collections-list-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.id}`}
              data-testid={`collection-item-${col.id}`}
              className="group relative rounded-3xl overflow-hidden border border-border/40 hover:border-[#D4AF37] transition-all bg-card shadow-xl flex flex-col justify-end aspect-[16/11]"
            >
              <img
                src={col.cover_image_url}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Top Badges */}
              <div className="relative z-10 p-6 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37]">
                  {col.category}
                </span>
                <span className="text-xs font-mono text-white/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                  {col.media_count} Archive Items
                </span>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 p-6 sm:p-8 space-y-2 mt-auto">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{col.location_name || 'Expedition Site'}</span>
                  {col.date_from && <span>· {col.date_from} — {col.date_to}</span>}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium group-hover:text-[#D4AF37] transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                  {col.subtitle || col.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  <span>Enter Collection World</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
