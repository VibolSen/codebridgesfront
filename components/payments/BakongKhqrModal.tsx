'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import {
  generateBakongKhqrApi,
  checkBakongPaymentStatusApi,
  simulateBakongPaymentApi,
} from '@/lib/api';

interface BakongKhqrModalProps {
  isOpen: boolean;
  amount: number;
  currency?: string;
  saleId?: string;
  billNumber?: string;
  onClose: () => void;
  onPaymentApproved: (paymentDetails: any) => void;
}

export function BakongKhqrModal({
  isOpen,
  amount,
  currency = 'USD',
  saleId,
  billNumber,
  onClose,
  onPaymentApproved,
}: BakongKhqrModalProps) {
  const [loading, setLoading] = useState(true);
  const [khqrData, setKhqrData] = useState<any>(null);
  const [polling, setPolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (isOpen && amount > 0) {
      initKhqrPayment();
    }
  }, [isOpen, amount]);

  // Polling loop every 3 seconds while modal is open and payment is pending
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (khqrData?.attempt_id && !polling) {
      interval = setInterval(() => {
        checkStatus(khqrData.attempt_id, true);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [khqrData?.attempt_id, polling]);

  const initKhqrPayment = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await generateBakongKhqrApi({
        amount,
        currency,
        sale_id: saleId,
        bill_number: billNumber,
      });

      setKhqrData(res.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate Bakong KHQR code.');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (attemptId: string, isAutoPoll: boolean = false) => {
    if (polling && isAutoPoll) return;
    try {
      if (!isAutoPoll) setPolling(true);
      const res = await checkBakongPaymentStatusApi(attemptId);

      if (res.paid) {
        onPaymentApproved(res);
      }
    } catch (err) {
      console.error('Bakong status check error:', err);
    } finally {
      if (!isAutoPoll) setPolling(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!khqrData?.attempt_id) return;
    try {
      setIsSimulating(true);
      const res = await simulateBakongPaymentApi(khqrData.attempt_id);
      if (res.paid) {
        onPaymentApproved(res);
      }
    } catch (err: any) {
      alert(err.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyKhqr = () => {
    if (khqrData?.khqr_string) {
      navigator.clipboard.writeText(khqrData.khqr_string);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col font-sans"
      >
        {/* NBC Bakong KHQR Header Banner */}
        <div className="bg-rose-700 text-white px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-rose-700 font-extrabold flex items-center justify-center text-sm shadow-md">
              KH
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight leading-tight">Bakong KHQR</h3>
              <p className="text-[10px] text-rose-200">National Bank of Cambodia Payment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-rose-200 hover:text-white hover:bg-rose-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-center">
          
          {loading ? (
            <div className="py-12 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-rose-600" />
              <p className="text-xs font-semibold text-slate-600">Generating Bakong KHQR Payment Payload...</p>
            </div>
          ) : errorMessage ? (
            <div className="py-6 space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-xs font-bold text-rose-600">{errorMessage}</p>
              <button
                onClick={initKhqrPayment}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <>
              {/* Pricing Display */}
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl space-y-0.5">
                <p className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">Amount Due</p>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-2xl font-black text-rose-700">${amount.toFixed(2)}</span>
                  <span className="text-xs font-bold text-slate-500">
                    (៛{(khqrData?.khr_equivalent || amount * 4100).toLocaleString()})
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Merchant: {khqrData?.merchant_name || 'Freshmart POS'}</p>
              </div>

              {/* KHQR Card & Pseudo QR Display */}
              <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-rose-600 shadow-md flex flex-col items-center justify-between">
                
                {/* Bakong KHQR Top Label */}
                <div className="w-full bg-rose-600 text-white text-[10px] font-extrabold py-0.5 rounded-md uppercase tracking-wider">
                  KHQR Payment
                </div>

                {/* Simulated Visual QR Canvas */}
                <div className="my-auto w-36 h-36 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 bg-slate-50">
                  <QrCode className="w-20 h-20 text-slate-800" />
                  <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">Scan via Bakong App</span>
                </div>

                {/* Reference Code */}
                <p className="text-[9px] font-mono font-bold text-slate-400 truncate w-full">
                  MD5: {khqrData?.md5?.substring(0, 16)}...
                </p>
              </div>

              {/* Status Indicator & Live Polling */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 py-2 rounded-xl border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Listening for Bakong API Payment...</span>
              </div>

              {/* Copy KHQR String & Check Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyKhqr}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  {copied ? 'Copied Payload' : 'Copy KHQR'}
                </button>
                <button
                  onClick={() => checkStatus(khqrData.attempt_id)}
                  disabled={polling}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${polling ? 'animate-spin' : ''}`} />
                  Check Status
                </button>
              </div>

              {/* Sandbox Simulator Action for Instant Verification */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-amber-400 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {isSimulating ? 'Verifying with Bakong...' : 'Simulate Mobile App Pay (Sandbox)'}
                </button>
              </div>

            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}

export default BakongKhqrModal;
