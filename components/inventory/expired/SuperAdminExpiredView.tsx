'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Search,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getExpiredProductsApi, adjustStockApi } from '@/lib/api';
import { OutletSelector } from '@/components/inventory-suite';
import { DisposalModal } from './DisposalModal';
import { ExpiredMetricsCards } from './ExpiredMetricsCards';
import { ExpiredProductsTable } from './ExpiredProductsTable';

export const SuperAdminExpiredView: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [outletId, setOutletId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Spoilage Disposal Modal State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [disposeQty, setDisposeQty] = useState('1');
  const [disposeNotes, setDisposeNotes] = useState('Expired items written off & disposed');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadExpired();
  }, [outletId, statusFilter]);

  const loadExpired = async () => {
    try {
      setLoading(true);
      const res = await getExpiredProductsApi(
        outletId,
        statusFilter || undefined,
        search || undefined
      );
      setItems(res.data || []);
    } catch (err: any) {
      console.error('Failed to load expired products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadExpired();
  };

  const handleOpenDisposeModal = (item: any) => {
    setSelectedProduct(item);
    setDisposeQty(String(item.on_hand > 0 ? item.on_hand : 1));
    setDisposeNotes('Expired items written off & disposed');
  };

  const handleSaveDisposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      setSaving(true);
      await adjustStockApi({
        outlet_id: outletId,
        product_id: selectedProduct.product_id,
        quantity: parseInt(disposeQty, 10),
        type: 'decrement',
        reason: 'spoilage',
        notes: disposeNotes,
      });

      setNotification({
        type: 'success',
        message: `Disposed ${disposeQty} units of ${selectedProduct.product_name}.`,
      });
      setSelectedProduct(null);
      loadExpired();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to dispose stock.' });
    } finally {
      setSaving(false);
    }
  };

  const expiredCount = items.filter((i) => i.status === 'expired').length;
  const expiringSoonCount = items.filter((i) => i.status === 'expiring_soon').length;
  const totalWastageValuation = items.reduce(
    (sum, i) => sum + (i.on_hand || 0) * (i.cost_price || i.price || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-rose-500" />
            Expired &amp; Perishable Product Monitoring
          </h1>
          <p className="text-xs text-slate-500">
            Track shelf-life limits, FIFO/FEFO expiration schedules, and authorize stock write-offs
          </p>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <ExpiredMetricsCards
        expiredCount={expiredCount}
        expiringSoonCount={expiringSoonCount}
        totalWastageValuation={totalWastageValuation}
      />

      {/* Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search perishable product or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <OutletSelector value={outletId} onChange={setOutletId} autoSelectFirst={true} />

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 ml-2">
            <Filter className="w-4 h-4 text-slate-400" />
            Expiry Category:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Perishables</option>
            <option value="expired">Expired Only (Past Date)</option>
            <option value="expiring_soon">Expiring Soon (Within 30 Days)</option>
          </select>
        </div>
      </div>

      {/* Expired Products Table */}
      <ExpiredProductsTable
        items={items}
        loading={loading}
        onOpenDisposeModal={handleOpenDisposeModal}
      />

      <DisposalModal
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        disposeQty={disposeQty}
        setDisposeQty={setDisposeQty}
        disposeNotes={disposeNotes}
        setDisposeNotes={setDisposeNotes}
        saving={saving}
        onSaveDisposal={handleSaveDisposal}
      />
    </div>
  );
};
