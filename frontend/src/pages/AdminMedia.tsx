import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch, apiDelete, apiPost } from '@/lib/api';
import type { Media, Collection, Location, MediaCreate } from '@/types';
import { Trash2, Star, Eye, EyeOff, Edit, Plus, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

export default function AdminMedia() {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState('all');
  const [editingItem, setEditingItem] = useState<Media | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [newItem, setNewItem] = useState<MediaCreate>({
    type: 'photo',
    title: '',
    short_description: '',
    file_url: '',
    category: 'Landscape',
    published: true,
    featured: false,
    tags: [],
  });

  const { data: media = [] } = useQuery<Media[]>({
    queryKey: ['admin-media', filterType],
    queryFn: () =>
      apiGet<Media[]>(`/media?limit=200${filterType !== 'all' ? `&type=${filterType}` : ''}`),
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => apiGet<Collection[]>('/collections'),
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => apiGet<Location[]>('/locations'),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    queryClient.invalidateQueries({ queryKey: ['media'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: MediaCreate) => apiPost<Media>('/media', payload),
    onSuccess: () => {
      toast.success('Media item created & published.');
      setShowCreate(false);
      setNewItem({
        type: 'photo',
        title: '',
        short_description: '',
        file_url: '',
        category: 'Landscape',
        published: true,
        featured: false,
        tags: [],
      });
      invalidate();
    },
    onError: () => toast.error('Failed to create media item.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Media> }) =>
      apiPatch<Media>(`/media/${id}`, payload),
    onSuccess: () => {
      toast.success('Media updated successfully.');
      setEditingItem(null);
      invalidate();
    },
    onError: () => toast.error('Update failed.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/media/${id}`),
    onSuccess: () => {
      toast.success('Media item removed from archive.');
      invalidate();
    },
    onError: () => toast.error('Delete failed.'),
  });

  const categories = ['Landscape', 'Wildlife', 'Aerial', 'Macro', 'Ocean', 'Travel', 'Other'];

  return (
    <AdminLayout title="Media Library" subtitle="Manage photographs, cinematic films, and vertical reels">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'Photos', value: 'photo' },
            { label: 'Films', value: 'video' },
            { label: 'Reels', value: 'reel' },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              data-testid={`admin-media-filter-${t.value}`}
              className={`px-3 py-1.5 text-xs font-mono uppercase rounded-lg transition-all ${
                filterType === t.value
                  ? 'bg-[#D4AF37] text-black font-semibold'
                  : 'bg-[#0C0E12] border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreate(true)}
          data-testid="admin-add-media-button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black text-xs font-mono uppercase font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Single Media</span>
        </button>
      </div>

      {/* Media Table */}
      <div data-testid="admin-media-table" className="rounded-2xl border border-white/10 overflow-hidden bg-[#0C0E12]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-white/5 text-white/60 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3 text-left">Preview</th>
                <th className="p-3 text-left">Title & Description</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {media.map((item) => (
                <tr
                  key={item.id}
                  data-testid={`admin-media-row-${item.id}`}
                  className="border-t border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="p-3">
                    <img
                      src={item.thumbnail_url || item.file_url}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-lg border border-white/10"
                    />
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="font-medium text-white line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-white/50 line-clamp-2">{item.short_description}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D4AF37]/15 text-[#D4AF37] uppercase">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-white/70 font-mono text-[11px]">{item.category}</td>
                  <td className="p-3 text-white/70 font-mono text-[11px]">
                    {item.location_name || '—'}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-[10px] font-mono ${
                          item.published ? 'text-green-400' : 'text-amber-400'
                        }`}
                      >
                        {item.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                      {item.featured && (
                        <span className="text-[10px] font-mono text-[#D4AF37]">FEATURED</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: item.id,
                            payload: { published: !item.published },
                          })
                        }
                        data-testid={`toggle-publish-${item.id}`}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-[#D4AF37]"
                        title="Toggle publish"
                      >
                        {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: item.id,
                            payload: { featured: !item.featured },
                          })
                        }
                        data-testid={`toggle-featured-${item.id}`}
                        className={`p-1.5 rounded-md hover:bg-white/10 ${
                          item.featured ? 'text-[#D4AF37]' : 'text-white/60'
                        }`}
                        title="Toggle featured"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        data-testid={`edit-media-${item.id}`}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white"
                        title="Edit metadata"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${item.title}" permanently?`)) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        data-testid={`delete-media-${item.id}`}
                        className="p-1.5 rounded-md hover:bg-red-500/20 text-white/60 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0C0E12] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl text-white">Add New Media Item</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Media Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) =>
                    setNewItem({ ...newItem, type: e.target.value as 'photo' | 'video' | 'reel' })
                  }
                  data-testid="new-media-type-select"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                >
                  <option value="photo">Photograph</option>
                  <option value="video">Cinematic Film</option>
                  <option value="reel">Vertical Reel</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  data-testid="new-media-category-select"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Title *</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                data-testid="new-media-title-input"
                placeholder="e.g. Where Clouds Touch the Forest"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">
                Two-Line Short Description *
              </label>
              <textarea
                rows={2}
                value={newItem.short_description}
                onChange={(e) => setNewItem({ ...newItem, short_description: e.target.value })}
                data-testid="new-media-description-input"
                placeholder="Mist rolled through the mountain forest just after sunrise..."
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">
                Media File URL (CDN / Storage) *
              </label>
              <input
                type="text"
                value={newItem.file_url}
                onChange={(e) => setNewItem({ ...newItem, file_url: e.target.value })}
                data-testid="new-media-fileurl-input"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Collection</label>
                <select
                  value={newItem.collection_id || ''}
                  onChange={(e) => setNewItem({ ...newItem, collection_id: e.target.value || undefined })}
                  data-testid="new-media-collection-select"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                >
                  <option value="">— None —</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Location</label>
                <select
                  value={newItem.location_id || ''}
                  onChange={(e) => setNewItem({ ...newItem, location_id: e.target.value || undefined })}
                  data-testid="new-media-location-select"
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

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-white/70">
                <input
                  type="checkbox"
                  checked={newItem.published}
                  onChange={(e) => setNewItem({ ...newItem, published: e.target.checked })}
                  data-testid="new-media-published-checkbox"
                  className="accent-[#D4AF37]"
                />
                Publish immediately
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-white/70">
                <input
                  type="checkbox"
                  checked={newItem.featured}
                  onChange={(e) => setNewItem({ ...newItem, featured: e.target.checked })}
                  data-testid="new-media-featured-checkbox"
                  className="accent-[#D4AF37]"
                />
                Mark as featured
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (!newItem.title || !newItem.short_description || !newItem.file_url) {
                    toast.error('Title, description, and file URL are required.');
                    return;
                  }
                  createMutation.mutate(newItem);
                }}
                disabled={createMutation.isPending}
                data-testid="save-new-media-button"
                className="flex-1 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{createMutation.isPending ? 'Saving...' : 'Save & Publish'}</span>
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

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0C0E12] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl text-white">Edit Media Metadata</h3>
              <button onClick={() => setEditingItem(null)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Title</label>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                data-testid="edit-media-title-input"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">
                Two-Line Short Description
              </label>
              <textarea
                rows={2}
                value={editingItem.short_description}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, short_description: e.target.value })
                }
                data-testid="edit-media-description-input"
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  data-testid="edit-media-category-select"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Location</label>
                <select
                  value={editingItem.location_id || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, location_id: e.target.value || undefined })
                  }
                  data-testid="edit-media-location-select"
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

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: editingItem.id,
                    payload: {
                      title: editingItem.title,
                      short_description: editingItem.short_description,
                      category: editingItem.category,
                      location_id: editingItem.location_id,
                    },
                  })
                }
                data-testid="save-edit-media-button"
                className="flex-1 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => setEditingItem(null)}
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
