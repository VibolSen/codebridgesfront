'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
} from '@/lib/api';
import { CustomerModal } from './CustomerModal';
import { CustomerMetricsCards } from './CustomerMetricsCards';
import { CustomerCardGrid } from './CustomerCardGrid';

export const SuperAdminCustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    loyalty_points: '0',
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomersApi(search || undefined);
      setCustomers(res.data || []);
    } catch (err: any) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      loyalty_points: '0',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      loyalty_points: (customer.loyalty_points || 0).toString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        loyalty_points: parseInt(formData.loyalty_points, 10) || 0,
      };

      let res;
      if (editingCustomer) {
        res = await updateCustomerApi(editingCustomer.id, payload);
      } else {
        res = await createCustomerApi(payload);
      }

      if (res.success) {
        setNotification({
          type: 'success',
          message: editingCustomer ? 'Customer profile updated' : 'Customer successfully registered',
        });
        setIsModalOpen(false);
        loadCustomers();
      } else {
        setNotification({
          type: 'error',
          message: res.message || 'Operation failed',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to submit customer details',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDeleteCustomer = async (customer: any) => {
    if (!window.confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      return;
    }
    try {
      const res = await deleteCustomerApi(customer.id);
      if (res.success) {
        setNotification({ type: 'success', message: 'Customer record removed' });
        loadCustomers();
      } else {
        setNotification({ type: 'error', message: res.message || 'Could not delete customer' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Deletion error' });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const totalCustomers = customers.length;
  const totalPointsBalance = customers.reduce(
    (acc, curr) => acc + (parseInt(curr.loyalty_points, 10) || 0),
    0
  );
  const pointsLiabilityUSD = totalPointsBalance * 0.01;

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
            <Users className="w-6 h-6 text-brand" />
            Customer Relationship &amp; Loyalty Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Manage customer directories, track purchase points, and maintain buyer engagement
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover active:bg-brand-active text-white font-bold text-xs shadow-md shadow-brand/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Register Customer
        </motion.button>
      </motion.div>

      {/* Metrics Cards */}
      <CustomerMetricsCards
        totalCustomers={totalCustomers}
        totalPointsBalance={totalPointsBalance}
        pointsLiabilityUSD={pointsLiabilityUSD}
      />

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
            placeholder="Search customer name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand font-medium"
          />
        </form>
      </div>

      {/* Customers Grid */}
      <CustomerCardGrid
        customers={customers}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteCustomer}
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCustomer={editingCustomer}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveCustomer}
        saving={saving}
      />
    </div>
  );
};
