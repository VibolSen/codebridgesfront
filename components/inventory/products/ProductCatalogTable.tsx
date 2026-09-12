'use client';

import React from 'react';
import { Package, Plus, Loader2, RotateCcw } from 'lucide-react';
import { ProductCatalogStats } from './ProductCatalogStats';
import { ProductCatalogToolbar } from './ProductCatalogToolbar';
import { ProductCatalogFilterChips } from './ProductCatalogFilterChips';
import { ProductCatalogTableHeader } from './ProductCatalogTableHeader';
import { ProductCatalogTableRow } from './ProductCatalogTableRow';
import { ProductCatalogPagination } from './ProductCatalogPagination';
import { useProductCatalog } from './useProductCatalog';

interface ProductCatalogTableProps {
  products: any[];
  categories?: any[];
  loading: boolean;
  onOpenAddModal: () => void;
  onEditProduct?: (product: any) => void;
  onDeleteProduct?: (product: any) => void;
}

export function ProductCatalogTable({
  products,
  categories = [],
  loading,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
}: ProductCatalogTableProps) {
  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    stockStatus,
    setStockStatus,
    sortKey,
    sortOrder,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    categoryOptions,
    stats,
    handleSort,
    handleSortPresetChange,
    handleResetFilters,
    hasActiveFilters,
    totalItems,
    totalPages,
    validCurrentPage,
    paginatedProducts,
    currentSortPreset,
  } = useProductCatalog(products, categories);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 font-sans">
      {/* 1. Header & Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-subtle flex items-center justify-center text-brand">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>Products &amp; SKUs Catalog</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-subtle text-brand border border-brand/20">
                {products.length} SKUs
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time stock valuation, unit costs, selling prices, and reorder buffer thresholds
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl font-black text-xs shadow-md shadow-brand/20 transition-all flex items-center gap-1.5 cursor-pointer self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. Interactive KPI Filter Badges */}
      <ProductCatalogStats
        stats={stats}
        currentStatus={stockStatus}
        onSelectStatus={(status) => {
          setStockStatus(status);
          setCurrentPage(1);
        }}
      />

      {/* 3. Search, Filter & Sort Toolbar */}
      <ProductCatalogToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onClearSearch={() => {
          setSearch('');
          setCurrentPage(1);
        }}
        categories={categoryOptions}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
        totalProductsCount={products.length}
        stockStatus={stockStatus}
        onSelectStockStatus={(status) => {
          setStockStatus(status);
          setCurrentPage(1);
        }}
        stats={stats}
        currentSortPreset={currentSortPreset}
        onSortPresetChange={handleSortPresetChange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Active Filter Chips */}
      <ProductCatalogFilterChips
        search={search}
        onClearSearch={() => {
          setSearch('');
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onClearCategory={() => {
          setSelectedCategory('all');
          setCurrentPage(1);
        }}
        stockStatus={stockStatus}
        onClearStockStatus={() => {
          setStockStatus('all');
          setCurrentPage(1);
        }}
        totalFiltered={totalItems}
        totalProducts={products.length}
      />

      {/* 5. Products Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table className="w-full text-xs">
          <ProductCatalogTableHeader
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-slate-400 font-medium">
                  <Loader2 className="w-7 h-7 animate-spin mx-auto text-brand mb-2.5" />
                  <span className="font-semibold text-slate-600">Loading live catalog products &amp; SKUs...</span>
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-slate-400 font-medium space-y-2">
                  <Package className="w-9 h-9 mx-auto text-slate-300 mb-1" />
                  <p className="font-extrabold text-slate-700 text-sm">No Matching Products Found</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {hasActiveFilters
                      ? 'No products matched your search query or filter criteria. Try adjusting or clearing your filters.'
                      : 'No catalog products available yet. Click "Add Product" above to create your first item.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-subtle text-brand hover:bg-brand/20 font-bold text-xs transition-colors cursor-pointer border border-brand/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear All Filters</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p: any) => (
                <ProductCatalogTableRow
                  key={p.id}
                  product={p}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 6. Pagination & Row Limits */}
      <ProductCatalogPagination
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        currentPage={validCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
