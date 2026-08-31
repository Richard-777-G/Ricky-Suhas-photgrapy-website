import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import type { DashboardStats } from '@/types';
import { Image, Film, Camera, Layers, MapPin, BookOpen, FileEdit, Star, Upload, ArrowRight } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiGet<DashboardStats>('/settings/dashboard-stats'),
  });

  const counts = stats?.counts;

  const cards = [
    { label: 'Photographs', value: counts?.photos ?? 0, icon: Image, link: '/admin/media' },
    { label: 'Cinematic Films', value: counts?.videos ?? 0, icon: Film, link: '/admin/media' },
    { label: 'Vertical Reels', value: counts?.reels ?? 0, icon: Camera, link: '/admin/media' },
    { label: 'Collections', value: counts?.collections ?? 0, icon: Layers, link: '/admin/collections' },
    { label: 'Locations', value: counts?.locations ?? 0, icon: MapPin, link: '/admin/places' },
    { label: 'Journal Entries', value: counts?.stories ?? 0, icon: BookOpen, link: '/admin/stories' },
    { label: 'Drafts (Unpublished)', value: counts?.drafts ?? 0, icon: FileEdit, link: '/admin/media' },
    { label: 'Featured Works', value: counts?.featured ?? 0, icon: Star, link: '/admin/media' },
  ];

  return (
    <AdminLayout
      title="Studio Overview"
      subtitle="Master archive statistics & recent upload activity"
    >
      {/* Stats Grid */}
      <div data-testid="dashboard-stats-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              data-testid={`stat-card-${card.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="p-5 rounded-2xl bg-[#0C0E12] border border-white/10 hover:border-[#D4AF37]/50 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <div className="font-serif text-3xl font-light text-white">{card.value}</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mt-0.5">
                  {card.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/upload"
          data-testid="quick-action-bulk-upload"
          className="p-6 rounded-2xl bg-[#D4AF37] text-black hover:bg-[#B8860B] transition-all space-y-2"
        >
          <Upload className="w-5 h-5" />
          <div className="font-serif text-lg font-semibold">Bulk Upload Media</div>
          <p className="text-xs opacity-80">Drag & drop multiple files with batch metadata tagging.</p>
        </Link>

        <Link
          to="/admin/collections"
          className="p-6 rounded-2xl bg-[#0C0E12] border border-white/10 hover:border-[#D4AF37]/50 transition-all space-y-2"
        >
          <Layers className="w-5 h-5 text-[#D4AF37]" />
          <div className="font-serif text-lg font-medium text-white">Manage Collections</div>
          <p className="text-xs text-white/50">Create expedition collections & assign works.</p>
        </Link>

        <Link
          to="/admin/settings"
          className="p-6 rounded-2xl bg-[#0C0E12] border border-white/10 hover:border-[#D4AF37]/50 transition-all space-y-2"
        >
          <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          <div className="font-serif text-lg font-medium text-white">Site Settings</div>
          <p className="text-xs text-white/50">Edit biography, social handles, and equipment.</p>
        </Link>
      </div>

      {/* Recent Uploads */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-white font-medium">Recent Uploads</h3>
        <div data-testid="recent-uploads-list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(stats?.recent_uploads || []).map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden bg-[#0C0E12] border border-white/10 group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.thumbnail_url || item.file_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2.5 space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-[#D4AF37]">{item.type}</div>
                <div className="text-xs text-white line-clamp-1 font-medium">{item.title}</div>
                <div className="text-[10px] text-white/40 line-clamp-1">
                  {item.published ? 'Published' : 'Draft'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
