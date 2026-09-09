'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Variants } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import {
  getInventoryBalancesApi,
  receiveStockApi,
  adjustStockApi,
  getProductsApi,
} from '@/lib/api';
import { InventoryBalancesTable } from './InventoryBalancesTable';
import { InventoryModals } from './InventoryModals';
import { InventorySummaryCards } from './InventorySummaryCards';
import { InventoryFilterBar } from './InventoryFilterBar';
import { InventoryHeaderBar } from './InventoryHeaderBar';

function InventoryViewContent() {
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

  const [receiveForm, setReceiveForm] = useState({ po_number: '', supplier_name: '', product_id: '', quantity: '10', unit_cost: '' });
  const [adjustForm, setAdjustForm] = useState({ product_id: '', type: 'decrement', reason: 'damaged', quantity: '1', notes: '' });
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
      const res = await getInventoryBalancesApi(
        outletId,
        statusFilter || undefined,
        search || undefined
      );
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
    if (products.length > 0) {
      setReceiveForm((prev) => ({
        ...prev,
        product_id: String(products[0].id),
        unit_cost: products[0].cost_price || products[0].price || '0',
      }));
    }
    setShowReceiveModal(true);
  };

  const handleOpenAdjustModal = (product?: any) => {
    if (product) {
      setSelectedProductForAdjust(product);
      setAdjustForm({
        product_id: String(product.product_id),
        type: 'decrement',
        reason: 'damaged',
        quantity: '1',
        notes: '',
      });
    } else {
      setSelectedProductForAdjust(null);
      setAdjustForm({
        product_id: products[0]?.id ? String(products[0].id) : '',
        type: 'decrement',
        reason: 'inventory_count',
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
      await receiveStockApi({
        outlet_id: outletId,
        po_number: receiveForm.po_number,
        supplier_name: receiveForm.supplier_name,
        items: [
          {
            product_id: parseInt(receiveForm.product_id, 10),
            quantity_received: parseInt(receiveForm.quantity, 10),
            unit_cost: parseFloat(receiveForm.unit_cost) || 0,
          },
        ],
      });

      setNotification({ type: 'success', message: 'Stock received and inventory balance credited.' });
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
      await adjustStockApi({
        outlet_id: outletId,
        product_id: parseInt(adjustForm.product_id, 10),
        quantity: parseInt(adjustForm.quantity, 10),
        type: adjustForm.type as any,
        reason: adjustForm.reason,
        notes: adjustForm.notes,
      });

      setNotification({ type: 'success', message: 'Stock level adjusted successfully.' });
      setShowAdjustModal(false);
      loadInventory();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to adjust stock.' });
    } finally {
      setSaving(false);
    }
  };

  const totalSKUs = balances.length;
  const totalUnits = balances.reduce((sum, b) => sum + (b.on_hand || 0), 0);
  const lowStockCount = balances.filter((b) => b.is_low_stock).length;
  const totalValuation = balances.reduce(
    (sum, b) => sum + (b.on_hand || 0) * (b.product?.price || 0),
    0
  );

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
      <InventoryHeaderBar
        statusFilter={statusFilter}
        onOpenAdjustModal={() => handleOpenAdjustModal()}
        onOpenReceiveModal={handleOpenReceiveModal}
      />

      {/* Summary Cards */}
      <InventorySummaryCards
        totalSKUs={totalSKUs}
        totalUnits={totalUnits}
        lowStockCount={lowStockCount}
        totalValuation={totalValuation}
      />

      {/* Low Stock Active Status Banner */}
      {statusFilter === 'low_stock' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Low Stock View Active:</span> Showing items running low on
              stock that require reordering.
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
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Outlet Selection Bar */}
      <InventoryFilterBar
        search={search}
        setSearch={setSearch}
        outletId={outletId}
        setOutletId={setOutletId}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearchSubmit={handleSearchSubmit}
      />

      <InventoryBalancesTable
        balances={balances}
        loading={loading}
        onOpenAdjustModal={handleOpenAdjustModal}
        cardVariants={cardVariants}
      />

      <InventoryModals
        showReceiveModal={showReceiveModal}
        onCloseReceiveModal={() => setShowReceiveModal(false)}
        receiveForm={receiveForm}
        setReceiveForm={setReceiveForm}
        onSaveReceiveStock={handleSaveReceiveStock}
        showAdjustModal={showAdjustModal}
        onCloseAdjustModal={() => setShowAdjustModal(false)}
        adjustForm={adjustForm}
        setAdjustForm={setAdjustForm}
        onSaveStockAdjustment={handleSaveStockAdjustment}
        selectedProductForAdjust={selectedProductForAdjust}
        products={products}
        saving={saving}
      />
    </div>
  );
}

export const SuperAdminInventoryView: React.FC = () => {
  return (
    <Suspense
      fallback={<div className="p-8 text-xs text-slate-400">Loading inventory balances...</div>}
    >
      <InventoryViewContent />
    </Suspense>
  );
};
