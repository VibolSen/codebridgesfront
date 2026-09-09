'use client';

import { useState } from 'react';
import { Product, CartItem } from '@/components/pos';
import { getBarcodeProductApi, validateCouponApi } from '@/lib/api';

export function usePosCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => (i.product_id || i.product?.id) === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].qty += 1;
        return next;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          product,
        },
      ];
    });
  };

  const handleUpdateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const newQty = next[index].qty + delta;
      if (newQty <= 0) return next.filter((_, i) => i !== index);
      next[index].qty = newQty;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index));

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      const res = await getBarcodeProductApi(barcode);
      const product = res.data?.product || res.product;
      if (product) {
        handleAddToCart({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: Number(product.price),
          category: product.category,
        });
      } else {
        alert(`No product found for barcode: ${barcode}`);
      }
    } catch {
      alert(`Barcode lookup failed for: ${barcode}`);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    try {
      setCouponError('');
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const res = await validateCouponApi(code, subtotal);
      if (res.data?.coupon || res.coupon) {
        setAppliedCoupon(res.data?.coupon || res.coupon);
      }
    } catch (err: any) {
      setCouponError(err.message || 'Invalid or expired coupon code.');
    }
  };

  return {
    cart,
    setCart,
    appliedCoupon,
    setAppliedCoupon,
    couponError,
    handleAddToCart,
    handleUpdateQty,
    handleRemoveCartItem,
    handleClearCart,
    handleBarcodeScan,
    handleApplyCoupon,
  };
}
