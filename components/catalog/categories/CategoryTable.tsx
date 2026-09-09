'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Tag, Layers, Edit3, Trash2 } from 'lucide-react';
import { CategoryItem } from './types';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
  }),
};

interface CategoryTableProps {
  categories: CategoryItem[];
  loading: boolean;
  onEdit: (cat: CategoryItem) => void;
  onDelete: (id: number, name: string) => void;
}

export function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 font-medium">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-12 text-center space-y-3">
        <Tag className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">No categories found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="py-3.5 px-4">Category Name</th>
            <th className="py-3.5 px-4">URL Slug</th>
            <th className="py-3.5 px-4">Type / Parent</th>
            <th className="py-3.5 px-4 text-right">Products Assigned</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {categories.map((cat, idx) => {
            const isSub = !!cat.parent_id;

            return (
              <motion.tr
                key={cat.id}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="hover:bg-orange-50/50 transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    {isSub ? (
                      <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                      <Tag className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span>{cat.name}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                  {cat.slug}
                </td>

                <td className="py-3.5 px-4">
                  {isSub ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Sub-Category of {cat.parent_name}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                      Main Category
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono">
                  {cat.products_count || 0}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cat.id, cat.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
