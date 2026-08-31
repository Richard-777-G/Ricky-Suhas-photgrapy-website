import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/api';
import type { SiteSettings } from '@/types';
import { Save, Mail } from 'lucide-react';
import { Instagram, Youtube, Facebook } from '@/components/SocialIcons';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<SiteSettings>>({});

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: () => apiGet<SiteSettings>('/settings'),
  });

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<SiteSettings>) => apiPatch<SiteSettings>('/settings', payload),
    onSuccess: () => {
      toast.success('Site settings updated across the platform.');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: () => toast.error('Failed to save settings.'),
  });

  const handleSave = () => {
    updateMutation.mutate({
      motto: form.motto,
      bio: form.bio,
      contact_email: form.contact_email,
      instagram_url: form.instagram_url,
      youtube_url: form.youtube_url,
      facebook_url: form.facebook_url,
      about_text: form.about_text,
      equipment_text: form.equipment_text,
      percussion_text: form.percussion_text,
    });
  };

  return (
    <AdminLayout
      title="Site Settings"
      subtitle="Edit biography, social handles, equipment, and contact information"
    >
      <div className="space-y-6 max-w-3xl">
        {/* Identity Section */}
        <div className="p-6 rounded-2xl bg-[#0C0E12] border border-white/10 space-y-4">
          <h3 className="font-serif text-lg text-white font-medium">Brand Identity</h3>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60">Motto / Philosophy</label>
            <input
              type="text"
              value={form.motto || ''}
              onChange={(e) => setForm({ ...form, motto: e.target.value })}
              data-testid="settings-motto-input"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60">Short Bio</label>
            <textarea
              rows={2}
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              data-testid="settings-bio-input"
              className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60">
              Full About Ricky Text
            </label>
            <textarea
              rows={4}
              value={form.about_text || ''}
              onChange={(e) => setForm({ ...form, about_text: e.target.value })}
              data-testid="settings-about-input"
              className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-[#0C0E12] border border-white/10 space-y-4">
          <h3 className="font-serif text-lg text-white font-medium">Social Hub Links</h3>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#D4AF37]" /> Instagram URL
            </label>
            <input
              type="text"
              value={form.instagram_url || ''}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              data-testid="settings-instagram-input"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60 flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube URL
            </label>
            <input
              type="text"
              value={form.youtube_url || ''}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              data-testid="settings-youtube-input"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60 flex items-center gap-1.5">
              <Facebook className="w-3.5 h-3.5 text-blue-500" /> Facebook Page URL
            </label>
            <input
              type="text"
              value={form.facebook_url || ''}
              onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
              data-testid="settings-facebook-input"
              placeholder="Configurable until Ricky provides official page"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> Contact Email
            </label>
            <input
              type="email"
              value={form.contact_email || ''}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              data-testid="settings-email-input"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>
        </div>

        {/* Equipment */}
        <div className="p-6 rounded-2xl bg-[#0C0E12] border border-white/10 space-y-4">
          <h3 className="font-serif text-lg text-white font-medium">Equipment & Instrumentation</h3>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60">
              Camera & Optics Loadout
            </label>
            <textarea
              rows={3}
              value={form.equipment_text || ''}
              onChange={(e) => setForm({ ...form, equipment_text: e.target.value })}
              data-testid="settings-equipment-input"
              className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-white/60">
              Percussion Instruments
            </label>
            <textarea
              rows={3}
              value={form.percussion_text || ''}
              onChange={(e) => setForm({ ...form, percussion_text: e.target.value })}
              data-testid="settings-percussion-input"
              className="w-full px-3 py-2 text-xs font-sans rounded-lg bg-[#050607] border border-white/15 text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          data-testid="save-settings-button"
          className="w-full py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{updateMutation.isPending ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </AdminLayout>
  );
}
