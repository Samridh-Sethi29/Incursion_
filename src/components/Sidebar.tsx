'use client';

import React, { useState } from 'react';
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
  Sparkles,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, setRole, isAcmCore, isClubExec } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    {
      href: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Key Metrics',
    },
    {
      href: '/calendar',
      label: 'Campus Calendar',
      icon: Calendar,
      description: 'Unified Multi-Club Schedule',
    },
    {
      href: '/conflicts',
      label: 'Conflict Center',
      icon: AlertTriangle,
      badge: '1 Active',
      description: 'Scheduling Clash Arbitration',
    },
    {
      href: '/expenses',
      label: 'Expenses & Funds',
      icon: Receipt,
      description: 'Budget & Digital Receipts',
    },
    {
      href: '/institutional-memory',
      label: 'Institutional Memory',
      icon: History,
      description: 'Historical Transition Archive',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-[#0B1522] border-r border-[#1E324B] text-slate-200">
      {/* Top Branding & Main Nav */}
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">INCURSION</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ACM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Campus Intelligence</p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
            Core Navigation
          </span>
          <nav className="mt-2 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <div>
                      <span className="block leading-tight">{link.label}</span>
                      <span className="text-[10px] font-normal text-slate-500 block leading-tight mt-0.5">
                        {link.description}
                      </span>
                    </div>
                  </div>

                  {link.badge ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                      {link.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: RBAC Switcher & Profile Card */}
      <div className="p-5 border-t border-[#1E324B] space-y-4 bg-[#0E1927]">
        {/* Role Switcher */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-blue-400" />
              Role Switcher (RBAC)
            </span>
            <span className="text-blue-400">{user.role.replace('_', ' ')}</span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-[#0B1522] p-1 rounded-xl border border-[#1E324B]">
            <button
              onClick={() => setRole('ACM_CORE')}
              className={`text-[10px] py-1.5 rounded-lg font-semibold transition-all ${
                user.role === 'ACM_CORE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Core Verifier Privileges"
            >
              Core
            </button>
            <button
              onClick={() => setRole('CLUB_EXEC')}
              className={`text-[10px] py-1.5 rounded-lg font-semibold transition-all ${
                user.role === 'CLUB_EXEC'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Club Executive (GDSC/IEEE)"
            >
              Exec
            </button>
            <button
              onClick={() => setRole('MEMBER')}
              className={`text-[10px] py-1.5 rounded-lg font-semibold transition-all ${
                user.role === 'MEMBER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="General Student Member"
            >
              Member
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0B1522] border border-[#1E324B]">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-blue-600/25 border border-blue-500/40 flex items-center justify-center font-bold text-blue-300 text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B1522] absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
            <p className="text-[10px] text-blue-400 truncate leading-tight mt-0.5">
              {user.clubAffiliation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar (with Hamburger to open sidebar) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0B1522]/95 backdrop-blur-md border-b border-[#1E324B] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">INCURSION</span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-[#101D2C] border border-[#1E324B]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
