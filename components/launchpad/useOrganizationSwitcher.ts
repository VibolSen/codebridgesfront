'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuthToken,
  getAuthUser,
  getSuperAdminTenantsApi,
} from '@/lib/api';

export interface OrgItem {
  id: string | number;
  name: string;
  type: 'Company' | 'Outlet' | 'Tenant' | 'Personal';
  code?: string;
}

export function useOrganizationSwitcher() {
  const router = useRouter();
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'personal' | 'company'>('company');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrgItem[]>([]);
  const [activeOrg, setActiveOrg] = useState<string>('Primary Organization');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCreateDropdown(false);
        setShowOrgDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadRealOrganizations() {
      setLoading(true);
      const token = getAuthToken();
      const currentUser = getAuthUser();

      if (!token || !currentUser) {
        setUser(null);
        setOrganizations([]);
        setActiveOrg('Guest Workspace');
        setLoading(false);
        return;
      }

      setUser(currentUser);
      const orgList: OrgItem[] = [];

      // Add user primary company/tenant workspace
      const isPlatformOwner = currentUser.role === 'super_admin';
      const userTenantName =
        currentUser.tenant_name ||
        currentUser.company_name ||
        currentUser.company;

      if (userTenantName || isPlatformOwner) {
        orgList.push({
          id: 'primary-company',
          name: userTenantName || 'CodeBridges Platform',
          type: 'Company',
        });
      }

      // If super_admin, fetch registered tenant organizations from backend API
      if (currentUser.role === 'super_admin') {
        try {
          const tenantsRes = await getSuperAdminTenantsApi();
          const tenantsData = Array.isArray(tenantsRes)
            ? tenantsRes
            : tenantsRes?.data || [];

          tenantsData.forEach((t: any) => {
            if (
              !orgList.some(
                (existing) =>
                  existing.name.toLowerCase() === (t.name || '').toLowerCase()
              )
            ) {
              orgList.push({
                id: `tenant-${t.id}`,
                name: t.name,
                type: 'Tenant',
              });
            }
          });
        } catch (err) {
          console.warn('[OrganizationManagerBar] Could not load tenants API:', err);
        }
      }

      setOrganizations(orgList);

      // Restore active organization from localStorage if set
      const savedActive = localStorage.getItem('active_org');
      if (
        savedActive &&
        savedActive !== 'No Organization Yet! Please Create' &&
        orgList.some((o) => o.name === savedActive)
      ) {
        setActiveOrg(savedActive);
      } else if (orgList.length > 0) {
        setActiveOrg(orgList[0].name);
        localStorage.setItem('active_org', orgList[0].name);
      } else {
        const fallback = isPlatformOwner
          ? 'CodeBridges Platform'
          : 'No Organization Yet! Please Create';
        setActiveOrg(fallback);
        localStorage.setItem('active_org', fallback);
      }

      setLoading(false);
    }

    loadRealOrganizations();

    // Listen to live organization changes
    const handleOrgChanged = (e: any) => {
      const newOrgName = e.detail?.orgName;
      if (newOrgName) {
        setActiveOrg(newOrgName);
      }
      loadRealOrganizations();
    };

    window.addEventListener('cb_org_changed', handleOrgChanged);
    return () => {
      window.removeEventListener('cb_org_changed', handleOrgChanged);
    };
  }, []);

  const handleSelectOrg = (orgName: string) => {
    setActiveOrg(orgName);
    localStorage.setItem('active_org', orgName);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cb_org_changed', { detail: { orgName } }));
    }
    setShowOrgDropdown(false);
  };

  const handleCreateOrg = (type: 'personal' | 'company') => {
    setShowCreateDropdown(false);
    setCreateModalType(type);
    setIsCreateModalOpen(true);
  };

  const handleOrgCreated = (newOrg: { id: string | number; name: string; type: 'Personal' | 'Company' }) => {
    setOrganizations((prev) => {
      if (prev.some((o) => o.name === newOrg.name)) return prev;
      return [{ id: newOrg.id, name: newOrg.name, type: newOrg.type }, ...prev];
    });
    setActiveOrg(newOrg.name);
    localStorage.setItem('active_org', newOrg.name);
  };

  return {
    router,
    showCreateDropdown,
    setShowCreateDropdown,
    showOrgDropdown,
    setShowOrgDropdown,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalType,
    setCreateModalType,
    user,
    loading,
    organizations,
    activeOrg,
    dropdownRef,
    handleSelectOrg,
    handleCreateOrg,
    handleOrgCreated,
  };
}
