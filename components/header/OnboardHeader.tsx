'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Store,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Building2,
} from 'lucide-react';
import { getAuthToken, clearAuthToken, getMeApi, setAuthUser, getAuthUser, getRoleDisplayName } from '@/lib/api';
import { OrganizationManagerBar } from '@/components/OrganizationManagerBar';

export function OnboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeOrg, setActiveOrg] = useState<string>('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const syncUserState = () => {
    const token = getAuthToken();
    const currentUser = getAuthUser();
    if (currentUser) {
      setUser(currentUser);
    }
    if (typeof window !== 'undefined') {
      setActiveOrg(localStorage.getItem('active_org') || currentUser?.tenant_name || '');
    }

    // Automatically sync fresh user role and details from auth-service /me
    if (token) {
      getMeApi()
        .then((res) => {
          if (res && res.user) {
            setUser(res.user);
            setAuthUser(res.user);
          }
        })
        .catch((err) => {
          console.error('Failed to sync user profile:', err);
        });
    }
  };

  useEffect(() => {
    syncUserState();

    // Listen to global workspace and user change events dynamically
    const handleOrgChange = (e: any) => {
      const orgName = e.detail?.orgName || localStorage.getItem('active_org') || '';
      setActiveOrg(orgName);
      syncUserState();
    };

    const handleUserUpdate = () => {
      syncUserState();
    };

    window.addEventListener('cb_org_changed', handleOrgChange);
    window.addEventListener('cb_user_updated', handleUserUpdate);
    window.addEventListener('storage', syncUserState);

    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChange);
      window.removeEventListener('cb_user_updated', handleUserUpdate);
      window.removeEventListener('storage', syncUserState);
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setShowUserDropdown(false);
    router.push('/login');
  };

  const dynamicRoleTitle = getRoleDisplayName(user, activeOrg);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-orange-500/20"
            >
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Store className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  Code<span className="text-orange-500">Bridges</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/10 text-orange-600 border border-orange-500/20 uppercase tracking-widest">
                  POS System
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                All-In-One Enterprise Point of Sale Operating System
              </p>
            </div>
          </Link>
        </div>

        {/* Right Nav Controls */}
        <div className="flex items-center gap-3">
          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="font-bold text-xs leading-none text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-orange-600 uppercase tracking-wider font-extrabold mt-0.5">
                    {dynamicRoleTitle}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-50 text-xs text-slate-700">
                  <div className="p-2.5 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{user.email || 'user@codebridges.com'}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-extrabold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                      <ShieldCheck className="w-3 h-3 text-orange-500" />
                      Role: {dynamicRoleTitle.toUpperCase()}
                    </div>
                  </div>

                  {/* Only show Admin Control Panel link to actual administrative roles */}
                  {['super_admin', 'admin', 'administrator', 'outlet_manager'].includes(user.role) && (
                    <Link
                      href="/super-admin/dashboard"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors font-medium"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      Admin Control Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors font-semibold mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out (SSO)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
