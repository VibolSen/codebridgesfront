'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAuthUser,
  getActiveShiftApi,
  openShiftApi,
  closeShiftApi,
  getHeldCartsApi,
  resumeHeldCartApi,
  deleteHeldCartApi,
  getReceiptApi,
  getDashboardSummaryApi,
  getDashboardWidgetsApi,
  syncOfflineSalesApi,
} from '@/lib/api';
import { getOfflineQueue, clearOfflineQueue } from '@/lib/offlineSync';
import {
  PosSuiteHeader,
  PosKpiSummary,
  PosShiftStatusCard,
  PosTenderBreakdownCard,
  PosQuickActionGrid,
  PosHeldOrdersList,
  PosRecentSalesTable,
  PosKpis,
  RecentPosSale,
  HeldCart,
} from '@/components/pos';
import { ThermalReceiptModal } from '@/components/receipt/ThermalReceiptModal';
import { SalesReturnModal } from '@/components/returns/SalesReturnModal';
import { Clock, X, AlertCircle } from 'lucide-react';

export default function PosDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Shift & Cash Drawer State
  const [activeShift, setActiveShift] = useState<any>(null);
  const [shiftSummary, setShiftSummary] = useState<any>(null);
  const [showShiftOpenModal, setShowShiftOpenModal] = useState(false);
  const [showShiftCloseModal, setShowShiftCloseModal] = useState(false);
  const [openingFloat, setOpeningFloat] = useState('100.00');
  const [countedCash, setCountedCash] = useState('');
  const [closingNote, setClosingNote] = useState('');
  const [supervisorPinInput, setSupervisorPinInput] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // POS KPIs State
  const [kpis, setKpis] = useState<PosKpis>({
    todaySales: 0,
    todayTransactions: 0,
    averageTicket: 0,
    drawerFloat: 100.0,
    cashSales: 0,
    khqrSales: 0,
    cardSales: 0,
  });

  // Recent Sales & Held Carts
  const [recentSales, setRecentSales] = useState<RecentPosSale[]>([]);
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([]);
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Offline Sync State
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    const role = (currentUser.role || '').toLowerCase();
    const isManagerial = [
      'super_admin',
      'admin',
      'administrator',
      'owner',
      'outlet_manager',
      'manager',
      'supervisor',
    ].includes(role);

    if (!isManagerial) {
      router.replace('/pos/terminal');
      return;
    }

    setUser(currentUser);
    loadDashboardData();

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

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Load active shift
      try {
        const shiftRes = await getActiveShiftApi();
        if (shiftRes.data?.shift) {
          setActiveShift(shiftRes.data.shift);
          setShiftSummary(shiftRes.data.summary);
          const shiftData = shiftRes.data.shift;
          const summaryData = shiftRes.data.summary || {};

          const cash = parseFloat(summaryData.cash_sales_total || '0');
          const khqr = parseFloat(summaryData.khqr_sales_total || '0');
          const card = parseFloat(summaryData.card_sales_total || '0');
          const totalSales = cash + khqr + card;
          const txCount = parseInt(summaryData.transactions_count || '0', 10);
          const avg = txCount > 0 ? totalSales / txCount : 0;

          setKpis({
            todaySales: totalSales,
            todayTransactions: txCount,
            averageTicket: avg,
            drawerFloat: parseFloat(shiftData.opening_float || '100'),
            cashSales: cash,
            khqrSales: khqr,
            cardSales: card,
          });
        } else {
          setActiveShift(null);
        }
      } catch (err) {
        console.warn('[POS Dashboard] Could not load shift data:', err);
      }

      // 2. Load held carts
      try {
        const cartsRes = await getHeldCartsApi();
        setHeldCarts(cartsRes.data || []);
      } catch (err) {
        console.warn('[POS Dashboard] Could not load held carts:', err);
      }

      // 3. Load recent sales from widgets
      try {
        const widgetsRes = await getDashboardWidgetsApi();
        const salesList = widgetsRes.data?.recent_sales || [];
        if (salesList.length > 0) {
          setRecentSales(
            salesList.map((s: any) => ({
              id: s.id,
              receipt_number: `REC-${s.id.toString().padStart(6, '0')}`,
              customer_name: s.customer || 'Walk-in Customer',
              created_at: s.date || 'Today',
              grand_total: parseFloat(s.total || '0'),
              tender_type: s.id % 2 === 0 ? 'khqr' : 'cash',
              status: s.status || 'Completed',
            }))
          );
        }
      } catch (err) {
        console.warn('[POS Dashboard] Could not load recent sales:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOfflineSales = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;
    try {
      setIsSyncing(true);
      await syncOfflineSalesApi(queue);
      clearOfflineQueue();
      setOfflineQueueCount(0);
      alert(`Successfully synced ${queue.length} offline transactions!`);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Offline sync failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await openShiftApi({ opening_float: parseFloat(openingFloat || '0') });
      setShowShiftOpenModal(false);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to open shift');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    try {
      setIsProcessing(true);
      await closeShiftApi(activeShift.id, {
        counted_cash: parseFloat(countedCash || '0'),
        closing_note: closingNote,
        supervisor_pin: supervisorPinInput,
      });
      setShowShiftCloseModal(false);
      setShowPinPrompt(false);
      setSupervisorPinInput('');
      setActiveShift(null);
      loadDashboardData();
    } catch (err: any) {
      if (err.message?.includes('Supervisor PIN')) {
        setShowPinPrompt(true);
      }
      alert(err.message || 'Failed to close shift');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeHeldCart = async (cartId: string | number) => {
    router.push(`/pos/terminal?resumeCart=${cartId}`);
  };

  const handleDeleteHeldCart = async (cartId: string | number) => {
    try {
      await deleteHeldCartApi(String(cartId));
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete held cart');
    }
  };

  const handleViewReceipt = async (saleId: string | number) => {
    try {
      const res = await getReceiptApi(String(saleId), true);
      setCompletedSale(res.data || { id: saleId });
    } catch {
      setCompletedSale({ id: saleId, grand_total: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* POS Suite Navigation Header */}
      <PosSuiteHeader
        user={user}
        activeShift={activeShift}
        heldCartsCount={heldCarts.length}
        offlineQueueCount={offlineQueueCount}
        isOnline={isOnline}
        isSyncing={isSyncing}
        onOpenShiftModal={() => setShowShiftOpenModal(true)}
        onCloseShiftModal={() => setShowShiftCloseModal(true)}
        onOpenHeldCartsModal={() => {
          const el = document.getElementById('held-orders-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenReturnsModal={() => setShowReturnModal(true)}
        onSyncOffline={handleSyncOfflineSales}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Row 1: KPI Summary Cards */}
        <PosKpiSummary kpis={kpis} />

        {/* Row 2: Shift Drawer Overview + Payment Tender Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PosShiftStatusCard
            activeShift={activeShift}
            shiftSummary={shiftSummary}
            onOpenShift={() => setShowShiftOpenModal(true)}
            onCloseShift={() => setShowShiftCloseModal(true)}
            onViewShiftHistory={() => router.push('/pos/shifts')}
          />

          <PosTenderBreakdownCard kpis={kpis} />
        </div>

        {/* Row 3: Quick Action Launchers Grid */}
        <PosQuickActionGrid
          onOpenShift={() => setShowShiftOpenModal(true)}
          onOpenReturn={() => setShowReturnModal(true)}
          activeShift={activeShift}
        />

        {/* Row 4: Recent Completed Sales + Held Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="held-orders-section">
          <div className="lg:col-span-2">
            <PosRecentSalesTable
              sales={recentSales}
              onViewReceipt={handleViewReceipt}
              onReturnSale={(saleId) => setShowReturnModal(true)}
            />
          </div>

          <div>
            <PosHeldOrdersList
              heldCarts={heldCarts}
              onResumeCart={handleResumeHeldCart}
              onDeleteCart={handleDeleteHeldCart}
            />
          </div>
        </div>
      </main>

      {/* Thermal Receipt Print Modal */}
      {completedSale && (
        <ThermalReceiptModal
          receiptData={{
            sale: completedSale.sale || completedSale,
            lines: completedSale.lines || [],
            outlet: completedSale.outlet || { name: 'Main Store Outlet' },
            cashier: completedSale.cashier || { name: user?.name || 'Cashier' },
            register: completedSale.register || { name: 'REG-01' },
            payments: completedSale.payments || [],
            is_reprint: true,
          }}
          onClose={() => setCompletedSale(null)}
        />
      )}

      {/* Sales Return Modal */}
      <SalesReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          setShowReturnModal(false);
          loadDashboardData();
        }}
      />

      {/* Open Shift Modal */}
      <AnimatePresence>
        {showShiftOpenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900">Open Cashier Shift</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter starting cash drawer float to begin sales.
                </p>
              </div>

              <form onSubmit={handleOpenShift} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">Opening Float ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={openingFloat}
                    onChange={(e) => setOpeningFloat(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowShiftOpenModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Opening...' : 'Start Shift'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Shift Modal */}
      <AnimatePresence>
        {showShiftCloseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h3 className="font-black text-base text-slate-900">Close Cashier Shift</h3>
                </div>
                <button
                  onClick={() => setShowShiftCloseModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCloseShift} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Counted Cash ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Enter physical cash counted in drawer..."
                    value={countedCash}
                    onChange={(e) => setCountedCash(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Closing Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Any shift variance or notes..."
                    value={closingNote}
                    onChange={(e) => setClosingNote(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {showPinPrompt && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <label className="text-[11px] font-bold text-amber-900">
                      Supervisor 4-Digit PIN Required
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={supervisorPinInput}
                      onChange={(e) => setSupervisorPinInput(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-amber-300 text-center font-mono font-bold text-sm tracking-widest"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowShiftCloseModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Auditing...' : 'Confirm Shift Close'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
