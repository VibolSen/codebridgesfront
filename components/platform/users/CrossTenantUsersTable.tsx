'use client';

import React from 'react';
import {
  Building2,
  Store,
  Key,
  Ban,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { CrossTenantUser, getRoleBadge } from './types';

interface CrossTenantUsersTableProps {
  loading: boolean;
  users: CrossTenantUser[];
  onResetPassword: (email: string, id: string | number) => void;
  onToggleActive: (id: string | number, currentActive: boolean | number) => void;
}

export function CrossTenantUsersTable({
  loading,
  users,
  onResetPassword,
  onToggleActive,
}: CrossTenantUsersTableProps) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-xs font-bold text-slate-500">Querying live users from `auth-service` API...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-16 text-center space-y-2">
        <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-sm font-extrabold text-slate-700">No users found</p>
        <p className="text-xs text-slate-400">Try adjusting your search query or role filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
          <tr>
            <th className="px-6 py-4">User Account</th>
            <th className="px-6 py-4">Assigned Role</th>
            <th className="px-6 py-4">Tenant Organization &amp; Outlet</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Master Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand border border-brand-border/60 flex items-center justify-center font-black text-xs shadow-2xs">
                    {u.name ? u.name[0]?.toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">{u.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase ${getRoleBadge(
                    u.role
                  )}`}
                >
                  {(u.role || 'user').replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-brand" />
                    <span>{u.tenant_name || 'CodeBridges Platform'}</span>
                  </p>
                  {u.outlet_name && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-slate-400" />
                      <span>{u.outlet_name}</span>
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                {u.is_active ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                    Suspended
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onResetPassword(u.email, u.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold transition-colors cursor-pointer flex items-center gap-1"
                    title="Send Password Reset"
                  >
                    <Key className="w-3 h-3 text-slate-500" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleActive(u.id, u.is_active)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-colors cursor-pointer flex items-center gap-1 ${
                      u.is_active
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200'
                    }`}
                  >
                    <Ban className="w-3 h-3" />
                    <span>{u.is_active ? 'Suspend' : 'Activate'}</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
