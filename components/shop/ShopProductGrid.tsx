'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

export interface ShopProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  image?: string;
}

interface ShopProductGridProps {
  products: ShopProduct[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
  onAddToCart: (product: ShopProduct) => void;
}

export const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  loading,
  onAddToCart,
}) => {
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading storefront catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center space-y-2">
          <p className="text-base font-bold text-slate-300">No products found</p>
          <p className="text-xs text-slate-500">Try searching for a different item or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              className="bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-md group"
            >
              <div className="w-full h-32 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600 font-mono font-bold text-xs uppercase group-hover:scale-105 transition-transform">
                {p.sku}
              </div>

              <div>
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                  {p.category}
                </span>
                <h3 className="font-bold text-xs text-white line-clamp-1 mt-0.5">{p.name}</h3>
                <p className="text-base font-extrabold text-white mt-1">${p.price.toFixed(2)}</p>
              </div>

              <button
                onClick={() => onAddToCart(p)}
                className="w-full py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-sm shadow-brand/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add to Order
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
