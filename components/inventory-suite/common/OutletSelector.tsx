'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getOutletsApi } from '@/lib/api';

export interface Outlet {
  id: string | number;
  name: string;
  code?: string;
  address?: string;
  is_active?: boolean | number;
}

interface OutletSelectorProps {
  value: string;
  onChange: (outletId: string) => void;
  includeAll?: boolean;
  allLabel?: string;
  autoSelectFirst?: boolean;
  showLabel?: boolean;
  className?: string;
  onOutletsLoaded?: (outlets: Outlet[]) => void;
}

export function OutletSelector({
  value,
  onChange,
  includeAll = false,
  allLabel = 'All Outlets',
  autoSelectFirst = false,
  showLabel = true,
  className = '',
  onOutletsLoaded,
}: OutletSelectorProps) {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOutletsApi();
      const list: Outlet[] = Array.isArray(res) ? res : res?.data || [];
      setOutlets(list);

      if (onOutletsLoaded) {
        onOutletsLoaded(list);
      }

      if (autoSelectFirst && list.length > 0 && !value) {
        onChange(String(list[0].id));
      }
    } catch (err: any) {
      console.error('Failed to load outlets:', err);
      setError(err?.message || 'Unable to load outlets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  if (error) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <span className="truncate">Outlets unavailable</span>
        <button
          type="button"
          onClick={fetchOutlets}
          title="Retry loading outlets"
          className="ml-1 p-0.5 hover:bg-rose-100 rounded text-rose-600 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Outlet:</span>
        </div>
      )}

      <div className="relative inline-flex items-center">
        <select
          value={value}
          disabled={loading}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 pr-8 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 cursor-pointer"
        >
          {includeAll && <option value="">{allLabel}</option>}
          {loading && outlets.length === 0 && (
            <option value="">Loading outlets...</option>
          )}
          {!loading && outlets.length === 0 && (
            <option value="">No Outlets Registered</option>
          )}
          {outlets.map((outlet) => (
            <option key={outlet.id} value={String(outlet.id)}>
              {outlet.name} {outlet.code ? `(${outlet.code})` : ''}
            </option>
          ))}
        </select>

        {loading && (
          <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin absolute right-2.5 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
