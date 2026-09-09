'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { CfdItemsList } from './CfdItemsList';
import { CfdPaymentCard } from './CfdPaymentCard';

export function PosCustomerDisplayView() {
  const [cart] = useState([
    { name: 'Iced Caramel Macchiato (Large)', qty: 2, price: 3.5, subtotal: 7.0 },
    { name: 'Butter Croissant Fresh', qty: 1, price: 2.25, subtotal: 2.25 },
  ]);

  const subtotal = cart.reduce((a, b) => a + b.subtotal, 0);
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between p-6 sm:p-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 bg-white p-6 rounded-2xl border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5B4DFB] text-white flex items-center justify-center shadow-md shadow-[#5B4DFB]/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              CodeBridges Store
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-[#5B4DFB] border border-purple-200">
                Customer Display (CFD)
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Welcome! Thank you for dining with us.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Register #01 Active</span>
          </div>
          <Link
            href="/inventory/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-[#5B4DFB] px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Exit CFD
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-auto py-6">
        <CfdItemsList cart={cart} />
        <CfdPaymentCard subtotal={subtotal} tax={tax} grandTotal={grandTotal} />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 font-medium border-t border-slate-200 pt-4">
        Powered by CodeBridges Cloud POS &amp; Inventory Suite
      </div>
    </div>
  );
}
