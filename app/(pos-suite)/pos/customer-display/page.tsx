'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, QrCode, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CustomerDisplayPage() {
  const [cart, setCart] = useState([
    { name: 'Iced Latte (Large)', qty: 2, price: 3.50, subtotal: 7.00 },
    { name: 'Butter Croissant', qty: 1, price: 2.25, subtotal: 2.25 },
  ]);

  const subtotal = cart.reduce((a, b) => a + b.subtotal, 0);
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between p-8">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-orange-500" />
            Dreams Coffee & Bakery
          </h1>
          <p className="text-xs text-slate-400 mt-1">Welcome! Thank you for dining with us.</p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-orange-500 text-white font-bold text-xs shadow-lg">
          Register #01 Active
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto py-6">
        
        {/* Left: Cart Itemized Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-500" /> Your Current Order Items
          </h2>

          <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto space-y-2">
            {cart.map((item, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between text-sm">
                <div>
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-xs text-slate-500 font-mono">${item.price.toFixed(2)} each</p>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-orange-400 text-base">${item.subtotal.toFixed(2)}</span>
                  <p className="text-xs text-slate-400 font-bold">Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Payment KHQR & Order Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between text-center">
          
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scan to Pay via KHQR</span>
            <div className="w-48 h-48 bg-white rounded-2xl mx-auto p-3 flex items-center justify-center border-4 border-red-600 shadow-xl">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Accepts Bakong, ABA, ACLEDA, Canadia, & All Banks</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-slate-400"><span>VAT Tax (10%):</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-xl font-black text-orange-400 border-t border-slate-800 pt-2">
              <span>Total Amount Due:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 font-mono border-t border-slate-800 pt-4">
        Powered by POS System Microservices Architecture
      </div>

    </div>
  );
}
