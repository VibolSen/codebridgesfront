'use client';

import React, { useState, useEffect } from 'react';
import { ChefHat, CheckCircle2, RefreshCw } from 'lucide-react';
import { getKdsTicketsApi, updateKdsStatusApi } from '@/lib/api';

export function KitchenDisplayView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const res = await getKdsTicketsApi();
      setTickets(res?.data || []);
    } catch (err) {
      console.error('Failed to load KDS tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    try {
      await updateKdsStatusApi(id, nextStatus);
      loadTickets();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <ChefHat className="w-7 h-7 text-brand" />
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Live order prep monitor for kitchen chefs, cooks &amp; baristas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-brand-subtle border border-brand/20 text-brand text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            <span>{tickets.length} ACTIVE TICKETS</span>
          </div>

          <button
            onClick={loadTickets}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Refresh KDS"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ticket Grid */}
      {tickets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
          <p className="text-xs text-slate-400 mt-1">No pending orders in the preparation queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="font-mono font-black text-sm text-slate-900">
                  #{String(ticket.id).slice(0, 6)}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {ticket.time || 'Just now'}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1">
                {ticket.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-700 font-medium">
                    <span>{item.qty}x {item.name}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(ticket.id, 'ready')}
                  className="w-full py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-black transition-colors cursor-pointer"
                >
                  Mark as Ready
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
