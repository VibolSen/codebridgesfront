'use client';

import React from 'react';
import {
  ReceiveStockShipmentModal,
  ReceiveFormState,
} from './modals/ReceiveStockShipmentModal';
import {
  RecordStockAdjustmentModal,
  AdjustFormState,
} from './modals/RecordStockAdjustmentModal';

export type { ReceiveFormState, AdjustFormState };

interface InventoryModalsProps {
  showReceiveModal: boolean;
  onCloseReceiveModal: () => void;
  receiveForm: ReceiveFormState;
  setReceiveForm: React.Dispatch<React.SetStateAction<ReceiveFormState>>;
  onSaveReceiveStock: (e: React.FormEvent) => void;
  showAdjustModal: boolean;
  onCloseAdjustModal: () => void;
  adjustForm: AdjustFormState;
  setAdjustForm: React.Dispatch<React.SetStateAction<AdjustFormState>>;
  onSaveStockAdjustment: (e: React.FormEvent) => void;
  selectedProductForAdjust: any;
  products: any[];
  saving: boolean;
}

export const InventoryModals: React.FC<InventoryModalsProps> = ({
  showReceiveModal,
  onCloseReceiveModal,
  receiveForm,
  setReceiveForm,
  onSaveReceiveStock,
  showAdjustModal,
  onCloseAdjustModal,
  adjustForm,
  setAdjustForm,
  onSaveStockAdjustment,
  selectedProductForAdjust,
  products,
  saving,
}) => {
  return (
    <>
      <ReceiveStockShipmentModal
        isOpen={showReceiveModal}
        onClose={onCloseReceiveModal}
        form={receiveForm}
        setForm={setReceiveForm}
        onSubmit={onSaveReceiveStock}
        products={products}
        saving={saving}
      />
      <RecordStockAdjustmentModal
        isOpen={showAdjustModal}
        onClose={onCloseAdjustModal}
        form={adjustForm}
        setForm={setAdjustForm}
        onSubmit={onSaveStockAdjustment}
        selectedProduct={selectedProductForAdjust}
        products={products}
        saving={saving}
      />
    </>
  );
};
