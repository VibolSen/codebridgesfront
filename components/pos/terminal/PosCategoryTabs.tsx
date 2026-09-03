'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PosCategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function PosCategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: PosCategoryTabsProps) {
  const allCategories = ['All', ...categories.filter((c) => c !== 'All')];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <motion.button
            key={cat}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-black'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs'
            }`}
          >
            {cat}
          </motion.button>
        );
      })}
    </div>
  );
}
