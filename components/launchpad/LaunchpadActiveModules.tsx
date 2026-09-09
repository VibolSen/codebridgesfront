'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { CatalogModule } from './types';
import { LaunchpadModuleCard } from './LaunchpadModuleCard';

interface LaunchpadActiveModulesProps {
  activeModules: CatalogModule[];
  userRole?: string;
  isTogglingModule: string | null;
  onToggleModule: (moduleId: string, enable: boolean) => void;
}

export function LaunchpadActiveModules({
  activeModules,
  userRole,
  isTogglingModule,
  onToggleModule,
}: LaunchpadActiveModulesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Active Running Modules ({activeModules.length} Enabled)
          </h3>
        </div>
      </div>

      {activeModules.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-800">No Running Modules Active for this Workspace</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Enable services from the platform catalog below to launch and run them across your store fleet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeModules.map((mod) => (
            <LaunchpadModuleCard
              key={mod.id}
              module={mod}
              isEnabled={true}
              isProcessing={isTogglingModule === mod.id}
              userRole={userRole}
              onToggleModule={onToggleModule}
              variant="active"
            />
          ))}
        </div>
      )}
    </div>
  );
}
