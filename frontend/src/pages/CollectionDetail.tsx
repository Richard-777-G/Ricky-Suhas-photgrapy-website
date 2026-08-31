import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { CollectionDetailResponse, Media } from '@/types';
import { MapPin, Calendar, ArrowLeft, Play } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpatialPhotoModal from '@/components/SpatialPhotoModal';
import CinematicFilmModal from '@/components/CinematicFilmModal';
import VerticalReelPlayer from '@/components/VerticalReelPlayer';
import AmbientScore from '@/components/AmbientScore';
import { AnimatedHeading } from '@/components/Motion';

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos' | 'reels'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<Media | null>(null);
  const [selectedReel, setSelectedReel] = useState<Media | null>(null);

  const { data, isLoading } = useQuery<CollectionDetailResponse>({
    queryKey: ['collection', id],
    queryFn: () => apiGet<CollectionDetailResponse>(`/collections/${id}`),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="font-mono text-xs uppercase tracking-widest text-[#D4AF37] animate-pulse">
            Loading Collection Universe...
          </div>
        </div>
      </div>
    );
  }

  if (!data?.collection) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <h2 className="font-serif text-2xl text-foreground">Collection Not Found</h2>
          <Link to="/collections" className="text-xs font-mono text-[#D4AF37] underline">
            Return to All Collections
          </Link>
        </div>
      </div>
    );
  }

  const { collection, media = [], photos = [], videos = [], reels = [] } = data;

  const currentMedia =
    activeTab === 'photos'
      ? photos
      : activeTab === 'videos'
      ? videos
      : activeTab === 'reels'
      ? reels
      : media;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Cover */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] flex items-end overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={collection.cover_image_url}
            alt={collection.title}
            className="w-full h-full object-cover filter brightness-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
          <Link
            to="/collections"
            data-testid="back-to-collections-link"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#D4AF37]">
            <span className="px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/30">
              {collection.category}
            </span>
            {collection.location_name && (
              <span className="flex items-center gap-1 text-white">
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                {collection.location_name}
              </span>
            )}
            {collection.date_from && (
              <span className="flex items-center gap-1 text-white/70">
                <Calendar className="w-3 h-3" />
                {collection.date_from} — {collection.date_to}
              </span>
            )}
          </div>

          <AnimatedHeading
            text={collection.title}
            testId="collection-detail-title"
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.05]"
          />

          <p className="text-sm sm:text-base text-[#F2F0EA]/85 max-w-3xl leading-relaxed">
            {collection.description}
          </p>

          <div className="pt-2" data-testid="collection-ambient-score">
            <AmbientScore category={collection.category} collectionTitle={collection.title} />
          </div>
        </div>
      </section>

      {/* Media Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 flex items-center justify-between border-b border-border/40">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-[#D4AF37] text-black font-semibold'
                : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            All Works ({media.length})
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg transition-all ${
              activeTab === 'photos'
                ? 'bg-[#D4AF37] text-black font-semibold'
                : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            Photos ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg transition-all ${
              activeTab === 'videos'
                ? 'bg-[#D4AF37] text-black font-semibold'
                : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            Films ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg transition-all ${
              activeTab === 'reels'
                ? 'bg-[#D4AF37] text-black font-semibold'
                : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            Reels ({reels.length})
          </button>
        </div>
      </div>

      {/* Grid of works */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMedia.map((item) => {
            const isVideo = item.type === 'video';
            const isReel = item.type === 'reel';

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isVideo) setSelectedFilm(item);
                  else if (isReel) setSelectedReel(item);
                  else setSelectedPhoto(item);
                }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg aspect-[16/11]"
              >
                <img
                  src={item.thumbnail_url || item.file_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {(isVideo || isReel) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="font-serif text-lg text-white font-medium group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2">
                    {item.short_description || item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modals */}
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
