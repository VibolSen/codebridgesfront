'use client';

import React, { useState } from 'react';
import { Tag, Plus, Search, CheckCircle2, XCircle, Calendar, Percent, DollarSign } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    {
      id: '1',
      code: 'WELCOME10',
      discount_type: 'percentage',
      discount_value: 10,
      min_spend: 5.00,
      is_active: true,
      expires_at: '2027-12-31',
    },
    {
      id: '2',
      code: 'FRESH5',
      discount_type: 'fixed',
      discount_value: 5,
      min_spend: 15.00,
      is_active: true,
      expires_at: '2027-12-31',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minSpend, setMinSpend] = useState('10');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created = {
      id: Date.now().toString(),
      code: newCode.toUpperCase().trim(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue) || 0,
      min_spend: parseFloat(minSpend) || 0,
      is_active: true,
      expires_at: '2027-12-31',
    };

    setCoupons([created, ...coupons]);
    setNewCode('');
    setShowModal(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-indigo-600" />
            Promotional Coupons & Special Offers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create discount promo codes, percentage vouchers, and minimum spend rules
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Promo Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount Type</th>
              <th className="py-3 px-4">Discount Value</th>
              <th className="py-3 px-4">Min. Spend ($)</th>
              <th className="py-3 px-4">Expires Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">{c.code}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-600 capitalize">{c.discount_type}</td>
                <td className="py-3.5 px-4 font-black text-indigo-600 text-sm">
                  {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `$${c.discount_value.toFixed(2)} OFF`}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">${c.min_spend.toFixed(2)}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{c.expires_at}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Create Promotional Coupon</h3>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Spend ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={minSpend}
                  onChange={(e) => setMinSpend(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
