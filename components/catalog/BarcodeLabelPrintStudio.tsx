'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Printer,
  QrCode,
  Barcode,
  Layers,
  Sparkles,
  Download,
  Settings,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface PrintableItem {
  id: string | number;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  currency: string;
  category: string;
}

const SAMPLE_PRODUCTS: PrintableItem[] = [
  { id: 1, name: 'Iced Caffe Latte (Large)', sku: 'BEV-LAT-01', barcode: '8849201948201', price: 3.50, currency: 'USD', category: 'Coffee' },
  { id: 2, name: 'Butter Croissant (Fresh)', sku: 'BAK-CRS-02', barcode: '8849201948218', price: 2.20, currency: 'USD', category: 'Bakery' },
  { id: 3, name: 'Matcha Green Tea Fusion', sku: 'BEV-MAT-03', barcode: '8849201948225', price: 4.00, currency: 'USD', category: 'Tea' },
  { id: 4, name: 'Cold Brew Reserve 250ml', sku: 'BEV-CLD-04', barcode: '8849201948232', price: 4.50, currency: 'USD', category: 'Bottled' },
];

export function BarcodeLabelPrintStudio() {
  const [items, setItems] = useState<PrintableItem[]>(SAMPLE_PRODUCTS);
  const [selectedFormat, setSelectedFormat] = useState<'CODE128' | 'EAN13' | 'QR'>('CODE128');
  const [labelSize, setLabelSize] = useState<'50x30' | '40x25' | 'A4_SHEET'>('50x30');
  const [showPrice, setShowPrice] = useState(true);
  const [showStoreName, setShowStoreName] = useState(true);
  const [copiesPerItem, setCopiesPerItem] = useState(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Configuration Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Barcode Type
            </label>
            <select
              value={selectedFormat}
              onChange={(e: any) => setSelectedFormat(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="CODE128">Code-128 (Alpha-Numeric)</option>
              <option value="EAN13">EAN-13 (Standard Retail)</option>
              <option value="QR">EMV / URL QR Code</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Roll Paper Format
            </label>
            <select
              value={labelSize}
              onChange={(e: any) => setLabelSize(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="50x30">50mm x 30mm (Thermal Roll)</option>
              <option value="40x25">40mm x 25mm (Compact Jewelry/Cafe)</option>
              <option value="A4_SHEET">A4 Sheet (3x8 Grid / 24 Labels)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Copies / SKU
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={copiesPerItem}
              onChange={(e) => setCopiesPerItem(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-center"
            />
          </div>

          <div className="flex items-center gap-4 pt-5 pl-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showPrice}
                onChange={(e) => setShowPrice(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
              <span>Include Price</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showStoreName}
                onChange={(e) => setShowStoreName(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
              <span>Store Header</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Barcode Labels</span>
        </button>
      </div>

      {/* Printable Sheet Preview */}
      <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Thermal Sticker Sheet Print Preview ({labelSize})</span>
            </p>
            <span className="text-xs text-slate-400 font-mono">
              Total Sticker Output: {items.length * copiesPerItem} labels
            </span>
          </div>

          {/* Grid of Thermal Sticker Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <React.Fragment key={item.id}>
                {[...Array(copiesPerItem)].map((_, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className="p-3.5 bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center justify-between text-center space-y-2 h-[150px]"
                  >
                    {showStoreName && (
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate w-full">
                        CODEBRIDGES STORE
                      </p>
                    )}

                    <div>
                      <p className="font-extrabold text-[11px] text-slate-900 leading-tight line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-[9px] font-mono text-slate-400 mt-0.5">{item.sku}</p>
                    </div>

                    {/* Barcode Graphic Simulation */}
                    <div className="w-full flex flex-col items-center">
                      {selectedFormat === 'QR' ? (
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                          <QrCode className="w-8 h-8" />
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-center">
                          {/* CSS Generated Authentic Barcode Strips */}
                          <div className="h-7 w-4/5 flex items-stretch justify-center gap-[2px] overflow-hidden bg-white">
                            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3].map(
                              (w, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-900"
                                  style={{ width: `${w}px` }}
                                />
                              )
                            )}
                          </div>
                          <p className="text-[9px] font-mono tracking-widest text-slate-700 font-bold mt-0.5">
                            {item.barcode}
                          </p>
                        </div>
                      )}
                    </div>

                    {showPrice && (
                      <p className="text-xs font-black text-orange-600 font-mono">
                        ${item.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
