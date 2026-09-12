'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Boxes, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

interface InventoryHeaderBarProps {
  statusFilter: string;
  onOpenAdjustModal: () => void;
  onOpenReceiveModal: () => void;
}

export const InventoryHeaderBar: React.FC<InventoryHeaderBarProps> = ({
  statusFilter,
  onOpenAdjustModal,
  onOpenReceiveModal,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          {statusFilter === 'low_stock' ? (
            <>
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Low Stock Items &amp; Reorder Dashboard
            </>
          ) : (
            <>
              <Boxes className="w-6 h-6 text-brand" />
              Inventory Operations &amp; Stock Levels
            </>
          )}
        </h1>
        <p className="text-xs text-slate-500">
          {statusFilter === 'low_stock'
            ? 'Monitoring products with inventory balances at or below minimum reorder thresholds requiring replenishment.'
            : 'Real-time stock balance tracking, low stock monitoring, and inventory movements'}
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenAdjustModal}
          className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          Stock Adjustment
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenReceiveModal}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Receive Stock Shipment
        </motion.button>
      </div>
    </motion.div>
  );
};
