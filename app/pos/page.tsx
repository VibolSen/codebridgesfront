'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProductsApi,
  createSaleApi,
  getAuthUser,
  logoutApi,
  getActiveShiftApi,
  openShiftApi,
  closeShiftApi,
  holdCartApi,
  getHeldCartsApi,
  resumeHeldCartApi,
  deleteHeldCartApi,
  getBarcodeProductApi,
} from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Banknote,
  QrCode,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Clock,
  X,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  Barcode,
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock_on_hand: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export default function PosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Checkout & Sale Modals
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [tenderType, setTenderType] = useState<'cash' | 'khqr'>('cash');
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
  }, []);

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
      });
      setShowShiftCloseModal(false);
      setActiveShift(null);
      setShowShiftOpenModal(true);
    } catch (err: any) {
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
    } catch (err) {
      // If not barcode match, normal text filter applies
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

  const handleResumeCart = async (heldCartId: string) => {
    try {
      const res = await resumeHeldCartApi(heldCartId);
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

  const handleDeleteHeldCart = async (heldCartId: string) => {
    try {
      await deleteHeldCartApi(heldCartId);
      fetchHeldCarts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete held cart');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = 0;
  const grandTotal = subtotal + tax;
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
      setCompletedSale(res.data);
      setCart([]);
      setShowCheckoutModal(false);
      loadCatalog();
      checkActiveShift();
    } catch (err: any) {
      alert(err.message || 'Failed to complete transaction');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    await logoutApi();
    router.push('/login');
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
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-extrabold text-white shadow-md shadow-orange-500/30">
            POS
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Phnom Penh Central Outlet</h1>
            <p className="text-xs text-slate-400">Terminal REG-01</p>
          </div>
        </div>

        {/* Shift & Navigation Actions */}
        <div className="flex items-center gap-3">
          {activeShift ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Shift Open (Float: ${parseFloat(activeShift.opening_float || 0).toFixed(0)})</span>
              <button
                onClick={() => setShowShiftCloseModal(true)}
                className="ml-2 px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
              >
                Close Shift
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowShiftOpenModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> Open Shift
            </button>
          )}

          {heldCarts.length > 0 && (
            <button
              onClick={() => setShowHeldCartsModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <PauseCircle className="w-3.5 h-3.5" /> Held Carts ({heldCarts.length})
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/admin/dashboard')}
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Super Admin Dashboard
          </motion.button>

          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{user?.name || 'Cashier'}</p>
            <p className="text-xs text-orange-500 capitalize">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
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
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="flex flex-col text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-500/50 transition-all group shadow-xs"
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
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                >
                  <PauseCircle className="w-3.5 h-3.5" /> Hold
                </button>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1"
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
                <p className="text-[11px] text-slate-400">Select items from catalog or scan barcode to add.</p>
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
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-400">${Number(item.product.price).toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
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
              <div className="flex justify-between text-slate-500">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-orange-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={cart.length === 0}
              onClick={() => {
                setCashAmount(grandTotal.toFixed(2));
                setShowCheckoutModal(true);
              }}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2 text-sm"
            >
              Pay ${grandTotal.toFixed(2)}
            </motion.button>
          </div>

        </div>

      </div>

      {/* Shift Open Modal */}
      <AnimatePresence>
        {showShiftOpenModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Open Cashier Shift</h3>
                <p className="text-xs text-slate-500">Enter cash drawer opening float to begin selling</p>
              </div>

              <form onSubmit={handleOpenShift} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Cash Float ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={openingFloat}
                    onChange={(e) => setOpeningFloat(e.target.value)}
                    className="w-full text-xl font-bold px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  {isProcessing ? 'Opening Shift...' : 'Confirm & Open Shift'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shift Close Modal */}
      <AnimatePresence>
        {showShiftCloseModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Close Cashier Shift</h3>
                <button onClick={() => setShowShiftCloseModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              {shiftSummary && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
                  <div className="flex justify-between"><span>Opening Float:</span><span className="font-bold">${shiftSummary.opening_float.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Cash Sales:</span><span className="font-bold">${shiftSummary.cash_sales.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Cash In / Out:</span><span className="font-bold">${(shiftSummary.cash_in - shiftSummary.cash_out).toFixed(2)}</span></div>
                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5"><span>Expected Drawer Cash:</span><span className="text-orange-600">${shiftSummary.expected_cash.toFixed(2)}</span></div>
                </div>
              )}

              <form onSubmit={handleCloseShift} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Counted Cash in Drawer ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={countedCash}
                    onChange={(e) => setCountedCash(e.target.value)}
                    placeholder="Enter final counted cash"
                    className="w-full text-xl font-bold px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Closing Notes / Discrepancy Reason</label>
                  <textarea
                    rows={2}
                    value={closingNote}
                    onChange={(e) => setClosingNote(e.target.value)}
                    placeholder="Optional notes..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20"
                >
                  {isProcessing ? 'Closing Shift...' : 'Confirm & Close Shift'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Held Carts Modal */}
      <AnimatePresence>
        {showHeldCartsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PauseCircle className="w-5 h-5 text-amber-500" /> Held Carts Queue ({heldCarts.length})
                </h3>
                <button onClick={() => setShowHeldCartsModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3">
                {heldCarts.map((hCart) => (
                  <div key={hCart.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-orange-600 text-[10px] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{hCart.id}</span>
                      <h4 className="font-bold text-slate-900 mt-1">{hCart.customer_name}</h4>
                      <p className="text-slate-400 text-[10px]">{hCart.total_items} items • {new Date(hCart.held_at).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResumeCart(hCart.id)}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Resume
                      </button>
                      <button
                        onClick={() => handleDeleteHeldCart(hCart.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tender Payment Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Select Payment Tender</h3>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tender Switch Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setTenderType('cash')}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    tenderType === 'cash' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Banknote className="w-4 h-4" /> Cash Payment
                </button>
                <button
                  onClick={() => setTenderType('khqr')}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    tenderType === 'khqr' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> KHQR / ABA
                </button>
              </div>

              {tenderType === 'cash' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase">
                    Tendered Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full text-2xl font-extrabold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Change Due:</span>
                    <span className="text-base font-extrabold text-orange-600">${cashChange.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                    <div className="w-full h-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-700 text-xs font-mono font-bold">
                      [KHQR Mock]
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">Scan QR Code using ABA Mobile / Bakong app</p>
                </div>
              )}

              <button
                disabled={isProcessing || (tenderType === 'cash' && Number(cashAmount) < grandTotal)}
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all disabled:opacity-40"
              >
                {isProcessing ? 'Processing Transaction...' : 'Complete & Issue Receipt'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed Receipt Modal */}
      <AnimatePresence>
        {completedSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs border border-slate-200"
            >
              <div className="text-center space-y-1">
                <h2 className="text-sm font-extrabold uppercase tracking-wider">Phnom Penh Outlet</h2>
                <p className="text-[10px] text-slate-400">Official Sales Receipt</p>
                <p className="text-[10px] text-slate-400">{new Date().toLocaleString()}</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                <p>Receipt #: <span className="font-bold">{completedSale.sale.receipt_number}</span></p>
                <p>Cashier: <span className="font-bold">{user?.name}</span></p>
              </div>

              <div className="space-y-1">
                {completedSale.lines.map((l: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{l.product_name} x{l.quantity}</span>
                    <span className="font-bold">${Number(l.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-xs font-bold">
                <div className="flex justify-between text-sm">
                  <span>TOTAL:</span>
                  <span>${Number(completedSale.sale.grand_total).toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => setCompletedSale(null)}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-sans text-xs font-bold hover:bg-orange-600"
                >
                  Close & Next Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
