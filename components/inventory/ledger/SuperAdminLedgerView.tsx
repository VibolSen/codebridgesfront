'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Package,
  History,
  UserCheck,
} from 'lucide-react';
import { getInventoryMovementsApi } from '@/lib/api';
import { OutletSelector } from '@/components/inventory-suite';

export const SuperAdminLedgerView: React.FC = () => {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [outletId, setOutletId] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMovements();
  }, [outletId, typeFilter]);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const res = await getInventoryMovementsApi(
        outletId || undefined,
        typeFilter || undefined,
        search || undefined
      );
      setMovements(res.data || []);
    } catch (err: any) {
      console.error('Failed to load inventory movement ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMovements();
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'receive':
        return {
          label: 'Stock Receive',
          style: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          icon: ArrowUpRight,
        };
      case 'sale':
        return {
          label: 'Sale Checkout',
          style: 'bg-blue-50 text-blue-700 border-blue-300',
          icon: ArrowDownRight,
        };
      case 'adjustment':
        return {
          label: 'Stock Adjustment',
          style: 'bg-amber-50 text-amber-700 border-amber-300',
          icon: RefreshCw,
        };
      case 'transfer':
        return {
          label: 'Outlet Transfer',
          style: 'bg-purple-50 text-purple-700 border-purple-300',
          icon: History,
        };
      case 'return':
        return {
          label: 'Sales Return',
          style: 'bg-indigo-50 text-indigo-700 border-indigo-300',
          icon: ArrowUpRight,
        };
      default:
        return {
          label: type,
          style: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: FileText,
        };
    }
  };

  const totalLogs = movements.length;
  const receiveCount = movements.filter((m) => m.movement_type === 'receive').length;
  const salesCount = movements.filter((m) => m.movement_type === 'sale').length;
  const adjustmentCount = movements.filter((m) => m.movement_type === 'adjustment').length;

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
            <History className="w-6 h-6 text-orange-500" />
            Append-Only Stock Movement Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Immutable audit trail log of every stock movement, sale, receiving, and adjustment
          </p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalLogs}</h4>
            <p className="text-xs text-slate-500 font-medium">Ledger Audit Entries</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{receiveCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Stock Shipment Receives</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{salesCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Checkout Deductions</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{adjustmentCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Manual Adjustments</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Search & Movement Type Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search product, SKU, PO # or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <OutletSelector
            value={outletId}
            onChange={setOutletId}
            includeAll={true}
            allLabel="All Outlets"
          />

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 ml-2">
            <Filter className="w-4 h-4 text-slate-400" />
            Movement Type:
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Movement Types</option>
            <option value="receive">Stock Receives</option>
            <option value="sale">Sale Deductions</option>
            <option value="adjustment">Stock Adjustments</option>
            <option value="transfer">Stock Transfers</option>
            <option value="return">Sales Returns</option>
          </select>
        </div>
      </div>

      {/* Movement Ledger Audit Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading movement audit logs...
          </div>
        ) : movements.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No stock movement logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Movement Type</th>
                  <th className="py-3.5 px-4 text-right">Quantity Delta</th>
                  <th className="py-3.5 px-4">Reference Doc</th>
                  <th className="py-3.5 px-4">Performed By</th>
                  <th className="py-3.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {movements.map((log, idx) => {
                  const badge = getMovementBadge(log.movement_type);
                  const IconComp = badge.icon;
                  const isPositive = log.quantity > 0;

                  return (
                    <motion.tr
                      key={log.id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 shrink-0">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-bold text-slate-900 text-xs">{log.product_name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{log.sku}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${badge.style}`}
                        >
                          <IconComp className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </td>

                      <td
                        className={`py-3.5 px-4 text-right font-extrabold font-mono text-xs ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPositive ? `+${log.quantity}` : log.quantity}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px]">
                          {log.reference_id || 'N/A'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          {log.user_name || 'System Worker'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                        {log.notes || '—'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
