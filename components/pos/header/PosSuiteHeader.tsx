'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Monitor,
  LayoutDashboard,
  Clock,
  Receipt,
  Tv,
  Zap,
  PauseCircle,
  RotateCcw,
  LogOut,
  ChevronRight,
  Store,
} from 'lucide-react';
import { AppLauncher } from '@/components/AppLauncher';
import { OrganizationManagerBar } from '@/components/OrganizationManagerBar';
import { logoutApi } from '@/lib/api';

interface PosSuiteHeaderProps {
  user: any;
  activeShift: any;
  heldCartsCount?: number;
  offlineQueueCount?: number;
  isOnline?: boolean;
  isSyncing?: boolean;
  onOpenShiftModal?: () => void;
  onCloseShiftModal?: () => void;
  onOpenHeldCartsModal?: () => void;
  onOpenReturnsModal?: () => void;
  onSyncOffline?: () => void;
  outletName?: string;
  terminalCode?: string;
}

export function PosSuiteHeader({
  user,
  activeShift,
  heldCartsCount = 0,
  offlineQueueCount = 0,
  isOnline = true,
  isSyncing = false,
  onOpenShiftModal,
  onCloseShiftModal,
  onOpenHeldCartsModal,
  onOpenReturnsModal,
  onSyncOffline,
  outletName = 'Main Store Outlet',
  terminalCode = 'REG-01',
}: PosSuiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutApi();
    router.push('/login');
  };

  const userRole = (user?.role || '').toLowerCase();
  const isManagerial = [
    'super_admin',
    'admin',
    'administrator',
    'owner',
    'outlet_manager',
    'manager',
    'supervisor',
  ].includes(userRole);

  const navLinks = [
    ...(isManagerial ? [{ label: 'POS Dashboard', href: '/pos', icon: LayoutDashboard }] : []),
    { label: 'Cashier Terminal', href: '/pos/terminal', icon: Monitor },
    ...(isManagerial ? [{ label: 'Shift Drawer', href: '/pos/shifts', icon: Clock }] : []),
    ...(isManagerial ? [{ label: 'Receipts & Sales', href: '/pos/orders', icon: Receipt }] : []),
    { label: 'Customer Display', href: '/pos/customer-display', icon: Tv, target: '_blank' },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Top Bar: Outlet Title + System Status + User info */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Branding & Outlet Info */}
        <div className="flex items-center gap-3">
          <Link href="/pos" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-extrabold text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-all">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                  POS Module Suite
                </span>
                <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/80">
                  {terminalCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                {outletName}
              </p>
            </div>
          </Link>
        </div>

        {/* Center/Right: Actions & Controls */}
        <div className="flex items-center gap-2.5">
          {/* App Switcher & Organization Switcher */}
          <AppLauncher />
          <OrganizationManagerBar />

          {/* Network Status / Offline Sync Trigger */}
          {offlineQueueCount > 0 ? (
            <button
              onClick={onSyncOffline}
              disabled={isSyncing || !isOnline}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : `Sync Offline (${offlineQueueCount})`}</span>
            </button>
          ) : isOnline ? (
            <div className="hidden sm:flex px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>OFFLINE</span>
            </div>
          )}

          {/* Shift Status Button */}
          {activeShift ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden md:inline">
                Shift Open (Float: ${parseFloat(activeShift.opening_float || 0).toFixed(0)})
              </span>
              <span className="md:hidden">Shift Open</span>
              {onCloseShiftModal && (
                <button
                  onClick={onCloseShiftModal}
                  className="ml-1 px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          ) : (
            onOpenShiftModal && (
              <button
                onClick={onOpenShiftModal}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Open Shift</span>
              </button>
            )
          )}

          {/* Held Carts Badge */}
          {heldCartsCount > 0 && onOpenHeldCartsModal && (
            <button
              onClick={onOpenHeldCartsModal}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Held ({heldCartsCount})</span>
            </button>
          )}

          {/* Sales Return Shortcut */}
          {onOpenReturnsModal && (
            <button
              onClick={onOpenReturnsModal}
              className="hidden lg:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
              <span>Return</span>
            </button>
          )}

          {/* User Profile & Logout */}
          <div className="hidden sm:block text-right pl-2 border-l border-slate-200">
            <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
              {user?.name || 'Cashier'}
            </p>
            <p className="text-[10px] text-orange-500 font-bold capitalize">
              {user?.role?.replace('_', ' ') || 'Staff'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Row: POS Navigation Tabs */}
      <div className="px-4 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1 overflow-x-auto py-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              target={link.target}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
