'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuthUser,
  getActiveShiftApi,
  openShiftApi,
  closeShiftApi,
  recordCashMovementApi,
  getShiftReportApi,
} from '@/lib/api';
import {
  PosSuiteHeader,
  PosShiftActiveCard,
  PosShiftHistoryTable,
  PosCashMovementModal,
  PosShiftOpenModal,
  PosShiftCloseModal,
  DualCurrencyDenominationModal,
  PosThermalReportModal,
  PosSafeDropModal,
} from '@/components/pos';

export default function PosShiftsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [shiftHistory, setShiftHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCashMovementModal, setShowCashMovementModal] = useState(false);
  const [cashMovementType, setCashMovementType] = useState<'in' | 'out'>('in');
  const [showDenomModal, setShowDenomModal] = useState(false);
  const [showThermalReportModal, setShowThermalReportModal] = useState(false);
  const [thermalReportType, setThermalReportType] = useState<'X-REPORT' | 'Z-REPORT'>('X-REPORT');
  const [showSafeDropModal, setShowSafeDropModal] = useState(false);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadShiftsData();
  }, []);

  const loadShiftsData = async () => {
    try {
      setLoading(true);
      const res = await getActiveShiftApi();
      if (res.data?.shift) {
        setActiveShift(res.data.shift);
      } else {
        setActiveShift(null);
      }

      const reportRes = await getShiftReportApi('history');
      const historyList = reportRes.data?.shifts || reportRes.shifts || [];
      setShiftHistory(historyList);
    } catch (err) {
      console.error('Failed to load shifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShift = async (floatAmount: number, note: string) => {
    const res = await openShiftApi({ opening_float: floatAmount, note });
    if (res.data?.shift) {
      setActiveShift(res.data.shift);
      loadShiftsData();
    }
  };

  const handleCloseShift = async (countedCash: number, note: string, supervisorPin?: string) => {
    const closingShift = activeShift ? { ...activeShift, counted_cash: countedCash } : null;
    await closeShiftApi({ counted_cash: countedCash, note, supervisor_pin: supervisorPin });
    setActiveShift(null);
    loadShiftsData();

    // Trigger printable Z-Report upon closing
    if (closingShift) {
      setActiveShift(closingShift);
      setThermalReportType('Z-REPORT');
      setShowThermalReportModal(true);
    }
  };

  const handleRecordCashMovement = async (type: 'in' | 'out', amount: number, reason: string) => {
    await recordCashMovementApi({ type, amount, reason });
    loadShiftsData();
  };

  const handleSafeDrop = async (data: { amount: number; envelopeSerial: string; supervisorPin: string; note: string }) => {
    await recordCashMovementApi({
      type: 'out',
      amount: data.amount,
      reason: `Safe Drop [${data.envelopeSerial}]: ${data.note}`,
    });
    loadShiftsData();
  };

  const currentExpectedCash = activeShift
    ? Number(activeShift.opening_float || 0) +
      Number(activeShift.cash_sales || 0) +
      Number(activeShift.cash_in || 0) -
      Number(activeShift.cash_out || 0) -
      Number(activeShift.safe_drops || 0)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shifts &amp; Till Float
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Cash drawer opening float, paid-in/out movements, mid-shift safe drops, and Z-report end-of-day reconciliation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeShift ? (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Shift Active (#{String(activeShift.id).slice(0, 6)})
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
              No Active Shift
            </span>
          )}
        </div>
      </div>

      {/* Active Shift Status Overview */}
      <PosShiftActiveCard
        activeShift={activeShift}
        onOpenShift={() => setShowOpenModal(true)}
        onCloseShift={() => setShowCloseModal(true)}
        onOpenCashMovement={(type) => {
          setCashMovementType(type);
          setShowCashMovementModal(true);
        }}
        onPrintXReport={() => {
          setThermalReportType('X-REPORT');
          setShowThermalReportModal(true);
        }}
        onSafeDrop={() => setShowSafeDropModal(true)}
        onDenominations={() => setShowDenomModal(true)}
      />

      {/* Historical Shifts Auditing Table */}
      <PosShiftHistoryTable
        shiftHistory={shiftHistory}
        loading={loading}
        onViewSummary={(shift: any) => {
          setActiveShift(shift);
          setThermalReportType('Z-REPORT');
          setShowThermalReportModal(true);
        }}
      />

      {/* Modal: Open Shift */}
      <PosShiftOpenModal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        onConfirmOpen={handleOpenShift}
      />

      {/* Modal: Close Shift */}
      {activeShift && (
        <PosShiftCloseModal
          isOpen={showCloseModal}
          onClose={() => setShowCloseModal(false)}
          activeShift={activeShift}
          onConfirmClose={handleCloseShift}
        />
      )}

      {/* Modal: Cash Movement (In/Out) */}
      <PosCashMovementModal
        isOpen={showCashMovementModal}
        onClose={() => setShowCashMovementModal(false)}
        defaultType={cashMovementType}
        onRecordMovement={handleRecordCashMovement}
      />

      {/* Modal: Physical Dual-Currency Denomination Counter */}
      <DualCurrencyDenominationModal
        isOpen={showDenomModal}
        onClose={() => setShowDenomModal(false)}
        onApply={(totalUsd) => {
          // If shift is active, we can record this or fill closing count
        }}
      />

      {/* Modal: Printable Thermal X-Report / Z-Report */}
      <PosThermalReportModal
        isOpen={showThermalReportModal}
        onClose={() => setShowThermalReportModal(false)}
        reportType={thermalReportType}
        shift={activeShift || shiftHistory[0] || {}}
        user={user}
      />

      {/* Modal: Safe Cash Drop */}
      <PosSafeDropModal
        isOpen={showSafeDropModal}
        onClose={() => setShowSafeDropModal(false)}
        onConfirm={handleSafeDrop}
        currentCashInDrawer={currentExpectedCash}
      />
    </div>
  );
}
