'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  getDashboardWidgetsApi,
  syncOfflineSalesApi,
} from '@/lib/api';
import { getOfflineQueue, clearOfflineQueue } from '@/lib/offlineSync';
import {
  PosKpiSummary,
  PosShiftStatusCard,
  PosTenderBreakdownCard,
  PosQuickActionGrid,
  PosHeldOrdersList,
  PosRecentSalesTable,
  PosHourlySalesChart,
  PosRegisterFleetCard,
  PosTopSellersCard,
  PosKpis,
  RecentPosSale,
  HeldCart,
} from '@/components/pos';
import { ThermalReceiptModal } from '@/components/receipt/ThermalReceiptModal';
import { SalesReturnModal } from '@/components/returns/SalesReturnModal';
import {
  Monitor,
  Clock,
  X,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  Store,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface PosDashboardProps {
  user?: any;
  activeShift?: any;
  onRefreshShift?: () => void;
  onOpenShiftModal?: () => void;
  onCloseShiftModal?: () => void;
}

export function PosDashboard({
  user: initialUser,
  activeShift: externalActiveShift,
  onRefreshShift,
  onOpenShiftModal: externalOpenShiftModal,
  onCloseShiftModal: externalCloseShiftModal,
}: PosDashboardProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(initialUser || null);
  const [loading, setLoading] = useState(true);

  // Shift & Cash Drawer State
  const [activeShift, setActiveShift] = useState<any>(externalActiveShift || null);
  const [shiftSummary, setShiftSummary] = useState<any>(null);
  const [showShiftOpenModal, setShowShiftOpenModal] = useState(false);
  const [showShiftCloseModal, setShowShiftCloseModal] = useState(false);
  const [openingFloat, setOpeningFloat] = useState('100.00');
  const [countedCash, setCountedCash] = useState('');
  const [closingNote, setClosingNote] = useState('');
  const [supervisorPinInput, setSupervisorPinInput] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // POS KPIs State (strictly live dynamic from backend)
  const [kpis, setKpis] = useState<PosKpis>({
    todaySales: 0,
    todayTransactions: 0,
    averageTicket: 0,
    drawerFloat: 0,
    cashSales: 0,
    khqrSales: 0,
    cardSales: 0,
  });

  // Recent Sales, Top Sellers, Register Fleet & Held Carts
  const [recentSales, setRecentSales] = useState<RecentPosSale[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [registerFleet, setRegisterFleet] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([]);
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Offline Sync State
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const currentUser = initialUser || getAuthUser();
    if (currentUser) {
      setUser(currentUser);
    }
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
  }, [initialUser]);

  useEffect(() => {
    if (externalActiveShift !== undefined) {
      setActiveShift(externalActiveShift);
    }
  }, [externalActiveShift]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      let calculatedKpis: PosKpis = {
        todaySales: 0,
        todayTransactions: 0,
        averageTicket: 0,
        drawerFloat: 0,
        cashSales: 0,
        khqrSales: 0,
        cardSales: 0,
      };

      // 1. Load active shift & shift summary
      try {
        const shiftRes = await getActiveShiftApi();
        if (shiftRes.data?.shift) {
          const shiftData = shiftRes.data.shift;
          const summaryData = shiftRes.data.summary || {};
          setActiveShift(shiftData);
          setShiftSummary(summaryData);

          const cash = parseFloat(summaryData.cash_sales_total || '0');
          const khqr = parseFloat(summaryData.khqr_sales_total || '0');
          const card = parseFloat(summaryData.card_sales_total || '0');
          const totalSales = cash + khqr + card;
          const txCount = parseInt(summaryData.transactions_count || '0', 10);
          const avg = txCount > 0 ? totalSales / txCount : 0;
          const float = parseFloat(shiftData.opening_float || '0');

          calculatedKpis = {
            todaySales: totalSales,
            todayTransactions: txCount,
            averageTicket: avg,
            drawerFloat: float,
            cashSales: cash,
            khqrSales: khqr,
            cardSales: card,
          };

          // Register Fleet Active Entry
          setRegisterFleet([
            {
              id: String(shiftData.id),
              name: 'Main Counter Register',
              code: 'REG-01',
              cashierName: user?.name || 'Assigned Cashier',
              status: 'active',
              openTime: shiftData.opened_at ? new Date(shiftData.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active Now',
              openingFloat: float,
              cashSales: cash,
              khqrSales: khqr,
              totalSales: totalSales,
              ordersCount: txCount,
            },
          ]);
        } else {
          setActiveShift(null);
          setShiftSummary(null);
          setRegisterFleet([]);
        }
      } catch (err) {
        console.warn('[POS Dashboard] Could not load shift data:', err);
      }

      // 2. Load held carts
      try {
        const cartsRes = await getHeldCartsApi();
        if (cartsRes.data && Array.isArray(cartsRes.data)) {
          setHeldCarts(cartsRes.data);
        } else {
          setHeldCarts([]);
        }
      } catch (err) {
        console.warn('[POS Dashboard] Could not load held carts:', err);
        setHeldCarts([]);
      }

      // 3. Load widgets: Recent sales, Top products, and Hourly aggregated charts
      try {
        const widgetsRes = await getDashboardWidgetsApi();
        const salesList = widgetsRes.data?.recent_sales || widgetsRes.recent_sales || [];
        const topList = widgetsRes.data?.top_selling || widgetsRes.top_selling || [];

        // Dynamic recent sales
        if (Array.isArray(salesList) && salesList.length > 0) {
          const parsedSales: RecentPosSale[] = salesList.map((s: any) => ({
            id: s.id,
            receipt_number: s.receipt_number || `REC-${String(s.id).padStart(6, '0')}`,
            customer_name: s.customer || s.customer_name || 'Walk-in Customer',
            created_at: s.created_at ? new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
            grand_total: parseFloat(s.grand_total || s.total || '0'),
            tender_type: s.tender_type || 'cash',
            status: s.status || 'Completed',
          }));
          setRecentSales(parsedSales);

          // If shift was not active or summary was 0, aggregate from recent sales
          if (calculatedKpis.todayTransactions === 0 && parsedSales.length > 0) {
            const sumSales = parsedSales.reduce((acc, s) => acc + s.grand_total, 0);
            calculatedKpis.todaySales = sumSales;
            calculatedKpis.todayTransactions = parsedSales.length;
            calculatedKpis.averageTicket = sumSales / parsedSales.length;
            calculatedKpis.cashSales = parsedSales.filter(s => s.tender_type === 'cash').reduce((a, b) => a + b.grand_total, 0);
            calculatedKpis.khqrSales = parsedSales.filter(s => s.tender_type === 'khqr').reduce((a, b) => a + b.grand_total, 0);
            calculatedKpis.cardSales = parsedSales.filter(s => s.tender_type === 'card').reduce((a, b) => a + b.grand_total, 0);
          }

          // Build hourly aggregation from live sales
          const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
          const hourlyMap: { [hour: string]: { sales: number; transactions: number } } = {};
          hours.forEach(h => { hourlyMap[h] = { sales: 0, transactions: 0 }; });

          salesList.forEach((s: any) => {
            if (s.created_at) {
              const d = new Date(s.created_at);
              const hourStr = `${String(d.getHours()).padStart(2, '0')}:00`;
              if (hourlyMap[hourStr]) {
                hourlyMap[hourStr].sales += parseFloat(s.grand_total || s.total || '0');
                hourlyMap[hourStr].transactions += 1;
              }
            }
          });

          setHourlyData(
            hours.map(h => ({
              hour: h,
              sales: hourlyMap[h].sales,
              transactions: hourlyMap[h].transactions,
            }))
          );
        } else {
          setRecentSales([]);
          setHourlyData([]);
        }

        // Dynamic top-selling products
        if (Array.isArray(topList) && topList.length > 0) {
          setTopSellers(
            topList.map((t: any) => ({
              id: t.id,
              name: t.name || 'Product',
              category: t.category || 'General',
              qtySold: parseInt(t.sales_count || '0', 10),
              revenue: parseFloat(t.total_revenue || '0'),
              stockRemaining: parseInt(t.stock_remaining || '0', 10),
            }))
          );
        } else {
          setTopSellers([]);
        }
      } catch (err) {
        console.warn('[POS Dashboard] Could not load dashboard widgets:', err);
        setRecentSales([]);
        setTopSellers([]);
      }

      setKpis(calculatedKpis);
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
      if (onRefreshShift) onRefreshShift();
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
      if (onRefreshShift) onRefreshShift();
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
    <div className="space-y-6">
      {/* Offline Alert Banner */}
      {offlineQueueCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-black">
              {offlineQueueCount}
            </div>
            <div>
              <p className="text-xs font-black text-amber-900">
                {offlineQueueCount} Offline Transaction(s) Pending Sync
              </p>
              <p className="text-[11px] text-amber-700">
                Transactions made during connection drops are safely stored locally.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSyncOfflineSales}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Pending Sales Now'}</span>
          </button>
        </div>
      )}

      {/* Hero Banner Cockpit - Clean Light Theme */}
      <div className="relative rounded-2xl bg-white text-slate-800 p-6 sm:p-8 shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200">
                POS Dashboard
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Live Stream Analytics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              POS Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              Monitor live shift drawers, cashier velocities, active registers, and payment tender mix across your store.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {activeShift ? (
              <button
                type="button"
                onClick={() => (externalCloseShiftModal ? externalCloseShiftModal() : setShowShiftCloseModal(true))}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Close Shift (${activeShift.opening_float || '0'})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (externalOpenShiftModal ? externalOpenShiftModal() : setShowShiftOpenModal(true))}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Open Shift Float</span>
              </button>
            )}

            <button
              type="button"
              onClick={loadDashboardData}
              title="Refresh Dashboard Data"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
            </button>

            <Link
              href="/pos/terminal"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Monitor className="w-4 h-4" />
              <span>Open Cashier Register</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 1: Executive KPI Summary Cards */}
      <PosKpiSummary kpis={kpis} />

      {/* Row 2: Hourly Sales Velocity Chart + Payment Tender Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PosHourlySalesChart data={hourlyData} todayTotal={kpis.todaySales} />
        </div>
        <div>
          <PosTenderBreakdownCard kpis={kpis} />
        </div>
      </div>

      {/* Row 3: Live Register Fleet + Top Fast-Moving Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PosRegisterFleetCard registers={registerFleet} />
        <PosTopSellersCard items={topSellers} />
      </div>

      {/* Row 4: Shift Drawer Status + Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PosShiftStatusCard
          activeShift={activeShift}
          shiftSummary={shiftSummary}
          onOpenShift={() => (externalOpenShiftModal ? externalOpenShiftModal() : setShowShiftOpenModal(true))}
          onCloseShift={() => (externalCloseShiftModal ? externalCloseShiftModal() : setShowShiftCloseModal(true))}
          onViewShiftHistory={() => router.push('/pos/shifts')}
        />

        <PosQuickActionGrid
          onOpenShift={() => (externalOpenShiftModal ? externalOpenShiftModal() : setShowShiftOpenModal(true))}
          onOpenReturn={() => setShowReturnModal(true)}
          activeShift={activeShift}
        />
      </div>

      {/* Row 5: Recent Sales Table & Held Orders */}
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
                  type="button"
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
                  <label className="text-xs font-bold text-slate-700">Shift Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Variance reason or closing handover notes..."
                    value={closingNote}
                    onChange={(e) => setClosingNote(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {showPinPrompt && (
                  <div>
                    <label className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Supervisor Override 4-Digit PIN Required</span>
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="Enter 4-digit PIN..."
                      value={supervisorPinInput}
                      onChange={(e) => setSupervisorPinInput(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-sm font-mono text-slate-900 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Closing Shift...' : 'Confirm & Close'}
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
