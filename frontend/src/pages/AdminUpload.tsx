import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { Collection, Location, Media, MediaCreate } from '@/types';
import { Upload, Trash2, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

interface PendingFile {
  localId: string;
  name: string;
  previewUrl: string;
  fileUrl: string;
  title: string;
  short_description: string;
  uploading: boolean;
  uploaded: boolean;
}

export default function AdminUpload() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  // Batch metadata applied to all
  const [batchType, setBatchType] = useState<'photo' | 'video' | 'reel'>('photo');
  const [batchCategory, setBatchCategory] = useState('Landscape');
  const [batchCollection, setBatchCollection] = useState('');
  const [batchLocation, setBatchLocation] = useState('');
  const [batchTags, setBatchTags] = useState('');
  const [batchPublished, setBatchPublished] = useState(true);

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => apiGet<Collection[]>('/collections'),
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => apiGet<Location[]>('/locations'),
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const newEntries: PendingFile[] = Array.from(files).map((f, idx) => ({
      localId: `${Date.now()}-${idx}`,
      name: f.name,
      previewUrl: URL.createObjectURL(f),
      fileUrl: '',
      title: f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      short_description: '',
      uploading: true,
      uploaded: false,
    }));

    setPendingFiles((prev) => [...prev, ...newEntries]);

    // Upload each file to backend storage
    const fileArray = Array.from(files);
    for (let i = 0; i < fileArray.length; i++) {
      const formData = new FormData();
      formData.append('file', fileArray[i]);
      try {
        const res = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.localId === newEntries[i].localId
              ? { ...p, fileUrl: data.file_url, uploading: false, uploaded: true }
              : p
          )
        );
      } catch {
        toast.error(`Failed to upload ${fileArray[i].name}`);
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.localId === newEntries[i].localId ? { ...p, uploading: false } : p
          )
        );
      }
    }
  };

  const bulkMutation = useMutation({
    mutationFn: (items: MediaCreate[]) => apiPost<Media[]>('/media/bulk', { items }),
    onSuccess: (data) => {
      toast.success(`${data.length} media items published to the archive.`);
      setPendingFiles([]);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: () => toast.error('Bulk publish failed.'),
  });

  const handlePublishAll = () => {
    const ready = pendingFiles.filter((p) => p.uploaded && p.fileUrl);
    if (ready.length === 0) {
      toast.error('No successfully uploaded files ready to publish.');
      return;
    }

    const tagsArray = batchTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const items: MediaCreate[] = ready.map((p) => ({
      type: batchType,
      title: p.title || 'Untitled Work',
      short_description:
        p.short_description || 'A newly archived visual moment captured by Ricky Suhas.',
      file_url: p.fileUrl,
      thumbnail_url: p.fileUrl,
      category: batchCategory,
      collection_id: batchCollection || undefined,
      location_id: batchLocation || undefined,
      tags: tagsArray,
      published: batchPublished,
      featured: false,
    }));

    bulkMutation.mutate(items);
  };

  const categories = ['Landscape', 'Wildlife', 'Aerial', 'Macro', 'Ocean', 'Travel', 'Other'];

  return (
    <AdminLayout
      title="Bulk Media Upload"
      subtitle="Drag & drop multiple files, apply shared metadata, then publish in one operation"
    >
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        data-testid="bulk-upload-dropzone"
        className={`rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
            : 'border-white/20 hover:border-[#D4AF37]/60 bg-[#0C0E12]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFiles(e.target.files)}
          data-testid="bulk-upload-file-input"
          className="hidden"
        />
        <Upload className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
        <h3 className="font-serif text-xl text-white font-medium">
          Drag & Drop Photographs, Films, or Reels
        </h3>
        <p className="text-xs font-mono text-white/50 mt-2">
          Supports multiple files at once · JPG, PNG, WEBP, MP4, MOV
        </p>
      </div>

      {/* Batch Metadata Panel */}
      {pendingFiles.length > 0 && (
        <div
          data-testid="batch-metadata-panel"
          className="p-6 rounded-2xl bg-[#0C0E12] border border-[#D4AF37]/30 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
            <Sparkles className="w-4 h-4" />
            <span>Apply Shared Metadata to All {pendingFiles.length} Files</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-white/60">Media Type</label>
              <select
                value={batchType}
                onChange={(e) => setBatchType(e.target.value as 'photo' | 'video' | 'reel')}
                data-testid="batch-type-select"
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
                value={batchCategory}
                onChange={(e) => setBatchCategory(e.target.value)}
                data-testid="batch-category-select"
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
              <label className="text-[11px] font-mono uppercase text-white/60">Collection</label>
              <select
                value={batchCollection}
                onChange={(e) => setBatchCollection(e.target.value)}
                data-testid="batch-collection-select"
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
                value={batchLocation}
                onChange={(e) => setBatchLocation(e.target.value)}
                data-testid="batch-location-select"
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
              <label className="text-[11px] font-mono uppercase text-white/60">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={batchTags}
                onChange={(e) => setBatchTags(e.target.value)}
                data-testid="batch-tags-input"
                placeholder="forest, mist, mountain"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
              />
            </div>

            <div className="space-y-1 flex items-end">
              <label className="flex items-center gap-2 text-xs font-mono text-white/70 pb-2">
                <input
                  type="checkbox"
                  checked={batchPublished}
                  onChange={(e) => setBatchPublished(e.target.checked)}
                  data-testid="batch-published-checkbox"
                  className="accent-[#D4AF37]"
                />
                Publish immediately (else save as draft)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Pending Files Individual Metadata */}
      {pendingFiles.length > 0 && (
        <div data-testid="pending-files-list" className="space-y-3">
          <h3 className="font-serif text-lg text-white font-medium">
            Individual Titles & Two-Line Descriptions
          </h3>

          {pendingFiles.map((pf) => (
            <div
              key={pf.localId}
              data-testid={`pending-file-${pf.localId}`}
              className="p-4 rounded-2xl bg-[#0C0E12] border border-white/10 flex flex-col sm:flex-row gap-4 items-start"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0">
                <img src={pf.previewUrl} alt={pf.name} className="w-full h-full object-cover" />
                {pf.uploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                  </div>
                )}
                {pf.uploaded && (
                  <div className="absolute bottom-1 right-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="text-[10px] font-mono text-white/40">{pf.name}</div>
                <input
                  type="text"
                  value={pf.title}
                  onChange={(e) =>
                    setPendingFiles((prev) =>
                      prev.map((p) => (p.localId === pf.localId ? { ...p, title: e.target.value } : p))
                    )
                  }
                  placeholder="Work Title"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
                />
                <textarea
                  rows={2}
                  value={pf.short_description}
                  onChange={(e) =>
                    setPendingFiles((prev) =>
                      prev.map((p) =>
                        p.localId === pf.localId ? { ...p, short_description: e.target.value } : p
                      )
                    )
                  }
                  placeholder="Two-line description of the moment captured..."
                  className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
                />
              </div>

              <button
                onClick={() =>
                  setPendingFiles((prev) => prev.filter((p) => p.localId !== pf.localId))
                }
                className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePublishAll}
              disabled={bulkMutation.isPending}
              data-testid="publish-all-bulk-button"
              className="flex-1 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>
                {bulkMutation.isPending
                  ? 'Publishing...'
                  : `Publish All ${pendingFiles.length} Items to Archive`}
              </span>
            </button>
            <button
              onClick={() => setPendingFiles([])}
              className="px-6 py-3.5 rounded-full border border-white/20 text-white/70 text-xs font-mono uppercase hover:bg-white/5"
            >
              Clear Queue
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
