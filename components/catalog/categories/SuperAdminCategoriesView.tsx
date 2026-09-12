'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Tag, Plus, Search, Layers, X, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { CategoryItem, CategoryFormData } from './types';
import { CategoryModal } from './CategoryModal';
import { CategoryTable } from './CategoryTable';

function CategoriesContent() {
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [parentCategories, setParentCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', parent_id: '' });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const urlType = searchParams.get('type') || '';
    setTypeFilter(urlType);
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
    loadParentOptions();
  }, [typeFilter]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategoriesApi(typeFilter || undefined, search || undefined);
      setCategories(res.data || []);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadParentOptions = async () => {
    try {
      const res = await getCategoriesApi('main');
      setParentCategories(res.data || []);
    } catch (err: any) {
      console.error('Failed to load parent categories:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCategories();
  };

  const handleOpenCreateModal = (isSub: boolean = false) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      parent_id: isSub && parentCategories[0] ? String(parentCategories[0].id) : '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      parent_id: cat.parent_id ? String(cat.parent_id) : '',
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, {
          name: formData.name,
          parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
        });
        setNotification({ type: 'success', message: 'Category updated successfully.' });
      } else {
        await createCategoryApi({
          name: formData.name,
          parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
        });
        setNotification({ type: 'success', message: 'Category created successfully.' });
      }

      setIsModalOpen(false);
      loadCategories();
      loadParentOptions();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save category.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await deleteCategoryApi(id);
      setNotification({ type: 'success', message: `Category "${name}" deleted.` });
      loadCategories();
      loadParentOptions();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete category.' });
    }
  };

  const mainCatCount = categories.filter((c) => !c.parent_id).length;
  const subCatCount = categories.filter((c) => c.parent_id).length;
  const totalProductsAssigned = categories.reduce((sum, c) => sum + (c.products_count || 0), 0);

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
            <Tag className="w-6 h-6 text-brand" />
            Categories &amp; Sub-Categories Management
          </h1>
          <p className="text-xs text-slate-500">Organize catalog items into main categories and nested sub-categories</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenCreateModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-brand" />
            Add Sub-Category
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenCreateModal(false)}
            className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover active:bg-brand-active text-white font-bold text-xs shadow-md shadow-brand/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Main Category
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{mainCatCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Main Categories</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{subCatCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Sub-Categories</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalProductsAssigned}</h4>
            <p className="text-xs text-slate-500 font-medium">Categorized Products</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

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
          <button onClick={() => setNotification(null)} className="cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search category name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </form>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({categories.length})
          </button>
          <button
            onClick={() => setTypeFilter('main')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'main' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Main Categories
          </button>
          <button
            onClick={() => setTypeFilter('sub')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'sub' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sub-Categories
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <CategoryTable
          categories={categories}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCategory}
        />
      </div>

      <CategoryModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCategory={editingCategory}
        formData={formData}
        setFormData={setFormData}
        parentCategories={parentCategories}
        onSave={handleSaveCategory}
        saving={saving}
      />
    </div>
  );
}

export function SuperAdminCategoriesView() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading categories...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
