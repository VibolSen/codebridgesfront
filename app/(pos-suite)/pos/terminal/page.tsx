'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProductsApi,
  createSaleApi,
  getAuthUser,
  getActiveShiftApi,
  openShiftApi,
  closeShiftApi,
  holdCartApi,
  getHeldCartsApi,
  resumeHeldCartApi,
  deleteHeldCartApi,
  getBarcodeProductApi,
  getReceiptApi,
  syncOfflineSalesApi,
  validateCouponApi,
} from '@/lib/api';
import { getOfflineQueue, saveOfflineSale, clearOfflineQueue } from '@/lib/offlineSync';
import { ThermalReceiptModal } from '@/components/receipt/ThermalReceiptModal';
import { SalesReturnModal } from '@/components/returns/SalesReturnModal';
import { BakongKhqrModal } from '@/components/payments/BakongKhqrModal';
import { PosSuiteHeader, CashierQuickSwitchModal } from '@/components/pos';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Banknote,
  QrCode,
  ShoppingBag,
  Clock,
  X,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  Barcode,
  RotateCcw,
  Zap,
  Tag,
  CreditCard,
  LayoutDashboard,
} from 'lucide-react';
import { Product, CartItem } from '@/components/pos/types';

export default function PosTerminalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick-Switch Modal State
  const [showQuickSwitchModal, setShowQuickSwitchModal] = useState(false);

  // Checkout & Sale Modals
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showBakongModal, setShowBakongModal] = useState(false);
  const [tenderType, setTenderType] = useState<'cash' | 'khqr' | 'card'>('cash');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [completedSale, setCompletedSale] = useState<any>(null);

  // Shift Management States
  const [activeShift, setActiveShift] = useState<any>(null);
  const [shiftSummary, setShiftSummary] = useState<any>(null);
  const [showShiftOpenModal, setShowShiftOpenModal] = useState(false);
  const [showShiftCloseModal, setShowShiftCloseModal] = useState(false);
  const [openingFloat, setOpeningFloat] = useState('100.00');
  const [countedCash, setCountedCash] = useState('');
  const [closingNote, setClosingNote] = useState('');

  // Cart Hold & Resume States
  const [heldCarts, setHeldCarts] = useState<any[]>([]);
  const [showHeldCartsModal, setShowHeldCartsModal] = useState(false);
  const [customerNameInput, setCustomerNameInput] = useState('');

  // Offline Sync States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Coupon States
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  // Supervisor PIN
  const [supervisorPinInput, setSupervisorPinInput] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadCatalog();
    checkActiveShift();
    fetchHeldCarts();

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      setOfflineQueueCount(getOfflineQueue().length);

      const handleOnline = () => {
        setIsOnline(true);
        autoSyncOfflineQueue();
      };
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const updateOfflineCount = () => {
    setOfflineQueueCount(getOfflineQueue().length);
  };

  const handleSyncOfflineSales = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;
    try {
      setIsSyncing(true);
      await syncOfflineSalesApi(queue);
      clearOfflineQueue();
      updateOfflineCount();
      alert(`Successfully synced ${queue.length} offline transactions!`);
    } catch (err: any) {
      alert(err.message || 'Offline sync failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  const autoSyncOfflineQueue = async () => {
    const queue = getOfflineQueue();
    if (queue.length > 0) {
      try {
        await syncOfflineSalesApi(queue);
        clearOfflineQueue();
        updateOfflineCount();
      } catch (err) {
        console.error('Auto sync offline sales failed:', err);
      }
    }
  };

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const res = await getProductsApi(1);
      const items: Product[] = res.data || [];
      setProducts(items);

      const uniqueCats = Array.from(new Set(items.map((p) => p.category).filter(Boolean)));
      setCategories(['All', ...uniqueCats]);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkActiveShift = async () => {
    try {
      const res = await getActiveShiftApi();
      if (res.data && res.data.shift) {
        setActiveShift(res.data.shift);
        setShiftSummary(res.data.summary);
      } else {
        setActiveShift(null);
        setShowShiftOpenModal(true);
      }
    } catch (err) {
      console.error('Failed to check active shift:', err);
    }
  };

  const fetchHeldCarts = async () => {
    try {
      const res = await getHeldCartsApi();
      setHeldCarts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch held carts:', err);
    }
  };

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await openShiftApi({ opening_float: parseFloat(openingFloat || '0') });
      setShowShiftOpenModal(false);
      checkActiveShift();
    } catch (err: any) {
      alert(err.message || 'Failed to open shift');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    try {
      setIsProcessing(true);
      await closeShiftApi(activeShift.id, {
        counted_cash: parseFloat(countedCash || '0'),
        closing_note: closingNote,
        supervisor_pin: supervisorPinInput,
      });
      setShowShiftCloseModal(false);
      setShowPinPrompt(false);
      setSupervisorPinInput('');
      setActiveShift(null);
      setShowShiftOpenModal(true);
    } catch (err: any) {
      if (err.message?.includes('Supervisor PIN')) {
        setShowPinPrompt(true);
      }
      alert(err.message || 'Failed to close shift');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * Number(product.price),
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          subtotal: Number(product.price),
        },
      ];
    });
  };

  const handleBarcodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await getBarcodeProductApi(searchQuery.trim());
      if (res.data) {
        handleAddToCart({
          id: res.data.id,
          name: res.data.name,
          sku: res.data.sku,
          price: parseFloat(res.data.price),
          category: res.data.category || 'General',
          stock_on_hand: 100,
        });
        setSearchQuery('');
      }
    } catch {
      // Normal text filter continues
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * Number(item.product.price),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const handleHoldCart = async () => {
    if (cart.length === 0) return;
    try {
      await holdCartApi({
        customer_name: customerNameInput || 'Walk-in Customer',
        items: cart.map((c) => ({
          product_id: c.product.id,
          name: c.product.name,
          price: c.product.price,
          qty: c.quantity,
        })),
      });
      clearCart();
      setCustomerNameInput('');
      fetchHeldCarts();
    } catch (err: any) {
      alert(err.message || 'Failed to hold cart');
    }
  };

  const handleResumeCart = async (heldCartId: string | number) => {
    try {
      const res = await resumeHeldCartApi(String(heldCartId));
      const resumedCart = res.data;
      if (resumedCart && resumedCart.items) {
        const loadedItems: CartItem[] = resumedCart.items.map((i: any) => ({
          product: {
            id: i.product_id,
            name: i.name,
            sku: 'SKU-' + i.product_id,
            price: Number(i.price),
            category: 'General',
            stock_on_hand: 100,
          },
          quantity: i.qty,
          subtotal: Number(i.price) * i.qty,
        }));
        setCart(loadedItems);
        setShowHeldCartsModal(false);
        fetchHeldCarts();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to resume cart');
    }
  };

  const handleDeleteHeldCart = async (heldCartId: string | number) => {
    try {
      await deleteHeldCartApi(String(heldCartId));
      fetchHeldCarts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete held cart');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    try {
      setCouponError('');
      const res = await validateCouponApi(couponCodeInput, subtotal);
      setAppliedCoupon(res.data);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discount_amount) : 0;
  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = netSubtotal * 0.1;
  const grandTotal = netSubtotal + tax;
  const cashChange = Number(cashAmount) >= grandTotal ? Number(cashAmount) - grandTotal : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!activeShift) {
      alert('Please open a shift before completing transactions.');
      setShowShiftOpenModal(true);
      return;
    }
    setIsProcessing(true);

    try {
      if (!isOnline) {
        throw new Error('NETWORK_OFFLINE');
      }

      const idempotencyKey = `POS-SALE-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const saleData = {
        outlet_id: 1,
        register_id: 1,
        shift_id: activeShift.id,
        idempotency_key: idempotencyKey,
        tender_type: tenderType,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await createSaleApi(saleData);

      const createdSaleId = res.data?.sale?.id || res.data?.id;
      if (createdSaleId) {
        try {
          const receiptRes = await getReceiptApi(createdSaleId);
          setCompletedSale(receiptRes.data);
        } catch {
          setCompletedSale(res.data);
        }
      } else {
        setCompletedSale(res.data);
      }

      setCart([]);
      setShowCheckoutModal(false);
      loadCatalog();
      checkActiveShift();
    } catch (err: any) {
      if (err.message === 'NETWORK_OFFLINE' || err.message?.includes('Failed to fetch')) {
        const tenders = [
          {
            tender_type: tenderType,
            amount: tenderType === 'cash' ? Number(cashAmount) || grandTotal : grandTotal,
          },
        ];
        const savedOffline = saveOfflineSale(cart, tenders);

        setCompletedSale({
          sale: {
            receipt_number: savedOffline.receipt_number,
            grand_total: grandTotal,
            created_at: savedOffline.created_at,
          },
          lines: cart.map((item) => ({
            product_name: item.product.name,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
          })),
          is_offline: true,
        });

        setCart([]);
        setShowCheckoutModal(false);
        updateOfflineCount();
      } else {
        alert(err.message || 'Failed to complete transaction');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-800 overflow-hidden font-sans">
      {/* POS Suite Top Header */}
      <PosSuiteHeader
        user={user}
        activeShift={activeShift}
        heldCartsCount={heldCarts.length}
        offlineQueueCount={offlineQueueCount}
        isOnline={isOnline}
        isSyncing={isSyncing}
        onOpenShiftModal={() => setShowShiftOpenModal(true)}
        onCloseShiftModal={() => setShowShiftCloseModal(true)}
        onOpenHeldCartsModal={() => setShowHeldCartsModal(true)}
        onOpenReturnsModal={() => setShowReturnModal(true)}
        onSyncOffline={handleSyncOfflineSales}
        onOpenQuickSwitchModal={() => setShowQuickSwitchModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Area: Product Catalog */}
        <div className="flex-1 flex flex-col border-r border-slate-200 p-6 overflow-hidden bg-slate-50">
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
            {/* Search / Barcode Input */}
            <form onSubmit={handleBarcodeSearch} className="relative flex-1">
              <Barcode className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan barcode or search product / SKU..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
              />
            </form>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Loading product catalog...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No products found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, idx) => (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="flex flex-col text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-500/50 transition-all group shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                        {product.sku}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        Stock: {product.stock_on_hand}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-1 text-sm">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">{product.category || 'General'}</p>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100 w-full">
                      <span className="text-lg font-extrabold text-slate-900">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        +
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Interactive Cart Sidebar */}
        <div className="w-96 bg-white flex flex-col shrink-0 border-l border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              Current Order
              {cart.length > 0 && (
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </h2>
            {cart.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHoldCart}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 cursor-pointer"
                >
                  <PauseCircle className="w-3.5 h-3.5" /> Hold
                </button>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
                <ShoppingBag className="w-12 h-12 text-slate-300" />
                <p className="text-xs font-semibold text-slate-500">Cart is empty</p>
                <p className="text-[11px] text-slate-400">
                  Select items from catalog or scan barcode to add.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={item.product.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        ${Number(item.product.price).toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[55px]">
                      <span className="text-xs font-extrabold text-slate-900">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Cart Summary & Pay CTA */}
          <div className="p-4 border-t border-slate-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>VAT Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              {/* Coupon Code Input Box */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[10px] text-rose-500 font-bold">{couponError}</p>
                )}
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-orange-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0 || isProcessing}
              onClick={() => {
                setCashAmount(grandTotal.toFixed(2));
                setShowCheckoutModal(true);
              }}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Pay ${grandTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Payment Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Complete Payment</h3>
                  <p className="text-xs text-slate-400">Total: ${grandTotal.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tender Type Switcher */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTenderType('cash')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    tenderType === 'cash'
                      ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs">Cash</span>
                </button>

                <button
                  onClick={() => setTenderType('khqr')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    tenderType === 'khqr'
                      ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs">ABA KHQR</span>
                </button>

                <button
                  onClick={() => setTenderType('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    tenderType === 'card'
                      ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Card Pay</span>
                </button>
              </div>

              {/* Cash Tender Details */}
              {tenderType === 'cash' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Cash Received ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-500">Change Due:</span>
                    <span className="text-sm font-black text-emerald-600">
                      ${cashChange.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* ABA KHQR Trigger Modal Action */}
              {tenderType === 'khqr' && (
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-center space-y-2">
                  <QrCode className="w-8 h-8 text-orange-600 mx-auto" />
                  <p className="text-xs font-bold text-orange-900">
                    Instant Bakong KHQR Settlement
                  </p>
                  <p className="text-[11px] text-orange-700">
                    Generate dynamic QR code for customer mobile banking payment.
                  </p>
                  <button
                    onClick={() => setShowBakongModal(true)}
                    className="mt-2 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Open Dynamic KHQR Screen
                  </button>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isProcessing || (tenderType === 'cash' && Number(cashAmount) < grandTotal)}
                  onClick={handleCheckout}
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing...' : 'Confirm Payment'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bakong KHQR Modal */}
      <BakongKhqrModal
        isOpen={showBakongModal}
        onClose={() => setShowBakongModal(false)}
        amount={grandTotal}
        billNumber={`POS-INV-${Date.now().toString().slice(-6)}`}
        onPaymentApproved={() => {
          setShowBakongModal(false);
          handleCheckout();
        }}
      />

      {/* Sales Return Modal */}
      <SalesReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSuccess={() => {
          setShowReturnModal(false);
          loadCatalog();
        }}
      />

      {/* Thermal Receipt Print Modal */}
      {completedSale && (
        <ThermalReceiptModal
          receiptData={{
            sale: completedSale.sale || completedSale,
            lines: completedSale.lines || [],
            outlet: completedSale.outlet || { name: 'Phnom Penh Central Outlet' },
            cashier: completedSale.cashier || { name: user?.name || 'Cashier' },
            register: completedSale.register || { name: 'REG-01' },
            payments: completedSale.payments || [],
            is_reprint: false,
          }}
          onClose={() => setCompletedSale(null)}
        />
      )}

      {/* Open Shift Modal */}
      <AnimatePresence>
        {showShiftOpenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900">Open Cashier Shift</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter starting cash drawer float to begin sales.
                </p>
              </div>

              <form onSubmit={handleOpenShift} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">Opening Float ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={openingFloat}
                    onChange={(e) => setOpeningFloat(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => router.push('/pos')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Opening...' : 'Start Shift'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Shift Modal */}
      <AnimatePresence>
        {showShiftCloseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h3 className="font-black text-base text-slate-900">Close Cashier Shift</h3>
                </div>
                <button
                  onClick={() => setShowShiftCloseModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCloseShift} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Counted Cash ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Enter physical cash counted in drawer..."
                    value={countedCash}
                    onChange={(e) => setCountedCash(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Closing Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Any shift variance or notes..."
                    value={closingNote}
                    onChange={(e) => setClosingNote(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {showPinPrompt && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <label className="text-[11px] font-bold text-amber-900">
                      Supervisor 4-Digit PIN Required
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={supervisorPinInput}
                      onChange={(e) => setSupervisorPinInput(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-amber-300 text-center font-mono font-bold text-sm tracking-widest"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowShiftCloseModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Auditing...' : 'Confirm Shift Close'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cashier PIN Quick-Switch Modal */}
      <CashierQuickSwitchModal
        isOpen={showQuickSwitchModal}
        onClose={() => setShowQuickSwitchModal(false)}
        currentUser={user}
        onSwitchSuccess={(newUser) => {
          setUser(newUser);
          checkActiveShift();
        }}
      />
    </div>
  );
}
