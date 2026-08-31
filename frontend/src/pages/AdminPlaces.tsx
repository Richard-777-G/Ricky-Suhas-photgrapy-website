import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import type { Location } from '@/types';
import { Plus, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

interface LocationForm {
  country: string;
  region: string;
  city: string;
  place_name: string;
  latitude: number;
  longitude: number;
  altitude: string;
  description: string;
  cover_image_url: string;
  featured: boolean;
}

export default function AdminPlaces() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<LocationForm>({
    country: 'India',
    region: '',
    city: '',
    place_name: '',
    latitude: 20.5937,
    longitude: 78.9629,
    altitude: '',
    description: '',
    cover_image_url: '',
    featured: false,
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => apiGet<Location[]>('/locations'),
  });

  const createMutation = useMutation({
    mutationFn: (payload: LocationForm) => apiPost<Location>('/locations', payload),
    onSuccess: () => {
      toast.success('Location added to the geographical archive.');
      setShowCreate(false);
      setForm({
        country: 'India',
        region: '',
        city: '',
        place_name: '',
        latitude: 20.5937,
        longitude: 78.9629,
        altitude: '',
        description: '',
        cover_image_url: '',
        featured: false,
      });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: () => toast.error('Failed to create location.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/locations/${id}`),
    onSuccess: () => {
      toast.success('Location removed.');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return (
    <AdminLayout title="Places Manager" subtitle="Manage countries, regions, and exact GPS coordinates">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(true)}
          data-testid="admin-add-place-button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black text-xs font-mono uppercase font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Location</span>
        </button>
      </div>

      <div data-testid="admin-places-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            data-testid={`admin-place-card-${loc.id}`}
            className="rounded-2xl bg-[#0C0E12] border border-white/10 overflow-hidden group"
          >
            <div className="aspect-[16/9] overflow-hidden relative">
              <img
                src={loc.cover_image_url}
                alt={loc.place_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <button
                onClick={() => {
                  if (confirm(`Delete location "${loc.place_name}"?`)) deleteMutation.mutate(loc.id);
                }}
                data-testid={`delete-place-${loc.id}`}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 text-white/70 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                <span className="text-[#D4AF37]">{loc.country} · {loc.region}</span>
                <span className="text-white/40">{loc.works_count} works</span>
              </div>
              <h3 className="font-serif text-base text-white font-medium">{loc.place_name}</h3>
              <p className="text-[11px] text-white/50 line-clamp-2">{loc.description}</p>
              <div className="text-[10px] font-mono text-white/40 pt-1">
                {loc.latitude.toFixed(4)}°N, {loc.longitude.toFixed(4)}°E · {loc.altitude || 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0C0E12] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl text-white">Add New Location</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Country *</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  data-testid="new-place-country-input"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Region / State *</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  data-testid="new-place-region-input"
                  placeholder="e.g. Kerala"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">City / Area</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Altitude</label>
                <input
                  type="text"
                  value={form.altitude}
                  onChange={(e) => setForm({ ...form, altitude: e.target.value })}
                  placeholder="e.g. 1,400m - 2,600m"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Place Name *</label>
              <input
                type="text"
                value={form.place_name}
                onChange={(e) => setForm({ ...form, place_name: e.target.value })}
                data-testid="new-place-name-input"
                placeholder="e.g. Silent Valley National Park"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Latitude *</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
                  data-testid="new-place-latitude-input"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Longitude *</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                  data-testid="new-place-longitude-input"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Description *</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                data-testid="new-place-description-input"
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Cover Image URL *</label>
              <input
                type="text"
                value={form.cover_image_url}
                onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                data-testid="new-place-cover-input"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (!form.place_name || !form.region || !form.description || !form.cover_image_url) {
                    toast.error('Place name, region, description, and cover image are required.');
                    return;
                  }
                  createMutation.mutate(form);
                }}
                disabled={createMutation.isPending}
                data-testid="save-new-place-button"
                className="flex-1 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{createMutation.isPending ? 'Saving...' : 'Add Location'}</span>
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-6 py-3 rounded-full border border-white/20 text-white/70 text-xs font-mono uppercase hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
