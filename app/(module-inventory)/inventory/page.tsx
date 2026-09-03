'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  InventoryKpiCards,
  WarehouseLevelsMatrix,
  PurchaseOrdersQueueCard,
  InterWarehouseTransfersCard,
  LowStockAlertsTable,
  ProductCatalogTable,
  AddProductModal,
  SuppliersDirectoryTable,
  StocktakeAdjustmentsCard,
  FifoValuationCard,
  InventoryRbacCard,
  InventorySettingsCard,
} from '@/components/inventory-suite';
import {
  Plus,
  Truck,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import { getSuppliersApi, getProductsApi, getCategoriesApi } from '@/lib/api';

function InventoryDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'overview';

  // Live Data State
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  // In-Page Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productSuccess, setProductSuccess] = useState<string | null>(null);

  async function loadProductsData() {
    try {
      setLoadingProducts(true);
      const res = await getProductsApi();
      const list = Array.isArray(res) ? res : res?.data || [];
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products in inventory:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
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

  async function loadSuppliersData() {
    try {
      setLoadingSuppliers(true);
      const res = await getSuppliersApi();
      const data = Array.isArray(res) ? res : res?.data || [];
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
      setSuppliers([]);
    } finally {
      setLoadingSuppliers(false);
    }
  }

  useEffect(() => {
    if (currentTab === 'products' || currentTab === 'overview') {
      loadProductsData();
      loadCategoriesData();
    }
    if (currentTab === 'suppliers') {
      loadSuppliersData();
    }
  }, [currentTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Toast Notification */}
      {productSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{productSuccess}</span>
          </div>
          <button onClick={() => setProductSuccess(null)} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-[#5B4DFB] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Multi-Warehouse &amp; Procurement Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Inventory &amp; Supply Chain Operations
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 font-medium leading-relaxed max-w-2xl">
            Real-time stock valuation across storage hubs, inter-warehouse transit tracking, PO 3-way matching, and automated replenishment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => {
              loadCategoriesData();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-[#5B4DFB] font-extrabold text-xs shadow-sm hover:bg-purple-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#5B4DFB]" />
            <span>Add Product</span>
          </button>
          <Link
            href="/super-admin/inventory/purchase-orders"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Create PO</span>
          </Link>
          <Link
            href="/super-admin/inventory/transfer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Transfer Stock</span>
          </Link>
        </div>
      </div>

      {/* 2. Overview / Tab Rendering */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <InventoryKpiCards />
          <WarehouseLevelsMatrix />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PurchaseOrdersQueueCard />
            <InterWarehouseTransfersCard />
          </div>
          <LowStockAlertsTable />
        </div>
      )}

      {/* Tab: Products & SKUs Catalog */}
      {currentTab === 'products' && (
        <ProductCatalogTable
          products={products}
          loading={loadingProducts}
          onOpenAddModal={() => {
            loadCategoriesData();
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Tab: Warehouse Stock Levels */}
      {currentTab === 'warehouses' && (
        <div className="space-y-6">
          <WarehouseLevelsMatrix />
          <LowStockAlertsTable />
        </div>
      )}

      {/* Tab: Inter-Warehouse Transfers */}
      {currentTab === 'transfers' && (
        <div className="space-y-6">
          <InterWarehouseTransfersCard />
        </div>
      )}

      {/* Tab: Purchase Orders */}
      {currentTab === 'pos' && (
        <div className="space-y-6">
          <PurchaseOrdersQueueCard />
          <LowStockAlertsTable />
        </div>
      )}

      {/* Tab: Approved Suppliers Directory */}
      {currentTab === 'suppliers' && (
        <SuppliersDirectoryTable
          suppliers={suppliers}
          loading={loadingSuppliers}
        />
      )}

      {/* Tab: Stocktake & Adjustments */}
      {currentTab === 'adjustments' && <StocktakeAdjustmentsCard />}

      {/* Tab: FIFO Valuation Reports */}
      {currentTab === 'reports' && <FifoValuationCard />}

      {/* Tab: Inventory Access & RBAC */}
      {currentTab === 'access' && <InventoryRbacCard />}

      {/* Tab: Inventory Settings */}
      {currentTab === 'settings' && <InventorySettingsCard />}

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

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-[#5B4DFB]" />
            <span>Loading Inventory Suite...</span>
          </div>
        </div>
      }
    >
      <InventoryDashboardContent />
    </Suspense>
  );
}
