'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getAuthUser } from '@/lib/api';
import { ConfirmVariant } from '@/components/common';
import { Tenant, TenantStats, TenantEditFormData } from './types';
import { useTenantActions } from './useTenantActions';

const INITIAL_STATS: TenantStats = {
  total: 0,
  active: 0,
  trial: 0,
  suspended: 0,
  enterprise_org: 0,
  business_runner: 0,
  free_personal: 0,
};

const computeStats = (data: Tenant[]): TenantStats => ({
  total: data.length,
  active: data.filter((t) => t.status === 'active').length,
  trial: data.filter((t) => t.status === 'trial').length,
  suspended: data.filter((t) => t.status === 'suspended').length,
  enterprise_org: data.filter((t) => t.client_tier === 'enterprise_org').length,
  business_runner: data.filter((t) => t.client_tier === 'business_runner').length,
  free_personal: data.filter((t) => t.client_tier === 'free_personal').length,
});

export function useTenantsManager() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<TenantStats | null>(null);
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
  const [drawerTenant, setDrawerTenant] = useState<Tenant | null>(null);
  const [impersonateTenant, setImpersonateTenant] = useState<Tenant | null>(null);

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

  const [editForm, setEditForm] = useState<TenantEditFormData>({
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

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

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
        setStats(res.stats || computeStats(res.data));
      } else if (Array.isArray(res)) {
        setTenants(res);
        setStats(computeStats(res));
      } else {
        setTenants([]);
        setStats(INITIAL_STATS);
      }
    } catch (err: any) {
      setTenants([]);
      setStats(INITIAL_STATS);
      if (err?.message === 'Unauthenticated.') {
        showNotification('error', 'Session expired. Please log in as Super Admin.');
      } else {
        showNotification('error', err?.message || 'Failed to load organization records.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push('/login?redirect=/super-admin/platform/tenants');
      return;
    }
    loadTenants();
  }, [filterTier, filterStatus]);

  const {
    handleStartImpersonate,
    handleOpenEditModal,
    handleSaveEditTenant,
    handleSuspendToggle,
    handleDeleteTenant,
  } = useTenantActions({
    selectedTenant,
    setSelectedTenant,
    editForm,
    setEditForm,
    setShowEditModal,
    setActionLoading,
    setConfirmModal,
    showNotification,
    loadTenants,
  });

  return {
    tenants,
    stats,
    loading,
    search,
    setSearch,
    filterTier,
    setFilterTier,
    filterStatus,
    setFilterStatus,
    selectedTenant,
    setSelectedTenant,
    notification,
    actionLoading,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showSubModal,
    setShowSubModal,
    drawerTenant,
    setDrawerTenant,
    impersonateTenant,
    setImpersonateTenant,
    confirmModal,
    setConfirmModal,
    editForm,
    setEditForm,
    loadTenants,
    handleStartImpersonate,
    handleOpenEditModal,
    handleSaveEditTenant,
    handleSuspendToggle,
    handleDeleteTenant,
  };
}
