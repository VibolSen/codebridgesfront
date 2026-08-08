'use client';

import { useState, useEffect } from 'react';
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getRolePermissionsApi,
  resetUserPasswordApi,
} from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  Building2,
  Edit3,
  UserX,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Grid,
  Check,
  Lock,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
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
  }, [selectedRole]);

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

  const handleDeactivateUser = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to deactivate user account "${name}"?`)) return;
    try {
      await deleteUserApi(id);
      setNotification({ type: 'success', message: `User "${name}" deactivated.` });
      loadUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to deactivate user.' });
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-amber-500/15 text-amber-700 border-amber-300';
      case 'admin':
        return 'bg-orange-500/15 text-orange-700 border-orange-300';
      case 'outlet_manager':
        return 'bg-indigo-500/15 text-indigo-700 border-indigo-300';
      case 'supervisor':
        return 'bg-purple-500/15 text-purple-700 border-purple-300';
      case 'cashier':
        return 'bg-emerald-500/15 text-emerald-700 border-emerald-300';
      case 'inventory_clerk':
        return 'bg-cyan-500/15 text-cyan-700 border-cyan-300';
      case 'accountant':
        return 'bg-blue-500/15 text-blue-700 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' as const },
    }),
  };

  const totalUsers = users.length;
  const activeUsersCount = users.filter((u) => u.is_active).length;
  const superAdminsCount = users.filter((u) => u.role === 'super_admin' || u.role === 'admin').length;

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
            <ShieldCheck className="w-6 h-6 text-orange-500" />
            Users & Staff Management (RBAC)
          </h1>
          <p className="text-xs text-slate-500">Manage operational staff accounts, access credentials, and 8 role boundaries</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenPermissionsModal}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Grid className="w-4 h-4 text-orange-500" />
            Permissions Matrix
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalUsers}</h4>
            <p className="text-xs text-slate-500 font-medium">Total Staff Registered</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{activeUsersCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Active User Accounts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{superAdminsCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Admins & Super Admins</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
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
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Search & Role Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search user by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            Filter Role:
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none w-full sm:w-48 capitalize"
          >
            <option value="">All 8 Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="outlet_manager">Outlet Manager</option>
            <option value="supervisor">Supervisor</option>
            <option value="cashier">Cashier</option>
            <option value="inventory_clerk">Inventory Clerk</option>
            <option value="accountant">Accountant</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* User Table List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            Loading user profiles...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">No user accounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Assigned Role (RBAC)</th>
                  <th className="py-3.5 px-4">PIN Code</th>
                  <th className="py-3.5 px-4">Outlet</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{user.name}</p>
                          <p className="text-[10px] text-slate-400">ID #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {user.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider ${getRoleBadgeStyle(user.role)}`}>
                        <Shield className="w-3 h-3" />
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs">
                      {user.pin_code ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          <Lock className="w-3 h-3 text-orange-500" />
                          PIN Set
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">No PIN</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {user.outlet_name || 'Phnom Penh Main'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setResetPasswordUser(user)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
                          title="Edit User Role / Details / PIN"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {user.is_active && (
                          <button
                            onClick={() => handleDeactivateUser(user.id, user.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Deactivate Account"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Permissions Matrix Modal */}
      {showPermissionsModal && permissionsMatrix && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Grid className="w-5 h-5 text-orange-500" />
                  Role Capabilities & Permissions Matrix
                </h3>
                <p className="text-xs text-slate-400">8 predefined system roles and capability boundaries</p>
              </div>
              <button onClick={() => setShowPermissionsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {Object.entries(permissionsMatrix).map(([roleKey, roleInfo]: [string, any]) => (
                <div key={roleKey} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRoleBadgeStyle(roleKey)}`}>
                      {roleInfo.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{roleInfo.capabilities.length} Capabilities</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {roleInfo.capabilities.map((cap: string) => (
                      <span key={cap} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700">
                        <Check className="w-3 h-3 text-emerald-500" /> {cap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-500" /> Reset Staff Password
              </h3>
              <button onClick={() => setResetPasswordUser(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>

            <p className="text-xs text-slate-500">Enter a new password for <strong className="text-slate-900">{resetPasswordUser.name}</strong> ({resetPasswordUser.email}).</p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  {saving ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editingUser ? 'Edit User Account' : 'Add New Staff Account'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sokha Chan"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sokha@pos.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Role (RBAC) *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 capitalize"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="outlet_manager">Outlet Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="cashier">Cashier</option>
                    <option value="inventory_clerk">Inventory Clerk</option>
                    <option value="accountant">Accountant</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supervisor Override PIN (Optional)</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={formData.pin_code}
                    onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                    placeholder="e.g. 1234"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Outlet</label>
                <select
                  value={formData.outlet_id}
                  onChange={(e) => setFormData({ ...formData, outlet_id: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="1">Phnom Penh Main Outlet</option>
                  <option value="2">Siem Reap Branch</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  {editingUser ? 'Password (Leave blank to keep unchanged)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Minimum 6 characters'}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  {saving ? 'Saving...' : editingUser ? 'Update Account' : 'Create User Account'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
