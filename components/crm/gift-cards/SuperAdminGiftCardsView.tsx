'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Plus, RefreshCw } from 'lucide-react';
import { getGiftCardsApi, createGiftCardApi } from '@/lib/api';

export const SuperAdminGiftCardsView: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customer, setCustomer] = useState('');
  const [balance, setBalance] = useState('50.00');

  useEffect(() => {
    loadGiftCards();
  }, []);

  const loadGiftCards = async () => {
    try {
      setLoading(true);
      const res = await getGiftCardsApi();
      setCards(res.data || []);
    } catch (err) {
      console.error('Failed to load gift cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGiftCardApi({
        customer: customer || 'Walk-in Customer',
        balance: parseFloat(balance) || 50,
      });
      setShowModal(false);
      setCustomer('');
      loadGiftCards();
    } catch (err: any) {
      alert(err.message || 'Failed to issue gift card');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Gift className="w-7 h-7 text-pink-500" />
            Gift Cards & Store Credit Vouchers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue digital gift cards, prepaid customer vouchers, and store credit cards
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Issue Gift Card
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Card Number</th>
              <th className="py-3 px-4">Assigned Customer</th>
              <th className="py-3 px-4">Remaining Balance ($)</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-1 text-pink-500" />
                  Loading gift cards...
                </td>
              </tr>
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 font-semibold">
                  No gift cards issued.
                </td>
              </tr>
            ) : (
              cards.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.card_code}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{c.customer}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-pink-600 text-sm">
                    ${Number(c.balance).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Issue Gift Card</h3>
            <form onSubmit={handleCreateGiftCard} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="Walk-in Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Balance ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-500 font-bold text-white shadow-md"
                >
                  Confirm &amp; Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
