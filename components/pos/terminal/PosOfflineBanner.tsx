'use client';

import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PosOfflineBannerProps {
  isOnline: boolean;
  offlineQueueCount: number;
  isSyncing: boolean;
  onSyncOffline: () => void;
}

export function PosOfflineBanner({
  isOnline,
  offlineQueueCount,
  isSyncing,
  onSyncOffline,
}: PosOfflineBannerProps) {
  if (isOnline && offlineQueueCount === 0) return null;

  return (
    <div className="px-4 py-2 bg-amber-500 text-white rounded-2xl shadow-xs flex items-center justify-between gap-3 text-xs font-bold">
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <WifiOff className="w-4 h-4 animate-pulse" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        <span>
          {!isOnline
            ? 'Operating in Offline Mode (Offline Queue Active)'
            : `${offlineQueueCount} Offline Transactions Ready to Sync`}
        </span>
      </div>

      {isOnline && offlineQueueCount > 0 && (
        <button
          type="button"
          onClick={onSyncOffline}
          disabled={isSyncing}
          className="px-3 py-1 rounded-xl bg-white text-amber-800 font-extrabold text-[11px] shadow-2xs hover:bg-amber-50 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync to Cloud Now'}</span>
        </button>
      )}
    </div>
  );
}
