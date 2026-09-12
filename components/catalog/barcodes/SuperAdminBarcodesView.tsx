'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Search, Plus, Trash2, RefreshCw } from 'lucide-react';
import { getProductsApi } from '@/lib/api';
import { BarcodeProductItem } from './types';
import { BarcodePreviewGrid } from './BarcodePreviewGrid';

export function SuperAdminBarcodesView() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<BarcodeProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [labelSize, setLabelSize] = useState('38x25');
  const [showPrice, setShowPrice] = useState(true);
  const [showSku, setShowSku] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductsApi(1);
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product: any) => {
    const existing = selectedItems.find((item) => item.id === product.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.id === product.id ? { ...item, printQty: item.printQty + 1 } : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...product, printQty: 10 }]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Printer className="w-7 h-7 text-brand" />
            Barcode Label Print Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and print custom product barcode stickers for thermal label printers
          </p>
        </div>

        <button
          onClick={handlePrint}
          disabled={selectedItems.length === 0}
          className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover active:bg-brand-active text-white font-bold text-xs shadow-md shadow-brand/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print Sticker Sheet
        </button>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Product Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-brand" /> Select Products
          </h3>
          <input
            type="text"
            placeholder="Search product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />

          <div className="max-h-60 overflow-y-auto space-y-1.5 divide-y divide-slate-100">
            {loading ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-brand" /> Loading catalog...
              </div>
            ) : (
              filteredProducts.map((p) => (
                <div key={p.id} className="pt-1.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">${Number(p.price).toFixed(2)} | {p.sku || 'NO-SKU'}</p>
                  </div>
                  <button
                    onClick={() => handleAddProduct(p)}
                    className="p-1.5 rounded-lg bg-brand-subtle text-brand hover:bg-brand hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Label Configuration */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Label Settings</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sticker Dimension</label>
              <select
                value={labelSize}
                onChange={(e) => setLabelSize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-900 cursor-pointer"
              >
                <option value="38x25">38mm x 25mm (Standard Jewelry/Retail)</option>
                <option value="50x30">50mm x 30mm (Large Supermarket)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 font-semibold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  className="rounded text-brand focus:ring-brand/30 cursor-pointer"
                />
                Display Selling Price ($)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSku}
                  onChange={(e) => setShowSku(e.target.checked)}
                  className="rounded text-brand focus:ring-brand/30 cursor-pointer"
                />
                Display Product SKU Code
              </label>
            </div>
          </div>
        </div>

        {/* Selected List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Print Queue ({selectedItems.length})</h3>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedItems.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 font-semibold">No products selected for barcode printing.</p>
            ) : (
              selectedItems.map((item) => (
                <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-mono">Copies:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.printQty}
                        onChange={(e) =>
                          setSelectedItems(
                            selectedItems.map((i) =>
                              i.id === item.id ? { ...i, printQty: parseInt(e.target.value) || 1 } : i
                            )
                          )
                        }
                        className="w-14 px-1.5 py-0.5 rounded border border-slate-300 font-mono text-center font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BarcodePreviewGrid
        selectedItems={selectedItems}
        showSku={showSku}
        showPrice={showPrice}
      />
    </div>
  );
}
