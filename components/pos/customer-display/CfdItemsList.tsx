'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface CfdItemsListProps {
  cart: Array<{ name: string; qty: number; price: number; subtotal: number }>;
}

export function CfdItemsList({ cart }: CfdItemsListProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-orange-500" />
          <span>Your Current Order Items</span>
        </h2>
        <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {cart.length} line items
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto space-y-2">
        {cart.map((item, idx) => (
          <div key={idx} className="pt-3 flex items-center justify-between text-sm">
            <div>
              <p className="font-extrabold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-400 font-semibold">${item.price.toFixed(2)} each</p>
            </div>
            <div className="text-right">
              <span className="font-black text-slate-900 text-base font-mono">
                ${item.subtotal.toFixed(2)}
              </span>
              <p className="text-xs text-orange-600 font-extrabold">Qty: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
