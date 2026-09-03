'use client';

import React from 'react';
import { Layers, Monitor, Boxes, DollarSign, Users, Briefcase, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface ModuleMetric {
  id: string;
  name: string;
  count: number;
  totalOrgs: number;
  color: string;
  icon: any;
}

export function ModuleAdoptionCard() {
  const totalOrgs = 128;

  const modules: ModuleMetric[] = [
    { id: 'pos', name: 'Point of Sale (POS)', count: 124, totalOrgs, color: 'bg-orange-500', icon: Monitor },
    { id: 'inventory', name: 'Stock & Inventory', count: 116, totalOrgs, color: 'bg-amber-500', icon: Boxes },
    { id: 'finance', name: 'Finance & Accounts', count: 88, totalOrgs, color: 'bg-emerald-500', icon: DollarSign },
    { id: 'hrm', name: 'HR & Workforce', count: 64, totalOrgs, color: 'bg-blue-500', icon: Briefcase },
    { id: 'crm', name: 'CRM & Deals Pipeline', count: 52, totalOrgs, color: 'bg-purple-500', icon: Users },
    { id: 'shop', name: 'Public E-Commerce', count: 38, totalOrgs, color: 'bg-rose-500', icon: ShoppingBag },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Module Adoption Across Tenants</h3>
            <p className="text-xs text-slate-500 font-medium">Breakdown of enabled suites across 128 active workspaces</p>
          </div>
        </div>
        <Link
          href="/super-admin/platform/modules"
          className="text-xs font-bold text-orange-600 hover:text-orange-700"
        >
          Manage Registry →
        </Link>
      </div>

      <div className="mt-4 space-y-3.5">
        {modules.map((mod) => {
          const pct = Math.round((mod.count / mod.totalOrgs) * 100);
          const IconComp = mod.icon;
          return (
            <div key={mod.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <IconComp className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mod.name}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-500 text-[11px]">
                  <span>{mod.count} tenants</span>
                  <span className="font-bold text-slate-900 font-mono">({pct}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${mod.color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
