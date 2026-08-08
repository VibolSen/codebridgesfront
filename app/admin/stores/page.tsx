'use client';

import { useState, useEffect } from 'react';
import { getOutletsApi, createOutletApi, updateOutletApi, deleteOutletApi } from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Users,
  Monitor,
  Receipt,
  Power,
} from 'lucide-react';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phone: '',
    address: '',
    receipt_header: 'Thank you for shopping at Dreams POS!',
    receipt_footer: 'Please visit us again soon!',
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const res = await getOutletsApi(search || undefined);
      setStores(res.data || []);
    } catch (err: any) {
      console.error('Failed to load store outlets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStores();
  };

  const handleOpenCreateModal = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      code: 'STORE-' + Math.floor(100 + Math.random() * 900),
      phone: '',
      address: '',
      receipt_header: 'Thank you for shopping at Dreams POS!',
      receipt_footer: 'Please visit us again soon!',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (st: any) => {
    setEditingStore(st);
    setFormData({
      name: st.name,
      code: st.code,
      phone: st.phone || '',
      address: st.address || '',
      receipt_header: st.receipt_header || 'Thank you for shopping at Dreams POS!',
      receipt_footer: st.receipt_footer || 'Please visit us again soon!',
    });
    setIsModalOpen(true);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      if (editingStore) {
        await updateOutletApi(editingStore.id, {
          name: formData.name,
          phone: formData.phone || null,
          address: formData.address || null,
          receipt_header: formData.receipt_header,
          receipt_footer: formData.receipt_footer,
        });
        setNotification({ type: 'success', message: 'Store outlet updated successfully.' });
      } else {
        await createOutletApi({
          name: formData.name,
          code: formData.code,
          phone: formData.phone || null,
          address: formData.address || null,
          receipt_header: formData.receipt_header,
          receipt_footer: formData.receipt_footer,
        });
        setNotification({ type: 'success', message: 'Store outlet registered successfully.' });
      }

      setIsModalOpen(false);
      loadStores();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save store.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateStore = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to deactivate store outlet "${name}"?`)) return;
    try {
      await deleteOutletApi(id);
      setNotification({ type: 'success', message: `Store outlet "${name}" deactivated.` });
      loadStores();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to deactivate store.' });
    }
  };

  const totalStoresCount = stores.length;
  const activeStoresCount = stores.filter((s) => s.is_active).length;

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
            <Building2 className="w-6 h-6 text-orange-500" />
            Stores & Outlets Management
          </h1>
          <p className="text-xs text-slate-500">Manage multi-store locations, POS register terminals, and printed receipt customizations</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Store Outlet
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalStoresCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Registered Store Outlets</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-emerald-600">{activeStoresCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Active Operating Locations</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
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

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search store name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>
      </div>

      {/* Stores Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading store outlets...
          </div>
        ) : stores.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No store outlets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Outlet Name</th>
                  <th className="py-3.5 px-4">Store Code</th>
                  <th className="py-3.5 px-4">Address & Phone</th>
                  <th className="py-3.5 px-4 text-center">Registers</th>
                  <th className="py-3.5 px-4 text-center">Staff Count</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stores.map((st, idx) => (
                  <motion.tr
                    key={st.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{st.name}</p>
                          <p className="text-[10px] text-slate-400">ID #{st.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {st.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="space-y-0.5 text-[11px]">
                        {st.address && (
                          <p className="flex items-center gap-1 text-slate-700 font-semibold">
                            <MapPin className="w-3 h-3 text-slate-400" /> {st.address}
                          </p>
                        )}
                        {st.phone && (
                          <p className="flex items-center gap-1 font-mono text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" /> {st.phone}
                          </p>
                        )}
                        {!st.address && !st.phone && <span className="text-slate-400">—</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        <Monitor className="w-3 h-3" /> {st.registers_count || 1} POS
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" /> {st.staff_count || 0} Staff
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${st.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {st.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(st)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
                          title="Edit Store Outlet / Receipts"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {st.is_active && (
                          <button
                            onClick={() => handleDeactivateStore(st.id, st.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Deactivate Store Outlet"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Store Outlet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editingStore ? 'Edit Store Outlet' : 'Add New Store Outlet'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Outlet Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Siem Reap Branch"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStore}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="023 123 456"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street / City Location"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-orange-500" /> Printed Receipt Header Greeting
                </label>
                <input
                  type="text"
                  value={formData.receipt_header}
                  onChange={(e) => setFormData({ ...formData, receipt_header: e.target.value })}
                  placeholder="Thank you for shopping at Dreams POS!"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-orange-500" /> Printed Receipt Footer Message
                </label>
                <input
                  type="text"
                  value={formData.receipt_footer}
                  onChange={(e) => setFormData({ ...formData, receipt_footer: e.target.value })}
                  placeholder="Please visit us again soon!"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
                  {saving ? 'Saving...' : editingStore ? 'Update Store' : 'Create Store Outlet'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
