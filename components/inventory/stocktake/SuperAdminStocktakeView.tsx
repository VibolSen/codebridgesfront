'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { getProductsApi, adjustStockApi } from '@/lib/api';
import { OutletSelector } from '@/components/inventory-suite';
import { StocktakeItem, StocktakeVarianceTable } from './StocktakeVarianceTable';

export const SuperAdminStocktakeView: React.FC = () => {
  const [items, setItems] = useState<StocktakeItem[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const productsRes = await getProductsApi();
        const prodList = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
        const mapped: StocktakeItem[] = prodList.map((p: any) => {
          const sys = Math.floor(parseFloat(p.stock_on_hand || '0'));
          return {
            id: p.id,
            name: p.name,
            sku: p.sku || `SKU-${p.id.substring(0, 6)}`,
            category: p.category || 'General',
            systemStock: sys,
            countedStock: sys,
            unitCost: parseFloat(p.cost_price || p.price || '0'),
          };
        });
        setItems(mapped);
      } catch (err) {
        console.error('Failed to load stocktake data:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleUpdateCount = (id: string, count: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, countedStock: Math.max(0, count) } : item))
    );
  };

  const handlePostVariance = async () => {
    const discrepancies = items.filter((i) => i.countedStock !== i.systemStock);
    if (discrepancies.length === 0) {
      setToastMessage('All physical counts match system stock. No variance adjustments needed.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    try {
      setSubmitting(true);
      const targetOutletId = selectedOutlet || '1';

      let adjustedCount = 0;
      for (const item of discrepancies) {
        const diff = item.countedStock - item.systemStock;
        await adjustStockApi({
          outlet_id: targetOutletId,
          product_id: item.id,
          quantity: Math.abs(diff),
          type: diff > 0 ? 'increment' : 'decrement',
          reason: 'count_variance',
          notes: `Stocktake session audit discrepancy (counted: ${item.countedStock}, system: ${item.systemStock})`,
        });
        adjustedCount++;
      }

      setItems((prev) =>
        prev.map((item) => ({ ...item, systemStock: item.countedStock }))
      );

      setToastMessage(
        `Stocktake posted! ${adjustedCount} item variances successfully updated in ledger.`
      );
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      setToastMessage(`Failed to post adjustments: ${err.message || 'Error updating stock'}`);
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const totalVarianceCost = items.reduce((acc, item) => {
    const diff = item.countedStock - item.systemStock;
    return acc + diff * item.unitCost;
  }, 0);

  const matchedItemsCount = items.filter((i) => i.countedStock === i.systemStock).length;
  const matchRate =
    items.length > 0 ? ((matchedItemsCount / items.length) * 100).toFixed(0) : '100';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand p-0.5 shadow-md shadow-brand/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-brand" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Physical Stocktake &amp; Cycle Counting
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand text-[10px] font-extrabold border border-brand/20 uppercase">
                Active Audit Session
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verify physical warehouse balances against system ledger records and reconcile inventory shrinkage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OutletSelector
            value={selectedOutlet}
            onChange={setSelectedOutlet}
            autoSelectFirst={true}
            showLabel={false}
          />

          <button
            type="button"
            disabled={submitting || loading}
            onClick={handlePostVariance}
            className="px-5 py-2.5 rounded-2xl bg-brand hover:bg-brand-hover active:bg-brand-strong disabled:opacity-50 text-white font-black text-xs shadow-md shadow-brand/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{submitting ? 'Posting Ledger...' : 'Post Discrepancies to Ledger'}</span>
          </button>
        </div>
      </div>

      {/* Stocktake Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-black text-slate-400 uppercase">Items Audited</span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {loading ? '...' : `${items.length} SKUs (${matchedItemsCount} Perfect Matches)`}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-black text-slate-400 uppercase">Accuracy Rate</span>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            {loading ? '...' : `${matchRate}% Match`}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-black text-slate-400 uppercase">Shrinkage Cost Variance</span>
          <p
            className={`text-2xl font-black font-mono ${
              totalVarianceCost < 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {loading
              ? '...'
              : totalVarianceCost < 0
              ? `-$${Math.abs(totalVarianceCost).toFixed(2)}`
              : `$${totalVarianceCost.toFixed(2)}`}
          </p>
        </div>
      </div>

      <StocktakeVarianceTable
        items={items}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        barcodeInput={barcodeInput}
        onBarcodeChange={setBarcodeInput}
        onUpdateCount={handleUpdateCount}
      />
    </div>
  );
};
