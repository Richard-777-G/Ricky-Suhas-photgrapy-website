import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { Story } from '@/types';
import { Calendar, MapPin, ArrowLeft, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: story, isLoading } = useQuery<Story>({
    queryKey: ['story', id],
    queryFn: () => apiGet<Story>(`/stories/${id}`),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest animate-pulse">
            Loading Field Journal...
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <h2 className="font-serif text-2xl text-foreground">Field Note Not Found</h2>
          <Link to="/stories" className="text-xs font-mono text-[#D4AF37] underline">
            Return to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <Link
          to="/stories"
          data-testid="back-to-stories-link"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Field Notes</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 border-b border-border/40 pb-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#D4AF37]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {story.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {story.read_time}
            </span>
            {story.location_name && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-foreground">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {story.location_name}
                </span>
              </>
            )}
          </div>

          <h1
            data-testid="story-detail-title"
            className="font-serif text-3xl sm:text-5xl font-light text-foreground tracking-tight leading-tight"
          >
            {story.title}
          </h1>

          <p className="text-base sm:text-lg font-serif italic text-[#D4AF37]">
            "{story.excerpt}"
          </p>
        </div>

        {/* Feature Cover Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border/40 shadow-2xl">
          <img
            src={story.cover_image_url}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div
          data-testid="story-body-content"
          className="prose prose-invert max-w-none text-foreground/90 leading-relaxed font-sans space-y-6 pt-4 text-sm sm:text-base whitespace-pre-line"
        >
          {story.content}
        </div>
      </main>

      <Footer />
    </div>
  );
}
