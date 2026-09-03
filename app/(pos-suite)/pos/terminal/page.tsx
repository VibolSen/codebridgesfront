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
  getOutletsApi,
} from '@/lib/api';
import { getOfflineQueue, saveOfflineSale, clearOfflineQueue } from '@/lib/offlineSync';
import { ThermalReceiptModal } from '@/components/receipt/ThermalReceiptModal';
import { SalesReturnModal } from '@/components/returns/SalesReturnModal';
import { BakongKhqrModal } from '@/components/payments/BakongKhqrModal';
import { CheckCircle2 } from 'lucide-react';
import {
  PosSuiteHeader,
  CashierQuickSwitchModal,
  PosCategoryTabs,
  PosProductGrid,
  PosBarcodeScanner,
  PosCartPanel,
  PosCheckoutModal,
  PosHoldCartModal,
  PosOfflineBanner,
  PosShiftOpenModal,
  PosShiftCloseModal,
  Product,
  CartItem,
} from '@/components/pos';

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

  // Modals
  const [showQuickSwitchModal, setShowQuickSwitchModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showBakongModal, setShowBakongModal] = useState(false);
  const [showHeldCartsModal, setShowHeldCartsModal] = useState(false);
  const [showShiftOpenModal, setShowShiftOpenModal] = useState(false);
  const [showShiftCloseModal, setShowShiftCloseModal] = useState(false);

  // States
  const [activeShift, setActiveShift] = useState<any>(null);
  const [heldCarts, setHeldCarts] = useState<any[]>([]);
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [defaultTender, setDefaultTender] = useState<'cash' | 'khqr' | 'card'>('cash');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saleToast, setSaleToast] = useState<string | null>(null);
  const [activeOutletId, setActiveOutletId] = useState<string | null>(null);

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

    getOutletsApi()
      .then((res: any) => {
        const list = res.data || res;
        if (Array.isArray(list) && list[0]?.id) {
          setActiveOutletId(String(list[0].id));
        }
      })
      .catch(() => {});

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

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const res = await getProductsApi();
      const rawProducts: any[] = Array.isArray(res) ? res : res.data || res.products || [];
      const formattedProducts: Product[] = rawProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || `SKU-${p.id}`,
        price: Number(p.price || p.selling_price || 0),
        category: p.category_name || (typeof p.category === 'object' ? p.category?.name : p.category) || 'General',
        stock: p.stock_quantity !== undefined ? p.stock_quantity : (p.stock !== undefined ? p.stock : 99),
        barcode: p.barcode || '',
      }));

      setProducts(formattedProducts);
      const cats = Array.from(new Set(formattedProducts.map((p) => p.category || 'General')));
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkActiveShift = async () => {
    try {
      const res = await getActiveShiftApi();
      if (res.data?.shift) {
        setActiveShift(res.data.shift);
      } else {
        setActiveShift({
          id: 'DEV-AUTO-SHIFT-01',
          opening_float: 100.0,
          status: 'open',
          opened_at: new Date().toISOString(),
        });
      }
    } catch {
      setActiveShift({
        id: 'DEV-FALLBACK-SHIFT',
        opening_float: 100.0,
        status: 'open',
        opened_at: new Date().toISOString(),
      });
    }
  };

  const fetchHeldCarts = async () => {
    try {
      const res = await getHeldCartsApi();
      setHeldCarts(res.data?.held_carts || res.held_carts || []);
    } catch {}
  };

  const autoSyncOfflineQueue = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;
    try {
      setIsSyncing(true);
      await syncOfflineSalesApi(queue);
      clearOfflineQueue();
      setOfflineQueueCount(0);
    } catch {
    } finally {
      setIsSyncing(false);
    }
  };

  // Cart Handlers
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
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index].qty = newQty;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleOpenCheckout = (tender: 'cash' | 'khqr' | 'card') => {
    if (cart.length === 0) return;
    setDefaultTender(tender);
    setShowCheckoutModal(true);
  };

  const handleCompleteSale = async (
    tenderType: 'cash' | 'khqr' | 'card',
    cashTendered: number,
    printReceipt: boolean = true
  ) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = appliedCoupon
      ? appliedCoupon.type === 'percentage'
        ? (subtotal * appliedCoupon.value) / 100
        : appliedCoupon.value
      : 0;
    const tax = Math.max(0, subtotal - discount) * 0.1;
    const grandTotal = Math.max(0, subtotal - discount) + tax;

    const salePayload = {
      outlet_id: activeOutletId || user?.outlet_id || '0d612401-62c2-4e9e-9857-69e40f24c86d',
      register_id: '9cd597e1-d134-4a91-b5e1-3dfd72c63554',
      idempotency_key: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      items: cart.map((i) => ({
        product_id: i.product_id || i.product?.id,
        name: i.name,
        quantity: i.qty,
        price: i.price,
      })),
      tender_type: tenderType,
      subtotal,
      discount_total: discount,
      discount_amount: discount,
      tax_total: tax,
      tax_amount: tax,
      grand_total: grandTotal,
      cash_tendered: tenderType === 'cash' ? cashTendered : grandTotal,
      shift_id: activeShift?.id || null,
    };

    if (!isOnline) {
      saveOfflineSale(salePayload);
      setOfflineQueueCount(getOfflineQueue().length);
      const offlineSale = {
        ...salePayload,
        receipt_number: `OFF-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      if (printReceipt) {
        setCompletedSale(offlineSale);
      } else {
        setSaleToast(`Sale recorded offline (${offlineSale.receipt_number})`);
        setTimeout(() => setSaleToast(null), 3500);
      }
      handleClearCart();
      return;
    }

    const res = await createSaleApi(salePayload);
    const saleResult = res.data?.sale || res.sale || salePayload;
    if (printReceipt) {
      setCompletedSale(saleResult);
    } else {
      setSaleToast(`Sale #${saleResult.receipt_number || 'OK'} completed (Receipt skipped)`);
      setTimeout(() => setSaleToast(null), 3500);
    }
    handleClearCart();
  };

  const handleHoldCart = async (customerName: string) => {
    await holdCartApi({
      customer_name: customerName,
      cart_data: cart,
    });
    fetchHeldCarts();
    handleClearCart();
  };

  const handleResumeCart = async (cartId: string) => {
    const res = await resumeHeldCartApi(cartId);
    const resumedItems = res.data?.cart_data || res.cart_data;
    if (resumedItems) {
      setCart(typeof resumedItems === 'string' ? JSON.parse(resumedItems) : resumedItems);
      fetchHeldCarts();
    }
  };

  const handleDeleteHeldCart = async (cartId: string) => {
    await deleteHeldCartApi(cartId);
    fetchHeldCarts();
  };

  const handleOpenShift = async (floatAmount: number, note: string) => {
    const res = await openShiftApi({ opening_float: floatAmount, note });
    if (res.data?.shift) setActiveShift(res.data.shift);
  };

  const handleCloseShift = async (countedCash: number, note: string, supervisorPin?: string) => {
    await closeShiftApi({ counted_cash: countedCash, note, supervisor_pin: supervisorPin });
    setActiveShift(null);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans flex flex-col select-none">
      {/* Header - Fixed & Pinned at top */}
      <div className="shrink-0 z-40">
        <PosSuiteHeader
          user={user}
          activeShift={activeShift}
          heldCartsCount={heldCarts.length}
          offlineQueueCount={offlineQueueCount}
          isOnline={isOnline}
          isSyncing={isSyncing}
          onOpenShiftModal={() => (activeShift ? setShowShiftCloseModal(true) : setShowShiftOpenModal(true))}
          onOpenHeldCartsModal={() => setShowHeldCartsModal(true)}
          onOpenReturnsModal={() => setShowReturnModal(true)}
          onSyncOffline={autoSyncOfflineQueue}
          onOpenQuickSwitchModal={() => setShowQuickSwitchModal(true)}
        />
      </div>

      {saleToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saleToast}</span>
        </div>
      )}

      {/* Main Terminal Layout - Fills viewport height without page scrolling */}
      <div className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left 8 Cols: Pinned Filters (Scanner, Categories) + Scrollable Product Grid */}
        <div className="lg:col-span-8 h-full flex flex-col min-h-0 overflow-hidden space-y-3">
          <div className="shrink-0">
            <PosOfflineBanner
              isOnline={isOnline}
              offlineQueueCount={offlineQueueCount}
              isSyncing={isSyncing}
              onSyncOffline={autoSyncOfflineQueue}
            />
          </div>

          <div className="shrink-0">
            <PosBarcodeScanner
              onScan={handleBarcodeScan}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <div className="shrink-0">
            <PosCategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Dedicated scrollable product catalogue */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-2 custom-scrollbar">
            <PosProductGrid
              products={products}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              loading={loading}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Right 4 Cols: Pinned Current Order Cart Panel */}
        <div className="lg:col-span-4 h-full flex flex-col min-h-0 overflow-hidden">
          <PosCartPanel
            cart={cart}
            appliedCoupon={appliedCoupon}
            couponError={couponError}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onOpenHoldModal={() => setShowHeldCartsModal(true)}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={() => setAppliedCoupon(null)}
            onOpenCheckout={handleOpenCheckout}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Reusable Modals */}
      <PosCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        defaultTender={defaultTender}
        onCompleteSale={handleCompleteSale}
        onTriggerKhqrModal={() => setShowBakongModal(true)}
      />

      <PosHoldCartModal
        isOpen={showHeldCartsModal}
        onClose={() => setShowHeldCartsModal(false)}
        cart={cart}
        heldCarts={heldCarts}
        onConfirmHold={handleHoldCart}
        onResumeCart={handleResumeCart}
        onDeleteHeldCart={handleDeleteHeldCart}
      />

      <PosShiftOpenModal
        isOpen={showShiftOpenModal}
        onClose={() => setShowShiftOpenModal(false)}
        onConfirmOpen={handleOpenShift}
      />

      <PosShiftCloseModal
        isOpen={showShiftCloseModal}
        onClose={() => setShowShiftCloseModal(false)}
        activeShift={activeShift}
        onConfirmClose={handleCloseShift}
      />

      {completedSale && (
        <ThermalReceiptModal
          isOpen={Boolean(completedSale)}
          onClose={() => setCompletedSale(null)}
          saleData={completedSale}
        />
      )}

      <SalesReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onReturnProcessed={() => {
          setShowReturnModal(false);
          checkActiveShift();
        }}
      />

      <BakongKhqrModal
        isOpen={showBakongModal}
        onClose={() => setShowBakongModal(false)}
        amount={cart.reduce((sum, item) => sum + item.price * item.qty, 0) * 1.1}
        salePayload={{
          outlet_id: activeOutletId || user?.outlet_id || '0d612401-62c2-4e9e-9857-69e40f24c86d',
          register_id: '9cd597e1-d134-4a91-b5e1-3dfd72c63554',
          idempotency_key: `khqr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          items: cart.map((i) => ({
            product_id: i.product_id || i.product?.id,
            name: i.name,
            quantity: i.qty,
            price: i.price,
          })),
        }}
        onSuccess={(sale) => {
          setCompletedSale(sale);
          handleClearCart();
          setShowBakongModal(false);
        }}
      />

      <CashierQuickSwitchModal
        isOpen={showQuickSwitchModal}
        onClose={() => setShowQuickSwitchModal(false)}
        onSuccess={(switchedUser) => {
          setUser(switchedUser);
          setShowQuickSwitchModal(false);
        }}
      />
    </div>
  );
}
