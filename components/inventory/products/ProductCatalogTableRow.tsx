import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

interface ProductCatalogTableRowProps {
  product: any;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
}

export function ProductCatalogTableRow({
  product: p,
  onEdit,
  onDelete,
}: ProductCatalogTableRowProps) {
  const stock = parseFloat(p.stock_on_hand || '0');
  const minBuffer = parseInt(p.min_reorder_point || '5', 10);
  const isOutOfStock = stock <= 0;
  const isLowStock = !isOutOfStock && stock <= minBuffer;

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      {/* Name & SKU */}
      <td className="px-4 py-3.5">
        <div className="font-black text-slate-900 text-xs">{p.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-[10px] text-slate-400 font-bold">
            {p.sku || 'SKU-N/A'}
          </span>
          {p.barcode && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
              {p.barcode}
            </span>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3.5">
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
          {p.category_name || p.category?.name || p.category || 'General'}
        </span>
      </td>

      {/* Stock On Hand Badge */}
      <td className="px-4 py-3.5 font-mono font-bold">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
            isOutOfStock
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : isLowStock
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          {Math.floor(stock)} units
        </span>
      </td>

      {/* Cost Price */}
      <td className="px-4 py-3.5 font-mono font-bold text-slate-500">
        ${Number(p.cost_price || 0).toFixed(2)}
      </td>

      {/* Selling Price */}
      <td className="px-4 py-3.5 font-mono font-black text-slate-900">
        ${Number(p.selling_price || p.price || 0).toFixed(2)}
      </td>

      {/* Min Buffer */}
      <td className="px-4 py-3.5 font-mono font-semibold text-slate-500">
        {minBuffer} units
      </td>

      {/* Action */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit?.(p)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-subtle text-slate-700 hover:text-brand font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Edit SKU Details"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(p)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center cursor-pointer"
            title="Delete Product SKU"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
