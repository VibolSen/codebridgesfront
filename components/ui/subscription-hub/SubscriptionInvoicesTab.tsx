'use client';

import React from 'react';
import { AppIcons } from '@/components/ui/icons';
import { badgeStyles } from '@/lib/theme';

export function SubscriptionInvoicesTab() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AppIcons.CreditCard className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-xs font-bold text-slate-900">Primary Payment Card</p>
            <p className="text-[11px] text-slate-400">Mastercard ending in 4242 &bull; Expires 08/28</p>
          </div>
        </div>
        <button type="button" className="text-xs font-bold text-brand hover:underline cursor-pointer">
          Update
        </button>
      </div>

      <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Invoice Date</th>
              <th className="p-3.5">Billing Description</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr>
              <td className="p-3.5 font-bold text-slate-900">Aug 20, 2026</td>
              <td className="p-3.5">CodeBridges Professional Monthly Subscription</td>
              <td className="p-3.5 font-black text-slate-900">$49.00</td>
              <td className="p-3.5">
                <span className={badgeStyles.active}>
                  Paid
                </span>
              </td>
              <td className="p-3.5 text-right">
                <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-brand cursor-pointer">
                  <AppIcons.Download className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-slate-900">Jul 20, 2026</td>
              <td className="p-3.5">CodeBridges Professional Monthly Subscription</td>
              <td className="p-3.5 font-black text-slate-900">$49.00</td>
              <td className="p-3.5">
                <span className={badgeStyles.active}>
                  Paid
                </span>
              </td>
              <td className="p-3.5 text-right">
                <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-brand cursor-pointer">
                  <AppIcons.Download className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
