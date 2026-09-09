'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, X, ArrowUpRight } from 'lucide-react';

interface ReceiveFormState {
  po_number: string;
  supplier_name: string;
  product_id: string;
  quantity: string;
  unit_cost: string;
}

interface AdjustFormState {
  product_id: string;
  type: string;
  reason: string;
  quantity: string;
  notes: string;
}

interface InventoryModalsProps {
  showReceiveModal: boolean;
  onCloseReceiveModal: () => void;
  receiveForm: ReceiveFormState;
  setReceiveForm: React.Dispatch<React.SetStateAction<ReceiveFormState>>;
  onSaveReceiveStock: (e: React.FormEvent) => void;
  showAdjustModal: boolean;
  onCloseAdjustModal: () => void;
  adjustForm: AdjustFormState;
  setAdjustForm: React.Dispatch<React.SetStateAction<AdjustFormState>>;
  onSaveStockAdjustment: (e: React.FormEvent) => void;
  selectedProductForAdjust: any;
  products: any[];
  saving: boolean;
}

export const InventoryModals: React.FC<InventoryModalsProps> = ({
  showReceiveModal,
  onCloseReceiveModal,
  receiveForm,
  setReceiveForm,
  onSaveReceiveStock,
  showAdjustModal,
  onCloseAdjustModal,
  adjustForm,
  setAdjustForm,
  onSaveStockAdjustment,
  selectedProductForAdjust,
  products,
  saving,
}) => {
  return (
    <>
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
              <button
                onClick={onCloseReceiveModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSaveReceiveStock} className="space-y-4 text-xs">
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
                    onChange={(e) =>
                      setReceiveForm({ ...receiveForm, supplier_name: e.target.value })
                    }
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
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku})
                    </option>
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
                  onClick={onCloseReceiveModal}
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
              <button
                onClick={onCloseAdjustModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSaveStockAdjustment} className="space-y-4 text-xs">
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
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, product_id: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (SKU: {p.sku})
                      </option>
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
                  onClick={onCloseAdjustModal}
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
    </>
  );
};
