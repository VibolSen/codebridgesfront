'use client';

import { useState, useEffect } from 'react';
import {
  getDepartmentsApi,
  createDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi,
} from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
} from 'lucide-react';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartmentsApi(search || undefined);
      setDepartments(res.data || []);
    } catch (err: any) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDepartments();
  };

  const handleOpenCreateModal = () => {
    setEditingDepartment(null);
    setFormData({
      name: '',
      code: 'DEPT-' + Math.floor(100 + Math.random() * 900),
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dept: any) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      if (editingDepartment) {
        await updateDepartmentApi(editingDepartment.id, {
          name: formData.name,
          description: formData.description || null,
        });
        setNotification({ type: 'success', message: 'Department updated successfully.' });
      } else {
        await createDepartmentApi({
          name: formData.name,
          code: formData.code,
          description: formData.description || null,
        });
        setNotification({ type: 'success', message: 'Department created successfully.' });
      }

      setIsModalOpen(false);
      loadDepartments();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save department.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete department "${name}"?`)) return;
    try {
      await deleteDepartmentApi(id);
      setNotification({ type: 'success', message: `Department "${name}" deleted.` });
      loadDepartments();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete department.' });
    }
  };

  const totalDeptsCount = departments.length;
  const totalEmployeesCount = departments.reduce((sum, d) => sum + (d.employees_count || 0), 0);

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
            HRM Departments Management
          </h1>
          <p className="text-xs text-slate-500">Manage organizational departments and functional team structures</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Department
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalDeptsCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Active Departments</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalEmployeesCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Staff Assigned to Departments</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
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
            placeholder="Search department name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>
      </div>

      {/* Departments Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading departments...
          </div>
        ) : departments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No departments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Department Name</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Employees Count</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {departments.map((dept, idx) => (
                  <motion.tr
                    key={dept.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{dept.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {dept.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {dept.description || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono">
                      {dept.employees_count || 0}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(dept)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
                          title="Edit Department"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Department"
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

      {/* Create / Edit Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sales & Cashier, Inventory..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingDepartment}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Functional scope of department..."
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
                  {saving ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
