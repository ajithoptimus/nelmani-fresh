"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/products", label: "Products", icon: "🌾" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.role !== "admin") { router.push("/"); return; }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <div className="bg-green-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
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

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-100 p-4">
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
          {children}
        </div>
      </div>
    </div>
  );
}
