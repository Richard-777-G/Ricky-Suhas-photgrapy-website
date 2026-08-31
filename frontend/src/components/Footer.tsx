import { Link } from 'react-router-dom';
import { Mail, Shield } from 'lucide-react';
import { Instagram, Youtube, Facebook } from '@/components/SocialIcons';

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="border-t border-[#D4AF37]/20 bg-[#050607] dark:bg-[#050607] bg-[#E8E4DA] text-foreground transition-colors relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl tracking-tight text-foreground">RICKY SUHAS</span>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            </div>
            <p className="text-sm font-serif italic text-[#D4AF37] tracking-wide">
              "Beauty Seeker — Take a moment to enjoy God's creation 🌍"
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              An evolving cinematic archive of places, nature, photography, film, and percussion rhythms. Preserving the sacred stillness of the wilderness across the high Himalayas, Western Ghats, and coastal frontiers.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/rickysuhas/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-instagram-link"
                className="w-9 h-9 rounded-full border border-border/60 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center text-muted-foreground transition-all"
                title="Instagram @rickysuhas"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@Rickysuhas0110"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-youtube-link"
                className="w-9 h-9 rounded-full border border-border/60 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center text-muted-foreground transition-all"
                title="YouTube @Rickysuhas0110"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/rickysuhas"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-facebook-link"
                className="w-9 h-9 rounded-full border border-border/60 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center text-muted-foreground transition-all"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@rickysuhas.com"
                data-testid="footer-email-link"
                className="w-9 h-9 rounded-full border border-border/60 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center text-muted-foreground transition-all"
                title="Email Inquiry"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Archive Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                  Visual Explorer
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
                  Featured Collections
                </Link>
              </li>
              <li>
                <Link to="/places" className="text-muted-foreground hover:text-foreground transition-colors">
                  Topographical Map & Places
                </Link>
              </li>
              <li>
                <Link to="/films" className="text-muted-foreground hover:text-foreground transition-colors">
                  4K Cinematic Films
                </Link>
              </li>
              <li>
                <Link to="/reels" className="text-muted-foreground hover:text-foreground transition-colors">
                  Vertical Moments & Reels
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Studio */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Expeditions & Studio</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Available for international nature documentary cinematography, fine art prints, and high-altitude photographic assignments.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                data-testid="footer-admin-link"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#D4AF37] hover:underline"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Photographer CMS Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-muted-foreground gap-4">
          <div>
            © {new Date().getFullYear()} Ricky Suhas. All Rights Reserved. Master Visual Archive.
          </div>
          <div className="flex items-center gap-2 text-[#D4AF37]/80">
            <span>Spatial Computing & High-Resolution Curation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
