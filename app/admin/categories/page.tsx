'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Tag,
  Plus,
  Search,
  Layers,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  Package,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<any[]>([]);
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
  });
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

  const handleOpenEditModal = (cat: any) => {
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
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
            <Tag className="w-6 h-6 text-orange-500" />
            Categories & Sub-Categories Management
          </h1>
          <p className="text-xs text-slate-500">Organize catalog items into main categories and nested sub-categories</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenCreateModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-orange-500" />
            Add Sub-Category
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenCreateModal(false)}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
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
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
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
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
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
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({categories.length})
          </button>
          <button
            onClick={() => setTypeFilter('main')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'main' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Main Categories
          </button>
          <button
            onClick={() => setTypeFilter('sub')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'sub' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sub-Categories
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">URL Slug</th>
                  <th className="py-3.5 px-4">Type / Parent</th>
                  <th className="py-3.5 px-4 text-right">Products Assigned</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {categories.map((cat, idx) => {
                  const isSub = !!cat.parent_id;

                  return (
                    <motion.tr
                      key={cat.id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          {isSub ? (
                            <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                          ) : (
                            <Tag className="w-4 h-4 text-orange-500 shrink-0" />
                          )}
                          <span>{cat.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {cat.slug}
                      </td>

                      <td className="py-3.5 px-4">
                        {isSub ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Sub-Category of {cat.parent_name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                            Main Category
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono">
                        {cat.products_count || 0}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
                            title="Edit Category"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editingCategory ? 'Edit Category' : formData.parent_id ? 'Add New Sub-Category' : 'Add New Main Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Beverages, Dairy, Snacks..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Category (Leave blank for Main Category)</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">None (Main Category)</option>
                  {parentCategories.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
