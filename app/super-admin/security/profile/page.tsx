'use client';

import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, Phone, Calendar, Key } from 'lucide-react';
import { getAuthUser } from '@/lib/api';

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">
      
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'VB'}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Vibol'}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-orange-100 text-orange-700">
              {user?.role ? user.role.replace('_', ' ') : 'Super Admin'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">{user?.email || 'admin@pos-system.local'}</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" /> Account Identity & Role Privileges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold uppercase">Full Name</span>
            <p className="text-sm font-extrabold text-slate-900">{user?.name || 'Vibol'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold uppercase">Email Address</span>
            <p className="text-sm font-extrabold text-slate-900">{user?.email || 'admin@pos-system.local'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold uppercase">Assigned Security Role</span>
            <p className="text-sm font-extrabold text-orange-600 uppercase">{user?.role || 'super_admin'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-bold uppercase">Account Status</span>
            <p className="text-sm font-extrabold text-emerald-600 uppercase">ACTIVE & VERIFIED</p>
          </div>
        </div>
      </div>

    </div>
  );
}
