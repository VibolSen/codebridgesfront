'use client';

import React, { useState } from 'react';
import { QrCode, Printer, Building2, Store, CreditCard, CheckCircle2 } from 'lucide-react';

export default function AdminQrCodesPage() {
  const [storeName, setStoreName] = useState('Dreams Coffee & Bakery');
  const [merchantId, setMerchantId] = useState('bakong_merchant_001@acleda');
  const [tableNumber, setTableNumber] = useState('Table #05');
  const [currency, setCurrency] = useState('USD');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-red-600" />
            NBC Bakong KHQR Poster & Label Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate printable NBC Bakong KHQR merchant table standees & QR posters
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print KHQR Poster
        </button>
      </div>

      {/* Control Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 print:hidden">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Poster Customization Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">Store / Merchant Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Bakong Account ID</label>
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Table / Counter Label</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Printable Poster Standee Preview */}
      <div className="flex justify-center">
        <div className="w-96 bg-white border-4 border-red-600 rounded-3xl p-8 shadow-2xl space-y-6 text-center print:w-full print:border-none print:shadow-none">
          
          {/* NBC Bakong Banner */}
          <div className="bg-red-600 text-white rounded-2xl py-3 px-4 font-black tracking-widest text-lg uppercase flex items-center justify-center gap-2">
            <QrCode className="w-6 h-6 text-white" /> KHQR PAY
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{storeName}</h2>
            <p className="text-xs font-mono text-slate-500 font-bold">{tableNumber}</p>
          </div>

          {/* QR Graphic Box */}
          <div className="p-4 bg-slate-50 border-2 border-dashed border-red-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <div className="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-mono p-2">
              <QrCode className="w-36 h-36 text-white" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">SCAN TO PAY WITH KHQR</span>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <p className="text-slate-400">Merchant Account ID:</p>
            <p className="font-bold text-slate-900">{merchantId}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>ACCEPT BAKONG</span>
            <span>USD / KHR (៛)</span>
          </div>

        </div>
      </div>

    </div>
  );
}
