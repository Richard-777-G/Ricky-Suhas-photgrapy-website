import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { apiGet, apiPost } from '@/lib/api';
import type { Media, InquiryCreate } from '@/types';
import {
  Frame,
  Ruler,
  CheckCircle,
  Send,
  Sparkles,
  MapPin,
  ShoppingBag,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal, AnimatedHeading, TiltCard, Magnetic, useLockBodyScroll } from '@/components/Motion';

/* Fine art print catalogue — request-to-purchase (no card payment taken).
   Every request lands in the Studio as an inquiry for Ricky to quote. */

const PRINT_SIZES = [
  { id: 'a3', label: 'A3 · 297 × 420mm', edition: 'Open edition', price: '₹ 9,500' },
  { id: 'a2', label: 'A2 · 420 × 594mm', edition: 'Open edition', price: '₹ 16,500' },
  { id: 'a1', label: 'A1 · 594 × 841mm', edition: 'Edition of 25', price: '₹ 32,000' },
  { id: 'panoramic', label: 'Panoramic · 1500 × 600mm', edition: 'Edition of 15', price: '₹ 48,000' },
  { id: 'museum', label: 'Museum · 1200 × 1800mm', edition: 'Edition of 7', price: '₹ 96,000' },
];

const FRAME_OPTIONS = [
  { id: 'unframed', label: 'Unframed Giclée', note: 'Hahnemühle Photo Rag 308gsm, archival, rolled in a tube' },
  { id: 'natural-oak', label: 'Natural Oak', note: 'Solid oak, museum glass, 40mm white mount' },
  { id: 'obsidian', label: 'Obsidian Black', note: 'Matte black hardwood, anti-reflective glazing' },
  { id: 'champagne', label: 'Brushed Champagne', note: 'Brushed metal, gallery float mount' },
];

