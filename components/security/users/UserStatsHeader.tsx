'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Grid, UserPlus, Users, CheckCircle2, Shield } from 'lucide-react';

interface UserStatsHeaderProps {
  totalUsers: number;
  activeUsersCount: number;
  superAdminsCount: number;
  onOpenPermissionsModal: () => void;
  onOpenCreateModal: () => void;
  onOpenInviteModal?: () => void;
}

export function UserStatsHeader({
  totalUsers,
  activeUsersCount,
  superAdminsCount,
  onOpenPermissionsModal,
  onOpenCreateModal,
  onOpenInviteModal,
}: UserStatsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
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
          <p className="text-xs text-slate-500">
            Manage operational staff accounts, access credentials, and role permission boundaries
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenPermissionsModal}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Grid className="w-4 h-4 text-orange-500" />
            Permissions Matrix
          </motion.button>

          {onOpenInviteModal && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenInviteModal}
              className="px-3.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Invite Link
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </motion.button>
        </div>
      </motion.div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{totalUsers}</h4>
            <p className="text-xs text-slate-500 font-medium">Total Staff Registered</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{activeUsersCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Active User Accounts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
        >
          <div>
            <h4 className="text-xl font-extrabold text-slate-900">{superAdminsCount}</h4>
            <p className="text-xs text-slate-500 font-medium">Admins & Super Admins</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
