import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '@/lib/api';
import type { LoginResponse } from '@/types';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@rickysuhas.com');
  const [password, setPassword] = useState('RickySuhas2026!');

  const mutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      apiPost<LoginResponse>('/auth/login', payload),
    onSuccess: (data) => {
      localStorage.setItem('rs_admin_user', JSON.stringify(data.user));
      toast.success(data.message || 'Welcome back, Ricky.');
      navigate('/admin/dashboard');
    },
    onError: () => {
      toast.error('Invalid credentials. Access denied.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#050607] text-[#F7F6F3] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Image */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1675702662605-57e37a8cb2c3?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-[#050607]/80 to-[#050607]/60" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0C0E12]/90 border border-[#D4AF37]/30 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-white">
              Studio Access
            </h1>
            <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest mt-1">
              Ricky Suhas CMS Portal
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} data-testid="admin-login-form" className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-white/60 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-email-input"
              className="w-full px-4 py-3 text-sm font-mono rounded-xl bg-[#050607] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-white/60 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
              className="w-full px-4 py-3 text-sm font-mono rounded-xl bg-[#050607] border border-white/15 focus:border-[#D4AF37] focus:outline-none text-white"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            data-testid="admin-login-submit-button"
            className="w-full py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20"
          >
            <span>{mutation.isPending ? 'Authenticating...' : 'Enter Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center space-y-1">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
            Demo Credentials Pre-filled
          </p>
          <p className="text-[11px] font-mono text-[#D4AF37]">
            admin@rickysuhas.com / RickySuhas2026!
          </p>
        </div>
      </div>
    </div>
  );
}
