'use client';

import { useState, useEffect } from 'react';
import { getBrandsApi, createBrandApi, updateBrandApi, deleteBrandApi } from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Award,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react';
import { BrandItem, BrandFormData } from './types';
import { BrandModal } from './BrandModal';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: 'easeOut' as const },
  }),
};

export function SuperAdminBrandsView() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await getBrandsApi(search || undefined);
      setBrands(res.data || []);
    } catch (err: any) {
      console.error('Failed to load brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBrands();
  };

  const handleOpenCreateModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: BrandItem) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      if (editingBrand) {
        await updateBrandApi(editingBrand.id, {
          name: formData.name,
          description: formData.description,
        });
        setNotification({ type: 'success', message: 'Brand updated successfully.' });
      } else {
        await createBrandApi({
          name: formData.name,
          description: formData.description,
        });
        setNotification({ type: 'success', message: 'Brand created successfully.' });
      }

      setIsModalOpen(false);
      loadBrands();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save brand.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"?`)) return;
    try {
      await deleteBrandApi(id);
      setNotification({ type: 'success', message: `Brand "${name}" deleted.` });
      loadBrands();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete brand.' });
    }
  };

  const totalBrandsCount = brands.length;
  const totalProductsAssigned = brands.reduce((sum, b) => sum + (b.products_count || 0), 0);

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
            <Award className="w-6 h-6 text-brand" />
            Brands Management
          </h1>
          <p className="text-xs text-slate-500">Manage manufacturer and supplier product brands</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover active:bg-brand-active text-white font-bold text-xs shadow-md shadow-brand/20 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Brand
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalBrandsCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Total Registered Brands</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalProductsAssigned}</h4>
            <p className="text-xs text-slate-500 font-medium">Branded Products</p>
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

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </form>
      </div>

      {/* Brands Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading brands...
          </div>
        ) : brands.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No product brands found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Brand Name</th>
                  <th className="py-3.5 px-4">URL Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Products Assigned</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {brands.map((brand, idx) => (
                  <motion.tr
                    key={brand.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="hover:bg-brand-subtle/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-brand shrink-0" />
                        <span>{brand.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {brand.slug}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {brand.description || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono">
                      {brand.products_count || 0}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(brand)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-subtle transition-colors cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand.id, brand.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete Brand"
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

      <BrandModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingBrand={editingBrand}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveBrand}
        saving={saving}
      />
    </div>
  );
}
