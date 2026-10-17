'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Calendar,
  AlertTriangle,
  Receipt,
  History,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  Users,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, setRole, isAcmCore, isClubExec } = useAuth();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/calendar', label: 'Campus Calendar', icon: Calendar },
    {
      href: '/conflicts',
      label: 'Conflict Center',
      icon: AlertTriangle,
      badge: '1 Active',
    },
    { href: '/expenses', label: 'Expenses & Funds', icon: Receipt },
    { href: '/institutional-memory', label: 'Institutional Memory', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1522]/95 backdrop-blur-md border-b border-[#1E324B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white tracking-tight">INCURSION</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    ACM Core
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Campus Events & Expense Intelligence</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RBAC Role Switcher (Crucial for Evaluation & Testing) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#101D2C] p-1 rounded-xl border border-[#1E324B]">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                Role:
              </span>
              <button
                onClick={() => setRole('ACM_CORE')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  user.role === 'ACM_CORE'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Full ACM Verifier privileges: Override conflicts, approve budgets"
              >
                Core Verifier
              </button>
              <button
                onClick={() => setRole('CLUB_EXEC')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  user.role === 'CLUB_EXEC'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Club Rep (GDSC/IEEE): Submit events, view conflict warnings"
              >
                Club Exec
              </button>
              <button
                onClick={() => setRole('MEMBER')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  user.role === 'MEMBER'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="General Student: Public calendar & transparency viewer"
              >
                Member
              </button>
            </div>

            {/* Profile Avatar / Club Affiliation */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#1E324B]">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name.split(' ')[0]}</p>
                <p className="text-[10px] text-blue-400 font-medium leading-tight">{user.clubAffiliation}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
