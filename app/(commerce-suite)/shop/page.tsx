'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  QrCode,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  X,
  Truck,
  Store,
  Sparkles,
} from 'lucide-react';
import { getProductsApi, createOnlineOrderApi } from '@/lib/api';
import { BakongKhqrModal } from '@/components/payments/BakongKhqrModal';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function PublicShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart & Fulfillment State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Payment & Order Confirmation State
  const [showKhqrModal, setShowKhqrModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductsApi();
      const items = (res.data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: Number(p.price || 0),
        category: p.category?.name || 'General',
      }));
      setProducts(items);

      const cats = Array.from(new Set(items.map((i: any) => i.category))) as string[];
      setCategories(['All', ...cats]);
    } catch (err) {
      console.error('Failed to load shop catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? 1.50 : 0.00;
  const taxAmount = roundTwo(subtotal * 0.10);
  const grandTotal = roundTwo(subtotal + taxAmount + deliveryFee);

  function roundTwo(val: number) {
    return Math.round(val * 100) / 100;
  }

  const handleStartKhqrCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your Name and Phone Number to proceed.');
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please provide your Delivery Address.');
      return;
    }
    setShowKhqrModal(true);
  };

  const handlePaymentApproved = async () => {
    setShowKhqrModal(false);
    try {
      setIsSubmitting(true);
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        payment_method: 'khqr',
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
      };

      const res = await createOnlineOrderApi(payload);
      setPlacedOrder(res.data);
      setCart([]);
      setShowCartDrawer(false);
    } catch (err: any) {
      alert(err.message || 'Order submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Top E-Commerce Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-500/30">
            F
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
              Freshmart Online Storefront <Sparkles className="w-4 h-4 text-orange-400" />
            </h1>
            <p className="text-[11px] text-slate-400">Order Online • Express Delivery or Store Pickup</p>
          </div>
        </div>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setShowCartDrawer(true)}
          className="relative px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/30 transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {cartTotalItems > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-orange-600 font-extrabold text-[10px] flex items-center justify-center">
              {cartTotalItems}
            </span>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Order Success Banner */}
        {placedOrder && (
          <div className="p-6 bg-emerald-950/60 border border-emerald-500/30 rounded-3xl space-y-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h2 className="text-lg font-black text-white">Order Confirmed! #{placedOrder.order_number}</h2>
                <p className="text-xs text-emerald-200">
                  Thank you! Your online order has been placed and is currently being prepared by our store staff.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPlacedOrder(null)}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Dismiss Banner
            </button>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-400">Loading storefront catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-2">
            <p className="text-base font-bold text-slate-300">No products found</p>
            <p className="text-xs text-slate-500">Try searching for a different item or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-md group"
              >
                <div className="w-full h-32 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600 font-mono font-bold text-xs uppercase group-hover:scale-105 transition-transform">
                  {p.sku}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{p.category}</span>
                  <h3 className="font-bold text-xs text-white line-clamp-1 mt-0.5">{p.name}</h3>
                  <p className="text-base font-extrabold text-white mt-1">${p.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => handleAddToCart(p)}
                  className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Order
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Cart & Checkout Slide-Over Drawer */}
      <AnimatePresence>
        {showCartDrawer && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                  <h2 className="font-bold text-sm text-white">Your Shopping Cart</h2>
                </div>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items & Customer Form */}
              <div className="p-5 overflow-y-auto flex-1 space-y-5">
                
                {/* Cart Items List */}
                {cart.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="text-xs font-semibold">Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-white">{item.product.name}</p>
                          <p className="text-[11px] text-slate-400">
                            ${item.product.price.toFixed(2)} x {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-md bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-md bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fulfillment Selection & Form */}
                {cart.length > 0 && (
                  <form onSubmit={handleStartKhqrCheckout} className="space-y-4 pt-4 border-t border-slate-800">
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
                        Fulfillment Option
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setDeliveryType('pickup')}
                          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            deliveryType === 'pickup'
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Store className="w-4 h-4" /> Store Pickup
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryType('delivery')}
                          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            deliveryType === 'delivery'
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Truck className="w-4 h-4" /> Delivery (+$1.50)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="012 345 6789..."
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {deliveryType === 'delivery' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Delivery Address *</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Street, House No, Phnom Penh..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    )}

                    {/* Summary Totals */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Tax (10% VAT):</span>
                        <span>${taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-slate-800 pt-1.5 flex justify-between font-extrabold text-sm text-white">
                        <span>Total Due:</span>
                        <span className="text-orange-400">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      Pay ${grandTotal.toFixed(2)} via Bakong KHQR
                    </button>
                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bakong KHQR Payment Modal */}
      <BakongKhqrModal
        isOpen={showKhqrModal}
        amount={grandTotal}
        currency="USD"
        onClose={() => setShowKhqrModal(false)}
        onPaymentApproved={handlePaymentApproved}
      />

    </div>
  );
}
