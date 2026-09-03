'use client';

import React, { useState, useEffect } from 'react';
import { getUsersApi } from '@/lib/api';

export function InventoryRbacCard() {
  const [staffCounts, setStaffCounts] = useState({
    admin: 0,
    warehouse: 0,
    receiving: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      try {
        setLoading(true);
        const res = await getUsersApi();
        const users = Array.isArray(res) ? res : res?.data || [];
        let admins = 0;
        let warehouse = 0;
        let receiving = 0;

        users.forEach((u: any) => {
          const role = (u.role || '').toLowerCase();
          if (['admin', 'super_admin', 'owner', 'outlet_manager'].includes(role)) {
            admins++;
          } else if (['inventory_clerk', 'supervisor', 'manager'].includes(role)) {
            warehouse++;
          } else if (['cashier', 'staff'].includes(role)) {
            receiving++;
          }
        });

        setStaffCounts({
          admin: Math.max(admins, 1),
          warehouse: warehouse,
          receiving: receiving,
        });
      } catch (err) {
        console.error('Failed to load inventory RBAC users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Inventory Access &amp; RBAC</h3>
          <p className="text-xs text-slate-500 font-medium">Domain-scoped RBAC permissions (module_name = &apos;inventory&apos;)</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-[#5B4DFB]">
          Module Scoped
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="font-extrabold text-sm text-slate-900">Inventory Director / Admin</h4>
          <p className="text-xs text-slate-500">Approve POs, adjust FIFO valuation rules, and configure safety buffers.</p>
          <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-[#5B4DFB] text-[10px] font-bold">
            {loading ? '...' : `${staffCounts.admin} Assigned`}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="font-extrabold text-sm text-slate-900">Warehouse Keeper</h4>
          <p className="text-xs text-slate-500">Create stock transfers, manage storage bin locations, and perform cycle counts.</p>
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {loading ? '...' : `${staffCounts.warehouse} Assigned`}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="font-extrabold text-sm text-slate-900">Receiving Clerk</h4>
          <p className="text-xs text-slate-500">Verify 3-way matching goods delivery notes and flag damaged item variances.</p>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
            {loading ? '...' : `${staffCounts.receiving} Assigned`}
          </span>
        </div>
      </div>
    </div>
  );
}
