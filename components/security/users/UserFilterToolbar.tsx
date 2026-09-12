'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface UserFilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  dynamicRoles: Array<{ id: string; name: string; slug: string; is_system?: boolean }>;
}

export function UserFilterToolbar({
  search,
  onSearchChange,
  onSearchSubmit,
  selectedRole,
  onRoleChange,
  dynamicRoles,
}: UserFilterToolbarProps) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input Bar */}
      <form onSubmit={onSearchSubmit} className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search user by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
        />
      </form>

      {/* Role Filter Select */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          Filter Role:
        </div>
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white w-full sm:w-48 capitalize cursor-pointer transition-all"
        >
          <option value="all">All Roles</option>
          {dynamicRoles.length > 0 ? (
            dynamicRoles.map((r) => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))
          ) : (
            <>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="outlet_manager">Outlet Manager</option>
              <option value="supervisor">Supervisor</option>
              <option value="cashier">Cashier</option>
              <option value="inventory_clerk">Inventory Clerk</option>
              <option value="accountant">Accountant</option>
              <option value="user">User</option>
              <option value="customer">Customer</option>
            </>
          )}
        </select>
      </div>
    </div>
  );
}
