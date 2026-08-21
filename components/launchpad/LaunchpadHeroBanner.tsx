'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Sliders } from 'lucide-react';
import { OrganizationManagerBar } from '@/components/OrganizationManagerBar';

interface LaunchpadHeroBannerProps {
  user: any;
  hasValidOrg: boolean;
  enabledCount: number;
  totalModules: number;
  onOpenManageModal: () => void;
}

export function LaunchpadHeroBanner({
  user,
  hasValidOrg,
  enabledCount,
  totalModules,
  onOpenManageModal,
}: LaunchpadHeroBannerProps) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white p-8 sm:p-10 shadow-xl shadow-orange-500/15">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5 w-full">
        {/* Top Row: Title Left + Organization Controls Right */}
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-30">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xs">
            Modular Enterprise{' '}
            <span className="underline decoration-yellow-300 decoration-wavy underline-offset-4">
              Product Suite
            </span>
          </h1>

          <div className="shrink-0 flex items-center gap-2">
            <OrganizationManagerBar />
          </div>
        </div>

        {/* Description & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <p className="text-xs sm:text-sm text-orange-50 font-medium leading-relaxed max-w-2xl">
            Enable or Disable individual operational modules (POS, Inventory, HR Workforce, ABA
            Settlement, KDS) tailored to each store organization workspace.
          </p>

          {/* Top Quick Manage Modules Action */}
          {user && hasValidOrg && (
            <div className="flex items-center gap-3 shrink-0 bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <div className="px-3 py-1 bg-black/20 rounded-xl text-[11px] font-bold text-orange-50 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {enabledCount} of {totalModules} Enabled
                </span>
              </div>

              <button
                onClick={onOpenManageModal}
                className="px-3.5 py-1.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-orange-500" />
                <span>Manage Modules</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
