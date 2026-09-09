'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  UserPlus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  getSuppliersApi,
  createSupplierApi,
  updateSupplierApi,
  deleteSupplierApi,
} from '@/lib/api';
import { SupplierModal } from './SupplierModal';
import { SupplierMetricsCards } from './SupplierMetricsCards';
import { SupplierCardGrid } from './SupplierCardGrid';

export const SuperAdminSuppliersView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const res = await getSuppliersApi(search || undefined);
      setSuppliers(res.data || []);
    } catch (err: any) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSuppliers();
  };

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sup: any) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      contact_name: sup.contact_name || '',
      email: sup.email || '',
      phone: sup.phone || '',
      address: sup.address || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      if (editingSupplier) {
        await updateSupplierApi(editingSupplier.id, {
          name: formData.name,
          contact_name: formData.contact_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        });
        setNotification({ type: 'success', message: 'Supplier updated successfully' });
      } else {
        await createSupplierApi({
          name: formData.name,
          contact_name: formData.contact_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        });
        setNotification({ type: 'success', message: 'New supplier added to directory' });
      }

      setIsModalOpen(false);
      loadSuppliers();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Operation failed. Check server connection.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSupplier = async (sup: any) => {
    if (!confirm(`Are you sure you want to remove supplier "${sup.name}"?`)) return;

    try {
      setLoading(true);
      await deleteSupplierApi(sup.id);
      setNotification({ type: 'success', message: 'Supplier removed' });
      loadSuppliers();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to remove supplier.',
      });
      setLoading(false);
    }
  };

  const totalSuppliers = suppliers.length;

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
            <UserCheck className="w-6 h-6 text-indigo-500" />
            Wholesale Vendor &amp; Supplier Directory
          </h1>
          <p className="text-xs text-slate-500">
            Maintain B2B vendor contacts, procurement supply chain addresses, and purchase history
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Supplier
        </motion.button>
      </motion.div>

      {/* Metrics Cards */}
      <SupplierMetricsCards totalSuppliers={totalSuppliers} />

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
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor name, contact, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
        </form>
      </div>

      {/* Suppliers Grid */}
      <SupplierCardGrid
        suppliers={suppliers}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteSupplier}
      />

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingSupplier={editingSupplier}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveSupplier}
        saving={saving}
      />
    </div>
  );
};
