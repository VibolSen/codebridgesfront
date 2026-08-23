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
  inviteStaffApi,
} from '@/lib/api';
import { CheckCircle2, AlertCircle, X, Copy, Check, Mail, Link as LinkIcon, UserPlus } from 'lucide-react';
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

  // Staff Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('cashier');
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const res = await inviteStaffApi(inviteEmail, inviteRole);
      if (res.status === 'success' && res.data) {
        const fullUrl = `${window.location.origin}${res.data.invite_url}`;
        setGeneratedInviteUrl(fullUrl);
        setNotification({ type: 'success', message: 'Staff invitation link generated successfully!' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to generate invitation link.' });
    } finally {
      setInviting(false);
    }
  };

  const handleCopyInviteLink = () => {
    if (!generatedInviteUrl) return;
    navigator.clipboard.writeText(generatedInviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
        onOpenInviteModal={() => {
          setGeneratedInviteUrl(null);
          setInviteEmail('');
          setShowInviteModal(true);
        }}
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

      {/* 7. Staff Invitation Link Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Invite Staff via Link</h3>
                  <p className="text-xs text-slate-500 font-medium">Generate a secure onboarding setup link</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedInviteUrl ? (
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@store.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Operational Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="outlet_manager">Outlet Manager</option>
                    <option value="inventory_clerk">Inventory Clerk</option>
                    <option value="accountant">Accountant</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {inviting ? 'Generating...' : 'Create Invite Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Invitation created! Share this link with the staff member:</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedInviteUrl}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 select-all"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="px-3.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

