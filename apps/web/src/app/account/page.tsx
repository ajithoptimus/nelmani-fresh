"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { ordersApi } from "@/lib/api";
import type { Order, OrderStatus } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  refunded: "bg-orange-100 text-orange-600",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/account");
      return;
    }
    ordersApi.list().then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <main className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-500 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">Profile</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-0.5">Name</p>
              <p className="font-medium text-gray-900">{user?.full_name || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Phone</p>
              <p className="font-medium text-gray-900">{user?.phone || "—"}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-6">Order History</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-900 font-semibold mb-2">No orders yet</p>
              <Link href="/products" className="text-green-700 hover:text-green-600 font-medium text-sm">
                Shop now →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono font-bold text-green-700">{order.order_number}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="font-bold text-gray-900 mt-1">₹{order.total.toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-500">
                        <span>{item.product_name} — {item.variant_size_kg}kg × {item.quantity}</span>
                        <span>₹{item.total_price.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  {order.tracking_number && (
                    <div className="mt-3 text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                      🚚 Tracking: {order.tracking_number} {order.courier_name && `(${order.courier_name})`}
                    </div>
                  )}

                  {/* Status timeline */}
                  {order.status === "processing" && (
                    <div className="mt-3 text-xs bg-amber-50 text-amber-700 px-3 py-2 rounded-lg">
                      ⚙️ Your rice is being freshly processed. Expected dispatch: 3 working days from order.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
