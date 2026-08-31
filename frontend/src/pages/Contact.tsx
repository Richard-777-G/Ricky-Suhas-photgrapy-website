import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/api';
import type { InquiryCreate } from '@/types';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState<InquiryCreate>({
    name: '',
    email: '',
    inquiry_type: 'Commercial Licensing',
    message: '',
    location_or_subject: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: InquiryCreate) => apiPost('/inquiries', data),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success('Inquiry transmitted successfully to Ricky Suhas.');
      setFormData({
        name: '',
        email: '',
        inquiry_type: 'Commercial Licensing',
        message: '',
        location_or_subject: '',
      });
    },
    onError: () => {
      toast.error('Failed to transmit message. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-[#D4AF37]/40 text-xs font-mono text-[#D4AF37]">
              <Mail className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest">Connect & Inquiries</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-foreground">
              Direct Inquiries
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              For fine art print acquisitions, commercial cinematography licensing, expedition assignments, or custom percussion collaborations.
            </p>

            <div className="p-6 rounded-2xl bg-card border border-border/40 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">Official Email</span>
                <a
                  href="mailto:contact@rickysuhas.com"
                  data-testid="contact-email-link"
                  className="text-sm font-mono text-foreground hover:text-[#D4AF37] transition-colors"
                >
                  contact@rickysuhas.com
                </a>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">Social Handles</span>
                <div className="flex gap-4 pt-1">
                  <a
                    href="https://www.instagram.com/rickysuhas/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-muted-foreground hover:text-[#D4AF37]"
                  >
                    Instagram @rickysuhas
                  </a>
                  <a
                    href="https://www.youtube.com/@Rickysuhas0110"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-muted-foreground hover:text-red-500"
                  >
                    YouTube @Rickysuhas0110
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/60 shadow-2xl space-y-6">
              {isSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-[#D4AF37] mx-auto animate-bounce" />
                  <h3 className="font-serif text-2xl text-foreground">Thank You</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    Your inquiry has been received. Ricky Suhas will review your message shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2 rounded-full bg-[#D4AF37] text-black font-mono text-xs uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-inquiry-form" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-muted-foreground">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        data-testid="inquiry-name-input"
                        placeholder="e.g. Richard Vishaal"
                        className="w-full px-4 py-2.5 text-xs font-mono rounded-xl bg-background border border-border/60 focus:border-[#D4AF37] focus:outline-none text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-muted-foreground">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        data-testid="inquiry-email-input"
                        placeholder="you@domain.com"
                        className="w-full px-4 py-2.5 text-xs font-mono rounded-xl bg-background border border-border/60 focus:border-[#D4AF37] focus:outline-none text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-muted-foreground">Inquiry Type</label>
                    <select
                      value={formData.inquiry_type}
                      onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                      data-testid="inquiry-type-select"
                      className="w-full px-4 py-2.5 text-xs font-mono rounded-xl bg-background border border-border/60 focus:border-[#D4AF37] focus:outline-none text-foreground"
                    >
                      <option value="Commercial Licensing">Commercial Cinema Licensing</option>
                      <option value="Fine Art Print">Fine Art Print Acquisition</option>
                      <option value="Film Production">Documentary Film Production</option>
                      <option value="Expedition / Collaboration">Expedition Collaboration</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Location or Subject (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location_or_subject || ''}
                      onChange={(e) => setFormData({ ...formData, location_or_subject: e.target.value })}
                      data-testid="inquiry-location-input"
                      placeholder="e.g. Western Ghats Monsoon Project"
                      className="w-full px-4 py-2.5 text-xs font-mono rounded-xl bg-background border border-border/60 focus:border-[#D4AF37] focus:outline-none text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-muted-foreground">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      data-testid="inquiry-message-textarea"
                      placeholder="Describe your assignment or collaboration concept..."
                      className="w-full px-4 py-2.5 text-xs font-sans rounded-xl bg-background border border-border/60 focus:border-[#D4AF37] focus:outline-none text-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    data-testid="submit-inquiry-button"
                    className="w-full py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{mutation.isPending ? 'Transmitting...' : 'Transmit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
