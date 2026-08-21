'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAuthUser,
  getActiveShiftApi,
  openShiftApi,
  closeShiftApi,
  recordCashMovementApi,
  getShiftReportApi,
} from '@/lib/api';
import { PosSuiteHeader } from '@/components/pos';
import {
  Clock,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Calendar,
  User,
  ChevronRight,
  X,
  RotateCcw,
} from 'lucide-react';

export default function PosShiftsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [shiftSummary, setShiftSummary] = useState<any>(null);
  const [shiftHistory, setShiftHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCashMovementModal, setShowCashMovementModal] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [movementAmount, setMovementAmount] = useState('');
  const [movementReason, setMovementReason] = useState('');

  // Shift Inputs
  const [openingFloat, setOpeningFloat] = useState('100.00');
  const [countedCash, setCountedCash] = useState('');
  const [closingNote, setClosingNote] = useState('');
  const [supervisorPin, setSupervisorPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadShiftData();
  }, []);

  const loadShiftData = async () => {
    try {
      setLoading(true);
      const res = await getActiveShiftApi();
      if (res.data?.shift) {
        setActiveShift(res.data.shift);
        setShiftSummary(res.data.summary);
      } else {
        setActiveShift(null);
      }

      try {
        const historyRes = await getShiftReportApi();
        setShiftHistory(historyRes.data || []);
      } catch {
        // Fallback demo shift records
        setShiftHistory([
          {
            id: 101,
            cashier_name: 'John Cashier',
            opened_at: '2026-08-15 08:00',
            closed_at: '2026-08-15 16:30',
            opening_float: 100.0,
            cash_sales: 580.0,
            counted_cash: 680.0,
            variance: 0.0,
            status: 'closed',
          },
          {
            id: 100,
            cashier_name: 'John Cashier',
            opened_at: '2026-08-14 08:00',
            closed_at: '2026-08-14 16:00',
            opening_float: 100.0,
            cash_sales: 450.0,
            counted_cash: 545.0,
            variance: -5.0,
            status: 'closed',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await openShiftApi({ opening_float: parseFloat(openingFloat || '0') });
      setShowOpenModal(false);
      loadShiftData();
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
        supervisor_pin: supervisorPin,
      });
      setShowCloseModal(false);
      setActiveShift(null);
      loadShiftData();
    } catch (err: any) {
      alert(err.message || 'Failed to close shift');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    try {
      setIsProcessing(true);
      await recordCashMovementApi(activeShift.id, {
        type: movementType,
        amount: parseFloat(movementAmount || '0'),
        reason: movementReason,
      });
      setShowCashMovementModal(false);
      setMovementAmount('');
      setMovementReason('');
      loadShiftData();
      alert(`Recorded $${movementAmount} Cash ${movementType.toUpperCase()} successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to record cash movement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <PosSuiteHeader
        user={user}
        activeShift={activeShift}
        onOpenShiftModal={() => setShowOpenModal(true)}
        onCloseShiftModal={() => setShowCloseModal(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Clock className="w-6 h-6 text-orange-500" />
              <span>Shift & Cash Drawer Audit Center</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage opening float, record pay-ins/pay-outs, audit drawer variance, and review shift logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeShift ? (
              <>
                <button
                  onClick={() => setShowCashMovementModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Banknote className="w-3.5 h-3.5 text-orange-500" />
                  <span>Cash In / Out</span>
                </button>
                <button
                  onClick={() => setShowCloseModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Close Current Shift</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowOpenModal(true)}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Open Cashier Shift</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Shift Details Card */}
        {activeShift ? (
          <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">
                      Active Shift #SHF-{activeShift.id}
                    </h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      IN PROGRESS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Started at: {activeShift.opened_at || activeShift.created_at}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Terminal</p>
                <p className="font-mono font-black text-slate-900 text-sm">REG-01</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Opening Float
                </span>
                <p className="text-xl font-black text-slate-900">
                  ${parseFloat(activeShift.opening_float || 0).toFixed(2)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
                  Cash Sales
                </span>
                <p className="text-xl font-black text-emerald-900">
                  ${parseFloat(shiftSummary?.cash_sales_total || 0).toFixed(2)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-orange-700 tracking-wider">
                  ABA KHQR Sales
                </span>
                <p className="text-xl font-black text-orange-900">
                  ${parseFloat(shiftSummary?.khqr_sales_total || 0).toFixed(2)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">
                  Expected in Drawer
                </span>
                <p className="text-xl font-black text-blue-900">
                  ${(
                    parseFloat(activeShift.opening_float || 0) +
                    parseFloat(shiftSummary?.cash_sales_total || 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 py-12">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No Shift Currently Active</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Open a cashier shift to record starting cash drawer float and start accepting transactions.
            </p>
            <button
              onClick={() => setShowOpenModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Open Shift Now</span>
            </button>
          </div>
        )}

        {/* Shift History Records */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Historic Shift Audits</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-2.5 px-3">Shift ID</th>
                  <th className="py-2.5 px-3">Cashier</th>
                  <th className="py-2.5 px-3">Opened / Closed</th>
                  <th className="py-2.5 px-3 text-right">Float</th>
                  <th className="py-2.5 px-3 text-right">Cash Sales</th>
                  <th className="py-2.5 px-3 text-right">Counted</th>
                  <th className="py-2.5 px-3 text-center">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {shiftHistory.map((shf) => (
                  <tr key={shf.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      #SHF-{shf.id}
                    </td>
                    <td className="py-3 px-3">{shf.cashier_name || 'Cashier'}</td>
                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {shf.opened_at} <br />
                      <span className="text-slate-400">{shf.closed_at}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      ${parseFloat(shf.opening_float || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                      ${parseFloat(shf.cash_sales || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ${parseFloat(shf.counted_cash || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          parseFloat(shf.variance || 0) === 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {parseFloat(shf.variance || 0) === 0
                          ? 'BALANCED'
                          : `$${parseFloat(shf.variance || 0).toFixed(2)}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Cash In / Out Movement Modal */}
      <AnimatePresence>
        {showCashMovementModal && (
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
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900">Record Cash Movement</h3>
                <button
                  onClick={() => setShowCashMovementModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCashMovement} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementType('in')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      movementType === 'in'
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" /> Pay In (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType('out')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      movementType === 'out'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Pay Out (Drop)
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={movementAmount}
                    onChange={(e) => setMovementAmount(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Reason / Note</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bank change top-up or Petty cash drop"
                    value={movementReason}
                    onChange={(e) => setMovementReason(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCashMovementModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    Record Movement
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open Shift Modal */}
      <AnimatePresence>
        {showOpenModal && (
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
                    onClick={() => setShowOpenModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    Start Shift
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Shift Modal */}
      <AnimatePresence>
        {showCloseModal && (
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
                <h3 className="font-black text-base text-slate-900">Close Cashier Shift</h3>
                <button
                  onClick={() => setShowCloseModal(false)}
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

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCloseModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Confirm Shift Close
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
