import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import type { Inquiry, InquiryStats } from '@/types';
import { Inbox, Send, Check, Trash2, Mail, Frame, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';

const FILTERS = ['all', 'new', 'quoted', 'fulfilled'] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminInbox() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>('all');
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const { data: stats } = useQuery<InquiryStats>({
    queryKey: ['inquiry-stats'],
    queryFn: () => apiGet<InquiryStats>('/inquiries/stats'),
  });

  const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({
    queryKey: ['inquiries', filter],
    queryFn: () => apiGet<Inquiry[]>(`/inquiries?status=${filter}`),
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['inquiries'] });
    qc.invalidateQueries({ queryKey: ['inquiry-stats'] });
  };

  const quote = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: string }) =>
      apiPost<Inquiry>(`/inquiries/${id}/quote`, { quote_amount: amount, status: 'quoted' }),
    onSuccess: () => {
      toast.success('Quote saved to this request');
      refresh();
    },
    onError: () => toast.error('Could not save the quote'),
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiPatch<Inquiry>(`/inquiries/${id}`, { status }),
    onSuccess: () => {
      toast.success('Request updated');
      refresh();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiDelete<{ message: string }>(`/inquiries/${id}`),
    onSuccess: () => {
      toast.success('Request removed');
      refresh();
    },
  });

  const statCards = [
    { label: 'Total Requests', value: stats?.total ?? 0 },
    { label: 'Awaiting Reply', value: stats?.new ?? 0 },
    { label: 'Quoted', value: stats?.quoted ?? 0 },
    { label: 'Print Requests', value: stats?.print_requests ?? 0 },
  ];

  return (
    <AdminLayout
      title="Print Order Inbox"
      subtitle="Every print and licensing request, with one-click quote replies"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div
            key={s.label}
            data-testid={`inbox-stat-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="text-2xl font-serif text-[#D4AF37] tabular-nums">{s.value}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/45 mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-testid={`inbox-filter-${f}`}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-colors duration-300 ${
              filter === f
                ? 'bg-[#D4AF37] text-black font-semibold'
                : 'bg-white/5 text-white/55 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-white/45">Loading requests…</p>
      ) : inquiries.length === 0 ? (
        <div
          data-testid="inbox-empty-state"
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center space-y-2"
        >
          <Inbox className="w-6 h-6 text-[#D4AF37] mx-auto" />
          <p className="text-sm text-white/70">No requests in this view yet.</p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="inbox-list">
          {inquiries.map((q) => (
            <div
              key={q.id}
              data-testid={`inbox-item-${q.id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 flex flex-col lg:flex-row gap-5 hover:border-[#D4AF37]/40 transition-colors duration-300"
            >
              {q.media_thumbnail && (
                <img
                  src={q.media_thumbnail}
                  alt={q.media_title || 'Requested artwork'}
                  data-testid={`inbox-item-thumb-${q.id}`}
                  className="w-full lg:w-40 h-32 lg:h-28 object-cover rounded-xl border border-white/10"
                />
              )}

              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25">
                    {q.inquiry_type}
                  </span>
                  <span
                    data-testid={`inbox-item-status-${q.id}`}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/8 text-white/65"
                  >
                    {q.status}
                  </span>
                </div>

                <div className="font-serif text-lg text-white leading-snug truncate">
                  {q.media_title || q.location_or_subject || 'General inquiry'}
                </div>

                <div className="flex items-center gap-3 flex-wrap text-[11px] font-mono text-white/55">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#D4AF37]" />
                    {q.name} · {q.email}
                  </span>
                  {q.print_size && (
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-[#D4AF37]" />
                      {q.print_size}
                    </span>
                  )}
                  {q.frame_option && (
                    <span className="flex items-center gap-1">
                      <Frame className="w-3 h-3 text-[#D4AF37]" />
                      {q.frame_option}
                    </span>
                  )}
                  {q.quoted_price && <span>Est. {q.quoted_price}</span>}
                </div>

                <p className="text-xs text-white/70 leading-relaxed line-clamp-3">{q.message}</p>

                {q.quote_amount && (
                  <p
                    data-testid={`inbox-item-quote-${q.id}`}
                    className="text-xs text-[#D4AF37] font-mono"
                  >
                    Quoted {q.quote_amount} — {q.quote_message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 lg:w-56 shrink-0">
                <input
                  value={amounts[q.id] ?? q.quoted_price ?? ''}
                  onChange={(e) => setAmounts((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Quote e.g. ₹18,000"
                  data-testid={`inbox-quote-input-${q.id}`}
                  className="px-3 py-2 rounded-lg bg-black/50 border border-white/12 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none transition-colors duration-300"
                />
                <button
                  onClick={() => {
                    const amount = (amounts[q.id] ?? q.quoted_price ?? '').trim();
                    if (!amount) {
                      toast.error('Enter a quote amount first');
                      return;
                    }
                    quote.mutate({ id: q.id, amount });
                  }}
                  disabled={quote.isPending}
                  data-testid={`inbox-send-quote-${q.id}`}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:brightness-110 disabled:opacity-50 transition-[filter,opacity] duration-300"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Quote
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus.mutate({ id: q.id, status: 'fulfilled' })}
                    data-testid={`inbox-fulfill-${q.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-white/12 text-[11px] text-white/70 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors duration-300"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Fulfilled
                  </button>
                  <button
                    onClick={() => remove.mutate(q.id)}
                    data-testid={`inbox-delete-${q.id}`}
                    className="px-2.5 py-2 rounded-lg border border-white/12 text-white/50 hover:text-red-400 hover:border-red-400/40 transition-colors duration-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] font-mono text-white/35">
        Quotes are stored on the request in the Studio — no email is sent automatically.
      </p>
    </AdminLayout>
  );
}
