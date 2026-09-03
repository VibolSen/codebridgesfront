'use client';

import { useState, useEffect } from 'react';
import { getExpiredProductsApi, adjustStockApi } from '@/lib/api';
import { OutletSelector } from '@/components/inventory-suite';
import { motion, Variants } from 'framer-motion';
import {
  Clock,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Package,
  Search,
  Filter,
  Building2,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';

export default function AdminExpiredProductsPage() {
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
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadExpired();
  }, [outletId, statusFilter]);

  const loadExpired = async () => {
    try {
      setLoading(true);
      const res = await getExpiredProductsApi(outletId, statusFilter || undefined, search || undefined);
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

      setNotification({ type: 'success', message: `Disposed ${disposeQty} units of ${selectedProduct.product_name}.` });
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
    (sum, i) => sum + ((i.on_hand || 0) * (i.cost_price || i.price || 0)),
    0
  );

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-rose-500" />
            Expired & Perishable Products Management
          </h1>
          <p className="text-xs text-slate-500">Monitor perishable inventory expiry dates, near-expiry alerts, and write off expired batches</p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-rose-600">{expiredCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Expired Items (Past Date)</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-amber-600">{expiringSoonCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Expiring Soon (Within 30 Days)</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">${totalWastageValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
            <p className="text-xs text-slate-500 font-medium">Perishable Stock Value at Risk</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filters Bar */}
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
          <OutletSelector
            value={outletId}
            onChange={setOutletId}
            autoSelectFirst={true}
          />

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
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading perishable inventory...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No expired or near-expiry products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Days Status</th>
                  <th className="py-3.5 px-4 text-right">On Hand Stock</th>
                  <th className="py-3.5 px-4 text-right">Valuation at Risk</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {items.map((item, idx) => {
                  const isExpired = item.status === 'expired';
                  const days = item.days_left;

                  return (
                    <motion.tr
                      key={item.product_id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{item.product_name}</p>
                            <p className="text-[10px] text-slate-400">${parseFloat(item.price).toFixed(2)} retail</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {item.sku}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                          {item.category_name || 'Perishable'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-900">
                        {item.expiry_date}
                      </td>

                      <td className="py-3.5 px-4">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-300">
                            <AlertOctagon className="w-3 h-3" /> EXPIRED ({Math.abs(days)} days ago)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
                            <AlertTriangle className="w-3 h-3" /> Expiring in {days} days
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                        {item.on_hand}
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-rose-600 font-mono">
                        ${((item.on_hand || 0) * (item.price || 0)).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDisposeModal(item)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition-colors flex items-center gap-1.5 ml-auto"
                          title="Dispose / Write off Spoilage"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Dispose Batch
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spoilage Disposal Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" /> Record Spoilage Write-Off
              </h3>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>

            <p className="text-xs text-slate-500">Writing off expired stock for <strong className="text-slate-900">{selectedProduct.product_name}</strong> (SKU: {selectedProduct.sku}).</p>

            <form onSubmit={handleSaveDisposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Disposal Quantity *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedProduct.on_hand > 0 ? selectedProduct.on_hand : 9999}
                  value={disposeQty}
                  onChange={(e) => setDisposeQty(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Justification Notes</label>
                <textarea
                  rows={2}
                  value={disposeNotes}
                  onChange={(e) => setDisposeNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  {saving ? 'Processing...' : 'Confirm Spoilage Disposal'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
