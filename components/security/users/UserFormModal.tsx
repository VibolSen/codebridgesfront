'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, KeyRound } from 'lucide-react';
import { OutletSelector } from '@/components/inventory-suite';

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  outlet_id: string;
  pin_code: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  editingUser: any | null;
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  dynamicRoles: Array<{ id: string; name: string; slug: string; is_system?: boolean }>;
}

export function UserFormModal({
  isOpen,
  editingUser,
  formData,
  setFormData,
  onClose,
  onSubmit,
  saving,
  dynamicRoles,
}: UserFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-100"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-lg">
            {editingUser ? 'Edit User Account' : 'Add New Staff Account'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
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

          {/* Email Address */}
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

          {/* Assigned Role & PIN Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Role (RBAC) *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 capitalize cursor-pointer"
              >
                {dynamicRoles.length > 0 ? (
                  dynamicRoles.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name} {!r.is_system ? '(Custom Role)' : ''}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="outlet_manager">Outlet Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="cashier">Cashier</option>
                    <option value="inventory_clerk">Inventory Clerk</option>
                    <option value="accountant">Accountant</option>
                    <option value="user">User</option>
                    <option value="customer">Customer</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Supervisor PIN (Optional)</label>
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

          {/* Assigned Outlet */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Outlet</label>
            <OutletSelector
              value={formData.outlet_id}
              onChange={(id) => setFormData({ ...formData, outlet_id: id })}
              showLabel={false}
              autoSelectFirst={true}
              className="w-full [&>div]:w-full [&>div>select]:w-full"
            />
          </div>

          {/* Password */}
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
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer transition-all"
            >
              {saving ? 'Saving...' : editingUser ? 'Update Account' : 'Create User Account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
