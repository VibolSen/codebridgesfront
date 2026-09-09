'use client';

import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { CouponItem } from './types';
import { CreateCouponModal } from './CreateCouponModal';

const INITIAL_COUPONS: CouponItem[] = [
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
];

export function SuperAdminCouponsView() {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minSpend, setMinSpend] = useState('10');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created: CouponItem = {
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
            Promotional Coupons &amp; Special Offers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create discount promo codes, percentage vouchers, and minimum spend rules
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
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

      <CreateCouponModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        newCode={newCode}
        setNewCode={setNewCode}
        discountType={discountType}
        setDiscountType={setDiscountType}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        minSpend={minSpend}
        setMinSpend={setMinSpend}
        onSubmit={handleCreateCoupon}
      />
    </div>
  );
}
