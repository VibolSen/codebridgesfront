'use client';

import { useState, useEffect } from 'react';
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getRolesApi,
  getRolePermissionsApi,
  resetUserPasswordApi,
} from '@/lib/api';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import {
  UserStatsHeader,
  UserFilterToolbar,
  UserTable,
  UserFormModal,
  UserFormData,
  ResetPasswordModal,
  PermissionsMatrixModal,
} from '@/components/security/users';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [dynamicRoles, setDynamicRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'cashier',
    outlet_id: '1',
    pin_code: '',
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Permissions Matrix & Password Reset States
  const [permissionsMatrix, setPermissionsMatrix] = useState<any>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [selectedRole]);

  const loadRoles = async () => {
    try {
      const res = await getRolesApi();
      if (res && res.data) {
        setDynamicRoles(res.data);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsersApi(selectedRole || undefined, search || undefined);
      setUsers(res.data || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPermissionsModal = async () => {
    try {
      if (!permissionsMatrix) {
        const res = await getRolePermissionsApi();
        setPermissionsMatrix(res.data);
      }
      setShowPermissionsModal(true);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch permissions matrix');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'cashier',
      outlet_id: '1',
      pin_code: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      outlet_id: user.outlet_id ? String(user.outlet_id) : '1',
      pin_code: user.pin_code || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      if (editingUser) {
        await updateUserApi(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          outlet_id: parseInt(formData.outlet_id, 10),
          pin_code: formData.pin_code || null,
          ...(formData.password ? { password: formData.password } : {}),
        });
        setNotification({ type: 'success', message: 'User updated successfully.' });
      } else {
        await createUserApi({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          outlet_id: parseInt(formData.outlet_id, 10),
          pin_code: formData.pin_code || null,
        });
        setNotification({ type: 'success', message: 'User created successfully.' });
      }

      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save user.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser || !newPasswordInput) return;
    try {
      setSaving(true);
      await resetUserPasswordApi(resetPasswordUser.id, newPasswordInput);
      setNotification({ type: 'success', message: `Password reset successfully for ${resetPasswordUser.name}.` });
      setResetPasswordUser(null);
      setNewPasswordInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateUser = async (id: number | string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate user account "${name}"?`)) return;
    try {
      await deleteUserApi(id);
      setNotification({ type: 'success', message: `User "${name}" deactivated.` });
      loadUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to deactivate user.' });
    }
  };

  const totalUsers = users.length;
  const activeUsersCount = users.filter((u) => u.is_active).length;
  const superAdminsCount = users.filter((u) => u.role === 'super_admin' || u.role === 'admin').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & KPI Cards */}
      <UserStatsHeader
        totalUsers={totalUsers}
        activeUsersCount={activeUsersCount}
        superAdminsCount={superAdminsCount}
        onOpenPermissionsModal={handleOpenPermissionsModal}
        onOpenCreateModal={handleOpenCreateModal}
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
          <button onClick={() => setNotification(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Search & Role Filter Toolbar */}
      <UserFilterToolbar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        dynamicRoles={dynamicRoles}
      />

      {/* 3. Main Users Data Table */}
      <UserTable
        users={users}
        loading={loading}
        onResetPassword={(user) => setResetPasswordUser(user)}
        onEditUser={handleOpenEditModal}
        onDeactivateUser={handleDeactivateUser}
      />

      {/* 4. Permissions Matrix Modal */}
      <PermissionsMatrixModal
        isOpen={showPermissionsModal}
        permissionsMatrix={permissionsMatrix}
        onClose={() => setShowPermissionsModal(false)}
      />

      {/* 5. Password Reset Modal */}
      <ResetPasswordModal
        user={resetPasswordUser}
        newPasswordInput={newPasswordInput}
        onPasswordChange={setNewPasswordInput}
        onClose={() => setResetPasswordUser(null)}
        onSubmit={handleResetPasswordSubmit}
        saving={saving}
      />

      {/* 6. User Create & Edit Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        saving={saving}
        dynamicRoles={dynamicRoles}
      />
    </div>
  );
}
