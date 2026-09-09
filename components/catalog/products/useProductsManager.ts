'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getProductsApi,
  getCategoriesApi,
  createProductApi,
  bulkCreateProductsApi,
  updateProductApi,
  deleteProductApi,
} from '@/lib/api';

export function useProductsManager() {
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

  useEffect(() => {
    loadCategoriesList();
  }, []);

  useEffect(() => {
    loadProducts();
    if (actionParam === 'create') {
      handleOpenCreateModal();
    }
  }, [selectedCategory, stockStatus, sortOption, actionParam]);

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
        if (cleanValues[index] !== undefined) rowData[header] = cleanValues[index];
      });
      if (rowData.name) rows.push(rowData);
    }
    return rows;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const rows = parseCsvText(content);
        setParsedRows(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleFetchGoogleSheet = async () => {
    if (!googleSheetUrl) return;
    try {
      setFetchingSheet(true);
      const match = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match || !match[1]) {
        alert('Invalid Google Sheet URL. Please ensure it is publicly shared.');
        return;
      }
      const sheetId = match[1];
      const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      const res = await fetch(exportUrl);
      if (!res.ok) throw new Error('Could not fetch Google Sheet. Make sure the sheet is public.');
      const csvText = await res.text();
      const rows = parseCsvText(csvText);
      setParsedRows(rows);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch Google Sheet.');
    } finally {
      setFetchingSheet(false);
    }
  };

  const handleExecuteBulkImport = async () => {
    if (parsedRows.length === 0) return;
    try {
      setImporting(true);
      const mapped = parsedRows.map((r) => ({
        name: r.name,
        sku: r.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        selling_price: parseFloat(r.selling_price || r.price || '0'),
        cost_price: parseFloat(r.cost_price || '0'),
        initial_stock: parseInt(r.initial_stock || r.stock || '100', 10),
        category_name: r.category_name || r.category || 'General',
        description: r.description || '',
      }));
      await bulkCreateProductsApi(mapped);
      setNotification({ type: 'success', message: `Imported ${mapped.length} products!` });
      setIsImportModalOpen(false);
      setParsedRows([]);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  return {
    products,
    categories,
    loading,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    stockStatus,
    setStockStatus,
    sortOption,
    setSortOption,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    formData,
    setFormData,
    saving,
    isImportModalOpen,
    setIsImportModalOpen,
    importTab,
    setImportTab,
    googleSheetUrl,
    setGoogleSheetUrl,
    fetchingSheet,
    parsedRows,
    setParsedRows,
    importing,
    notification,
    setNotification,
    loadProducts,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleSaveProduct,
    handleDeleteProduct,
    handleDownloadSampleTemplate,
    handleFileUpload,
    handleFetchGoogleSheet,
    handleExecuteBulkImport,
  };
}
