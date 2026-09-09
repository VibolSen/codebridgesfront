'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { ConfirmVariant } from '@/components/common';
import { Tenant, TenantEditFormData } from './types';

interface TenantActionDeps {
  selectedTenant: Tenant | null;
  setSelectedTenant: (tenant: Tenant | null) => void;
  editForm: TenantEditFormData;
  setEditForm: React.Dispatch<React.SetStateAction<TenantEditFormData>>;
  setShowEditModal: (show: boolean) => void;
  setActionLoading: (loading: boolean) => void;
  setConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      description: React.ReactNode;
      variant: ConfirmVariant;
      confirmText: string;
      onConfirm: () => Promise<void> | void;
      details?: { label: string; value: React.ReactNode }[];
      requireTypingMatch?: string;
    }>
  >;
  showNotification: (type: 'success' | 'error', message: string) => void;
  loadTenants: () => Promise<void>;
}

export function useTenantActions({
  selectedTenant,
  setSelectedTenant,
  editForm,
  setEditForm,
  setShowEditModal,
  setActionLoading,
  setConfirmModal,
  showNotification,
  loadTenants,
}: TenantActionDeps) {
  const router = useRouter();

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
        : `Are you sure you want to suspend "${tenant.name}"? Store access, active register terminals, and user sessions will be temporarily blocked.`,
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

  return {
    handleStartImpersonate,
    handleOpenEditModal,
    handleSaveEditTenant,
    handleSuspendToggle,
    handleDeleteTenant,
  };
}
