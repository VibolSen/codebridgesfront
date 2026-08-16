'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Search, Plus, Monitor, Bell, LogOut, Store, Package, UserPlus, User, Settings, ShieldCheck, ChevronDown } from 'lucide-react';
import { getOutletsApi } from '@/lib/api';
import { AppLauncher } from '@/components/AppLauncher';

interface SuperAdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
  handleLogout: () => void;
}

export function SuperAdminHeader({
  sidebarOpen,
  setSidebarOpen,
  user,
  handleLogout,
}: SuperAdminHeaderProps) {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string>('');
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadOutlets();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadOutlets = async () => {
    try {
      const res = await getOutletsApi();
      const items = res.data || [];
      setOutlets(items);
      if (items.length > 0) {
        setSelectedOutlet(items[0].id || items[0].name);
      }
    } catch (err) {
      console.error('Failed to fetch outlets for header:', err);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Left Header Elements */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dreams POS Brand Logo & Portal Subtitle */}
        <Link href="/super-admin/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/30">
            <span className="text-lg font-black">D</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <span className="font-extrabold text-base tracking-tight text-slate-900 block">
              dreams<span className="text-orange-500 font-normal">POS</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase text-orange-600 tracking-wider block">
              {user?.role === 'super_admin' ? 'Super Admin Portal' : 'Administrator Portal'}
            </span>
          </div>
        </Link>

        {/* Global Search Input */}
        <div className="relative hidden md:block w-64 lg:w-80 ml-4">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog, orders... ⌘ K"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        
        {/* Google 9-Dot App Switcher Launcher */}
        <AppLauncher />

        {/* Dynamic Store / Outlet Switcher */}
        <div className="relative hidden sm:block">
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            {outlets.length === 0 ? (
              <option value="">Freshmart Main Outlet</option>
            ) : (
              outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} {o.code ? `(${o.code})` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Quick Add New Modal Button */}
        <button
          onClick={() => setShowQuickAddModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-xs shadow-sm shadow-orange-500/30 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </button>

        {/* POS Terminal Quick Launcher */}
        <Link
          href="/pos"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5"
        >
          <Monitor className="w-3.5 h-3.5" />
          POS Terminal
        </Link>

        {/* Notifications Bell */}
        <button className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-2 right-2 border border-white animate-pulse"></span>
        </button>

        {/* Interactive Profile Dropdown Container */}
        <div className="relative pl-3 border-l border-slate-200" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'VB'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold leading-tight text-slate-900 flex items-center gap-1">
                {user?.name || 'Super Admin'}
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </p>
              <p className="text-[10px] text-orange-600 font-bold capitalize">
                {user?.role ? user.role.replace('_', ' ') : 'super_admin'}
              </p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100 font-sans text-slate-800">
              
              {/* Profile Card Header */}
              <div className="px-4 py-3 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Vibol'}</p>
                <p className="text-[11px] text-slate-500">{user?.email || 'admin@pos-system.local'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-orange-100 text-orange-700">
                  {user?.role ? user.role.replace('_', ' ') : 'Super Admin'}
                </span>
              </div>

              {/* Menu Links */}
              <div className="py-1 text-xs">
                <Link
                  href="/super-admin/profile"
                  onClick={() => setShowProfileDropdown(false)}
                  className="px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 font-bold text-slate-700 hover:text-orange-600 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" /> My Profile
                </Link>
                <Link
                  href="/super-admin/profile/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 font-bold text-slate-700 hover:text-orange-600 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Profile Settings
                </Link>
                <Link
                  href="/super-admin/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 font-bold text-slate-700 hover:text-orange-600 transition-colors"
                >
                  <Store className="w-4 h-4 text-slate-400" /> System & Store Settings
                </Link>
                <Link
                  href="/super-admin/audit-logs"
                  onClick={() => setShowProfileDropdown(false)}
                  className="px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 font-bold text-slate-700 hover:text-orange-600 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" /> Security Audit Logs
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4 font-sans text-slate-800">
            <h3 className="font-extrabold text-base text-slate-900">Quick Creation Actions</h3>
            <div className="space-y-2">
              <Link
                href="/super-admin/products"
                onClick={() => setShowQuickAddModal(false)}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-orange-600 flex items-center gap-3 transition-colors"
              >
                <Package className="w-4 h-4 text-orange-500" /> Add New Product
              </Link>
              <Link
                href="/super-admin/users"
                onClick={() => setShowQuickAddModal(false)}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-orange-600 flex items-center gap-3 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-indigo-500" /> Add New Staff / User
              </Link>
              <Link
                href="/super-admin/stores"
                onClick={() => setShowQuickAddModal(false)}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-orange-600 flex items-center gap-3 transition-colors"
              >
                <Store className="w-4 h-4 text-blue-500" /> Add New Outlet / Store
              </Link>
            </div>
            <button
              onClick={() => setShowQuickAddModal(false)}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
