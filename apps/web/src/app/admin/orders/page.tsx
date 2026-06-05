"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { adminApi, ordersApi } from "@/lib/api";
import type { OrderStatus } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-orange-100 text-orange-700",
};

const STATUS_FLOW: OrderStatus[] = [
  "confirmed", "processing", "packed", "shipped", "delivered"
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") { router.push("/"); return; }
    loadOrders();
  }, [isAuthenticated, user, filterStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.orders(filterStatus || undefined);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      await ordersApi.updateStatus(orderId, { status });
      await loadOrders();
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-green-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-green-300 hover:text-white text-sm">← Dashboard</Link>
          <span className="text-white font-bold">Order Management</span>
        </div>
      </div>

      <div className="p-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["", "pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as OrderStatus | "")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterStatus === s ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="px-5 py-4 text-left">Order</th>
                  <th className="px-5 py-4 text-left">Customer</th>
                  <th className="px-5 py-4 text-left">Total</th>
                  <th className="px-5 py-4 text-left">Status</th>
                  <th className="px-5 py-4 text-left">Date</th>
                  <th className="px-5 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono font-semibold text-green-700">{order.order_number}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{order.customer_name || "—"}</p>
                        <p className="text-gray-400 text-xs">{order.customer_email}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">₹{order.total.toFixed(0)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, nextStatus)}
                            disabled={updating === order.id}
                            className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
                          >
                            {updating === order.id ? "..." : `Mark ${nextStatus}`}
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "cancelled")}
                            disabled={updating === order.id}
                            className="ml-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-400">No orders found</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
