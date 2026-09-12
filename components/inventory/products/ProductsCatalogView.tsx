'use client';

import React, { useState, useEffect } from 'react';
import { ProductCatalogTable } from './ProductCatalogTable';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';
import { getProductsApi, getCategoriesApi, deleteProductApi } from '@/lib/api';
import { useToast, useConfirm } from '@/components/common';

export function ProductsCatalogView() {
  const toast = useToast();
  const confirm = useConfirm();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In-Page Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

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

  const handleDeleteProduct = async (product: any) => {
    const confirmed = await confirm({
      title: 'Delete Product SKU',
      description: `Are you sure you want to permanently delete "${product.name}" from the product catalog? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete SKU',
      details: [
        { label: 'Product Name', value: product.name },
        { label: 'SKU', value: product.sku || 'N/A' },
        { label: 'Barcode', value: product.barcode || 'N/A' },
        { label: 'Stock on Hand', value: `${Math.floor(parseFloat(product.stock_on_hand || '0'))} units` },
      ],
    });

    if (!confirmed) return;

    try {
      await deleteProductApi(product.id);
      toast.success(`Product "${product.name}" was successfully deleted.`);
      loadProductsData();
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error(err?.message || 'Failed to delete product SKU.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-900 pb-16">
      {/* 1. Interactive Product Catalog Table */}
      <ProductCatalogTable
        products={products}
        categories={categories}
        loading={loading}
        onOpenAddModal={() => {
          loadCategoriesData();
          setIsAddModalOpen(true);
        }}
        onEditProduct={(p) => {
          loadCategoriesData();
          setEditingProduct(p);
        }}
        onDeleteProduct={handleDeleteProduct}
      />

      {/* 2. Reusable In-Page Dynamic Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onProductCreated={(productName) => {
          toast.success(`Product "${productName}" successfully created & added to inventory!`);
          loadProductsData();
        }}
      />

      {/* 3. In-Page Dynamic Edit Product Modal */}
      <EditProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        categories={categories}
        onProductUpdated={(productName) => {
          toast.success(`Product "${productName}" details updated successfully!`);
          loadProductsData();
        }}
      />
    </div>
  );
}
