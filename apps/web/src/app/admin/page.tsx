"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { adminApi } from "@/lib/api";
import type { DashboardOverview } from "@/types";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🌾" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.role !== "admin") { router.push("/"); return; }
    loadOverview();
  }, [isAuthenticated, user]);

  const loadOverview = async () => {
    try {
      const { data } = await adminApi.overview();
      setOverview(data);
    } finally {
      setLoading(false);
    }
  };

  const metrics = overview
    ? [
        { label: "Total Orders", value: overview.total_orders, icon: "📦", color: "bg-blue-50 text-blue-700" },
        { label: "Revenue", value: `₹${overview.total_revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, icon: "💰", color: "bg-green-50 text-green-700" },
        { label: "Customers", value: overview.total_customers, icon: "👥", color: "bg-purple-50 text-purple-700" },
        { label: "Processing", value: overview.processing_orders, icon: "⚙️", color: "bg-amber-50 text-amber-700" },
        { label: "Pending Payment", value: overview.pending_orders, icon: "⏳", color: "bg-orange-50 text-orange-700" },
        { label: "Delivered", value: overview.delivered_orders, icon: "✅", color: "bg-emerald-50 text-emerald-700" },
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-green-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center font-bold">N</div>
            <span className="font-bold">Nelmani Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-300 text-sm">{user?.email}</span>
          <Link href="/" className="text-sm text-green-400 hover:text-white transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-56px)] bg-white border-r border-gray-100 p-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors font-medium text-sm"
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.full_name || user?.email}</p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6"
                >
                  <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {metric.icon}
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Quick links */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <Link href="/admin/orders" className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all group">
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700">📦 Manage Orders</h3>
              <p className="text-sm text-gray-400">View and update order processing status</p>
            </Link>
            <Link href="/admin/products" className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all group">
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700">🌾 Manage Products</h3>
              <p className="text-sm text-gray-400">Add, edit, and manage rice varieties</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
