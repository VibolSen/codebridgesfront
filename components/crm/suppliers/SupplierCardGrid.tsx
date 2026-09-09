'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { UserCheck, Phone, Mail, Trash2, Edit3 } from 'lucide-react';

interface SupplierCardGridProps {
  suppliers: any[];
  loading: boolean;
  onEdit: (sup: any) => void;
  onDelete: (sup: any) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' as const },
  }),
};

export const SupplierCardGrid: React.FC<SupplierCardGridProps> = ({
  suppliers,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 font-medium">
        Loading suppliers...
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
        <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">No wholesale suppliers found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {suppliers.map((sup, idx) => (
        <motion.div
          key={sup.id}
          custom={idx}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  {sup.name ? sup.name[0] : 'S'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{sup.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Contact: {sup.contact_name || 'Primary Representative'}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                Vendor #{sup.id}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              {sup.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sup.phone}</span>
                </p>
              )}
              {sup.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{sup.email}</span>
                </p>
              )}
              {sup.address && (
                <p className="text-slate-400 text-[11px] line-clamp-1">{sup.address}</p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={() => onDelete(sup)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Supplier"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(sup)}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
