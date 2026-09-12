'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { ModuleCard } from '@/components/ui';
import { PlatformModule } from './types';

interface ModuleRegistryTabProps {
  modulesList: PlatformModule[];
  getAdoptionCount: (moduleId: string) => number;
}

export function ModuleRegistryTab({ modulesList, getAdoptionCount }: ModuleRegistryTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {modulesList.map((mod) => {
          const adoption = getAdoptionCount(mod.id);

          return (
            <ModuleCard
              key={mod.id}
              name={mod.name}
              category={mod.category}
              icon={mod.icon}
              color={mod.color}
              bgColor={mod.bgColor}
              size="compact"
              actionSlot={
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100/90 text-[10px] font-bold text-slate-600">
                  <Building2 className="w-2.5 h-2.5 text-slate-400" />
                  <span>{adoption}</span>
                  <span className="text-slate-400 font-normal">{adoption === 1 ? 'org' : 'orgs'}</span>
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
