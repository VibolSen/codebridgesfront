'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  RefreshCw,
  PieChart,
  Receipt,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { getSalesReportApi, getShiftReportApi, getTaxReportApi } from '@/lib/api';

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'shifts' | 'tax'>('sales');
  const [loading, setLoading] = useState(true);

  const [salesData, setSalesData] = useState<any>(null);
  const [shiftData, setShiftData] = useState<any>(null);
  const [taxData, setTaxData] = useState<any>(null);

  useEffect(() => {
    loadActiveReport();
  }, [activeTab]);

  const loadActiveReport = async () => {
    try {
      setLoading(true);
      if (activeTab === 'sales') {
        const res = await getSalesReportApi();
        setSalesData(res.data);
      } else if (activeTab === 'shifts') {
        const res = await getShiftReportApi();
        setShiftData(res.data);
      } else if (activeTab === 'tax') {
        const res = await getTaxReportApi();
        setTaxData(res.data);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const exportUrl = `http://localhost:8080/api/v1/reports/export?type=${activeTab}`;
    
    // Create temporary download anchor
    const a = document.createElement('a');
    a.href = exportUrl;
    a.download = `report_${activeTab}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-orange-500" />
            Financial Reports & Analytics Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise revenue analysis, profit margins, cashier shift balances & tax settlement reports
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-orange-400" />
          Export {activeTab.toUpperCase()} Report (CSV)
        </button>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sales'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Sales & Profit Margin
        </button>
        <button
          onClick={() => setActiveTab('shifts')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'shifts'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" /> Cashier Shift Summaries
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tax'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-4 h-4" /> Tax & VAT Settlement
        </button>
      </div>

      {/* Main Tab Content */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 space-y-2 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500" />
          <p className="text-xs font-semibold">Generating analytics & financial metrics...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: Sales & Profit Margin */}
          {activeTab === 'sales' && salesData && (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                  <p className="text-2xl font-black text-slate-900 font-mono">
                    ${salesData.summary.total_revenue.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-500">Gross sales volume</p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated COGS</span>
                  <p className="text-2xl font-black text-slate-700 font-mono">
                    ${salesData.summary.cogs.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-500">60% cost of goods sold</p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Profit</span>
                  <p className="text-2xl font-black text-emerald-600 font-mono">
                    ${salesData.summary.gross_profit.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold">Net profit generated</p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profit Margin</span>
                  <p className="text-2xl font-black text-orange-600 font-mono">
                    {salesData.summary.gross_margin_pct}%
                  </p>
                  <p className="text-[10px] text-slate-500">Average net margin %</p>
                </div>
              </div>

              {/* Top Selling Products Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Top 10 Selling Products</h3>
                
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3 text-center">Units Sold</th>
                      <th className="py-2.5 px-3 text-right">Revenue Generated ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(salesData.top_products || []).map((tp: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{tp.product_name}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">{Number(tp.total_quantity)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-600">
                          ${Number(tp.total_revenue).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: Shift Summaries */}
          {activeTab === 'shifts' && shiftData && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Shifts Recorded</span>
                  <p className="text-3xl font-black text-slate-900 font-mono">{shiftData.summary.total_shifts}</p>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Opening Float Total</span>
                  <p className="text-3xl font-black text-slate-700 font-mono">${shiftData.summary.total_opening_float.toFixed(2)}</p>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Cash Drawer Variance</span>
                  <p className="text-3xl font-black text-amber-600 font-mono">${shiftData.summary.net_variance.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Recent Cashier Shifts Log</h3>
                
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Shift ID</th>
                      <th className="py-2.5 px-3">Float ($)</th>
                      <th className="py-2.5 px-3">Expected Cash ($)</th>
                      <th className="py-2.5 px-3">Actual Cash ($)</th>
                      <th className="py-2.5 px-3">Variance ($)</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(shiftData.shifts || []).map((sh: any) => (
                      <tr key={sh.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{sh.id.substring(0, 8)}...</td>
                        <td className="py-2.5 px-3 font-semibold">${Number(sh.opening_float).toFixed(2)}</td>
                        <td className="py-2.5 px-3 font-semibold">${Number(sh.expected_cash || 0).toFixed(2)}</td>
                        <td className="py-2.5 px-3 font-semibold">${Number(sh.actual_cash || 0).toFixed(2)}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-600">${Number(sh.variance || 0).toFixed(2)}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                            {sh.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: Tax & VAT Settlement */}
          {activeTab === 'tax' && taxData && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Taxable Sales (USD)</span>
                  <p className="text-3xl font-black text-slate-900 font-mono">${taxData.taxable_sales_usd.toFixed(2)}</p>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">10% VAT Collected (USD)</span>
                  <p className="text-3xl font-black text-orange-600 font-mono">${taxData.vat_collected_usd.toFixed(2)}</p>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grand Total (KHR Equivalent)</span>
                  <p className="text-3xl font-black text-emerald-600 font-mono">៛{taxData.grand_total_khr.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 shadow-lg">
                <h3 className="font-bold text-sm text-orange-400 uppercase tracking-wider">Official Tax Settlement Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <p className="text-slate-400">VAT Rate Applied:</p>
                    <p className="font-bold text-base">{taxData.vat_rate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Exchange Rate Benchmark:</p>
                    <p className="font-bold text-base">{taxData.exchange_rate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">VAT Payable KHR:</p>
                    <p className="font-bold text-base text-orange-400">៛{taxData.vat_collected_khr.toLocaleString()}</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}
