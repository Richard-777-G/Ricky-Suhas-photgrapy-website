import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Moon,
  Sun,
  Menu,
  X,
  Compass,
  Shield,
  Camera,
  Film,
  Layers,
  MapPin,
  BookOpen,
  User,
  Mail,
  Search,
  Frame,
} from 'lucide-react';
import { Instagram, Youtube } from '@/components/SocialIcons';
import SoundscapeAudio from './SoundscapeAudio';
import SearchPalette from './SearchPalette';
import { ScrollProgressRail } from '@/components/Motion';

const PRIMARY_LINKS = [
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Collections', path: '/collections', icon: Layers },
  { label: 'Places', path: '/places', icon: MapPin },
  { label: 'Films', path: '/films', icon: Film },
  { label: 'Reels', path: '/reels', icon: Camera },
  { label: 'Prints', path: '/prints', icon: Frame },
];

const SECONDARY_LINKS = [
  { label: 'Journal', path: '/stories', icon: BookOpen },
  { label: 'About', path: '/about', icon: User },
  { label: 'Contact', path: '/contact', icon: Mail },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();
  const { scrollY } = useScroll();
  const shellWidth = useTransform(scrollY, [0, 160], ['100%', '94%']);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Cmd/Ctrl + K opens the archive search palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nowDark = !root.classList.contains('dark');
    root.classList.toggle('dark', nowDark);
    setIsDark(nowDark);
  };

  const allLinks = [...PRIMARY_LINKS, ...SECONDARY_LINKS];

  return (
    <>
      <ScrollProgressRail />

      <motion.header
        data-testid="main-navigation-bar"
        style={{ width: shellWidth }}
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-[padding,background-color,border-radius,box-shadow] duration-500 ease-out ${
          isScrolled
            ? 'mt-3 py-2.5 rounded-2xl border border-[#D4AF37]/18 bg-background/72 backdrop-blur-2xl shadow-[0_18px_50px_-20px_rgba(0,0,0,0.85)]'
            : 'mt-0 py-5 rounded-none border-b border-transparent bg-gradient-to-b from-black/70 via-black/25 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" data-testid="brand-logo-link" className="group flex flex-col items-start shrink-0">
            <span className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-medium tracking-tight text-foreground group-hover:text-[#D4AF37] transition-colors duration-500">
                RICKY SUHAS
              </span>
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/85">
              Beauty Seeker
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {allLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className="relative px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] font-medium transition-colors duration-300 rounded-md"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-md bg-[#D4AF37]/12 border border-[#D4AF37]/25"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative ${
                      isActive ? 'text-[#D4AF37]' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              data-testid="open-search-palette-button"
              title="Search the archive (⌘K)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-background/50 text-muted-foreground hover:text-[#D4AF37] hover:border-[#D4AF37]/60 transition-colors duration-300"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[10px] font-mono uppercase tracking-wider">
                Search
              </span>
              <span className="hidden lg:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-border/50">
                ⌘K
              </span>
            </button>

            <div className="hidden sm:block">
              <SoundscapeAudio />
            </div>

            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-button"
              title="Switch atmosphere"
              className="p-2 rounded-full border border-border/50 text-foreground hover:border-[#D4AF37]/60 transition-colors duration-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.35 }}
                  className="block"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#B8860B]" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>

            <Link
              to="/admin"
              data-testid="admin-studio-nav-button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-[#050607] text-[#D4AF37] transition-colors duration-300"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Studio</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              data-testid="mobile-menu-toggle-button"
              className="xl:hidden p-2 rounded-md border border-border/50 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              data-testid="mobile-nav-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="xl:hidden overflow-hidden bg-background/95 backdrop-blur-2xl border-t border-[#D4AF37]/15 mt-3"
            >
              <div className="p-5 grid grid-cols-2 gap-2">
                {allLinks.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.035, duration: 0.4 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`mobile-nav-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'text-[#D4AF37] bg-[#D4AF37]/12 border border-[#D4AF37]/25'
                            : 'text-muted-foreground hover:text-foreground border border-border/40'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#D4AF37]" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="px-5 pb-5 flex items-center justify-between border-t border-border/30 pt-4">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Studio CMS</span>
                </Link>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/rickysuhas/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@Rickysuhas0110"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
