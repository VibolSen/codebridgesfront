'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Check,
  Coffee,
  Plus,
  Minus,
  DollarSign,
  FileText,
} from 'lucide-react';

export interface SelectedModifierState {
  size: { name: string; price: number };
  sweetness: string;
  temperature: string;
  addons: { id: string; name: string; price: number }[];
  note: string;
}

interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

interface ModifierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onConfirm: (product: any, modifiers: SelectedModifierState, finalPrice: number) => void;
}

const SIZE_OPTIONS: ModifierOption[] = [
  { id: 'sz-s', name: 'Regular / Small', price: 0 },
  { id: 'sz-m', name: 'Medium (+16oz)', price: 0.50 },
  { id: 'sz-l', name: 'Large (+22oz)', price: 1.00 },
];

const SWEETNESS_OPTIONS = ['0% (No Sugar)', '25% (Less Sweet)', '50% (Standard)', '75% (Sweet)', '100% (Full)'];
const TEMP_OPTIONS = ['Iced', 'Hot', 'Less Ice', 'No Ice'];

const TOPPING_OPTIONS: ModifierOption[] = [
  { id: 'top-1', name: 'Brown Sugar Boba Pearls', price: 0.50 },
  { id: 'top-2', name: 'Salted Cheese Foam', price: 0.75 },
  { id: 'top-3', name: 'Extra Espresso Shot', price: 0.60 },
  { id: 'top-4', name: 'Oat Milk Substitution', price: 0.75 },
  { id: 'top-5', name: 'Grass Jelly Cubes', price: 0.40 },
];

export function ModifierSelectionModal({
  isOpen,
  onClose,
  product,
  onConfirm,
}: ModifierSelectionModalProps) {
  const [selectedSize, setSelectedSize] = useState<ModifierOption>(SIZE_OPTIONS[0]);
  const [selectedSweetness, setSelectedSweetness] = useState<string>(SWEETNESS_OPTIONS[2]);
  const [selectedTemp, setSelectedTemp] = useState<string>(TEMP_OPTIONS[0]);
  const [selectedAddons, setSelectedAddons] = useState<ModifierOption[]>([]);
  const [specialNote, setSpecialNote] = useState<string>('');

  if (!isOpen || !product) return null;

  const basePrice = Number(product.price || 3.50);
  const addonsTotal = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
  const finalUnitPrice = basePrice + selectedSize.price + addonsTotal;

  const handleToggleAddon = (addon: ModifierOption) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleApply = () => {
    const modifierData: SelectedModifierState = {
      size: { name: selectedSize.name, price: selectedSize.price },
      sweetness: selectedSweetness,
      temperature: selectedTemp,
      addons: selectedAddons,
      note: specialNote,
    };
    onConfirm(product, modifierData, finalUnitPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">{product.name}</h2>
              <p className="text-[11px] text-orange-100 font-medium">
                Base Price: ${basePrice.toFixed(2)} • Customize Options &amp; Add-ons
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1. Size Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              1. Beverage Cup Size *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedSize.id === size.id
                      ? 'bg-orange-50/80 border-orange-500 text-orange-950 font-black shadow-xs ring-1 ring-orange-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 font-bold hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs">{size.name}</p>
                  <p className="text-[11px] text-orange-600 font-bold mt-0.5">
                    {size.price > 0 ? `+$${size.price.toFixed(2)}` : 'Included'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sweetness & Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                2. Sweetness Level
              </label>
              <select
                value={selectedSweetness}
                onChange={(e) => setSelectedSweetness(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {SWEETNESS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                3. Temperature / Ice
              </label>
              <select
                value={selectedTemp}
                onChange={(e) => setSelectedTemp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {TEMP_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Extra Add-ons */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              4. Extra Toppings &amp; Add-ons
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPPING_OPTIONS.map((topping) => {
                const isSelected = selectedAddons.some((a) => a.id === topping.id);
                return (
                  <button
                    key={topping.id}
                    type="button"
                    onClick={() => handleToggleAddon(topping)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 text-amber-950 font-black shadow-xs ring-1 ring-amber-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="text-xs">{topping.name}</p>
                      <p className="text-[11px] text-amber-700 font-bold">
                        +${topping.price.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? 'bg-amber-500 border-amber-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Special Kitchen Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Special Kitchen / Barista Instructions</span>
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Extra hot, separate lid, soy milk allergy..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Footer Summary & Add to Cart */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase">Item Total with Modifiers</p>
            <p className="text-xl font-black text-emerald-400 font-mono">
              ${finalUnitPrice.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Add to Cart (${finalUnitPrice.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
