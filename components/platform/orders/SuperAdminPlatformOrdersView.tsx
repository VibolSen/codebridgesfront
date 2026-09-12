'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  RefreshCw,
  Search,
} from 'lucide-react';
import { getOnlineOrdersApi, updateOnlineOrderStatusApi } from '@/lib/api';
import { OnlineOrder } from './types';
import { OrderCard } from './OrderCard';

export function SuperAdminPlatformOrdersView() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OnlineOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOnlineOrdersApi(statusFilter);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load online orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await updateOnlineOrderStatusApi(orderId, newStatus);
      await loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-brand" />
            Online Order Fulfillment Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management & fulfillment tracking for customer storefront orders
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Orders
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Status Tabs */}
        <div className="flex gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-xl">
          {['all', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* Orders Grid / List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand" />
          <p className="text-xs font-semibold">Fetching customer online orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-700">No online orders found</p>
          <p className="text-xs text-slate-400">Orders placed on the storefront will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              updatingId={updatingId}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
