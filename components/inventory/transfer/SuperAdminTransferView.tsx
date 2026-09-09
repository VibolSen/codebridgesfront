'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  getTransfersApi,
  getTransferDetailApi,
  createTransferApi,
  receiveTransferApi,
  getProductsApi,
  getOutletsApi,
} from '@/lib/api';
import { TransferModals } from './TransferModals';
import { TransferMetricsCards } from './TransferMetricsCards';
import { TransferTable } from './TransferTable';

export const SuperAdminTransferView: React.FC = () => {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // New Transfer Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    from_outlet_id: '',
    to_outlet_id: '',
    notes: '',
    items: [{ product_id: '', quantity: '10' }],
  });
  const [submitting, setSubmitting] = useState(false);

  // Detail Modal State
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadTransfers();
    loadProductsList();
    loadOutletsList();
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

  const loadOutletsList = async () => {
    try {
      const res = await getOutletsApi();
      const list = Array.isArray(res) ? res : res?.data || [];
      setOutlets(list);
      if (list.length >= 2) {
        setCreateForm((prev) => ({
          ...prev,
          from_outlet_id: String(list[0].id),
          to_outlet_id: String(list[1].id),
        }));
      } else if (list.length === 1) {
        setCreateForm((prev) => ({
          ...prev,
          from_outlet_id: String(list[0].id),
          to_outlet_id: String(list[0].id),
        }));
      }
    } catch (err: any) {
      console.error('Failed to load outlets list:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTransfers();
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createForm.from_outlet_id === createForm.to_outlet_id) {
      setNotification({
        type: 'error',
        message: 'Origin and destination outlets must be different.',
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        from_outlet_id: parseInt(createForm.from_outlet_id, 10),
        to_outlet_id: parseInt(createForm.to_outlet_id, 10),
        notes: createForm.notes,
        items: createForm.items.map((it) => ({
          product_id: parseInt(it.product_id, 10),
          quantity: parseInt(it.quantity, 10),
        })),
      };

      await createTransferApi(payload);
      setNotification({ type: 'success', message: 'Stock transfer dispatched successfully!' });
      setIsCreateModalOpen(false);
      loadTransfers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to dispatch transfer.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = async (id: string | number) => {
    try {
      setIsDetailModalOpen(true);
      setLoadingDetail(true);
      const res = await getTransferDetailApi(String(id));
      setSelectedTransfer(res.data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to load transfer details.',
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleMarkReceived = async (id: string | number, transferNumber: string) => {
    if (!confirm(`Confirm receipt for Transfer #${transferNumber}? Stock will be credited to destination.`)) {
      return;
    }

    try {
      await receiveTransferApi(String(id));
      setNotification({
        type: 'success',
        message: `Transfer #${transferNumber} received successfully. Stock levels updated!`,
      });
      if (isDetailModalOpen) setIsDetailModalOpen(false);
      loadTransfers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to mark as received.' });
    }
  };

  const totalTransfers = transfers.length;
  const inTransitCount = transfers.filter((t) => t.status === 'dispatched').length;
  const receivedCount = transfers.filter((t) => t.status === 'received').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ArrowRightLeft className="w-6 h-6 text-orange-500" />
            Inter-Store Stock Transfers
          </h1>
          <p className="text-xs text-slate-500">
            Dispatch, track, and receive inventory shipments across store warehouses and retail outlets
          </p>
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
      <TransferMetricsCards
        totalTransfers={totalTransfers}
        inTransitCount={inTransitCount}
        receivedCount={receivedCount}
      />

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
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
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
      <TransferTable
        transfers={transfers}
        loading={loading}
        onViewDetails={handleViewDetails}
        onMarkReceived={handleMarkReceived}
      />

      <TransferModals
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={() => setIsCreateModalOpen(false)}
        createForm={createForm}
        setCreateForm={setCreateForm}
        onCreateTransfer={handleCreateTransfer}
        submitting={submitting}
        outlets={outlets}
        products={products}
        isDetailModalOpen={isDetailModalOpen}
        onCloseDetailModal={() => setIsDetailModalOpen(false)}
        selectedTransfer={selectedTransfer}
        loadingDetail={loadingDetail}
        onMarkReceived={handleMarkReceived}
      />
    </div>
  );
};
