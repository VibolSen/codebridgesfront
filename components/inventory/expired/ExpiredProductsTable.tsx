'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Clock, AlertOctagon, AlertTriangle, Package, Trash2 } from 'lucide-react';

interface ExpiredProductsTableProps {
  items: any[];
  loading: boolean;
  onOpenDisposeModal: (item: any) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
  }),
};

export const ExpiredProductsTable: React.FC<ExpiredProductsTableProps> = ({
  items,
  loading,
  onOpenDisposeModal,
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">
          Loading perishable inventory...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">
            No expired or near-expiry products found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Days Status</th>
                <th className="py-3.5 px-4 text-right">On Hand Stock</th>
                <th className="py-3.5 px-4 text-right">Valuation at Risk</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {items.map((item, idx) => {
                const isExpired = item.status === 'expired';
                const days = item.days_left;

                return (
                  <motion.tr
                    key={item.product_id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{item.product_name}</p>
                          <p className="text-[10px] text-slate-400">
                            Outlet: {item.outlet_name || 'All'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.sku}</td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        {item.category_name || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {item.expiry_date}
                    </td>

                    <td className="py-3.5 px-4">
                      {isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertOctagon className="w-3 h-3" /> Expired ({Math.abs(days)}d ago)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> {days} days left
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {item.on_hand}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">
                      ${((item.on_hand || 0) * (item.cost_price || item.price || 0)).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenDisposeModal(item)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] transition-colors inline-flex items-center gap-1 border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Write Off
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
