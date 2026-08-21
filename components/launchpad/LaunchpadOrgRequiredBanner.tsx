'use client';

import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { CreateOrgModal } from '@/components/tenant';

export function LaunchpadOrgRequiredBanner() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-amber-900">
              Organization Required to Enable System Modules
            </h4>
            <p className="text-xs text-amber-800 font-medium mt-0.5">
              You must create or select an active store organization before you can enable and launch
              POS, Inventory, KDS, or Finance modules.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 whitespace-nowrap transition-all cursor-pointer"
        >
          + Create Organization Now
        </button>
      </div>

      <CreateOrgModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialType="company"
        onOrgCreated={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}

