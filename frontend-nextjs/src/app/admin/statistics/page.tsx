"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { adminService } from "@/services/adminService";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import Link from "next/link";
import { ChevronLeft, TrendingUp, Calendar, CalendarDays, DollarSign } from "lucide-react";

interface StatisticsData {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  totalRevenue: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  totalOrders: number;
  dailyRevenue: { date: string; revenue: number; orderCount: number }[];
  monthlyRevenue: { month: string; revenue: number; orderCount: number }[];
  orderStatusCounts: { status: string; count: number }[];
  topProducts: { productId: string; name: string; soldCount: number; revenue: number }[];
  revenueByPaymentMethod: { method: string; revenue: number; count: number }[];
}

const formatMoney = (amount: number) => {
  return amount.toLocaleString("vi-VN") + " đ";
};

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];
const STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

const PAYMENT_MAP: Record<string, string> = {
  CASH_ON_DELIVERY: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
  VNPAY: "VNPay",
  PAYOS: "PayOS",
};

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStatistics();
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1 py-10 flex items-center justify-center">
            <div className="text-primary font-medium animate-pulse">Đang tải dữ liệu thống kê...</div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !data) {
    return (
      <ProtectedRoute adminOnly>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1 py-10 flex items-center justify-center">
            <div className="text-red-500 font-medium">{error || "Không có dữ liệu"}</div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  // Format data for charts
  const statusData = data.orderStatusCounts.map(item => ({
    name: STATUS_MAP[item.status] || item.status,
    value: item.count
  }));

  const paymentData = data.revenueByPaymentMethod.map(item => ({
    name: PAYMENT_MAP[item.method] || item.method,
    value: item.revenue
  }));

  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-6 md:py-10">
          <Container>
            <div className="mb-8 flex items-center gap-4">
              <Link href="/admin" className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Thống Kê & Doanh Thu</h1>
                <p className="text-sm text-slate-500 mt-1">Tổng quan chi tiết về hoạt động kinh doanh</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-orange-500 to-orange-600 p-6 shadow-sm text-white transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2 opacity-90">
                  <div className="p-2 bg-white/20 rounded-lg"><TrendingUp size={20} /></div>
                  <h3 className="font-medium text-sm">Hôm nay</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{formatMoney(data.todayRevenue)}</p>
                <p className="text-xs opacity-80">{data.todayOrders} đơn hàng</p>
              </div>
              
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-sm text-white transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2 opacity-90">
                  <div className="p-2 bg-white/20 rounded-lg"><Calendar size={20} /></div>
                  <h3 className="font-medium text-sm">Tuần này</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{formatMoney(data.weekRevenue)}</p>
                <p className="text-xs opacity-80">{data.weekOrders} đơn hàng</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-sm text-white transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2 opacity-90">
                  <div className="p-2 bg-white/20 rounded-lg"><CalendarDays size={20} /></div>
                  <h3 className="font-medium text-sm">Tháng này</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{formatMoney(data.monthRevenue)}</p>
                <p className="text-xs opacity-80">{data.monthOrders} đơn hàng</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-sm text-white transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2 opacity-90">
                  <div className="p-2 bg-white/20 rounded-lg"><DollarSign size={20} /></div>
                  <h3 className="font-medium text-sm">Tổng doanh thu</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{formatMoney(data.totalRevenue)}</p>
                <p className="text-xs opacity-80">{data.totalOrders} đơn hàng</p>
              </div>
            </div>

            {/* Daily Revenue Area Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Doanh thu 30 ngày gần nhất</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyRevenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                    <YAxis yAxisId="left" tickFormatter={(val) => `${val/1000000}M`} tick={{fontSize: 12, fill: '#64748b'}} width={60} />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#64748b'}} width={40} />
                    <Tooltip 
                      formatter={(value: any, name: any) => {
                        if (name === "revenue") return [formatMoney(value), "Doanh thu"];
                        return [value, "Số đơn"];
                      }}
                      labelFormatter={(label) => `Ngày: ${label}`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area yAxisId="right" type="monotone" dataKey="orderCount" name="orderCount" stroke="#3b82f6" strokeWidth={2} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid gap-8 lg:grid-cols-2 mb-8">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Doanh thu 12 tháng</h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthlyRevenue} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis tickFormatter={(val) => `${val/1000000}M`} tick={{fontSize: 12, fill: '#64748b'}} width={60} />
                      <Tooltip 
                        formatter={(value: any) => [formatMoney(value), "Doanh thu"]}
                        labelFormatter={(label) => `Tháng: ${label}`}
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="revenue" fill="#ea580c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Trạng thái đơn hàng</h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} đơn`, "Số lượng"]}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Phương thức thanh toán (Doanh thu)</h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [formatMoney(value), "Doanh thu"]}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Top 10 Sản phẩm bán chạy</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 text-slate-500">
                      <tr>
                        <th className="pb-3 font-medium">#</th>
                        <th className="pb-3 font-medium">Sản phẩm</th>
                        <th className="pb-3 font-medium text-right">Đã bán</th>
                        <th className="pb-3 font-medium text-right">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.topProducts.map((product, idx) => (
                        <tr key={product.productId} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 text-slate-500 font-medium">{idx + 1}</td>
                          <td className="py-3 font-medium text-slate-800">{product.name}</td>
                          <td className="py-3 text-right text-emerald-600 font-medium">{product.soldCount}</td>
                          <td className="py-3 text-right text-orange-600 font-medium">{formatMoney(product.revenue)}</td>
                        </tr>
                      ))}
                      {data.topProducts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500">
                            Chưa có dữ liệu
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </Container>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
