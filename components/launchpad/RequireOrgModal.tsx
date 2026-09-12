'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateOrgModal } from '@/components/tenant';
import { AppIcons } from '@/components/ui/icons';
import { buttonStyles, cardStyles } from '@/lib/theme';
import { modalBackdrop, modalContent } from '@/lib/animations';

interface RequireOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequireOrgModal({ isOpen, onClose }: RequireOrgModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && !isCreateModalOpen && (
          <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4">
            <motion.div
              variants={modalBackdrop}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${cardStyles.base} max-w-md w-full p-6 shadow-2xl text-slate-800 space-y-5 text-center relative z-10 my-auto`}
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-subtle text-brand flex items-center justify-center mx-auto shadow-inner border border-brand-border">
                <AppIcons.Organization className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Organization Required</h3>
                <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                  System modules are locked because you have not created or selected an active store
                  organization yet. Please create your organization to enable modules.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className={`w-full py-3 ${buttonStyles.primary}`}
                >
                  <AppIcons.Plus className="w-4 h-4" />
                  <span>Create Organization Now</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-full ${buttonStyles.secondary}`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CreateOrgModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          onClose();
        }}
        initialType="company"
        onOrgCreated={() => {
          setIsCreateModalOpen(false);
          onClose();
        }}
      />
    </>,
    document.body
  );
}
