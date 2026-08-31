import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import type { Story } from '@/types';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Stories() {
  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ['stories'],
    queryFn: () => apiGet<Story[]>('/stories'),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <BookOpen className="w-4 h-4" />
            <span>Field Notes & Expedition Journal</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-foreground tracking-tight">
            Stories of Creation
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Personal chronicles written during expeditions—exploring sub-zero dawns, high-altitude monasteries, and monsoon rain percussion.
          </p>
        </div>

        {/* Stories List */}
        <div data-testid="stories-list-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <Link
              key={story.id}
              to={`/stories/${story.id}`}
              data-testid={`story-item-${story.id}`}
              className="group p-6 rounded-3xl border border-border/40 hover:border-[#D4AF37] bg-card shadow-lg transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <img
                    src={story.cover_image_url}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono bg-black/70 border border-white/20 text-[#D4AF37]">
                    {story.read_time}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{story.date}</span>
                    {story.location_name && (
                      <>
                        <span>·</span>
                        <span className="text-[#D4AF37]">{story.location_name}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl text-foreground font-medium group-hover:text-[#D4AF37] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37] pt-3 border-t border-border/30 group-hover:translate-x-1 transition-transform">
                <span>Read Full Journal</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
