'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, Loader2 } from 'lucide-react';

interface ProductCatalogTableProps {
  products: any[];
  loading: boolean;
  onOpenAddModal: () => void;
}

export function ProductCatalogTable({
  products,
  loading,
  onOpenAddModal,
}: ProductCatalogTableProps) {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((p: any) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#5B4DFB]" />
            <span>Products &amp; SKUs</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">All active catalog products, barcoding, unit costs, and inventory thresholds</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU or name..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B4DFB]"
            />
          </div>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Product &amp; SKU</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Stock On Hand</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Cost Price</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Selling Price</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Min Buffer</th>
              <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#5B4DFB] mb-2" />
                  Loading live catalog products &amp; SKUs...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium space-y-2">
                  <Package className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                  <p className="font-extrabold text-slate-700">No Products Found</p>
                  <p className="text-xs text-slate-400">Click &quot;Add Product&quot; to create your first catalog item.</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p: any) => {
                const stock = parseFloat(p.stock_on_hand || '0');
                const minBuffer = parseInt(p.min_reorder_point || '5', 10);
                const isOutOfStock = stock <= 0;
                const isLowStock = !isOutOfStock && stock <= minBuffer;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-black text-slate-900">{p.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{p.sku || 'SKU-N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {p.category_name || p.category?.name || p.category || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
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
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">
                      ${Number(p.cost_price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono font-black text-slate-900">
                      ${Number(p.selling_price || p.price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-500">
                      {minBuffer} units
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/super-admin/catalog/products`}
                        className="text-[#5B4DFB] font-extrabold hover:underline text-xs"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
