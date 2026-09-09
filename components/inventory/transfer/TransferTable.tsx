'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRightLeft, Truck, CheckCircle2, Eye, ArrowRight } from 'lucide-react';

interface TransferTableProps {
  transfers: any[];
  loading: boolean;
  onViewDetails: (id: string | number) => void;
  onMarkReceived: (id: string | number, transferNumber: string) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
  }),
};

export const TransferTable: React.FC<TransferTableProps> = ({
  transfers,
  loading,
  onViewDetails,
  onMarkReceived,
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">
          Loading stock transfers...
        </div>
      ) : transfers.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <ArrowRightLeft className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">No stock transfers found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Transfer #</th>
                <th className="py-3.5 px-4">From Outlet &rarr; To Outlet</th>
                <th className="py-3.5 px-4 text-center">Items</th>
                <th className="py-3.5 px-4 text-center">Total Qty</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Dispatched At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {transfers.map((trf, idx) => (
                <motion.tr
                  key={trf.id}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="hover:bg-orange-50/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {trf.transfer_number}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{trf.from_outlet_name || `Outlet #${trf.from_outlet_id}`}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{trf.to_outlet_name || `Outlet #${trf.to_outlet_id}`}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {trf.items_count || 1} line(s)
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                    {parseInt(trf.total_quantity || '0', 10)}
                  </td>

                  <td className="py-3.5 px-4">
                    {trf.status === 'dispatched' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Truck className="w-3 h-3" /> In Transit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Received
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {trf.dispatched_at ? new Date(trf.dispatched_at).toLocaleString() : '—'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(trf.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>

                      {trf.status === 'dispatched' && (
                        <button
                          onClick={() => onMarkReceived(trf.id, trf.transfer_number)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Received
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
