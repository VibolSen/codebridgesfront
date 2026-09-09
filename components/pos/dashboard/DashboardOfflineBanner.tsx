'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface DashboardOfflineBannerProps {
  offlineQueueCount: number;
  isSyncing: boolean;
  onSync: () => void;
}

export function DashboardOfflineBanner({
  offlineQueueCount,
  isSyncing,
  onSync,
}: DashboardOfflineBannerProps) {
  if (offlineQueueCount <= 0) return null;

  return (
    <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
          {offlineQueueCount}
        </div>
        <div>
          <p className="text-xs font-black text-amber-900">
            {offlineQueueCount} Offline Transaction(s) Pending Sync
          </p>
          <p className="text-[11px] text-amber-700">
            Transactions processed during connection dips are safely cached and awaiting sync.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSync}
        disabled={isSyncing}
        className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all shrink-0"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{isSyncing ? 'Syncing...' : 'Sync Pending Sales Now'}</span>
      </button>
    </div>
  );
}
