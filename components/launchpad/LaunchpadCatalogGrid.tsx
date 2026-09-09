'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { CatalogModule } from './types';
import { LaunchpadModuleCard } from './LaunchpadModuleCard';

interface LaunchpadCatalogGridProps {
  catalogModules: CatalogModule[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isModuleEnabled: (id: string) => boolean;
  isTogglingModule: string | null;
  userRole?: string;
  onToggleModule: (moduleId: string, enable: boolean) => void;
}

export function LaunchpadCatalogGrid({
  catalogModules,
  searchTerm,
  onSearchChange,
  isModuleEnabled,
  isTogglingModule,
  userRole,
  onToggleModule,
}: LaunchpadCatalogGridProps) {
  const filteredCatalog = catalogModules.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Available Platform Modules &amp; Integrated Services
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Live ecosystem services synced directly with your organization database
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search module..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B4DFB] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((mod) => (
          <LaunchpadModuleCard
            key={mod.id}
            module={mod}
            isEnabled={isModuleEnabled(mod.id)}
            isProcessing={isTogglingModule === mod.id}
            userRole={userRole}
            onToggleModule={onToggleModule}
            variant="catalog"
          />
        ))}
      </div>
    </div>
  );
}
