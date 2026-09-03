'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuthUser,
  getActiveShiftApi,
  getHeldCartsApi,
  syncOfflineSalesApi,
} from '@/lib/api';
import { getOfflineQueue, clearOfflineQueue } from '@/lib/offlineSync';
import { PosDashboard } from '@/components/pos';
import { Loader2 } from 'lucide-react';

function PosManagementHubPageContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [heldCartsCount, setHeldCartsCount] = useState(0);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showShiftOpenModal, setShowShiftOpenModal] = useState(false);
  const [showShiftCloseModal, setShowShiftCloseModal] = useState(false);

  const fetchActiveShift = async () => {
    try {
      const res = await getActiveShiftApi();
      if (res.data?.shift) {
        setActiveShift(res.data.shift);
      } else {
        setActiveShift(null);
      }
    } catch {
      setActiveShift(null);
    }
  };

  const fetchHeldCarts = async () => {
    try {
      const res = await getHeldCartsApi();
      if (res.data) {
        setHeldCartsCount(res.data.length);
      }
    } catch {
      setHeldCartsCount(0);
    }
  };

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchActiveShift();
    fetchHeldCarts();

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      setOfflineQueueCount(getOfflineQueue().length);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleSyncOffline = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;
    try {
      setIsSyncing(true);
      await syncOfflineSalesApi(queue);
      clearOfflineQueue();
      setOfflineQueueCount(0);
      alert(`Successfully synced ${queue.length} offline sales.`);
    } catch (err: any) {
      alert(err.message || 'Offline sync failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <PosDashboard
        user={user}
        activeShift={activeShift}
        onRefreshShift={fetchActiveShift}
        onOpenShiftModal={() => setShowShiftOpenModal(true)}
        onCloseShiftModal={() => setShowShiftCloseModal(true)}
      />
    </div>
  );
}

export default function PosManagementHubPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            <span>Loading POS Cockpit...</span>
          </div>
        </div>
      }
    >
      <PosManagementHubPageContent />
    </Suspense>
  );
}
