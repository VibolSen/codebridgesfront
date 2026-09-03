'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { UniversalModuleLayout } from '@/components/module-shell';
import { getEmployeesApi } from '@/lib/api';

export default function HrmLayout({ children }: { children: React.ReactNode }) {
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadCount() {
      try {
        const res = await getEmployeesApi();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        setEmployeeCount(list.length);
      } catch {
        setEmployeeCount(0);
      }
    }
    loadCount();
  }, []);

  const sections = [
    {
      items: [
        { label: 'HR Dashboard', href: '/hrm', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Workforce & Time Tracking',
      items: [
        {
          label: 'Employees Directory',
          href: '/hrm?tab=employees',
          icon: Users,
          ...(employeeCount && employeeCount > 0
            ? { badge: String(employeeCount), badgeColor: 'bg-purple-100 text-purple-700 font-bold' }
            : {}),
        },
        { label: 'Attendance & Clock-In', href: '/hrm?tab=attendance', icon: Clock },
        { label: 'Leave Management', href: '/hrm?tab=leaves', icon: Calendar },
        { label: 'Payroll Studio', href: '/hrm?tab=payroll', icon: DollarSign },
        { label: 'Documents & Contracts', href: '/hrm?tab=docs', icon: FileText },
      ],
    },
    {
      title: 'Analytics & Compliance',
      items: [
        { label: 'HR Reports', href: '/hrm?tab=reports', icon: BarChart3 },
        { label: 'HR Access & RBAC', href: '/hrm?tab=access', icon: ShieldCheck },
        { label: 'HR Settings', href: '/hrm?tab=settings', icon: Settings },
      ],
    },
  ];

  return (
    <UniversalModuleLayout
      currentModuleId="hrm"
      moduleTitle="HR & Workforce Suite"
      moduleIcon={Briefcase}
      sidebarSections={sections}
    >
      {children}
    </UniversalModuleLayout>
  );
}
