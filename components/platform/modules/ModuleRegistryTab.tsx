'use client';

import React from 'react';
import { PlatformModule } from './types';

interface ModuleRegistryTabProps {
  modulesList: PlatformModule[];
  onToggleDefault: (moduleId: string) => void;
}

export function ModuleRegistryTab({ modulesList, onToggleDefault }: ModuleRegistryTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modulesList.map((mod) => {
          const IconComp = mod.icon;
          return (
            <div
              key={mod.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${mod.bgColor} ${mod.color} flex items-center justify-center font-bold shadow-xs`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      mod.status.includes('GA')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : mod.status.includes('Beta')
                        ? 'bg-[#F5F3FF] text-[#5B4DFB] border-[#DDD6FE]'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{mod.name}</h3>
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">
                    {mod.category} • {mod.version}
                  </span>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{mod.description}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="font-bold text-slate-700">
                  <span>{mod.adoptionCount}</span> <span className="text-slate-400 font-normal">tenants</span>
                </div>

                <button
                  onClick={() => onToggleDefault(mod.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                    mod.isDefault
                      ? 'bg-[#F5F3FF] text-[#5B4DFB] border border-[#DDD6FE]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  <span>Default Suite:</span>
                  <strong>{mod.isDefault ? 'ON' : 'OFF'}</strong>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
