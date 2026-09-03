'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  getInventoryBalancesApi,
  receiveStockApi,
  adjustStockApi,
  getProductsApi,
} from '@/lib/api';
import { OutletSelector } from '@/components/inventory-suite';
import { motion, Variants } from 'framer-motion';
import {
  Boxes,
  Package,
  Plus,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  X,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

import { useSearchParams } from 'next/navigation';

function InventoryContent() {
  const searchParams = useSearchParams();
  const [balances, setBalances] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [outletId, setOutletId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [search, setSearch] = useState('');

  // Modals state
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<any>(null);

  // Receive Stock Form
  const [receiveForm, setReceiveForm] = useState({
    po_number: '',
    supplier_name: '',
    product_id: '',
    quantity: '10',
    unit_cost: '',
  });

  // Adjust Stock Form
  const [adjustForm, setAdjustForm] = useState({
    product_id: '',
    type: 'decrement',
    reason: 'damaged',
    quantity: '1',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    setStatusFilter(urlStatus);
  }, [searchParams]);

  useEffect(() => {
    loadInventory();
    loadProductsList();
  }, [outletId, statusFilter]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await getInventoryBalancesApi(outletId, statusFilter || undefined, search || undefined);
      setBalances(res.data || []);
    } catch (err: any) {
      console.error('Failed to load inventory balances:', err);
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
    loadInventory();
  };

  const handleOpenReceiveModal = () => {
    setReceiveForm({
      po_number: 'PO-' + Math.floor(100000 + Math.random() * 900000),
      supplier_name: '',
      product_id: products[0] ? String(products[0].id) : '',
      quantity: '10',
      unit_cost: products[0] ? String(products[0].cost_price || '') : '',
    });
    setShowReceiveModal(true);
  };

  const handleOpenAdjustModal = (item?: any) => {
    if (item) {
      setSelectedProductForAdjust(item);
      setAdjustForm({
        product_id: String(item.product_id),
        type: 'decrement',
        reason: 'damaged',
        quantity: '1',
        notes: '',
      });
    } else {
      setSelectedProductForAdjust(null);
      setAdjustForm({
        product_id: products[0] ? String(products[0].id) : '',
        type: 'decrement',
        reason: 'damaged',
        quantity: '1',
        notes: '',
      });
    }
    setShowAdjustModal(true);
  };

  const handleSaveReceiveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);
      await receiveStockApi({
        outlet_id: outletId,
        po_number: receiveForm.po_number,
        supplier_name: receiveForm.supplier_name,
        items: [
          {
            product_id: parseInt(receiveForm.product_id, 10),
            quantity: parseInt(receiveForm.quantity, 10),
            unit_cost: receiveForm.unit_cost ? parseFloat(receiveForm.unit_cost) : null,
          },
        ],
      });

      setNotification({ type: 'success', message: 'Stock received successfully!' });
      setShowReceiveModal(false);
      loadInventory();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to receive stock.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);
      await adjustStockApi({
        outlet_id: outletId,
        product_id: parseInt(adjustForm.product_id, 10),
        quantity: parseInt(adjustForm.quantity, 10),
        type: adjustForm.type,
        reason: adjustForm.reason,
        notes: adjustForm.notes,
      });

      setNotification({ type: 'success', message: 'Stock adjustment recorded successfully.' });
      setShowAdjustModal(false);
      loadInventory();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to adjust stock.' });
    } finally {
      setSaving(false);
    }
  };

  const totalSKUs = balances.length;
  const totalUnits = balances.reduce((sum, item) => sum + (item.on_hand || 0), 0);
  const lowStockCount = balances.filter((item) => item.is_low_stock).length;
  const totalValuation = balances.reduce((sum, item) => sum + ((item.on_hand || 0) * (item.price || 0)), 0);

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
            {statusFilter === 'low_stock' ? (
              <>
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Low Stock Items & Reorder Dashboard
              </>
            ) : (
              <>
                <Boxes className="w-6 h-6 text-orange-500" />
                Inventory Operations & Stock Levels
              </>
            )}
          </h1>
          <p className="text-xs text-slate-500">
            {statusFilter === 'low_stock'
              ? 'Monitoring products with inventory balances at or below minimum reorder thresholds requiring replenishment.'
              : 'Real-time stock balance tracking, low stock monitoring, and inventory movements'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenAdjustModal()}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            Stock Adjustment
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenReceiveModal}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Receive Stock Shipment
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalSKUs}</h4>
            <p className="text-xs text-slate-500 font-medium">Total Active SKUs</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalUnits.toLocaleString()}</h4>
            <p className="text-xs text-slate-500 font-medium">Total Units On Hand</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{lowStockCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Low Stock Alerts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
            <p className="text-xs text-slate-500 font-medium">Retail Valuation</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Low Stock Active Status Banner */}
      {statusFilter === 'low_stock' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Low Stock View Active:</span> Showing items running low on stock that require reordering.
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('')}
            className="px-3 py-1 rounded-xl bg-amber-200/60 hover:bg-amber-300/80 text-amber-900 text-xs font-bold transition-all"
          >
            Clear Filter (Show All)
          </button>
        </div>
      )}

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

      {/* Filter & Outlet Selection Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search product name, SKU or barcode..."
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
            Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Stock Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Stock Balances Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading stock balances...
          </div>
        ) : balances.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No stock balances found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU / Barcode</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">On Hand</th>
                  <th className="py-3.5 px-4 text-right">Reserved</th>
                  <th className="py-3.5 px-4 text-right">Available</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {balances.map((item, idx) => {
                  const isOut = item.on_hand <= 0;
                  const isLow = item.is_low_stock && !isOut;

                  return (
                    <motion.tr
                      key={item.balance_id}
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

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <p className="text-slate-900 font-bold">{item.sku}</p>
                        <p className="text-[10px] text-slate-400">{item.barcode || '—'}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                          {item.category_name || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {item.on_hand}
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                        {item.reserved}
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-orange-600 font-mono">
                        {item.available}
                      </td>

                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Low Stock ({item.on_hand})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenAdjustModal(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
                            title="Adjust Stock Balance"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receive Stock Shipment Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" /> Receive Stock Shipment
              </h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveReceiveStock} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PO Reference Number *</label>
                  <input
                    type="text"
                    required
                    value={receiveForm.po_number}
                    onChange={(e) => setReceiveForm({ ...receiveForm, po_number: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Fresh Supplier Ltd"
                    value={receiveForm.supplier_name}
                    onChange={(e) => setReceiveForm({ ...receiveForm, supplier_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Product *</label>
                <select
                  required
                  value={receiveForm.product_id}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const p = products.find((prod) => String(prod.id) === pid);
                    setReceiveForm({
                      ...receiveForm,
                      product_id: pid,
                      unit_cost: p && p.cost_price ? String(p.cost_price) : '',
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Received Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={receiveForm.quantity}
                    onChange={(e) => setReceiveForm({ ...receiveForm, quantity: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={receiveForm.unit_cost}
                    onChange={(e) => setReceiveForm({ ...receiveForm, unit_cost: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReceiveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  {saving ? 'Processing...' : 'Confirm Stock Receiving'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Manual Stock Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-500" /> Record Stock Adjustment
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveStockAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Product *</label>
                {selectedProductForAdjust ? (
                  <input
                    type="text"
                    disabled
                    value={`${selectedProductForAdjust.product_name} (Current On Hand: ${selectedProductForAdjust.on_hand})`}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold"
                  />
                ) : (
                  <select
                    required
                    value={adjustForm.product_id}
                    onChange={(e) => setAdjustForm({ ...adjustForm, product_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adjustment Action *</label>
                  <select
                    value={adjustForm.type}
                    onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  >
                    <option value="decrement">Deduct / Remove Stock (-)</option>
                    <option value="increment">Add / Found Stock (+)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason Code *</label>
                  <select
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="damaged">Damaged / Broken</option>
                    <option value="spoilage">Spoilage / Expired</option>
                    <option value="count_variance">Inventory Count Variance</option>
                    <option value="found">Uncounted Stock Found</option>
                    <option value="other">Other Reason</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Justification</label>
                <textarea
                  rows={2}
                  placeholder="Explain why stock is being adjusted..."
                  value={adjustForm.notes}
                  onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  {saving ? 'Recording...' : 'Record Adjustment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading inventory balances...</div>}>
      <InventoryContent />
    </Suspense>
  );
}

