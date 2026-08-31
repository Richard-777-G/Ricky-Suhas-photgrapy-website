import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Layers,
  MapPin,
  BookOpen,
  Settings,
  LogOut,
  Upload,
  Eye,
  Shield,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Media Library', path: '/admin/media', icon: Image },
    { label: 'Bulk Upload', path: '/admin/upload', icon: Upload },
    { label: 'Collections', path: '/admin/collections', icon: Layers },
    { label: 'Places', path: '/admin/places', icon: MapPin },
    { label: 'Journal', path: '/admin/stories', icon: BookOpen },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('rs_admin_user');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F7F6F3] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        data-testid="admin-sidebar"
        className="w-full lg:w-64 shrink-0 bg-[#0C0E12] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col"
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <div className="font-serif text-base font-medium text-white">Ricky Suhas</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                Studio CMS
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`admin-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-semibold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 flex lg:flex-col gap-2">
          <Link
            to="/"
            data-testid="admin-view-site-link"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-[#D4AF37] transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            data-testid="admin-logout-button"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl">
          <div className="space-y-1 border-b border-white/10 pb-5">
            <h1 data-testid="admin-page-title" className="font-serif text-2xl sm:text-3xl font-light text-white">
              {title}
            </h1>
            {subtitle && <p className="text-xs font-mono text-white/50">{subtitle}</p>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
