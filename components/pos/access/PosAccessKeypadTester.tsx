'use client';

import React from 'react';
import { KeyRound, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface PosAccessKeypadTesterProps {
  testPinInput: string;
  testResult: { success: boolean; message: string } | null;
  isVerifying: boolean;
  onKeypadPress: (digit: string) => void;
  onKeypadClear: () => void;
  onVerify: () => void;
}

export function PosAccessKeypadTester({
  testPinInput,
  testResult,
  isVerifying,
  onKeypadPress,
  onKeypadClear,
  onVerify,
}: PosAccessKeypadTesterProps) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5B4DFB] border border-purple-100 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-900">PIN Authorizer Test</h3>
            <p className="text-[11px] text-slate-400 font-medium">Simulate cashier manager overrides</p>
          </div>
        </div>

        {/* PIN Display Dots */}
        <div className="my-5 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 py-3 px-6 rounded-2xl bg-slate-50 border border-slate-200">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = testPinInput.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all ${
                    isFilled ? 'bg-[#5B4DFB] scale-110 shadow-xs' : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">
            {testPinInput.length}/4 digits entered
          </span>
        </div>

        {/* Result Feedback Banner */}
        {testResult && (
          <div
            className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 mb-4 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="truncate">{testResult.message}</span>
          </div>
        )}

        {/* Interactive Number Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {digits.map((btn) => {
            if (btn === 'C') {
              return (
                <button
                  key={btn}
                  type="button"
                  onClick={onKeypadClear}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Clear
                </button>
              );
            }
            if (btn === '✓') {
              return (
                <button
                  key={btn}
                  type="button"
                  onClick={onVerify}
                  disabled={testPinInput.length !== 4 || isVerifying}
                  className="py-3 rounded-2xl bg-[#5B4DFB] hover:bg-[#4E3FE3] disabled:opacity-40 text-white font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Enter'}
                </button>
              );
            }
            return (
              <button
                key={btn}
                type="button"
                onClick={() => onKeypadPress(btn)}
                className="py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-900 font-black text-sm transition-all active:scale-95 cursor-pointer"
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-center">
        Verified with live POS cryptographic authorization hash
      </div>
    </div>
  );
}
