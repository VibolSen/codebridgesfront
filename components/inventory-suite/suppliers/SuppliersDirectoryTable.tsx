'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';

interface SuppliersDirectoryTableProps {
  suppliers: any[];
  loading: boolean;
}

export function SuppliersDirectoryTable({
  suppliers,
  loading,
}: SuppliersDirectoryTableProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Suppliers Directory</h3>
          <p className="text-xs text-slate-500 font-medium">Vendor contacts, lead times, and performance ratings</p>
        </div>
        <Link
          href="/super-admin/crm/suppliers"
          className="px-3.5 py-1.5 bg-[#5B4DFB] hover:bg-[#4E3FE3] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manage Suppliers</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Supplier Company</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Contact Person</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Phone &amp; Email</th>
              <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase">Delivery Lead Time</th>
              <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#5B4DFB] mb-1" />
                  Loading live suppliers directory...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  No supplier vendors found in database.
                </td>
              </tr>
            ) : (
              suppliers.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-extrabold text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{s.contact_person || s.contact || 'Main Contact'}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{s.phone || s.email || 'N/A'}</td>
                  <td className="px-4 py-3 font-bold text-[#5B4DFB]">{s.lead_time || s.leadTime || '2-3 days'}</td>
                  <td className="px-4 py-3 text-right font-bold text-amber-600">{s.rating || '5.0 ★'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
