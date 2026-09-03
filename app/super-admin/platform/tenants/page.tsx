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
  CreditCard,
  Users,
  LayoutGrid,
  Trash2,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  Clock,
  Monitor,
  Eye,
  Lock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiFetch, getAuthUser } from '@/lib/api';
import { CreateOrgModal, TenantDetailDrawer, ImpersonateModal } from '@/components/tenant';
import { ConfirmDialog, ConfirmVariant } from '@/components/common';

interface TenantOwner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

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
  owner?: TenantOwner | null;
  users_count?: number;
  outlets_count?: number;
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

export default function TenantsManagementPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [drawerTenant, setDrawerTenant] = useState<any>(null);
  const [impersonateTenant, setImpersonateTenant] = useState<any>(null);

  const handleStartImpersonate = async (tenant: any, reason: string) => {
    try {
      const auditPayload = {
        action: 'tenant_impersonation',
        target_tenant_id: tenant.id,
        target_tenant_name: tenant.name,
        reason,
        timestamp: new Date().toISOString(),
      };
      const existingLogs = JSON.parse(localStorage.getItem('cb_audit_logs') || '[]');
      existingLogs.unshift(auditPayload);
      localStorage.setItem('cb_audit_logs', JSON.stringify(existingLogs));

      localStorage.setItem(
        'cb_impersonation',
        JSON.stringify({
          orgId: tenant.id,
          orgName: tenant.name,
          reason,
          startedAt: new Date().toISOString(),
        })
      );
      localStorage.setItem('active_org', tenant.name);

      window.dispatchEvent(new Event('cb_impersonation_changed'));
      window.dispatchEvent(new Event('cb_org_changed'));

      router.push('/pos');
    } catch (err: any) {
      alert(err?.message || 'Impersonation failed.');
    }
  };

  // General Reusable Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: React.ReactNode;
    variant: ConfirmVariant;
    confirmText: string;
    onConfirm: () => Promise<void> | void;
    details?: { label: string; value: React.ReactNode }[];
    requireTypingMatch?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'warning',
    confirmText: 'Confirm',
    onConfirm: () => {},
  });

  // Edit Tenant & Owner Form State
  const [editForm, setEditForm] = useState({
    name: '',
    client_tier: 'business_runner',
    status: 'active',
    email: '',
    phone: '',
    address: '',
    max_outlets: 5,
    max_registers: 15,
    max_users: 50,
    owner_name: '',
    owner_email: '',
    owner_phone: '',
  });

  // Subscription Modal State
  const [subForm, setSubForm] = useState({
    plan_name: '',
    price: '',
    billing_cycle: 'monthly',
    client_tier: '',
    expires_at: '',
    notes: '',
  });

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push('/login?redirect=/super-admin/platform/tenants');
      return;
    }
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
      if (res?.success && Array.isArray(res.data)) {
        setTenants(res.data);
        setStats(res.stats || {
          total: res.data.length,
          active: res.data.filter((t: Tenant) => t.status === 'active').length,
          trial: res.data.filter((t: Tenant) => t.status === 'trial').length,
          suspended: res.data.filter((t: Tenant) => t.status === 'suspended').length,
          enterprise_org: res.data.filter((t: Tenant) => t.client_tier === 'enterprise_org').length,
          business_runner: res.data.filter((t: Tenant) => t.client_tier === 'business_runner').length,
          free_personal: res.data.filter((t: Tenant) => t.client_tier === 'free_personal').length,
        });
      } else if (Array.isArray(res)) {
        setTenants(res);
        setStats({
          total: res.length,
          active: res.filter((t: Tenant) => t.status === 'active').length,
          trial: res.filter((t: Tenant) => t.status === 'trial').length,
          suspended: res.filter((t: Tenant) => t.status === 'suspended').length,
          enterprise_org: res.filter((t: Tenant) => t.client_tier === 'enterprise_org').length,
          business_runner: res.filter((t: Tenant) => t.client_tier === 'business_runner').length,
          free_personal: res.filter((t: Tenant) => t.client_tier === 'free_personal').length,
        });
      } else {
        setTenants([]);
        setStats({ total: 0, active: 0, trial: 0, suspended: 0, enterprise_org: 0, business_runner: 0, free_personal: 0 });
      }
    } catch (err: any) {
      console.warn('[Tenants] Failed to load tenants from backend API:', err?.message);
      setTenants([]);
      setStats({ total: 0, active: 0, trial: 0, suspended: 0, enterprise_org: 0, business_runner: 0, free_personal: 0 });

      if (err?.message === 'Unauthenticated.') {
        showNotification('error', 'Session expired. Please log in as Super Admin.');
      } else {
        showNotification('error', err?.message || 'Failed to load organization records.');
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleOpenEditModal = (tenant: Tenant, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTenant(tenant);
    setEditForm({
      name: tenant.name || '',
      client_tier: tenant.client_tier || 'business_runner',
      status: tenant.status || 'active',
      email: tenant.owner?.email || tenant.email || '',
      phone: tenant.phone || '',
      address: tenant.address || '',
      max_outlets: tenant.max_outlets || 5,
      max_registers: tenant.max_registers || 15,
      max_users: tenant.max_users || 50,
      owner_name: tenant.owner?.name || '',
      owner_email: tenant.owner?.email || tenant.email || '',
      owner_phone: tenant.owner?.phone || tenant.phone || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEditTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    try {
      setActionLoading(true);
      const res = await apiFetch(`/super-admin/tenants/${selectedTenant.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });

      if (res?.success) {
        showNotification('success', res.message || 'Tenant organization updated successfully.');
        setShowEditModal(false);
        loadTenants();
      } else {
        showNotification('error', res?.message || 'Failed to update tenant details.');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'An error occurred updating tenant.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendToggle = (tenant: Tenant, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlySuspended = tenant.status === 'suspended';

    setConfirmModal({
      isOpen: true,
      variant: isCurrentlySuspended ? 'success' : 'warning',
      title: isCurrentlySuspended ? `Reactivate "${tenant.name}"` : `Suspend "${tenant.name}"`,
      description: isCurrentlySuspended
        ? `Are you sure you want to restore access for "${tenant.name}"? Cashiers, staff, and registers will be able to log in immediately.`
        : `Are you sure you want to suspend "${tenant.name}"? Store access, active register terminals, and user sessions for this workspace will be temporarily blocked.`,
      confirmText: isCurrentlySuspended ? 'Reactivate Organization' : 'Suspend Organization',
      details: [
        { label: 'Organization', value: tenant.name },
        { label: 'Client Tier', value: tenant.client_tier },
        { label: 'Owner', value: tenant.owner?.name || 'Unassigned' },
      ],
      onConfirm: async () => {
        try {
          const res = await apiFetch(`/super-admin/tenants/${tenant.id}/suspend`, { method: 'POST' });
          if (res?.success) {
            showNotification('success', res.message);
            loadTenants();
            if (selectedTenant?.id === tenant.id) {
              setSelectedTenant({ ...selectedTenant, status: res.status });
            }
          } else {
            showNotification('error', res?.message || 'Action failed.');
          }
        } catch (err: any) {
          showNotification('error', err?.message || 'An error occurred.');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleDeleteTenant = (tenant: Tenant, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setConfirmModal({
      isOpen: true,
      variant: 'danger',
      title: `Delete Organization "${tenant.name}"`,
      description: `This action is permanent and cannot be undone. It will remove the tenant workspace, delete subscriptions, and detach associated user accounts.`,
      confirmText: 'Permanently Delete',
      requireTypingMatch: tenant.name,
      details: [
        { label: 'Organization', value: tenant.name },
        { label: 'Company Code', value: tenant.company_code },
        { label: 'Owner', value: tenant.owner?.name || 'Unassigned' },
      ],
      onConfirm: async () => {
        try {
          const res = await apiFetch(`/super-admin/tenants/${tenant.id}`, { method: 'DELETE' });
          if (res?.success) {
            showNotification('success', res.message || 'Organization deleted successfully.');
            if (selectedTenant?.id === tenant.id) setSelectedTenant(null);
            loadTenants();
          } else {
            showNotification('error', res?.message || 'Failed to delete organization.');
          }
        } catch (err: any) {
          showNotification('error', err?.message || 'Failed to delete organization.');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
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
      if (res?.success) {
        showNotification('success', 'Subscription updated successfully.');
        setShowSubModal(false);
        loadTenants();
      } else {
        showNotification('error', res?.message || 'Failed to update subscription.');
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
    t.slug.toLowerCase().includes(search.toLowerCase()) ||
    (t.owner?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.owner?.email || '').toLowerCase().includes(search.toLowerCase())
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
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {notification.message}
            </div>
            <button onClick={() => setNotification(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Client Tenant Management</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Monitor client store organizations, view assigned workspace owners, edit quotas, and manage subscription tiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadTenants}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh tenants"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Tenant</span>
          </button>
        </div>
      </div>

      {/* Stats Grid with 1-Click Status & Tier Filters */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { key: 'all', statusFilter: '', tierFilter: '', label: 'Total Clients', value: stats.total, color: 'text-slate-900', bg: 'bg-white' },
            { key: 'active', statusFilter: 'active', tierFilter: '', label: 'Active', value: stats.active, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { key: 'trial', statusFilter: 'trial', tierFilter: '', label: 'On Trial', value: stats.trial, color: 'text-blue-700', bg: 'bg-blue-50' },
            { key: 'suspended', statusFilter: 'suspended', tierFilter: '', label: 'Suspended', value: stats.suspended, color: 'text-rose-700', bg: 'bg-rose-50' },
            { key: 'enterprise_org', statusFilter: '', tierFilter: 'enterprise_org', label: 'Enterprise', value: stats.enterprise_org, color: 'text-purple-700', bg: 'bg-purple-50' },
            { key: 'business_runner', statusFilter: '', tierFilter: 'business_runner', label: 'Biz Runner', value: stats.business_runner, color: 'text-orange-700', bg: 'bg-orange-50' },
            { key: 'free_personal', statusFilter: '', tierFilter: 'free_personal', label: 'Personal', value: stats.free_personal, color: 'text-slate-600', bg: 'bg-slate-50' },
          ].map((s) => {
            const isCurrent = (s.statusFilter && filterStatus === s.statusFilter) || (s.tierFilter && filterTier === s.tierFilter) || (!s.statusFilter && !s.tierFilter && !filterStatus && !filterTier);
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setFilterStatus(s.statusFilter);
                  setFilterTier(s.tierFilter);
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 shadow-2xs transition-all cursor-pointer ${s.bg} ${
                  isCurrent ? 'ring-2 ring-orange-500 border-orange-400 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        {/* Quick Status Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterStatus('')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              !filterStatus ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Clients
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('trial')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              filterStatus === 'trial' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>14-Day Free Trials</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('suspended')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'suspended' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Suspended
          </button>
        </div>

        {/* Search & Tier Dropdown */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px] justify-end">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, owner, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadTenants()}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="">All Tiers</option>
            <option value="enterprise_org">Enterprise Org</option>
            <option value="business_runner">Business Runner</option>
            <option value="free_personal">Personal</option>
          </select>
        </div>
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
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Owner & Admin</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Tier</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Plan / Billing</th>
                  <th className="px-4 py-3.5 text-left font-extrabold uppercase tracking-wider text-slate-500">Limits</th>
                  <th className="px-4 py-3.5 text-right font-extrabold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((tenant) => {
                  const tierConf = TIER_CONFIG[tenant.client_tier] || TIER_CONFIG.business_runner;
                  const statusConf = STATUS_CONFIG[tenant.status] || STATUS_CONFIG.active;
                  const isSelected = selectedTenant?.id === tenant.id;

                  return (
                    <motion.tr
                      key={tenant.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedTenant(isSelected ? null : tenant)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-orange-50/70' : 'hover:bg-slate-50'}`}
                    >
                      {/* Tenant Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            {tierConf.icon}
                            {tenant.name}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">{tenant.company_code} · {tenant.slug}</span>
                        </div>
                      </td>

                      {/* Owner Column */}
                      <td className="px-4 py-3.5">
                        {tenant.owner ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-slate-900 flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              {tenant.owner.name}
                            </span>
                            <span className="text-slate-500 font-medium text-[10px] truncate max-w-[160px]">
                              {tenant.owner.email}
                            </span>
                            {tenant.owner.phone && (
                              <span className="text-slate-400 font-mono text-[9px] flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5 text-slate-400" />
                                <span>{tenant.owner.phone}</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No assigned owner</span>
                        )}
                      </td>

                      {/* Tier */}
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${tierConf.color}`}>
                          {tierConf.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusConf.color}`}>
                          {statusConf.label}
                        </span>
                      </td>

                      {/* Subscription Plan */}
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

                      {/* Limits */}
                      <td className="px-4 py-3.5 text-slate-600 font-semibold">
                        <div className="flex items-center gap-3">
                          <span title="Max Outlets" className="inline-flex items-center gap-1">
                            <Store className="w-3.5 h-3.5 text-slate-400" />
                            <span>{tenant.max_outlets}</span>
                          </span>
                          <span title="Max Registers" className="inline-flex items-center gap-1">
                            <Monitor className="w-3.5 h-3.5 text-slate-400" />
                            <span>{tenant.max_registers}</span>
                          </span>
                          <span title="Max Users" className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{tenant.max_users}</span>
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details / Modules Drawer */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDrawerTenant(tenant);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Tenant & Modules Drawer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Login as Tenant (Impersonation) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImpersonateTenant(tenant);
                            }}
                            className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Login as Tenant (Audited)"
                          >
                            <Lock className="w-4 h-4" />
                          </button>

                          {/* Edit Details & Owner */}
                          <button
                            onClick={(e) => handleOpenEditModal(tenant, e)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Tenant & Owner Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Update Subscription */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTenant(tenant);
                              setSubForm({
                                plan_name: tenant.subscription?.plan_name || '',
                                price: String(tenant.subscription?.price || ''),
                                billing_cycle: tenant.subscription?.billing_cycle || 'monthly',
                                client_tier: tenant.client_tier,
                                expires_at: tenant.subscription?.expires_at ? tenant.subscription.expires_at.slice(0, 10) : '',
                                notes: '',
                              });
                              setShowSubModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Manage Plan & Billing"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          {/* Suspend / Reactivate */}
                          <button
                            onClick={(e) => handleSuspendToggle(tenant, e)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              tenant.status === 'suspended'
                                ? 'text-emerald-500 hover:bg-emerald-50'
                                : 'text-rose-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={tenant.status === 'suspended' ? 'Reactivate Tenant' : 'Suspend Tenant'}
                          >
                            {tenant.status === 'suspended' ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => handleDeleteTenant(tenant, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Tenant"
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

      {/* Edit Tenant & Owner Modal */}
      <AnimatePresence>
        {showEditModal && selectedTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Edit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Edit Organization & Owner
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedTenant.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditTenant} className="space-y-4 text-xs">
                {/* Organization Details Section */}
                <div className="space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">Organization Settings</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Company / Store Name *</label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Client Tier *</label>
                      <select
                        value={editForm.client_tier}
                        onChange={(e) => setEditForm({ ...editForm, client_tier: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
                      >
                        <option value="free_personal">Personal Solopreneur Free</option>
                        <option value="business_runner">Business Runner Pro</option>
                        <option value="enterprise_org">Enterprise Organization</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="suspended">Suspended</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Organization Contact Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+855 12 345 678"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Outlets</label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.max_outlets}
                        onChange={(e) => setEditForm({ ...editForm, max_outlets: parseInt(e.target.value, 10) || 1 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Registers</label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.max_registers}
                        onChange={(e) => setEditForm({ ...editForm, max_registers: parseInt(e.target.value, 10) || 1 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Staff Users</label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.max_users}
                        onChange={(e) => setEditForm({ ...editForm, max_users: parseInt(e.target.value, 10) || 1 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Profile Section */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-orange-500" />
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-600">
                      Workspace Owner & Administrator
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={editForm.owner_name}
                        onChange={(e) => setEditForm({ ...editForm, owner_name: e.target.value })}
                        placeholder="Owner full name"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Owner Email</label>
                      <input
                        type="email"
                        value={editForm.owner_email}
                        onChange={(e) => setEditForm({ ...editForm, owner_email: e.target.value })}
                        placeholder="owner@company.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Owner Phone</label>
                      <input
                        type="text"
                        value={editForm.owner_phone}
                        onChange={(e) => setEditForm({ ...editForm, owner_phone: e.target.value })}
                        placeholder="012 345 678"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    {actionLoading ? 'Saving Changes...' : 'Save All Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <button onClick={() => setShowSubModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
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
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
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
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    {actionLoading ? 'Saving...' : 'Update Subscription'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register New Organization Modal */}
      <CreateOrgModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialType="company"
        onOrgCreated={() => {
          setShowCreateModal(false);
          loadTenants();
          showNotification('success', 'New organization created successfully.');
        }}
      />

      {/* Enterprise Reusable Confirmation Modal */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        confirmText={confirmModal.confirmText}
        details={confirmModal.details}
        requireTypingMatch={confirmModal.requireTypingMatch}
      />

      {/* Tenant Profile & Module Entitlement Drawer */}
      <TenantDetailDrawer
        tenant={drawerTenant}
        isOpen={Boolean(drawerTenant)}
        onClose={() => setDrawerTenant(null)}
        onImpersonate={(t) => {
          setDrawerTenant(null);
          setImpersonateTenant(t);
        }}
        onEditQuotas={(t) => {
          setDrawerTenant(null);
          handleOpenEditModal(t);
        }}
      />

      {/* Audited Impersonation Security Confirmation Modal */}
      <ImpersonateModal
        tenant={impersonateTenant}
        isOpen={Boolean(impersonateTenant)}
        onClose={() => setImpersonateTenant(null)}
        onConfirm={handleStartImpersonate}
      />
    </div>
  );
}
