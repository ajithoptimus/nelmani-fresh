"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { item_count, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow">
              N
            </div>
            <div>
              <span
                className={`font-bold text-lg transition-colors ${
                  scrolled ? "text-gray-900" : "text-white"
                }`}
              >
                Nelmani
              </span>
              <span
                className={`font-bold text-lg transition-colors ${
                  scrolled ? "text-green-700" : "text-amber-400"
                }`}
              >
                {" "}
                Fresh
              </span>
              <span
                className={`block text-xs leading-none -mt-0.5 transition-colors ${
                  scrolled ? "text-gray-400" : "text-green-300"
                }`}
              >
                Kerala Heritage Rice
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-700 ${
                  scrolled ? "text-gray-600" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={toggleCart}
              className={`relative p-2.5 rounded-xl transition-colors ${
                scrolled
                  ? "hover:bg-gray-100 text-gray-700"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {item_count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {item_count > 99 ? "99+" : item_count}
                </motion.span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className={`text-sm font-medium transition-colors hover:text-green-700 ${
                    scrolled ? "text-gray-600" : "text-white/90"
                  }`}
                >
                  Account
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-sm font-semibold bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${
                    scrolled ? "text-gray-600 hover:text-green-700" : "text-white/90"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-green-700 text-white px-5 py-2.5 rounded-full hover:bg-green-600 transition-colors shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                scrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="container mx-auto px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex gap-3">
                <Link href="/login" className="flex-1 text-center border border-green-700 text-green-700 py-2.5 rounded-full font-semibold">
                  Login
                </Link>
                <Link href="/register" className="flex-1 text-center bg-green-700 text-white py-2.5 rounded-full font-semibold">
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
