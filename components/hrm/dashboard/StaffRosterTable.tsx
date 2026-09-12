'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Filter, Phone, Mail, Building2, Loader2, Store } from 'lucide-react';
import { getEmployeesApi, getAuthToken } from '@/lib/api';

interface Employee {
  id: string | number;
  name: string;
  code?: string;
  department?: string;
  role: string;
  outlet?: string;
  status: 'Active' | 'On Leave' | 'Probation';
  salary?: string;
}

export function StaffRosterTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadStaff() {
      try {
        setLoading(true);
        const token = getAuthToken();
        if (!token) {
          setEmployees([]);
          return;
        }

        const empRes = await getEmployeesApi();
        const roster: Employee[] = [];

        if (empRes?.data) {
          const rawEmps = Array.isArray(empRes.data)
            ? empRes.data
            : empRes.data.data || [];
          rawEmps.forEach((e: any) => {
            roster.push({
              id: e.id,
              name: e.name || e.full_name || `${e.first_name || ''} ${e.last_name || ''}`.trim() || 'Employee',
              code: e.employee_code || e.code || `EMP-${String(e.id).substring(0, 6)}`,
              department: e.department_name || e.department?.name || 'General Operations',
              role: e.designation || e.position || e.role || 'Staff',
              outlet: e.outlet_name || 'All Outlets',
              status: e.is_active ? 'Active' : 'Probation',
              salary: e.salary && parseFloat(e.salary) > 0 ? `$${parseFloat(e.salary).toFixed(2)}/mo` : 'Unassigned',
            });
          });
        }

        setEmployees(roster);
      } catch (err) {
        console.error('Failed to load staff roster:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.department && e.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">Employees Directory</h3>
          <p className="text-xs text-slate-500 font-medium">Live headcount directory across store outlets and warehouse (auth_db)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff, code, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Loader2 className="w-4 h-4 animate-spin text-brand" />
          <span>Loading staff directory...</span>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 font-medium space-y-1">
          <p>No employee profiles found in this organization.</p>
          <p className="text-[11px] text-slate-300">Click &quot;New Employee&quot; above to add your first staff member.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Store Outlet</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Base Salary</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-subtle text-brand border border-brand/20 flex items-center justify-center font-black text-xs">
                        {emp.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{emp.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{emp.department}</td>
                  <td className="py-3 px-4 font-medium text-slate-600 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.outlet}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 capitalize">{emp.role}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{emp.salary}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        emp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
