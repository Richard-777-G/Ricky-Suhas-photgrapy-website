import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import type { Story, StoryCreate, Location, Collection } from '@/types';
import { Plus, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

export default function AdminStories() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<StoryCreate>({
    title: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    read_time: '5 min read',
    published: true,
    featured: false,
    tags: [],
  });

  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ['stories'],
    queryFn: () => apiGet<Story[]>('/stories'),
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => apiGet<Location[]>('/locations'),
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => apiGet<Collection[]>('/collections'),
  });

  const createMutation = useMutation({
    mutationFn: (payload: StoryCreate) => apiPost<Story>('/stories', payload),
    onSuccess: () => {
      toast.success('Field journal entry published.');
      setShowCreate(false);
      setForm({
        title: '',
        excerpt: '',
        content: '',
        cover_image_url: '',
        read_time: '5 min read',
        published: true,
        featured: false,
        tags: [],
      });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: () => toast.error('Failed to publish story.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/stories/${id}`),
    onSuccess: () => {
      toast.success('Journal entry deleted.');
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return (
    <AdminLayout title="Journal Manager" subtitle="Write and publish expedition field notes">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(true)}
          data-testid="admin-add-story-button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black text-xs font-mono uppercase font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      <div data-testid="admin-stories-list" className="space-y-4">
        {stories.map((story) => (
          <div
            key={story.id}
            data-testid={`admin-story-row-${story.id}`}
            className="p-4 rounded-2xl bg-[#0C0E12] border border-white/10 flex gap-4 items-start"
          >
            <img
              src={story.cover_image_url}
              alt={story.title}
              className="w-24 h-16 object-cover rounded-lg border border-white/10 shrink-0"
            />
            <div className="flex-1 space-y-1">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase">
                {story.date} · {story.read_time} · {story.location_name || 'No location'}
              </div>
              <h3 className="font-serif text-base text-white font-medium">{story.title}</h3>
              <p className="text-[11px] text-white/50 line-clamp-2">{story.excerpt}</p>
            </div>
            <button
              onClick={() => {
                if (confirm(`Delete journal entry "${story.title}"?`)) deleteMutation.mutate(story.id);
              }}
              data-testid={`delete-story-${story.id}`}
              className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0C0E12] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl text-white">New Field Journal Entry</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-testid="new-story-title-input"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Excerpt *</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                data-testid="new-story-excerpt-input"
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Full Content *</label>
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                data-testid="new-story-content-input"
                className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Cover Image URL *</label>
              <input
                type="text"
                value={form.cover_image_url}
                onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                data-testid="new-story-cover-input"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Location</label>
                <select
                  value={form.location_id || ''}
                  onChange={(e) => setForm({ ...form, location_id: e.target.value || undefined })}
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
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-white/60">Collection</label>
                <select
                  value={form.collection_id || ''}
                  onChange={(e) => setForm({ ...form, collection_id: e.target.value || undefined })}
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
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (!form.title || !form.excerpt || !form.content || !form.cover_image_url) {
                    toast.error('All required fields must be completed.');
                    return;
                  }
                  createMutation.mutate(form);
                }}
                disabled={createMutation.isPending}
                data-testid="save-new-story-button"
                className="flex-1 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{createMutation.isPending ? 'Publishing...' : 'Publish Journal Entry'}</span>
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
