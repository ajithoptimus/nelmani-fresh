/**
 * Nelmani Fresh — TypeScript Types
 * Mirrors the FastAPI Pydantic schemas for type safety.
 */

// ── Auth ──────────────────────────────────────────────────────────────────────
export type UserRole = "customer" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// ── Products ──────────────────────────────────────────────────────────────────
export interface ProductVariant {
  id: number;
  size_kg: number;
  sku: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  is_available: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductListItem {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  is_featured: boolean;
  primary_image: string | null;
  starting_price: number | null;
}

export interface ProductDetail {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  heritage_story: string | null;
  origin_region: string | null;
  nutritional_info: string | null;
  health_benefits: string | null;
  cooking_instructions: string | null;
  storage_instructions: string | null;
  processing_days: number;
  packaging_details: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
  average_rating: number | null;
  review_count: number;
}

export interface PaginatedProducts {
  items: ProductListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ── Cart ──────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  variant_id: number;
  product_name: string;
  product_slug: string;
  size_kg: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  primary_image: string | null;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  item_count: number;
}

// ── Orders ─────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: number;
  product_name: string;
  variant_size_kg: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  total: number;
  customer_notes: string | null;
  tracking_number: string | null;
  courier_name: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
  confirmed_at: string | null;
  processing_started_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  items: OrderItem[];
}

// ── Address ───────────────────────────────────────────────────────────────────
export interface Address {
  id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

export interface AddressInput {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  reviewer_name: string;
  is_verified_purchase: boolean;
  created_at: string;
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  featured_image_url: string | null;
  published_at: string | null;
}

export interface BlogPostDetail extends BlogPost {
  body: string;
  meta_title: string | null;
  meta_description: string | null;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export interface DashboardOverview {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  processing_orders: number;
  pending_orders: number;
  delivered_orders: number;
}

// ── Payments ──────────────────────────────────────────────────────────────────
export interface RazorpayOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ── Indian States (for checkout form) ────────────────────────────────────────
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];
