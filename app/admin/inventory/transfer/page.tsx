'use client';

import { useState, useEffect } from 'react';
import {
  getTransfersApi,
  getTransferDetailApi,
  createTransferApi,
  receiveTransferApi,
  getProductsApi,
} from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  ArrowRightLeft,
  Plus,
  Search,
  Filter,
  Building2,
  Package,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Eye,
  RefreshCw,
  Truck,
  ArrowRight,
} from 'lucide-react';

export default function AdminStockTransferPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // New Transfer Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    from_outlet_id: '1',
    to_outlet_id: '2',
    notes: '',
    items: [{ product_id: '', quantity: '10' }],
  });
  const [submitting, setSubmitting] = useState(false);

  // Detail Modal State
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadTransfers();
    loadProductsList();
  }, [statusFilter]);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      const res = await getTransfersApi(undefined, statusFilter || undefined, search || undefined);
      setTransfers(res.data || []);
    } catch (err: any) {
      console.error('Failed to load stock transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsList = async () => {
    try {
      const res = await getProductsApi();
      setProducts(res.data || []);
    } catch (err: any) {
      console.error('Failed to load products list:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTransfers();
  };

  const handleAddItemRow = () => {
    setCreateForm({
      ...createForm,
      items: [...createForm.items, { product_id: '', quantity: '10' }],
    });
  };

  const handleRemoveItemRow = (index: number) => {
    const updated = [...createForm.items];
    updated.splice(index, 1);
    setCreateForm({ ...createForm, items: updated });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updated = [...createForm.items];
    updated[index] = { ...updated[index], [field]: value };
    setCreateForm({ ...createForm, items: updated });
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setNotification(null);

      const validItems = createForm.items
        .filter((item) => item.product_id && parseInt(item.quantity, 10) > 0)
        .map((item) => ({
          product_id: item.product_id,
          quantity: parseInt(item.quantity, 10),
        }));

      if (validItems.length === 0) {
        setNotification({ type: 'error', message: 'Please select at least one product and quantity.' });
        setSubmitting(false);
        return;
      }

      const res = await createTransferApi({
        from_outlet_id: parseInt(createForm.from_outlet_id, 10),
        to_outlet_id: parseInt(createForm.to_outlet_id, 10),
        notes: createForm.notes,
        items: validItems,
      });

      setNotification({
        type: 'success',
        message: res.message || 'Stock transfer created and dispatched successfully.',
      });

      setIsCreateModalOpen(false);
      setCreateForm({
        from_outlet_id: '1',
        to_outlet_id: '2',
        notes: '',
        items: [{ product_id: '', quantity: '10' }],
      });
      loadTransfers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to create stock transfer.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkReceived = async (id: string, transferNumber: string) => {
    if (!confirm(`Mark transfer "${transferNumber}" as received at destination outlet?`)) return;
    try {
      setNotification(null);
      const res = await receiveTransferApi(id);
      setNotification({
        type: 'success',
        message: res.message || 'Stock transfer marked as received.',
      });
      loadTransfers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to mark transfer received.' });
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      setIsDetailModalOpen(true);
      setLoadingDetail(true);
      const res = await getTransferDetailApi(id);
      setSelectedTransfer(res.data || null);
    } catch (err: any) {
      console.error('Failed to load transfer detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Metrics
  const totalTransfers = transfers.length;
  const inTransitCount = transfers.filter((t) => t.status === 'dispatched').length;
  const receivedCount = transfers.filter((t) => t.status === 'received').length;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' as const },
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
            <ArrowRightLeft className="w-6 h-6 text-orange-500" />
            Stock Transfers & Inter-Outlet Dispatch
          </h1>
          <p className="text-xs text-slate-500">Dispatch, track, and receive inventory transfers across store locations</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Stock Transfer
        </motion.button>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalTransfers}</h4>
            <p className="text-xs text-slate-500 font-medium">Total Transfers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-amber-600">{inTransitCount}</h4>
            <p className="text-xs text-slate-500 font-medium">In Transit (Dispatched)</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-emerald-600">{receivedCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Completed & Received</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
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
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filters & Search Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search transfer # or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-4 h-4 text-slate-400" />
            Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="dispatched">In Transit (Dispatched)</option>
            <option value="received">Completed & Received</option>
          </select>
        </div>
      </div>

      {/* Stock Transfer Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading stock transfers...
          </div>
        ) : transfers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ArrowRightLeft className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No stock transfers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Transfer #</th>
                  <th className="py-3.5 px-4">From Outlet &rarr; To Outlet</th>
                  <th className="py-3.5 px-4 text-center">Items</th>
                  <th className="py-3.5 px-4 text-center">Total Qty</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Dispatched At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {transfers.map((trf, idx) => (
                  <motion.tr
                    key={trf.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {trf.transfer_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span>{trf.from_outlet_name || `Outlet #${trf.from_outlet_id}`}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{trf.to_outlet_name || `Outlet #${trf.to_outlet_id}`}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {trf.items_count || 1} line(s)
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                      {parseInt(trf.total_quantity || '0', 10)}
                    </td>

                    <td className="py-3.5 px-4">
                      {trf.status === 'dispatched' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Truck className="w-3 h-3" /> In Transit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Received
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {trf.dispatched_at ? new Date(trf.dispatched_at).toLocaleString() : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(trf.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>

                        {trf.status === 'dispatched' && (
                          <button
                            onClick={() => handleMarkReceived(trf.id, trf.transfer_number)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Received
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Create Stock Transfer Modal --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-orange-500" /> Dispatch New Stock Transfer
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="p-6 space-y-4 text-xs font-medium overflow-y-auto flex-1">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Source Outlet (From) *</label>
                  <select
                    value={createForm.from_outlet_id}
                    onChange={(e) => setCreateForm({ ...createForm, from_outlet_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    <option value="1">Phnom Penh Main Outlet</option>
                    <option value="2">Siem Reap Branch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Target Outlet (To) *</label>
                  <select
                    value={createForm.to_outlet_id}
                    onChange={(e) => setCreateForm({ ...createForm, to_outlet_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    <option value="2">Siem Reap Branch</option>
                    <option value="1">Phnom Penh Main Outlet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Notes / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly stock rebalance..."
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              {/* Items Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs">Transfer Items *</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Product Row
                  </button>
                </div>

                {createForm.items.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <select
                        required
                        value={row.product_id}
                        onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none text-xs"
                      >
                        <option value="">Select Product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku}) — {p.stock_on_hand || 0} in stock
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="Qty"
                        value={row.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none text-xs font-mono font-bold"
                      />
                    </div>

                    {createForm.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  Dispatch Transfer
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* --- View Transfer Details Modal --- */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">
                Transfer Details ({selectedTransfer?.transfer_number})
              </h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-medium">
              {loadingDetail ? (
                <div className="p-8 text-center text-slate-400">Loading details...</div>
              ) : selectedTransfer ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-800">
                      <span className="font-bold">Route:</span>
                      <span className="font-bold text-orange-600">
                        {selectedTransfer.from_outlet_name} &rarr; {selectedTransfer.to_outlet_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>Dispatched At:</span>
                      <span>{selectedTransfer.dispatched_at ? new Date(selectedTransfer.dispatched_at).toLocaleString() : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>Status:</span>
                      <span className="capitalize font-bold text-slate-900">{selectedTransfer.status}</span>
                    </div>
                    {selectedTransfer.notes && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        Notes: {selectedTransfer.notes}
                      </p>
                    )}
                  </div>

                  {/* Line Items Breakdown */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Transferred Line Items:</h4>
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">Product Name</th>
                            <th className="p-2.5">SKU</th>
                            <th className="p-2.5 text-right">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedTransfer.lines?.map((line: any) => (
                            <tr key={line.id}>
                              <td className="p-2.5 font-bold text-slate-900">{line.product_name}</td>
                              <td className="p-2.5 font-mono text-slate-500">{line.sku}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-900">{line.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center text-slate-400">No detail available</div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
