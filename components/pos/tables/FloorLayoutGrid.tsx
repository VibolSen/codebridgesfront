'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  RefreshCw,
} from 'lucide-react';

export interface DiningTable {
  id: string;
  name: string;
  section: 'Indoor Main Floor' | 'Outdoor Garden Terrace' | 'VIP Private Lounge' | 'Espresso Bar';
  capacity: number;
  status: 'available' | 'occupied' | 'billing';
  activeBillTotal?: number;
  guestCount?: number;
  elapsedMinutes?: number;
  activeOrderItems?: number;
}

const INITIAL_TABLES: DiningTable[] = [
  { id: 't-1', name: 'Table 01', section: 'Indoor Main Floor', capacity: 2, status: 'occupied', activeBillTotal: 18.50, guestCount: 2, elapsedMinutes: 35, activeOrderItems: 3 },
  { id: 't-2', name: 'Table 02', section: 'Indoor Main Floor', capacity: 4, status: 'available' },
  { id: 't-3', name: 'Table 03', section: 'Indoor Main Floor', capacity: 4, status: 'occupied', activeBillTotal: 42.00, guestCount: 3, elapsedMinutes: 52, activeOrderItems: 6 },
  { id: 't-4', name: 'Table 04', section: 'Indoor Main Floor', capacity: 6, status: 'billing', activeBillTotal: 68.50, guestCount: 5, elapsedMinutes: 80, activeOrderItems: 8 },
  { id: 't-5', name: 'Terrace 01', section: 'Outdoor Garden Terrace', capacity: 2, status: 'available' },
  { id: 't-6', name: 'Terrace 02', section: 'Outdoor Garden Terrace', capacity: 4, status: 'occupied', activeBillTotal: 26.00, guestCount: 4, elapsedMinutes: 20, activeOrderItems: 4 },
  { id: 't-7', name: 'Terrace 03', section: 'Outdoor Garden Terrace', capacity: 4, status: 'available' },
  { id: 't-8', name: 'VIP Suite A', section: 'VIP Private Lounge', capacity: 10, status: 'occupied', activeBillTotal: 185.00, guestCount: 8, elapsedMinutes: 95, activeOrderItems: 14 },
  { id: 't-9', name: 'Bar Seat 01', section: 'Espresso Bar', capacity: 1, status: 'available' },
  { id: 't-10', name: 'Bar Seat 02', section: 'Espresso Bar', capacity: 1, status: 'occupied', activeBillTotal: 8.50, guestCount: 1, elapsedMinutes: 15, activeOrderItems: 2 },
  { id: 't-11', name: 'Bar Seat 03', section: 'Espresso Bar', capacity: 1, status: 'available' },
  { id: 't-12', name: 'Bar Seat 04', section: 'Espresso Bar', capacity: 1, status: 'available' },
];

interface FloorLayoutGridProps {
  onSelectTable?: (table: DiningTable) => void;
  selectedTableId?: string;
}

export function FloorLayoutGrid({ onSelectTable, selectedTableId }: FloorLayoutGridProps) {
  const [tables, setTables] = useState<DiningTable[]>(INITIAL_TABLES);
  const [activeSection, setActiveSection] = useState<string>('All');

  const sections = ['All', 'Indoor Main Floor', 'Outdoor Garden Terrace', 'VIP Private Lounge', 'Espresso Bar'];

  const filteredTables = activeSection === 'All'
    ? tables
    : tables.filter((t) => t.section === activeSection);

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const billingCount = tables.filter((t) => t.status === 'billing').length;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header & Summary Stats */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Dine-In Floor &amp; Table Layout</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live dining room occupancy, active table tabs, guest orders, and service timers
            </p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{availableCount} Available</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-black border border-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{occupiedCount} Dining</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-orange-50 text-orange-700 text-xs font-black border border-orange-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>{billingCount} Billing</span>
          </span>
        </div>
      </div>

      {/* 2. Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => setActiveSection(sec)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSection === sec
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* 3. Tables Interactive Floor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const isOccupied = table.status === 'occupied';
          const isBilling = table.status === 'billing';

          return (
            <motion.div
              key={table.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectTable && onSelectTable(table)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between h-[175px] shadow-sm ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                  : isOccupied
                  ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400'
                  : isBilling
                  ? 'border-orange-300 bg-orange-50/40 hover:border-orange-400'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-sm text-slate-900">{table.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{table.section}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isOccupied
                      ? 'bg-amber-100 text-amber-800'
                      : isBilling
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {table.status}
                </span>
              </div>

              {/* Occupied State Details */}
              {isOccupied || isBilling ? (
                <div className="space-y-1 my-1">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900">
                    <span className="text-slate-500 text-[11px] font-bold">Active Bill:</span>
                    <span className="text-orange-600 font-mono">
                      ${(table.activeBillTotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{table.guestCount} Guests</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-amber-700 font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{table.elapsedMinutes}m</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-2 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready for Guests</span>
                  </span>
                </div>
              )}

              {/* Footer Capacity */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Max {table.capacity} Seats</span>
                <span className="text-slate-900 font-bold">
                  {isOccupied ? `${table.activeOrderItems} Items` : '0 Active'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
