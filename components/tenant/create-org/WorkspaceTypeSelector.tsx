'use client';

import React from 'react';
import { Building2, User } from 'lucide-react';

interface WorkspaceTypeSelectorProps {
  workspaceType: 'personal' | 'company';
  onSelectType: (type: 'personal' | 'company') => void;
}

export function WorkspaceTypeSelector({
  workspaceType,
  onSelectType,
}: WorkspaceTypeSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
        Choose Workspace Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        {/* Personal Workspace Card */}
        <button
          type="button"
          onClick={() => onSelectType('personal')}
          className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
            workspaceType === 'personal'
              ? 'border-brand bg-brand-subtle shadow-xs ring-2 ring-brand/20'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                workspaceType === 'personal'
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <User className="w-4 h-4" />
            </div>
            {workspaceType === 'personal' && (
              <span className="w-2.5 h-2.5 rounded-full bg-brand" />
            )}
          </div>
          <div className="mt-2.5">
            <p className="text-xs font-black text-slate-900">Personal Workspace</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
              Single shop & solo checkout
            </p>
          </div>
        </button>

        {/* Company / Multi-Outlet Card */}
        <button
          type="button"
          onClick={() => onSelectType('company')}
          className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
            workspaceType === 'company'
              ? 'border-brand bg-brand-subtle shadow-xs ring-2 ring-brand/20'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                workspaceType === 'company'
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Building2 className="w-4 h-4" />
            </div>
            {workspaceType === 'company' && (
              <span className="w-2.5 h-2.5 rounded-full bg-brand" />
            )}
          </div>
          <div className="mt-2.5">
            <p className="text-xs font-black text-slate-900">Company / Chain</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
              Multi-outlet, team & inventory
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
