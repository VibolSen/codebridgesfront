'use client';

import React from 'react';

interface ReturnLineItemsTableProps {
  lines: any[];
  returnItems: {
    [saleLineId: string]: {
      quantity: number;
      restock_decision: 'restock' | 'wastage' | 'non_returnable';
      reason: string;
    };
  };
  onQuantityChange: (lineId: string, maxQty: number, val: number) => void;
  onDecisionChange: (lineId: string, decision: 'restock' | 'wastage' | 'non_returnable') => void;
}

export function ReturnLineItemsTable({
  lines,
  returnItems,
  onQuantityChange,
  onDecisionChange,
}: ReturnLineItemsTableProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        Select Items to Return &amp; Restock
      </h4>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Item</th>
              <th className="py-2.5 px-3">Price</th>
              <th className="py-2.5 px-3">Remaining</th>
              <th className="py-2.5 px-3 w-24">Return Qty</th>
              <th className="py-2.5 px-3">Restock Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lines.map((line: any) => {
              const item = returnItems[line.sale_line_id] || { quantity: 0, restock_decision: 'restock' };
              return (
                <tr key={line.sale_line_id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-900">{line.product_name}</p>
                    <p className="text-[10px] text-slate-400">
                      Purchased: {line.purchased_qty} • Returned: {line.already_returned_qty}
                    </p>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">
                    ${line.unit_price.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {line.remaining_returnable_qty}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="0"
                      max={line.remaining_returnable_qty}
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onQuantityChange(
                          line.sale_line_id,
                          line.remaining_returnable_qty,
                          parseInt(e.target.value || '0', 10)
                        )
                      }
                      disabled={line.remaining_returnable_qty <= 0}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-300 font-bold text-center text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand disabled:opacity-40"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <select
                      value={item.restock_decision}
                      onChange={(e: any) =>
                        onDecisionChange(line.sale_line_id, e.target.value)
                      }
                      disabled={item.quantity <= 0}
                      className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold focus:outline-none disabled:opacity-40"
                    >
                      <option value="restock">Restock into Inventory</option>
                      <option value="wastage">Mark Damaged / Wastage</option>
                      <option value="non_returnable">Discard / No Restock</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
