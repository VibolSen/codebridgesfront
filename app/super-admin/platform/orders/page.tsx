'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Store,
  RefreshCw,
  Search,
  ChevronRight,
  Phone,
  User,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { getOnlineOrdersApi, updateOnlineOrderStatusApi } from '@/lib/api';

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ready':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-orange-500" />
            Online Order Fulfillment Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management & fulfillment tracking for customer storefront orders
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-2"
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
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
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Orders Grid / List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500" />
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
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Top Banner */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-black text-sm text-slate-900">{order.order_number}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(
                    order.fulfillment_status
                  )}`}
                >
                  {order.fulfillment_status}
                </span>
              </div>

              {/* Customer Details */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{order.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-orange-600">
                  {order.delivery_type === 'delivery' ? (
                    <Truck className="w-3.5 h-3.5 text-orange-500" />
                  ) : (
                    <Store className="w-3.5 h-3.5 text-orange-500" />
                  )}
                  <span className="capitalize">{order.delivery_type} Fulfillment</span>
                </div>
                {order.delivery_address && (
                  <div className="flex items-start gap-2 text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{order.delivery_address}</span>
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="space-y-1 text-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ordered Items</p>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                  {(order.lines || []).map((line: any) => (
                    <div key={line.id} className="flex justify-between text-slate-700">
                      <span>{line.product_name} x{Number(line.quantity)}</span>
                      <span className="font-bold">${Number(line.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Total & Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-baseline font-extrabold text-sm text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-orange-600 font-mono">${Number(order.grand_total).toFixed(2)}</span>
                </div>

                {/* Fulfillment Status Progression Buttons */}
                <div className="grid grid-cols-1 gap-1.5">
                  {order.fulfillment_status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'preparing')}
                      disabled={updatingId === order.id}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" /> Start Preparing Order
                    </button>
                  )}

                  {order.fulfillment_status === 'preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ready')}
                      disabled={updatingId === order.id}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready for {order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}
                    </button>
                  )}

                  {order.fulfillment_status === 'ready' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      disabled={updatingId === order.id}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete Order
                    </button>
                  )}

                  {order.fulfillment_status === 'completed' && (
                    <div className="py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Order Fulfilled & Paid
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
