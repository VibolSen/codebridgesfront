'use client';

import React from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  Store,
  Phone,
  User,
  MapPin,
} from 'lucide-react';
import { OnlineOrder, getOrderStatusBadge } from './types';

interface OrderCardProps {
  order: OnlineOrder;
  updatingId: string | null;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

export function OrderCard({ order, updatingId, onUpdateStatus }: OrderCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
      {/* Top Banner */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono font-black text-sm text-slate-900">{order.order_number}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getOrderStatusBadge(
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
          {(order.lines || []).map((line) => (
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
              onClick={() => onUpdateStatus(order.id, 'preparing')}
              disabled={updatingId === order.id}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Clock className="w-3.5 h-3.5" /> Start Preparing Order
            </button>
          )}

          {order.fulfillment_status === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              disabled={updatingId === order.id}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready for {order.delivery_type === 'delivery' ? 'Delivery' : 'Pickup'}
            </button>
          )}

          {order.fulfillment_status === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'completed')}
              disabled={updatingId === order.id}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
  );
}