export default function Prints() {
  const [selected, setSelected] = useState<Media | null>(null);

  const { data: photos = [] } = useQuery<Media[]>({
    queryKey: ['media', 'prints'],
    queryFn: () => apiGet<Media[]>('/media?type=photo&published=true&limit=60'),
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-14">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.28em] text-[#D4AF37]">
              <Frame className="w-3.5 h-3.5" />
              <span>Archival Giclée · Signed by the photographer</span>
            </div>
          </Reveal>

          <AnimatedHeading
            text="Fine Art Prints"
            accentFrom={2}
            testId="prints-page-title"
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground"
          />

          <Reveal delay={0.15}>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Each photograph is printed on Hahnemühle archival cotton rag, hand-checked against the
              master file, signed and numbered. Choose a work, a size and a frame — Ricky confirms
              availability, shipping and final pricing personally.
            </p>
          </Reveal>
        </div>

        {/* Print catalogue grid */}
        <div
          data-testid="prints-catalogue-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {photos.map((photo, idx) => (
            <Reveal key={photo.id} delay={Math.min(idx * 0.05, 0.4)}>
              <TiltCard
                max={5}
                testId={`print-card-${photo.id}`}
                onClick={() => setSelected(photo)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-[#D4AF37]/70 shadow-lg hover:shadow-2xl hover:shadow-black/40 transition-[border-color,box-shadow] duration-500 flex flex-col"
              >
                {/* print-on-wall presentation: generous mount, floating shadow */}
                <div className="p-4 sm:p-5 bg-gradient-to-b from-[#101319] to-[#0A0C11] dark:from-[#101319] dark:to-[#0A0C11]">
                  <div className="relative aspect-[4/3] overflow-hidden shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)]">
                    <img
                      src={photo.thumbnail_url || photo.file_url}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1300ms] ease-out"
                    />
                  </div>
                </div>

                <div className="p-5 pt-2 space-y-1.5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-[#D4AF37]">
                    <span>{photo.category}</span>
                    <span className="flex items-center gap-1 opacity-75">
                      <MapPin className="w-2.5 h-2.5" />
                      {photo.location_name?.split(' ')[0] || 'Archive'}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-foreground font-medium group-hover:text-[#D4AF37] transition-colors duration-300">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {photo.short_description}
                  </p>

                  <div className="pt-3 mt-auto flex items-center justify-between border-t border-border/40">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      From <span className="text-foreground font-semibold">₹ 9,500</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] group-hover:translate-x-0.5 transition-transform duration-300">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Request print
                    </span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </main>

      {selected && <PrintRequestModal media={selected} onClose={() => setSelected(null)} />}

      <Footer />
    </div>
  );
}

function PrintRequestModal({ media, onClose }: { media: Media; onClose: () => void }) {
  useLockBodyScroll(true);
  const [sizeId, setSizeId] = useState(PRINT_SIZES[1].id);
  const [frameId, setFrameId] = useState(FRAME_OPTIONS[1].id);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  const size = useMemo(() => PRINT_SIZES.find((s) => s.id === sizeId)!, [sizeId]);
  const frame = useMemo(() => FRAME_OPTIONS.find((f) => f.id === frameId)!, [frameId]);

  const mutation = useMutation({
    mutationFn: (payload: InquiryCreate) => apiPost('/inquiries', payload),
    onSuccess: () => {
      setDone(true);
      toast.success('Print request sent to Ricky Suhas.');
    },
    onError: () => toast.error('Could not send the request. Please try again.'),
  });

  const submit = () => {
    if (!name || !email) {
      toast.error('Please add your name and email.');
      return;
    }
    mutation.mutate({
      name,
      email,
      inquiry_type: 'Fine Art Print',
      message:
        note ||
        `Print request for "${media.title}" — ${size.label}, ${frame.label}. Please confirm availability and shipping.`,
      location_or_subject: media.location_name,
      media_id: media.id,
      media_title: media.title,
      print_size: size.label,
      frame_option: frame.label,
      quoted_price: size.price,
    });
  };

  return (
    <div
      data-testid="print-request-modal"
      className="fixed inset-0 z-[60] bg-black/92 backdrop-blur-2xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#D4AF37]/30 bg-[#0C0E12] shadow-2xl grid grid-cols-1 lg:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview side */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#12151C] to-[#08090C] flex flex-col justify-center">
          <div className="relative shadow-[0_30px_70px_-20px_rgba(0,0,0,0.95)]">
            <img
              src={media.file_url}
              alt={media.title}
              className="w-full object-cover"
              style={{
                border:
                  frameId === 'unframed'
                    ? 'none'
                    : `14px solid ${
                        frameId === 'natural-oak'
                          ? '#B08453'
                          : frameId === 'obsidian'
                          ? '#14161A'
                          : '#C9B28A'
                      }`,
                padding: frameId === 'unframed' ? 0 : 10,
                background: frameId === 'unframed' ? 'transparent' : '#F7F5F0',
              }}
            />
          </div>
          <div className="mt-5 space-y-1">
            <h3 className="font-serif text-xl text-white font-medium">{media.title}</h3>
            <p className="text-xs text-white/60 leading-relaxed">{media.short_description}</p>
            <p className="text-[10px] font-mono text-[#D4AF37] pt-1">
              {media.exif?.camera} · {media.exif?.lens}
            </p>
          </div>
        </div>

        {/* Configurator side */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                Configure your print
              </div>
              <div className="font-serif text-2xl text-white font-light mt-1">
                {size.price}
                <span className="text-xs font-mono text-white/40 ml-2">indicative</span>
              </div>
            </div>
            <button
              onClick={onClose}
              data-testid="close-print-modal-button"
              className="p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {done ? (
            <div className="py-10 text-center space-y-3" data-testid="print-request-success">
              <CheckCircle className="w-11 h-11 text-[#D4AF37] mx-auto" />
              <h4 className="font-serif text-xl text-white">Request received</h4>
              <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                Ricky will confirm availability, edition number and shipping for{' '}
                <span className="text-[#D4AF37]">{size.label}</span> · {frame.label}.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-[11px] font-mono uppercase tracking-wider transition-colors"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <>
              {/* Size selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 flex items-center gap-1.5">
                  <Ruler className="w-3 h-3 text-[#D4AF37]" /> Paper size
                </span>
                <div className="space-y-1.5">
                  {PRINT_SIZES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSizeId(s.id)}
                      data-testid={`print-size-${s.id}`}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-300 ${
                        sizeId === s.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/12'
                          : 'border-white/12 hover:border-white/30'
                      }`}
                    >
                      <span>
                        <span className="block text-xs text-white font-medium">{s.label}</span>
                        <span className="block text-[10px] font-mono text-white/45">{s.edition}</span>
                      </span>
                      <span className="text-xs font-mono text-[#D4AF37]">{s.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 flex items-center gap-1.5">
                  <Frame className="w-3 h-3 text-[#D4AF37]" /> Framing
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {FRAME_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFrameId(f.id)}
                      data-testid={`print-frame-${f.id}`}
                      title={f.note}
                      className={`px-3 py-2 rounded-xl border text-left transition-all duration-300 ${
                        frameId === f.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/12'
                          : 'border-white/12 hover:border-white/30'
                      }`}
                    >
                      <span className="block text-[11px] text-white font-medium">{f.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-white/40">{frame.note}</p>
              </div>

              {/* Buyer details */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="print-name-input"
                    placeholder="Your name"
                    className="px-3 py-2.5 text-xs font-mono rounded-xl bg-[#050607] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="print-email-input"
                    placeholder="you@domain.com"
                    className="px-3 py-2.5 text-xs font-mono rounded-xl bg-[#050607] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white"
                  />
                </div>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  data-testid="print-note-input"
                  placeholder="Shipping city, deadline, or any special request…"
                  className="w-full px-3 py-2.5 text-xs font-sans rounded-xl bg-[#050607] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white"
                />
              </div>

              <Magnetic strength={0.12} className="w-full">
                <button
                  onClick={submit}
                  disabled={mutation.isPending}
                  data-testid="submit-print-request-button"
                  className="w-full py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-semibold text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{mutation.isPending ? 'Sending…' : 'Request this print'}</span>
                </button>
              </Magnetic>

              <p className="text-[10px] font-mono text-white/35 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                No payment taken here — Ricky confirms the quote personally
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
