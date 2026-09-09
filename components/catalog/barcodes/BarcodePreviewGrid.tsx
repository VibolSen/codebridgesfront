'use client';

import React from 'react';
import { BarcodeProductItem } from './types';

interface BarcodePreviewGridProps {
  selectedItems: BarcodeProductItem[];
  showSku: boolean;
  showPrice: boolean;
}

export function BarcodePreviewGrid({
  selectedItems,
  showSku,
  showPrice,
}: BarcodePreviewGridProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider print:hidden">
        Sticker Sheet Live Preview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-100 rounded-xl print:bg-white print:p-0 print:grid-cols-3">
        {selectedItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs font-semibold print:hidden">
            Select items above to generate barcode sticker previews.
          </div>
        ) : (
          selectedItems.flatMap((item) =>
            Array.from({ length: item.printQty }).map((_, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="p-3 bg-white border border-slate-300 rounded-lg shadow-2xs flex flex-col items-center justify-center text-center space-y-1 font-mono"
              >
                <span className="text-[10px] font-bold text-slate-900 truncate w-full">{item.name}</span>
                <div className="w-full h-8 bg-slate-900 rounded-sm flex items-center justify-center text-[8px] text-white tracking-widest font-mono">
                  ||||| | |||| ||| |||||||
                </div>
                <div className="flex justify-between w-full text-[9px] text-slate-600 font-bold px-1">
                  {showSku && <span>{item.sku || 'SKU-001'}</span>}
                  {showPrice && <span className="text-orange-600">${Number(item.price).toFixed(2)}</span>}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
