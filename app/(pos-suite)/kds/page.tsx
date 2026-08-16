'use client';

import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, RefreshCw, Flame, AlertCircle } from 'lucide-react';
import { getKdsTicketsApi, updateKdsStatusApi } from '@/lib/api';

export default function KitchenDisplaySystemPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getKdsTicketsApi();
      setTickets(res.data || []);
    } catch (err) {
      console.error('Failed to load KDS tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    try {
      await updateKdsStatusApi(id, nextStatus);
      loadTickets();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-500" />
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Live order prep monitor for kitchen chefs, cooks & baristas</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span>{tickets.length} ACTIVE TICKETS</span>
          </div>

          <button
            onClick={loadTickets}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ticket Grid */}
      {loading && tickets.length === 0 ? (
        <div className="py-24 text-center text-slate-500 text-xs font-mono">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" />
          Connecting to Kitchen Display Stream...
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-32 text-center space-y-3">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto opacity-80" />
          <h3 className="text-lg font-bold text-white">All Kitchen Orders Clear!</h3>
          <p className="text-xs text-slate-400">New orders from POS terminals & online storefront will appear here live.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tickets.map((ticket) => {
            const items = typeof ticket.items === 'string' ? JSON.parse(ticket.items) : ticket.items || [];
            
            return (
              <div
                key={ticket.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 shadow-xl ${
                  ticket.status === 'preparing'
                    ? 'bg-slate-900 border-orange-500/50 shadow-orange-500/5'
                    : ticket.status === 'ready'
                    ? 'bg-slate-900 border-emerald-500/50'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-black text-lg text-white">{ticket.ticket_number}</span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {ticket.order_type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{ticket.table_name || 'Counter'}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {ticket.prep_time_minutes || 2}m elapsed
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    {items.map((it: any, idx: number) => (
                      <div key={idx} className="flex items-start justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{it.quantity}x {it.name}</span>
                          {it.note && (
                            <p className="text-[10px] text-amber-400 font-mono font-semibold">↳ {it.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom Action Button */}
                <div className="pt-2">
                  {ticket.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(ticket.id, 'preparing')}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4" /> Start Preparing
                    </button>
                  )}

                  {ticket.status === 'preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(ticket.id, 'ready')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Order Ready
                    </button>
                  )}

                  {ticket.status === 'ready' && (
                    <button
                      onClick={() => handleUpdateStatus(ticket.id, 'bumped')}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                      Bump / Complete
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
