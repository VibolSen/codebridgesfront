'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  getProductsApi,
  getCategoriesApi,
  createProductApi,
  bulkCreateProductsApi,
  updateProductApi,
  deleteProductApi,
} from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Tag,
  Boxes,
  X,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  UploadCloud,
  Download,
  Link,
  RefreshCw,
  HelpCircle,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [sortOption, setSortOption] = useState('created_at_desc');

  // Single Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    selling_price: '',
    cost_price: '',
    category_id: '',
    description: '',
    initial_stock: '100',
  });
  const [saving, setSaving] = useState(false);

  // Bulk Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<'file' | 'google_sheet'>('file');
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [fetchingSheet, setFetchingSheet] = useState(false);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadCategoriesList();
  }, []);

  useEffect(() => {
    loadProducts();
    if (actionParam === 'create') {
      handleOpenCreateModal();
    }
  }, [selectedCategory, stockStatus, sortOption, actionParam]);

  const loadCategoriesList = async () => {
    try {
      const res = await getCategoriesApi();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);

      // Parse sort_by and sort_order from sortOption string
      let sortBy = 'created_at';
      let sortOrder = 'desc';

      if (sortOption === 'name_asc') {
        sortBy = 'name';
        sortOrder = 'asc';
      } else if (sortOption === 'name_desc') {
        sortBy = 'name';
        sortOrder = 'desc';
      } else if (sortOption === 'price_asc') {
        sortBy = 'price';
        sortOrder = 'asc';
      } else if (sortOption === 'price_desc') {
        sortBy = 'price';
        sortOrder = 'desc';
      } else if (sortOption === 'stock_asc') {
        sortBy = 'stock';
        sortOrder = 'asc';
      } else if (sortOption === 'stock_desc') {
        sortBy = 'stock';
        sortOrder = 'desc';
      }

      const res = await getProductsApi(
        1,
        selectedCategory || undefined,
        search || undefined,
        stockStatus || undefined,
        sortBy,
        sortOrder
      );
      setProducts(res.data || []);
    } catch (err: any) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      selling_price: '',
      cost_price: '',
      category_id: categories[0] ? String(categories[0].id) : '',
      description: '',
      initial_stock: '100',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      selling_price: prod.price ? String(prod.price) : '',
      cost_price: prod.cost_price ? String(prod.cost_price) : '',
      category_id: prod.category_id ? String(prod.category_id) : '',
      description: prod.description || '',
      initial_stock: prod.stock_on_hand ? String(prod.stock_on_hand) : '0',
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      if (editingProduct) {
        await updateProductApi(editingProduct.id, {
          name: formData.name,
          selling_price: parseFloat(formData.selling_price),
          cost_price: parseFloat(formData.cost_price || '0'),
          category_id: formData.category_id ? String(formData.category_id) : null,
          description: formData.description,
        });
        setNotification({ type: 'success', message: 'Product updated successfully.' });
      } else {
        await createProductApi({
          name: formData.name,
          sku: formData.sku,
          selling_price: parseFloat(formData.selling_price),
          cost_price: parseFloat(formData.cost_price || '0'),
          category_id: formData.category_id ? String(formData.category_id) : null,
          description: formData.description,
          initial_stock: parseInt(formData.initial_stock || '100', 10),
        });
        setNotification({ type: 'success', message: 'Product created successfully.' });
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save product.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProductApi(id);
      setNotification({ type: 'success', message: 'Product deleted.' });
      loadProducts();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete product.' });
    }
  };

  // --- CSV / Google Sheet Import Logic ---

  const handleDownloadSampleTemplate = () => {
    const csvContent = `name,sku,barcode,selling_price,cost_price,initial_stock,min_reorder_point,category_name,description
Iced Americano,BEV-AME-01,885000000001,2.50,1.20,100,5,Beverages,Cold brew iced coffee
Iced Latte,BEV-LAT-01,885000000002,3.00,1.50,80,5,Beverages,Espresso with fresh milk
Butter Croissant,SNK-CRO-01,885000000003,2.00,0.80,50,5,Bakery,Freshly baked butter croissant`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCsvText = (csvText: string) => {
    const lines = csvText.split(/\r\n|\n/).filter((line) => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));

    const rows: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cleanValues = values.map((v) => v.trim().replace(/^["']|["']$/g, ''));

      const rowData: any = {};
      headers.forEach((header, index) => {
        if (cleanValues[index] !== undefined) {
          rowData[header] = cleanValues[index];
        }
      });

      if (rowData.name || rowData.sku) {
        const isValid = !!(rowData.name && rowData.sku && rowData.selling_price && !isNaN(parseFloat(rowData.selling_price)));
        rows.push({
          ...rowData,
          selling_price: parseFloat(rowData.selling_price || '0'),
          cost_price: parseFloat(rowData.cost_price || '0'),
          initial_stock: parseInt(rowData.initial_stock || '0', 10),
          min_reorder_point: parseInt(rowData.min_reorder_point || '5', 10),
          isValid,
          validationError: !isValid ? 'Missing required fields (name, sku, or valid selling_price)' : null,
        });
      }
    }
    return rows;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCsvText(text);
      setParsedRows(parsed);
    };
    reader.readAsText(file);
  };

  const handleFetchGoogleSheet = async () => {
    if (!googleSheetUrl) {
      setNotification({ type: 'error', message: 'Please enter a Google Sheet URL.' });
      return;
    }

    try {
      setFetchingSheet(true);
      let csvUrl = googleSheetUrl.trim();

      if (csvUrl.includes('docs.google.com/spreadsheets/d/')) {
        const match = csvUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          const sheetId = match[1];
          csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        }
      }

      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error('Failed to fetch Google Sheet. Make sure the sheet is public ("Anyone with link can view") or published to web.');
      }

      const text = await res.text();
      const parsed = parseCsvText(text);
      setParsedRows(parsed);

      if (parsed.length === 0) {
        setNotification({ type: 'error', message: 'No valid rows found in Google Sheet. Check headers.' });
      } else {
        setNotification({ type: 'success', message: `Fetched ${parsed.length} rows from Google Sheet.` });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error fetching Google Sheet.' });
    } finally {
      setFetchingSheet(false);
    }
  };

  const handleConfirmImport = async () => {
    const validItems = parsedRows.filter((r) => r.isValid);
    if (validItems.length === 0) {
      setNotification({ type: 'error', message: 'No valid rows to import.' });
      return;
    }

    try {
      setImporting(true);
      const payload = validItems.map((r) => ({
        name: r.name,
        sku: r.sku,
        barcode: r.barcode || null,
        selling_price: r.selling_price,
        cost_price: r.cost_price,
        initial_stock: r.initial_stock,
        min_reorder_point: r.min_reorder_point,
        category_name: r.category_name || 'General',
        description: r.description || null,
      }));

      const res = await bulkCreateProductsApi(payload);
      setNotification({
        type: 'success',
        message: res.message || `Successfully imported ${res.created_count || validItems.length} products.`,
      });

      setIsImportModalOpen(false);
      setParsedRows([]);
      setGoogleSheetUrl('');
      loadProducts();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to import products.' });
    } finally {
      setImporting(false);
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-orange-500" />
            Product Catalog
          </h1>
          <p className="text-xs text-slate-500">Manage sellable catalog items, SKUs, pricing, and stock levels</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-2 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Import Products
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </motion.button>
        </div>
      </motion.div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Advanced Search, Filtering & Sorting Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col xl:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full xl:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, SKU or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
        </form>

        {/* Filters & Sorting controls */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
            <Boxes className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500">Stock:</span>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="">All Levels</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock Alerts</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Sorting Control */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="name_asc">Name (A &rarr; Z)</option>
              <option value="name_desc">Name (Z &rarr; A)</option>
              <option value="price_asc">Price (Low &rarr; High)</option>
              <option value="price_desc">Price (High &rarr; Low)</option>
              <option value="stock_asc">Stock (Low &rarr; High)</option>
              <option value="stock_desc">Stock (High &rarr; Low)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Product Table List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading catalog items...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No products found matching your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU / Barcode</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">Cost Price</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {products.map((prod, idx) => (
                  <motion.tr
                    key={prod.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {prod.image_url ? (
                            <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{prod.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <p className="text-slate-900 font-bold">{prod.sku}</p>
                      <p className="text-[10px] text-slate-400">{prod.barcode || '—'}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        {prod.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      ${parseFloat(prod.price || '0').toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      ${parseFloat(prod.cost_price || '0').toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          (prod.stock_on_hand || 0) <= 0
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : (prod.stock_on_hand || 0) <= 5
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {prod.stock_on_hand || 0} in stock
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Create / Edit Single Product Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iced Americano"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2.50"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1.20"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Initial Stock</label>
                  <input
                    type="number"
                    disabled={!!editingProduct}
                    placeholder="100"
                    value={formData.initial_stock}
                    onChange={(e) => setFormData({ ...formData, initial_stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  placeholder="Optional product description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- Bulk Product Import Modal (Excel & Google Sheets) --- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Import Products (Excel & Google Sheets)</h3>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setParsedRows([]);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              
              {/* Tab Selector & Download Template */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 text-slate-600 font-semibold">
                  <button
                    onClick={() => setImportTab('file')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      importTab === 'file' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-orange-500" />
                    Excel / CSV File
                  </button>

                  <button
                    onClick={() => setImportTab('google_sheet')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      importTab === 'google_sheet' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5 text-emerald-600" />
                    Google Sheets Link
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5 text-orange-500" />
                  Download Sample Template (.csv)
                </button>
              </div>

              {/* Tab 1: File Upload */}
              {importTab === 'file' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 relative">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-xs mb-1">Click to upload or drag & drop file</p>
                    <p className="text-[11px] text-slate-400">Supports .csv, .xlsx, .xls (CSV formatted template recommended)</p>
                    <input
                      type="file"
                      accept=".csv, .xlsx, .xls, .txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Google Sheets URL */}
              {importTab === 'google_sheet' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">Google Sheets Setup Instructions:</p>
                      <p className="text-[11px] leading-relaxed">
                        1. In Google Sheets, make sure your sheet has standard header columns (`name`, `sku`, `selling_price`, etc.).<br />
                        2. Click <b>Share</b> &rarr; Set permissions to <b>&quot;Anyone with the link can view&quot;</b> (or <b>File &rarr; Share &rarr; Publish to web as CSV</b>).<br />
                        3. Paste the Google Sheet URL below.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Link className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="url"
                        placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=0"
                        value={googleSheetUrl}
                        onChange={(e) => setGoogleSheetUrl(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={fetchingSheet || !googleSheetUrl}
                      onClick={handleFetchGoogleSheet}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      {fetchingSheet ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Fetch Data
                    </button>
                  </div>
                </div>
              )}

              {/* Data Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Parsed Preview ({parsedRows.length} items found)</span>
                    <span className="text-emerald-600">
                      {parsedRows.filter((r) => r.isValid).length} Ready to Import
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-500 uppercase text-[9px] sticky top-0">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">SKU</th>
                          <th className="p-2">Price ($)</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Initial Stock</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {parsedRows.map((r, i) => (
                          <tr key={i} className={r.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/50'}>
                            <td className="p-2 text-slate-400">{i + 1}</td>
                            <td className="p-2 font-bold text-slate-900">{r.name || '—'}</td>
                            <td className="p-2 font-mono">{r.sku || '—'}</td>
                            <td className="p-2 font-mono">${parseFloat(r.selling_price || 0).toFixed(2)}</td>
                            <td className="p-2">{r.category_name || 'General'}</td>
                            <td className="p-2 font-mono">{r.initial_stock || 0}</td>
                            <td className="p-2">
                              {r.isValid ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                  <CheckCircle2 className="w-3 h-3" /> Valid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700" title={r.validationError}>
                                  <AlertCircle className="w-3 h-3" /> Invalid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {parsedRows.length > 0 ? `${parsedRows.filter((r) => r.isValid).length} valid items ready` : 'No data loaded yet'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={importing || parsedRows.filter((r) => r.isValid).length === 0}
                  onClick={handleConfirmImport}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {importing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                  Confirm & Import
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
