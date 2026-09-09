'use client';

import React from 'react';
import { Search, Plus, Lock, Edit, Trash2, ShieldCheck } from 'lucide-react';

export interface RoleItem {
  id: string;
  company_id?: string;
  name: string;
  slug: string;
  description: string;
  is_system: boolean;
  permission_ids: string[];
  permissions_count: number;
}

interface RolesListSidebarProps {
  roles: RoleItem[];
  search: string;
  setSearch: (val: string) => void;
  selectedRole: RoleItem | null;
  onSelectRole: (role: RoleItem) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (role: RoleItem) => void;
  onDeleteRole: (role: RoleItem) => void;
}

export const RolesListSidebar: React.FC<RolesListSidebarProps> = ({
  roles,
  search,
  setSearch,
  selectedRole,
  onSelectRole,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteRole,
}) => {
  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full lg:w-80 bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 flex flex-col space-y-4 shrink-0">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          Roles Directory
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
            {roles.length}
          </span>
        </h3>
        <button
          onClick={onOpenCreateModal}
          className="p-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all"
          title="Create New Role"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Filter roles by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
        {filteredRoles.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No roles found.</p>
        ) : (
          filteredRoles.map((r) => {
            const isSelected = selectedRole?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => onSelectRole(r)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-xs tracking-tight">
                    {r.is_system && (
                      <Lock
                        className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-200' : 'text-slate-400'}`}
                      />
                    )}
                    <span>{r.name}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {r.permission_ids?.length ?? r.permissions_count ?? 0} perms
                  </span>
                </div>

                <p
                  className={`text-[11px] line-clamp-1 ${
                    isSelected ? 'text-orange-100' : 'text-slate-500'
                  }`}
                >
                  {r.description || 'System access role template'}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-black/5">
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider ${
                      isSelected ? 'text-orange-200' : 'text-slate-400'
                    }`}
                  >
                    {r.is_system ? 'Built-in Template' : 'Tenant Custom Role'}
                  </span>

                  {!r.is_system && (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenEditModal(r)}
                        className={`p-1 rounded-md hover:bg-black/10 transition-colors ${
                          isSelected ? 'text-white' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="Edit metadata"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRole(r)}
                        className={`p-1 rounded-md hover:bg-black/10 transition-colors ${
                          isSelected ? 'text-white' : 'text-rose-400 hover:text-rose-600'
                        }`}
                        title="Delete custom role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
