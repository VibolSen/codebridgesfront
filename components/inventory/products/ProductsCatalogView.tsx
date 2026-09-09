'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { ProductCatalogTable } from './ProductCatalogTable';
import { AddProductModal } from './AddProductModal';
import { getProductsApi, getCategoriesApi } from '@/lib/api';

export function ProductsCatalogView() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In-Page Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productSuccess, setProductSuccess] = useState<string | null>(null);

  async function loadProductsData() {
    try {
      setLoading(true);
      const res = await getProductsApi();
      const list = Array.isArray(res) ? res : res?.data || [];
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategoriesData() {
    try {
      const res = await getCategoriesApi();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCategories(list);
    } catch (err) {
      console.warn('Failed to load categories:', err);
    }
  }

  useEffect(() => {
    loadProductsData();
    loadCategoriesData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-900 pb-16">
      {/* 1. Success Toast Notification */}
      {productSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{productSuccess}</span>
          </div>
          <button
            onClick={() => setProductSuccess(null)}
            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Interactive Product Catalog Table */}
      <ProductCatalogTable
        products={products}
        categories={categories}
        loading={loading}
        onOpenAddModal={() => {
          loadCategoriesData();
          setIsAddModalOpen(true);
        }}
      />

      {/* 3. Reusable In-Page Dynamic Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onProductCreated={(productName) => {
          setProductSuccess(`Product "${productName}" successfully created & added to inventory!`);
          setTimeout(() => setProductSuccess(null), 3500);
          loadProductsData();
        }}
      />
    </div>
  );
}
