'use client';

import React, { useState, useMemo } from 'react';
import { Package, Plus, Loader2, RotateCcw } from 'lucide-react';
import {
  SortKey,
  SortOrder,
  StockStatusFilter,
  CategoryOption,
  ProductStats,
} from './types';
import { ProductCatalogStats } from './ProductCatalogStats';
import { ProductCatalogToolbar } from './ProductCatalogToolbar';
import { ProductCatalogFilterChips } from './ProductCatalogFilterChips';
import { ProductCatalogTableHeader } from './ProductCatalogTableHeader';
import { ProductCatalogTableRow } from './ProductCatalogTableRow';
import { ProductCatalogPagination } from './ProductCatalogPagination';

interface ProductCatalogTableProps {
  products: any[];
  categories?: any[];
  loading: boolean;
  onOpenAddModal: () => void;
}

export function ProductCatalogTable({
  products,
  categories = [],
  loading,
  onOpenAddModal,
}: ProductCatalogTableProps) {
  // Filter & Search States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockStatus, setStockStatus] = useState<StockStatusFilter>('all');

  // Sorting States
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Derive unique categories from both categories prop and products list
  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const map = new Map<string, CategoryOption>();

    // From categories prop
    categories.forEach((cat: any) => {
      const name = cat.name || cat.title;
      if (name) {
        map.set(name.toLowerCase(), { id: String(cat.id || name), name, count: 0 });
      }
    });

    // Count products per category
    products.forEach((p: any) => {
      const catName = p.category_name || p.category?.name || p.category || 'Uncategorized';
      const key = catName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { id: key, name: catName, count: 0 });
      }
      const item = map.get(key)!;
      item.count += 1;
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, products]);

  // Overall KPI counts
  const stats = useMemo<ProductStats>(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach((p: any) => {
      const stock = parseFloat(p.stock_on_hand || '0');
      const minBuffer = parseInt(p.min_reorder_point || '5', 10);
      if (stock <= 0) {
        outOfStock++;
      } else if (stock <= minBuffer) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    return {
      total: products.length,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // Handle column header sort toggle
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'stock' || key === 'cost_price' || key === 'selling_price' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    // 1. Filter
    const filtered = products.filter((p: any) => {
      // Search text match
      if (q) {
        const name = (p.name || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const barcode = (p.barcode || '').toLowerCase();
        const cat = (p.category_name || p.category?.name || p.category || '').toLowerCase();
        if (!name.includes(q) && !sku.includes(q) && !barcode.includes(q) && !cat.includes(q)) {
          return false;
        }
      }

      // Category filter match
      if (selectedCategory !== 'all') {
        const catName = (p.category_name || p.category?.name || p.category || 'Uncategorized').toLowerCase();
        if (catName !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Stock status match
      if (stockStatus !== 'all') {
        const stock = parseFloat(p.stock_on_hand || '0');
        const minBuffer = parseInt(p.min_reorder_point || '5', 10);
        if (stockStatus === 'out_of_stock' && stock > 0) return false;
        if (stockStatus === 'low_stock' && (stock <= 0 || stock > minBuffer)) return false;
        if (stockStatus === 'in_stock' && stock <= minBuffer) return false;
      }

      return true;
    });

    // 2. Sort
    filtered.sort((a: any, b: any) => {
      let valA: any;
      let valB: any;

      switch (sortKey) {
        case 'name':
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

        case 'sku':
          valA = (a.sku || '').toLowerCase();
          valB = (b.sku || '').toLowerCase();
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

        case 'category':
          valA = (a.category_name || a.category?.name || a.category || '').toLowerCase();
          valB = (b.category_name || b.category?.name || b.category || '').toLowerCase();
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

        case 'stock':
          valA = parseFloat(a.stock_on_hand || '0');
          valB = parseFloat(b.stock_on_hand || '0');
          return sortOrder === 'asc' ? valA - valB : valB - valA;

        case 'cost_price':
          valA = parseFloat(a.cost_price || '0');
          valB = parseFloat(b.cost_price || '0');
          return sortOrder === 'asc' ? valA - valB : valB - valA;

        case 'selling_price':
          valA = parseFloat(a.selling_price || a.price || '0');
          valB = parseFloat(b.selling_price || b.price || '0');
          return sortOrder === 'asc' ? valA - valB : valB - valA;

        case 'min_buffer':
          valA = parseInt(a.min_reorder_point || '5', 10);
          valB = parseInt(b.min_reorder_point || '5', 10);
          return sortOrder === 'asc' ? valA - valB : valB - valA;

        default:
          return 0;
      }
    });

    return filtered;
  }, [products, search, selectedCategory, stockStatus, sortKey, sortOrder]);

  // Pagination calculation
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedProducts, validCurrentPage, pageSize]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setStockStatus('all');
    setSortKey('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const hasActiveFilters = search.trim() !== '' || selectedCategory !== 'all' || stockStatus !== 'all';

  // Sort preset dropdown handler
  const handleSortPresetChange = (preset: string) => {
    switch (preset) {
      case 'name_asc':
        setSortKey('name');
        setSortOrder('asc');
        break;
      case 'name_desc':
        setSortKey('name');
        setSortOrder('desc');
        break;
      case 'sku_asc':
        setSortKey('sku');
        setSortOrder('asc');
        break;
      case 'stock_asc':
        setSortKey('stock');
        setSortOrder('asc');
        break;
      case 'stock_desc':
        setSortKey('stock');
        setSortOrder('desc');
        break;
      case 'selling_price_desc':
        setSortKey('selling_price');
        setSortOrder('desc');
        break;
      case 'selling_price_asc':
        setSortKey('selling_price');
        setSortOrder('asc');
        break;
      case 'cost_price_desc':
        setSortKey('cost_price');
        setSortOrder('desc');
        break;
      case 'cost_price_asc':
        setSortKey('cost_price');
        setSortOrder('asc');
        break;
    }
    setCurrentPage(1);
  };

  const currentSortPreset = `${sortKey}_${sortOrder}`;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 font-sans">
      {/* 1. Header & Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#5B4DFB]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>Products &amp; SKUs Catalog</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5B4DFB]">
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
          className="px-4 py-2 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-black text-xs shadow-md shadow-[#5B4DFB]/20 transition-all flex items-center gap-1.5 cursor-pointer self-start lg:self-auto"
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
                  <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#5B4DFB] mb-2.5" />
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
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#5B4DFB] hover:bg-purple-100 font-bold text-xs transition-colors cursor-pointer border border-purple-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear All Filters</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p: any) => (
                <ProductCatalogTableRow key={p.id} product={p} />
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
