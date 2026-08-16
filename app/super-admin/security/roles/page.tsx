'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Lock,
  Search,
  Check,
  X,
  AlertCircle,
  Key,
  Layers,
  Sparkles,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  getRolesApi,
  getPermissionsApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
} from '@/lib/api';

interface PermissionItem {
  id: string;
  name: string;
  group: string;
  description: string;
}

interface RoleItem {
  id: string;
  company_id?: string;
  name: string;
  slug: string;
  description: string;
  is_system: boolean;
  permission_ids: string[];
  permissions_count: number;
}

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, PermissionItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRoleName, setModalRoleName] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalSelectedPerms, setModalSelectedPerms] = useState<string[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([getRolesApi(), getPermissionsApi()]);
      
      if (rolesRes.success && rolesRes.data) {
        setRoles(rolesRes.data);
        if (rolesRes.data.length > 0 && !selectedRole) {
          setSelectedRole(rolesRes.data[0]);
        } else if (selectedRole) {
          const updatedSelected = rolesRes.data.find((r: RoleItem) => r.id === selectedRole.id);
          if (updatedSelected) setSelectedRole(updatedSelected);
        }
      }

      if (permsRes.success) {
        setPermissions(permsRes.data || []);
        setGroupedPermissions(permsRes.grouped || {});
      }
    } catch (err) {
      console.error('Failed to load roles and permissions data:', err);
      showNotification('error', 'Failed to load roles and permissions matrix from server.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTogglePermission = (permId: string) => {
    if (!selectedRole) return;

    const currentPerms = selectedRole.permission_ids || [];
    const isAssigned = currentPerms.includes(permId);

    const updatedPermIds = isAssigned
      ? currentPerms.filter((id) => id !== permId)
      : [...currentPerms, permId];

    setSelectedRole({
      ...selectedRole,
      permission_ids: updatedPermIds,
      permissions_count: updatedPermIds.length,
    });
  };

  const handleSaveSelectedRolePermissions = async () => {
    if (!selectedRole) return;
    try {
      setSaving(true);
      const res = await updateRoleApi(selectedRole.id, {
        permission_ids: selectedRole.permission_ids,
      });

      if (res.success) {
        showNotification('success', `Permissions updated successfully for role "${selectedRole.name}".`);
        loadData();
      } else {
        showNotification('error', res.message || 'Failed to update role permissions.');
      }
    } catch (err) {
      console.error('Error updating role permissions:', err);
      showNotification('error', 'An error occurred while saving role permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingRoleId(null);
    setModalRoleName('');
    setModalDescription('');
    setModalSelectedPerms([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role: RoleItem) => {
    setEditingRoleId(role.id);
    setModalRoleName(role.name);
    setModalDescription(role.description || '');
    setModalSelectedPerms(role.permission_ids || []);
    setIsModalOpen(true);
  };

  const handleToggleModalPermission = (permId: string) => {
    setModalSelectedPerms((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalRoleName.trim()) {
      showNotification('error', 'Please enter a valid role name.');
      return;
    }

    try {
      setSaving(true);
      if (editingRoleId) {
        const res = await updateRoleApi(editingRoleId, {
          name: modalRoleName,
          description: modalDescription,
          permission_ids: modalSelectedPerms,
        });

        if (res.success) {
          showNotification('success', 'Custom role updated successfully.');
          setIsModalOpen(false);
          loadData();
        } else {
          showNotification('error', res.message || 'Failed to update role.');
        }
      } else {
        const res = await createRoleApi({
          name: modalRoleName,
          description: modalDescription,
          permission_ids: modalSelectedPerms,
        });

        if (res.success) {
          showNotification('success', 'New custom role created successfully.');
          setIsModalOpen(false);
          loadData();
        } else {
          showNotification('error', res.message || 'Failed to create custom role.');
        }
      }
    } catch (err) {
      console.error('Error saving role:', err);
      showNotification('error', 'An error occurred while saving custom role.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (role: RoleItem) => {
    if (role.is_system) {
      showNotification('error', 'System default roles cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete custom role "${role.name}"?`)) {
      return;
    }

    try {
      setSaving(true);
      const res = await deleteRoleApi(role.id);
      if (res.success) {
        showNotification('success', `Role "${role.name}" deleted successfully.`);
        if (selectedRole?.id === role.id) {
          setSelectedRole(null);
        }
        loadData();
      } else {
        showNotification('error', res.message || 'Failed to delete custom role.');
      }
    } catch (err) {
      console.error('Error deleting role:', err);
      showNotification('error', 'An error occurred while deleting custom role.');
    } finally {
      setSaving(false);
    }
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const permissionGroups = Object.keys(groupedPermissions);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-4 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-between border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">
              Dynamic Roles & Custom Permissions Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Define custom roles and toggle dynamic database-backed permissions across all enterprise modules without touching code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
            title="Refresh Permissions Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Custom Role</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Roles Column + Right Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Roles Selection List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-orange-500" />
                Configured Roles ({filteredRoles.length})
              </h3>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Roles List */}
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredRoles.map((role) => {
                const isSelected = selectedRole?.id === role.id;

                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {role.name}
                          </h4>
                          {role.is_system ? (
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                              isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              System
                            </span>
                          ) : (
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                              isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                            }`}>
                              Custom
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {role.description || `Slug: ${role.slug}`}
                        </p>
                      </div>

                      {!role.is_system && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(role);
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              isSelected ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-400'
                            }`}
                            title="Edit Role Name"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role);
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              isSelected ? 'hover:bg-rose-950 text-rose-300' : 'hover:bg-rose-50 text-rose-500'
                            }`}
                            title="Delete Custom Role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/30 flex items-center justify-between text-[10px] font-semibold">
                      <span className={isSelected ? 'text-orange-400' : 'text-slate-400'}>
                        {role.permission_ids?.length || 0} Permissions Assigned
                      </span>
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                        {role.slug}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Permission Matrix for Selected Role (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedRole ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
              
              {/* Header for Selected Role */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedRole.name}</h2>
                    {selectedRole.is_system ? (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider border border-slate-200">
                        System Template
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-200">
                        Custom Role
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {selectedRole.description || `Slug key: ${selectedRole.slug}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveSelectedRolePermissions}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? 'Saving Changes...' : 'Save Permission Matrix'}</span>
                  </button>
                </div>
              </div>

              {/* Module Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  All Groups ({permissions.length})
                </button>

                {permissionGroups.map((group) => {
                  const countInGroup = (groupedPermissions[group] || []).length;

                  return (
                    <button
                      key={group}
                      onClick={() => setActiveTab(group)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === group
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {group} ({countInGroup})
                    </button>
                  );
                })}
              </div>

              {/* Permissions Checkbox Matrix */}
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {permissionGroups
                  .filter((group) => activeTab === 'all' || activeTab === group)
                  .map((group) => {
                    const groupPerms = groupedPermissions[group] || [];

                    return (
                      <div key={group} className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <Key className="w-3.5 h-3.5 text-orange-500" />
                            {group} Permissions ({groupPerms.length})
                          </h4>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {groupPerms.filter((p) => selectedRole.permission_ids?.includes(p.id)).length} / {groupPerms.length} Enabled
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {groupPerms.map((perm) => {
                            const isChecked = selectedRole.permission_ids?.includes(perm.id);

                            return (
                              <label
                                key={perm.id}
                                onClick={() => handleTogglePermission(perm.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                  isChecked
                                    ? 'bg-orange-500/10 border-orange-500/40 text-slate-900'
                                    : 'bg-white border-slate-200/80 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}} // Handled by parent container click
                                  className="mt-0.5 rounded text-orange-500 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                                />
                                <div>
                                  <h5 className="text-xs font-bold font-mono leading-tight text-slate-900">
                                    {perm.name}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                    {perm.description || 'Permission action capability'}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Select a Role to Manage Permissions</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose a pre-configured system role or create a custom company role to toggle dynamic permission checkboxes.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Modal: Create or Edit Custom Role */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-500" />
                  {editingRoleId ? 'Edit Custom Role' : 'Create New Custom Role'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Head Cashier, Senior Warehouse Manager, Audit Lead"
                    value={modalRoleName}
                    onChange={(e) => setModalRoleName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe operational responsibilities and staff authorization scope..."
                    value={modalDescription}
                    onChange={(e) => setModalDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                {/* Permission Checkboxes */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>Assign Module Permissions ({modalSelectedPerms.length} Selected)</span>
                  </h4>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {permissionGroups.map((group) => {
                      const groupPerms = groupedPermissions[group] || [];

                      return (
                        <div key={group} className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                            {group} Module
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {groupPerms.map((perm) => {
                              const isChecked = modalSelectedPerms.includes(perm.id);

                              return (
                                <label
                                  key={perm.id}
                                  onClick={() => handleToggleModalPermission(perm.id)}
                                  className={`p-2 rounded-lg border cursor-pointer transition-all flex items-start gap-2 text-xs ${
                                    isChecked
                                      ? 'bg-orange-500/10 border-orange-500/40 text-slate-900 font-bold'
                                      : 'bg-white border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="mt-0.5 rounded text-orange-500 focus:ring-orange-500 w-3.5 h-3.5 cursor-pointer"
                                  />
                                  <span className="font-mono text-[11px]">{perm.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md shadow-orange-500/20"
                  >
                    {saving ? 'Saving...' : editingRoleId ? 'Update Role' : 'Create Role'}
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
