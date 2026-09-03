'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { CfdItemsList, CfdPaymentCard } from '@/components/pos';

export default function CustomerDisplayPage() {
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              CodeBridges Store
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200">
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
            href="/pos"
            className="text-xs font-bold text-slate-500 hover:text-orange-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
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
        Powered by CodeBridges Enterprise Modular Platform
      </div>
    </div>
  );
}
