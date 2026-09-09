'use client';

import React, { useState, useEffect } from 'react';
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
import {
  getDepartmentsApi,
  createDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi,
} from '@/lib/api';
import { DepartmentModal } from './DepartmentModal';

export const SuperAdminDepartmentsView: React.FC = () => {
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
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

  const handleDeleteDepartment = async (dept: any) => {
    if (
      !confirm(
        `Are you sure you want to delete department "${dept.name}"? Employees in this department will need to be reassigned.`
      )
    ) {
      return;
    }
    try {
      await deleteDepartmentApi(dept.id);
      setNotification({ type: 'success', message: `Department "${dept.name}" deleted.` });
      loadDepartments();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete department.' });
    }
  };

  const totalDepts = departments.length;
  const totalStaffAcrossDepts = departments.reduce(
    (sum, d) => sum + (d.employees_count || 0),
    0
  );
  const avgStaff = totalDepts > 0 ? (totalStaffAcrossDepts / totalDepts).toFixed(1) : '0';

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
            <Building2 className="w-6 h-6 text-orange-500" />
            Organizational Departments
          </h1>
          <p className="text-xs text-slate-500">
            Structure your operational workforce into functional business divisions
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Department
        </motion.button>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalDepts}</h4>
            <p className="text-xs text-slate-500 font-medium">Departments Configured</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-emerald-600">{totalStaffAcrossDepts}</h4>
            <p className="text-xs text-slate-500 font-medium">Assigned Employees</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-indigo-600">{avgStaff}</h4>
            <p className="text-xs text-slate-500 font-medium">Average Staff / Dept</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
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
            placeholder="Search department name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
        </form>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">
          Loading departments...
        </div>
      ) : departments.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">No departments configured yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, idx) => (
            <motion.div
              key={dept.id}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">{dept.code}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {dept.employees_count || 0} Staff
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium line-clamp-2">
                  {dept.description || 'No description provided for this department.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleDeleteDepartment(dept)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEditModal(dept)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingDepartment={editingDepartment}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveDepartment}
        saving={saving}
      />
    </div>
  );
};
