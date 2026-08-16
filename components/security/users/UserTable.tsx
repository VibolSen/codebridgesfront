'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Users,
  Shield,
  Lock,
  Building2,
  KeyRound,
  Edit3,
  UserX,
} from 'lucide-react';

interface UserTableProps {
  users: any[];
  loading: boolean;
  onResetPassword: (user: any) => void;
  onEditUser: (user: any) => void;
  onDeactivateUser: (id: number | string, name: string) => void;
}

export function UserTable({
  users,
  loading,
  onResetPassword,
  onEditUser,
  onDeactivateUser,
}: UserTableProps) {
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-amber-500/15 text-amber-700 border-amber-300';
      case 'admin':
      case 'administrator':
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
      case 'user':
        return 'bg-teal-500/15 text-teal-700 border-teal-300';
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

  return (
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
                  {/* Name + Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs uppercase">
                        {user.name ? user.name.substring(0, 2) : 'US'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID #{user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {user.email}
                  </td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider ${getRoleBadgeStyle(
                        user.role
                      )}`}
                    >
                      <Shield className="w-3 h-3" />
                      {(user.role || 'user').replace('_', ' ')}
                    </span>
                  </td>

                  {/* PIN Code */}
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

                  {/* Outlet */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {user.outlet_name || 'Phnom Penh Main'}
                    </span>
                  </td>

                  {/* Active Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onResetPassword(user)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Reset Password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
                        title="Edit User Role / Details / PIN"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {user.is_active && (
                        <button
                          onClick={() => onDeactivateUser(user.id, user.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
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
  );
}
