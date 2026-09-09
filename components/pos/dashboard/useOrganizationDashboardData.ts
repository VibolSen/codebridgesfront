'use client';

import { useState, useEffect } from 'react';
import {
  getAuthUser,
  getActiveShiftApi,
  getHeldCartsApi,
  getDashboardWidgetsApi,
  getDashboardSummaryApi,
} from '@/lib/api';
import { getOfflineQueue } from '@/lib/offlineSync';
import { PosKpis, RecentPosSale, HeldCart } from '../types';

export function useOrganizationDashboardData(
  initialUser: any,
  externalActiveShift?: any
) {
  const [user, setUser] = useState<any>(initialUser || null);
  const [orgName, setOrgName] = useState<string>('My Store Organization');
  const [loading, setLoading] = useState(true);

  // Shift & Drawer
  const [activeShift, setActiveShift] = useState<any>(externalActiveShift || null);
  const [shiftSummary, setShiftSummary] = useState<any>(null);

  // KPIs & Counts
  const [kpis, setKpis] = useState<PosKpis>({
    todaySales: 0,
    todayTransactions: 0,
    averageTicket: 0,
    drawerFloat: 0,
    cashSales: 0,
    khqrSales: 0,
    cardSales: 0,
  });
  const [ecosystemStats, setEcosystemStats] = useState({
    lowStockCount: 0,
    customersCount: 0,
  });

  // Recent Sales, Top Sellers, Registers & Carts
  const [recentSales, setRecentSales] = useState<RecentPosSale[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [registerFleet, setRegisterFleet] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([]);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  useEffect(() => {
    const currentUser = initialUser || getAuthUser();
    if (currentUser) setUser(currentUser);
    if (typeof window !== 'undefined') {
      const storedOrg = localStorage.getItem('cb_active_org_name');
      if (storedOrg) setOrgName(storedOrg);
      setOfflineQueueCount(getOfflineQueue().length);
    }
  }, [initialUser]);

  useEffect(() => {
    if (externalActiveShift !== undefined) setActiveShift(externalActiveShift);
  }, [externalActiveShift]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      let calculatedKpis: PosKpis = {
        todaySales: 0,
        todayTransactions: 0,
        averageTicket: 0,
        drawerFloat: 0,
        cashSales: 0,
        khqrSales: 0,
        cardSales: 0,
      };

      const [shiftResult, cartsResult, widgetsResult, summaryResult] =
        await Promise.allSettled([
          getActiveShiftApi(),
          getHeldCartsApi(),
          getDashboardWidgetsApi(),
          getDashboardSummaryApi(),
        ]);

      if (shiftResult.status === 'fulfilled' && shiftResult.value?.data?.shift) {
        const shiftData = shiftResult.value.data.shift;
        const summaryData = shiftResult.value.data.summary || {};
        setActiveShift(shiftData);
        setShiftSummary(summaryData);

        const cash = parseFloat(summaryData.cash_sales_total || '0');
        const khqr = parseFloat(summaryData.khqr_sales_total || '0');
        const card = parseFloat(summaryData.card_sales_total || '0');
        const totalSales = cash + khqr + card;
        const txCount = parseInt(summaryData.transactions_count || '0', 10);
        const avg = txCount > 0 ? totalSales / txCount : 0;
        const float = parseFloat(shiftData.opening_float || '0');

        calculatedKpis = {
          todaySales: totalSales,
          todayTransactions: txCount,
          averageTicket: avg,
          drawerFloat: float,
          cashSales: cash,
          khqrSales: khqr,
          cardSales: card,
        };

        setRegisterFleet([
          {
            id: String(shiftData.id),
            name: 'Main Counter Register',
            code: 'REG-01',
            cashierName: user?.name || 'Assigned Cashier',
            status: 'active',
            openTime: shiftData.opened_at
              ? new Date(shiftData.opened_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Active Now',
            openingFloat: float,
            cashSales: cash,
            khqrSales: khqr,
            totalSales: totalSales,
            ordersCount: txCount,
          },
        ]);
      } else {
        setActiveShift(null);
        setShiftSummary(null);
        setRegisterFleet([]);
      }

      if (cartsResult.status === 'fulfilled' && Array.isArray(cartsResult.value?.data)) {
        setHeldCarts(cartsResult.value.data);
      } else {
        setHeldCarts([]);
      }

      if (summaryResult.status === 'fulfilled' && summaryResult.value?.data?.counts) {
        const counts = summaryResult.value.data.counts;
        setEcosystemStats({
          lowStockCount: counts.low_stock || 0,
          customersCount: counts.customers || 0,
        });
      }

      const widgetsRes = widgetsResult.status === 'fulfilled' ? widgetsResult.value : null;
      const salesList = widgetsRes?.data?.recent_sales || widgetsRes?.recent_sales || [];
      const topList = widgetsRes?.data?.top_selling || widgetsRes?.top_selling || [];

      if (Array.isArray(salesList) && salesList.length > 0) {
        const parsedSales: RecentPosSale[] = salesList.map((s: any) => ({
          id: s.id,
          receipt_number: s.receipt_number || `REC-${String(s.id).padStart(6, '0')}`,
          customer_name: s.customer || s.customer_name || 'Walk-in Customer',
          created_at: s.created_at
            ? new Date(s.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Today',
          grand_total: parseFloat(s.grand_total || s.total || '0'),
          tender_type: s.tender_type || 'cash',
          status: s.status || 'Completed',
        }));
        setRecentSales(parsedSales);

        if (calculatedKpis.todayTransactions === 0 && parsedSales.length > 0) {
          const sumSales = parsedSales.reduce((acc, s) => acc + s.grand_total, 0);
          calculatedKpis.todaySales = sumSales;
          calculatedKpis.todayTransactions = parsedSales.length;
          calculatedKpis.averageTicket = sumSales / parsedSales.length;
          calculatedKpis.cashSales = parsedSales
            .filter((s) => s.tender_type === 'cash')
            .reduce((a, b) => a + b.grand_total, 0);
          calculatedKpis.khqrSales = parsedSales
            .filter((s) => s.tender_type === 'khqr')
            .reduce((a, b) => a + b.grand_total, 0);
          calculatedKpis.cardSales = parsedSales
            .filter((s) => s.tender_type === 'card')
            .reduce((a, b) => a + b.grand_total, 0);
        }

        const hours = [
          '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
          '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
        ];
        const hourlyMap: { [hour: string]: { sales: number; transactions: number } } = {};
        hours.forEach((h) => {
          hourlyMap[h] = { sales: 0, transactions: 0 };
        });

        salesList.forEach((s: any) => {
          if (s.created_at) {
            const d = new Date(s.created_at);
            const hourStr = `${String(d.getHours()).padStart(2, '0')}:00`;
            if (hourlyMap[hourStr]) {
              hourlyMap[hourStr].sales += parseFloat(s.grand_total || s.total || '0');
              hourlyMap[hourStr].transactions += 1;
            }
          }
        });

        setHourlyData(
          hours.map((h) => ({
            hour: h,
            sales: hourlyMap[h].sales,
            transactions: hourlyMap[h].transactions,
          }))
        );
      } else {
        setRecentSales([]);
        setHourlyData([]);
      }

      if (Array.isArray(topList) && topList.length > 0) {
        setTopSellers(
          topList.map((t: any) => ({
            id: t.id,
            name: t.name || 'Product',
            category: t.category || 'General',
            qtySold: parseInt(t.sales_count || '0', 10),
            revenue: parseFloat(t.total_revenue || '0'),
            stockRemaining: parseInt(t.stock_remaining || '0', 10),
          }))
        );
      } else {
        setTopSellers([]);
      }

      setKpis(calculatedKpis);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    user,
    orgName,
    loading,
    activeShift,
    setActiveShift,
    shiftSummary,
    kpis,
    ecosystemStats,
    recentSales,
    topSellers,
    registerFleet,
    hourlyData,
    heldCarts,
    setHeldCarts,
    offlineQueueCount,
    setOfflineQueueCount,
    loadDashboardData,
  };
}
