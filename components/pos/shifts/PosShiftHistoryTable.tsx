'use client';

import React from 'react';
import { Calendar, User, FileText } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  Badge,
  Button,
} from '@/components/ui';

interface PosShiftHistoryTableProps {
  shiftHistory: any[];
  loading: boolean;
  onViewSummary?: (shift: any) => void;
}

export function PosShiftHistoryTable({
  shiftHistory,
  loading,
  onViewSummary,
}: PosShiftHistoryTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#5B4DFB]" />
          <span>Shift Auditing History &amp; Z-Reports</span>
        </CardTitle>
        <Badge variant="neutral" size="sm">
          {shiftHistory.length} recorded shifts
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="border-0 rounded-none shadow-none">
          <TableHeader>
            <TableRow>
              <TableHead>Shift ID</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Opened At</TableHead>
              <TableHead>Closed At</TableHead>
              <TableHead className="text-right">Float</TableHead>
              <TableHead className="text-right">Counted</TableHead>
              <TableHead className="text-right">Variance</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Slip</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shiftHistory.length === 0 ? (
              <TableEmptyState
                colSpan={9}
                title="No historical shifts recorded yet"
                description="Completed cashier shift sessions and fiscal Z-reports will appear here."
              />
            ) : (
              shiftHistory.map((shift) => {
                const isClosed = shift.status === 'closed';
                const variance = Number(shift.cash_variance ?? shift.cash_difference ?? 0);

                return (
                  <TableRow
                    key={shift.id}
                    className="cursor-pointer"
                    onClick={() => onViewSummary?.(shift)}
                  >
                    <TableCell className="font-mono font-bold text-slate-900">
                      {String(shift.id || '').slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{shift.cashier_name || shift.user_name || 'Cashier'}</span>
                      </div>
                      {shift.outlet_name && (
                        <p className="text-[10px] text-slate-400 font-medium">{shift.outlet_name}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(shift.opened_at || shift.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {shift.closed_at
                        ? new Date(shift.closed_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '— (Active)'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      ${Number(shift.opening_float || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {shift.counted_cash !== null && shift.counted_cash !== undefined
                        ? `$${Number(shift.counted_cash).toFixed(2)}`
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-black">
                      {isClosed ? (
                        <span
                          className={
                            variance === 0
                              ? 'text-emerald-600'
                              : variance > 0
                              ? 'text-blue-600'
                              : 'text-rose-600'
                          }
                        >
                          {variance >= 0 ? `+$${variance.toFixed(2)}` : `-$${Math.abs(variance).toFixed(2)}`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={isClosed ? 'neutral' : 'success'}
                        pulse={!isClosed}
                        size="sm"
                      >
                        {shift.status || 'closed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="xs"
                        iconLeft={<FileText className="w-3.5 h-3.5" />}
                        onClick={() => onViewSummary?.(shift)}
                        title="View Fiscal Slip"
                      >
                        {isClosed ? 'Z-Report' : 'X-Report'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
