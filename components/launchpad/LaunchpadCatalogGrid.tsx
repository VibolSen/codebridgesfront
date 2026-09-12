'use client';

import React from 'react';
import Link from 'next/link';
import { Search, CheckCircle2, ArrowRight, Power, Plus, RefreshCw } from 'lucide-react';
import { CatalogModule } from './types';
import { ModuleCard } from '@/components/ui';

interface LaunchpadCatalogGridProps {
  catalogModules: CatalogModule[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isModuleEnabled: (id: string) => boolean;
  isTogglingModule: string | null;
  userRole?: string;
  onToggleModule: (moduleId: string, enable: boolean) => void;
  onOpenSubscriptionModal?: () => void;
}

export function LaunchpadCatalogGrid({
  catalogModules,
  searchTerm,
  onSearchChange,
  isModuleEnabled,
  isTogglingModule,
  userRole,
  onToggleModule,
  onOpenSubscriptionModal,
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
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((mod) => {
          const isEnabled = isModuleEnabled(mod.id);
          const isProcessing = isTogglingModule === mod.id;
          const isSubscription = mod.id === 'bill-subscription';
          const isTenantUser = userRole !== 'super_admin';
          const launchHref =
            mod.id === 'pos-management' && userRole === 'cashier' ? '/pos/pos-terminal' : mod.href;

          return (
            <ModuleCard
              key={mod.id}
              name={mod.name}
              category={mod.category}
              icon={mod.icon}
              logoUrl={mod.logoUrl}
              description={mod.description}
              size="standard"
              statusDot={isEnabled}
              isSelected={isEnabled}
              footerSlot={
                <>
                  {isEnabled ? (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Not Activated
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {isEnabled ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onToggleModule(mod.id, false)}
                          disabled={isProcessing}
                          title="Deactivate Module"
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Power className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isSubscription && isTenantUser ? (
                          <button
                            type="button"
                            onClick={onOpenSubscriptionModal}
                            className="px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span>Manage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <Link
                            href={launchHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span>Launch</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleModule(mod.id, true)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-xl bg-brand-subtle hover:bg-brand text-brand hover:text-white border border-brand/20 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        <span>Enable Service</span>
                      </button>
                    )}
                  </div>
                </>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
