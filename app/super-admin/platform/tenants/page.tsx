'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Store,
  User,
  Crown,
  Search,
  Plus,
  Edit,
  ShieldOff,
  ShieldCheck,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Globe,
  Calendar,
  CreditCard,
  Users,
  LayoutGrid,
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  company_code: string;
  client_tier: 'free_personal' | 'business_runner' | 'enterprise_org';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  email: string;
  phone: string;
  address: string;
  max_outlets: number;
  max_registers: number;
  max_users: number;
  trial_ends_at: string | null;
  created_at: string;
  subscription?: {
    plan_name: string;
    price: number;
    billing_cycle: string;
    status: string;
    expires_at: string | null;
  };
}

const TIER_CONFIG = {
  enterprise_org: {
    label: 'Enterprise',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-purple-500/10 text-purple-700 border-purple-300',
    badgeColor: 'bg-purple-100 text-purple-700',
    dotColor: 'bg-purple-500',
  },
  business_runner: {
    label: 'Business Runner',
    icon: <Store className="w-4 h-4" />,
    color: 'bg-orange-500/10 text-orange-700 border-orange-300',
    badgeColor: 'bg-orange-100 text-orange-700',
    dotColor: 'bg-orange-500',
  },
  free_personal: {
    label: 'Personal',
    icon: <User className="w-4 h-4" />,
    color: 'bg-slate-500/10 text-slate-700 border-slate-300',
    badgeColor: 'bg-slate-100 text-slate-600',
    dotColor: 'bg-slate-400',
  },
};

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  trial: { label: 'Trial', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  suspended: { label: 'Suspended', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  expired: { label: 'Expired', color: 'bg-amber-100 text-amber-700 border-amber-300' },
};

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`http://localhost:8080/api/v1${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
  return res.json();
}

export default function TenantsManagementPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Subscription Modal State
  const [showSubModal, setShowSubModal] = useState(false);
  const [subForm, setSubForm] = useState({
    plan_name: '',
    price: '',
    billing_cycle: 'monthly',
    client_tier: '',
    expires_at: '',
    notes: '',
  });

  useEffect(() => {
    loadTenants();
  }, [filterTier, filterStatus]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterTier) params.append('client_tier', filterTier);
      if (filterStatus) params.append('status', filterStatus);
      if (search) params.append('q', search);

      const res = await apiFetch(`/super-admin/tenants?${params.toString()}`);
      if (res.success) {
        setTenants(res.data || []);
        setStats(res.stats || null);
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleSuspendToggle = async (tenant: Tenant) => {
    if (!confirm(`Are you sure you want to ${tenant.status === 'suspended' ? 'reactivate' : 'suspend'} "${tenant.name}"?`)) return;
    try {
      setActionLoading(true);
      const res = await apiFetch(`/super-admin/tenants/${tenant.id}/suspend`, { method: 'POST' });
      if (res.success) {
        showNotification('success', res.message);
        loadTenants();
        if (selectedTenant?.id === tenant.id) {
          setSelectedTenant({ ...selectedTenant, status: res.status });
        }
      } else {
        showNotification('error', res.message || 'Action failed.');
      }
    } catch (err) {
      showNotification('error', 'An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    try {
      setActionLoading(true);
      const res = await apiFetch(`/super-admin/tenants/${selectedTenant.id}/subscription`, {
        method: 'PUT',
        body: JSON.stringify(subForm),
      });
      if (res.success) {
        showNotification('success', 'Subscription updated successfully.');
        setShowSubModal(false);
        loadTenants();
      } else {
        showNotification('error', res.message || 'Failed to update subscription.');
      }
    } catch (err) {
      showNotification('error', 'An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success'
                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />
              }
              {notification.message}
            </div>
            <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">Client Tenant Management</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage all registered organization, business runner, and personal solopreneur client tenants.
          </p>
        </div>
        <button
          onClick={loadTenants}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Total Clients', value: stats.total, color: 'text-slate-900', bg: 'bg-white' },
            { label: 'Active', value: stats.active, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'On Trial', value: stats.trial, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Suspended', value: stats.suspended, color: 'text-rose-700', bg: 'bg-rose-50' },
            { label: 'Enterprise', value: stats.enterprise_org, color: 'text-purple-700', bg: 'bg-purple-50' },
            { label: 'Biz Runner', value: stats.business_runner, color: 'text-orange-700', bg: 'bg-orange-50' },
            { label: 'Personal', value: stats.free_personal, color: 'text-slate-600', bg: 'bg-slate-50' },
          ].map((s) => (
            <div key={s.label} className={`p-4 rounded-2xl border border-slate-200 ${s.bg} flex flex-col gap-1 shadow-2xs`}>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadTenants()}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
        >
          <option value="">All Tiers</option>
          <option value="enterprise_org">Enterprise Organization</option>
          <option value="business_runner">Business Runner</option>
          <option value="free_personal">Personal Solopreneur</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-500 text-xs font-semibold gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading tenants...
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
            <Building2 className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-semibold">No client tenants found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Client / Tenant</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Tier</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Plan / Subscription</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Limits</th>
                  <th className="px-4 py-3.5 text-right font-extrabold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((tenant) => {
                  const tierConf = TIER_CONFIG[tenant.client_tier];
                  const statusConf = STATUS_CONFIG[tenant.status];
                  const isSelected = selectedTenant?.id === tenant.id;

                  return (
                    <motion.tr
                      key={tenant.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedTenant(isSelected ? null : tenant)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            {tierConf.icon}
                            {tenant.name}
                          </span>
                          <span className="text-slate-400 font-mono">{tenant.email}</span>
                          <span className="text-slate-400 font-mono text-[10px]">{tenant.company_code} · {tenant.slug}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${tierConf.color}`}>
                          {tierConf.label}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusConf.color}`}>
                          {statusConf.label}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {tenant.subscription ? (
                          <div>
                            <div className="font-semibold text-slate-800">{tenant.subscription.plan_name}</div>
                            <div className="text-slate-400 font-mono">
                              ${tenant.subscription.price}/{tenant.subscription.billing_cycle.slice(0, 2)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">No plan</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 font-semibold">
                        <div className="flex gap-3">
                          <span title="Max Outlets">🏪 {tenant.max_outlets}</span>
                          <span title="Max Registers">🖥 {tenant.max_registers}</span>
                          <span title="Max Users">👥 {tenant.max_users}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTenant(tenant);
                              setSubForm({
                                plan_name: tenant.subscription?.plan_name || '',
                                price: String(tenant.subscription?.price || ''),
                                billing_cycle: tenant.subscription?.billing_cycle || 'monthly',
                                client_tier: tenant.client_tier,
                                expires_at: '',
                                notes: '',
                              });
                              setShowSubModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            title="Manage Subscription"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuspendToggle(tenant);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              tenant.status === 'suspended'
                                ? 'text-emerald-500 hover:bg-emerald-50'
                                : 'text-rose-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={tenant.status === 'suspended' ? 'Reactivate Tenant' : 'Suspend Tenant'}
                          >
                            {tenant.status === 'suspended'
                              ? <ShieldCheck className="w-4 h-4" />
                              : <ShieldOff className="w-4 h-4" />
                            }
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

      {/* Update Subscription Modal */}
      <AnimatePresence>
        {showSubModal && selectedTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Update Subscription — {selectedTenant.name}
                </h3>
                <button onClick={() => setShowSubModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSubscription} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={subForm.plan_name}
                    onChange={(e) => setSubForm({ ...subForm, plan_name: e.target.value })}
                    placeholder="e.g. Enterprise Pro Annual"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (USD) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={subForm.price}
                      onChange={(e) => setSubForm({ ...subForm, price: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Billing Cycle *</label>
                    <select
                      value={subForm.billing_cycle}
                      onChange={(e) => setSubForm({ ...subForm, billing_cycle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Upgrade Tier</label>
                    <select
                      value={subForm.client_tier}
                      onChange={(e) => setSubForm({ ...subForm, client_tier: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Keep Current</option>
                      <option value="free_personal">Personal</option>
                      <option value="business_runner">Business Runner</option>
                      <option value="enterprise_org">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expires At</label>
                    <input
                      type="date"
                      value={subForm.expires_at}
                      onChange={(e) => setSubForm({ ...subForm, expires_at: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Internal Notes</label>
                  <textarea
                    rows={2}
                    value={subForm.notes}
                    onChange={(e) => setSubForm({ ...subForm, notes: e.target.value })}
                    placeholder="Admin notes about this subscription change..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSubModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-500/20"
                  >
                    {actionLoading ? 'Saving...' : 'Update Subscription'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
