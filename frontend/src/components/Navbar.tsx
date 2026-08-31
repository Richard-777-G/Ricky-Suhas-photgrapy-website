import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Compass, Shield, Camera, Film, Layers, MapPin, BookOpen, User, Mail } from 'lucide-react';
import { Instagram, Youtube } from '@/components/SocialIcons';
import SoundscapeAudio from './SoundscapeAudio';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Collections', path: '/collections', icon: Layers },
    { label: 'Places & Map', path: '/places', icon: MapPin },
    { label: 'Films', path: '/films', icon: Film },
    { label: 'Reels', path: '/reels', icon: Camera },
    { label: 'Journal', path: '/stories', icon: BookOpen },
    { label: 'About', path: '/about', icon: User },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <header
      data-testid="main-navigation-bar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 backdrop-blur-xl bg-[#050607]/85 dark:bg-[#050607]/85 bg-[#F2F0EA]/85 border-b border-[#D4AF37]/15 shadow-2xl shadow-black/40'
          : 'py-5 bg-gradient-to-b from-[#050607]/90 via-[#050607]/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          data-testid="brand-logo-link"
          className="group flex flex-col items-start"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-foreground group-hover:text-[#D4AF37] transition-colors">
              RICKY SUHAS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#D4AF37] opacity-80 group-hover:opacity-100 transition-opacity">
            Beauty Seeker
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className={`px-3 py-1.5 text-xs uppercase tracking-[0.15em] font-medium transition-all rounded-md relative ${
                  isActive
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D4AF37] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nature Soundscape */}
          <SoundscapeAudio />

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-button"
            className="p-2 rounded-full border border-border/40 hover:border-[#D4AF37]/50 text-foreground transition-all"
            title="Switch theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D4AF37]" /> : <Moon className="w-4 h-4 text-[#B8860B]" />}
          </button>

          {/* Admin Studio portal */}
          <Link
            to="/admin"
            data-testid="admin-studio-nav-button"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-[#050607] text-[#D4AF37] transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Studio</span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle-button"
            className="lg:hidden p-2 rounded-md border border-border/40 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-nav-menu"
          className="lg:hidden absolute top-full left-0 right-0 bg-[#050607]/95 dark:bg-[#050607]/95 bg-[#F2F0EA]/95 backdrop-blur-2xl border-b border-[#D4AF37]/20 p-6 shadow-2xl transition-all"
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm tracking-wide font-medium transition-colors ${
                    isActive
                      ? 'text-[#D4AF37] bg-[#D4AF37]/15 font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border/30 flex items-center justify-between">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Studio CMS</span>
              </Link>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/rickysuhas/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-[#D4AF37]"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@Rickysuhas0110"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-[#D4AF37]"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
