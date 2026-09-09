'use client';

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  useProductsManager,
  ProductFilterBar,
  ProductTable,
  ProductModal,
  ProductImportModal,
} from './';

function ProductsContent() {
  const m = useProductsManager();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {m.notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold shadow-sm ${
              m.notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {m.notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {m.notification.message}
            </div>
            <button
              type="button"
              onClick={() => m.setNotification(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter & Metric Bar */}
      <ProductFilterBar
        productsCount={m.products.length}
        categories={m.categories}
        search={m.search}
        setSearch={m.setSearch}
        selectedCategory={m.selectedCategory}
        setSelectedCategory={m.setSelectedCategory}
        stockStatus={m.stockStatus}
        setStockStatus={m.setStockStatus}
        sortOption={m.sortOption}
        setSortOption={m.setSortOption}
        onOpenCreateModal={m.handleOpenCreateModal}
        onOpenImportModal={() => m.setIsImportModalOpen(true)}
        onSearchSubmit={(e) => {
          e.preventDefault();
          m.loadProducts();
        }}
      />

      {/* Products Table */}
      <ProductTable
        products={m.products}
        loading={m.loading}
        onEdit={m.handleOpenEditModal}
        onDelete={m.handleDeleteProduct}
      />

      {/* Create / Edit Single Product Modal */}
      <ProductModal
        isOpen={m.isModalOpen}
        onClose={() => m.setIsModalOpen(false)}
        editingProduct={m.editingProduct}
        formData={m.formData}
        setFormData={m.setFormData}
        categories={m.categories}
        onSave={m.handleSaveProduct}
        saving={m.saving}
      />

      {/* Bulk Import Modal */}
      <ProductImportModal
        isOpen={m.isImportModalOpen}
        onClose={() => m.setIsImportModalOpen(false)}
        importTab={m.importTab}
        setImportTab={m.setImportTab}
        googleSheetUrl={m.googleSheetUrl}
        setGoogleSheetUrl={m.setGoogleSheetUrl}
        fetchingSheet={m.fetchingSheet}
        parsedRows={m.parsedRows}
        importing={m.importing}
        onDownloadTemplate={m.handleDownloadSampleTemplate}
        onFileUpload={m.handleFileUpload}
        onFetchGoogleSheet={m.handleFetchGoogleSheet}
        onExecuteImport={m.handleExecuteBulkImport}
      />
    </div>
  );
}

export function SuperAdminProductsView() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400 font-bold">
          Loading catalog management...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
