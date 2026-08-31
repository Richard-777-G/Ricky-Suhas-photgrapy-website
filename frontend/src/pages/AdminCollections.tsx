import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import type { Collection, CollectionCreate, Location } from '@/types';
import { Plus, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

export default function AdminCollections() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CollectionCreate>({
    title: '',
    description: '',
    subtitle: '',
    cover_image_url: '',
    category: 'Landscape',
    date_from: '',
    date_to: '',
    featured: false,
    status: 'published',
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => apiGet<Collection[]>('/collections'),
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => apiGet<Location[]>('/locations'),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CollectionCreate) => apiPost<Collection>('/collections', payload),
    onSuccess: () => {
      toast.success('Collection created successfully.');
      setShowCreate(false);
      setForm({
        title: '',
        description: '',
        subtitle: '',
        cover_image_url: '',
        category: 'Landscape',
        date_from: '',
        date_to: '',
        featured: false,
        status: 'published',
      });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: () => toast.error('Failed to create collection.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/collections/${id}`),
    onSuccess: () => {
      toast.success('Collection deleted.');
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return (
    <AdminLayout title="Collections Manager" subtitle="Create and manage curated expedition collections">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(true)}
          data-testid="admin-add-collection-button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black text-xs font-mono uppercase font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      <div data-testid="admin-collections-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            data-testid={`admin-collection-card-${col.id}`}
            className="rounded-2xl bg-[#0C0E12] border border-white/10 overflow-hidden group"
          >
            <div className="aspect-[16/9] overflow-hidden relative">
              <img
                src={col.cover_image_url}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  onClick={() => {
                    if (confirm(`Delete collection "${col.title}"?`)) deleteMutation.mutate(col.id);
                  }}
                  data-testid={`delete-collection-${col.id}`}
                  className="p-1.5 rounded-md bg-black/70 text-white/70 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                <span className="text-[#D4AF37]">{col.category}</span>
                <span className="text-white/40">{col.media_count} works</span>
              </div>
              <h3 className="font-serif text-base text-white font-medium line-clamp-1">{col.title}</h3>
              <p className="text-[11px] text-white/50 line-clamp-2">{col.subtitle || col.description}</p>
              <div className="text-[10px] font-mono text-white/40 pt-1">
                {col.location_name || 'No location'} · {col.status.toUpperCase()}
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
              <h3 className="font-serif text-xl text-white">Create New Collection</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Collection Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-testid="new-collection-title-input"
                placeholder="e.g. Mist Over the Western Ghats"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Subtitle</label>
              <input
                type="text"
                value={form.subtitle || ''}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                data-testid="new-collection-subtitle-input"
                placeholder="An odyssey through ancient cloud canopies"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Description *</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                data-testid="new-collection-description-input"
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Cover Image URL *</label>
              <input
                type="text"
                value={form.cover_image_url}
                onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                data-testid="new-collection-cover-input"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  data-testid="new-collection-category-select"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                >
                  {['Landscape', 'Wildlife', 'Aerial', 'Macro', 'Ocean', 'Travel', 'Exploration'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Location</label>
                <select
                  value={form.location_id || ''}
                  onChange={(e) => setForm({ ...form, location_id: e.target.value || undefined })}
                  data-testid="new-collection-location-select"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                >
                  <option value="">— None —</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.place_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Date From</label>
                <input
                  type="text"
                  value={form.date_from || ''}
                  onChange={(e) => setForm({ ...form, date_from: e.target.value })}
                  placeholder="2024"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Date To</label>
                <input
                  type="text"
                  value={form.date_to || ''}
                  onChange={(e) => setForm({ ...form, date_to: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-mono text-white/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              Mark as featured collection
            </label>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (!form.title || !form.description || !form.cover_image_url) {
                    toast.error('Title, description, and cover image are required.');
                    return;
                  }
                  createMutation.mutate(form);
                }}
                disabled={createMutation.isPending}
                data-testid="save-new-collection-button"
                className="flex-1 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{createMutation.isPending ? 'Creating...' : 'Create Collection'}</span>
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
