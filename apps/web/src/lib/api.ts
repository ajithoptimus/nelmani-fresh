/**
 * Nelmani Fresh — API Client
 * Axios instance with automatic token refresh and auth interceptors.
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── Token management ────────────────────────────────────────────────────────
let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// ── Request interceptor — attach Bearer token ──────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — auto-refresh on 401 ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefresh = localStorage.getItem("refresh_token");
        if (!storedRefresh) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: storedRefresh,
        });

        accessToken = data.access_token;
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        accessToken = null;
        localStorage.removeItem("refresh_token");
        // Redirect to login — handled by consuming components
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── API helpers ─────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: RegisterData) => api.post("/auth/register", data),
  login: (data: LoginData) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const productsApi = {
  list: (params?: ProductListParams) => api.get("/products", { params }),
  get: (slug: string) => api.get(`/products/${slug}`),
  create: (data: unknown) => api.post("/products", data),
  update: (id: number, data: unknown) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  getReviews: (productId: number) => api.get(`/products/${productId}/reviews`),
  createReview: (productId: number, data: unknown) =>
    api.post(`/products/${productId}/reviews`, data),
};

export const cartApi = {
  get: () => api.get("/cart"),
  addItem: (variantId: number, quantity: number) =>
    api.post("/cart/items", { variant_id: variantId, quantity }),
  updateItem: (itemId: number, quantity: number) =>
    api.patch(`/cart/items/${itemId}`, { variant_id: 0, quantity }),
  removeItem: (itemId: number) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete("/cart"),
};

export const ordersApi = {
  create: (addressId: number, notes?: string) =>
    api.post("/orders", { address_id: addressId, customer_notes: notes }),
  list: () => api.get("/orders"),
  get: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, data: unknown) =>
    api.patch(`/orders/${id}/status`, data),
};

export const paymentsApi = {
  createRazorpayOrder: (orderId: number) =>
    api.post("/payments/create-order", { order_id: orderId }),
  verifyPayment: (data: unknown) => api.post("/payments/verify", data),
};

export const addressesApi = {
  list: () => api.get("/addresses"),
  create: (data: unknown) => api.post("/addresses", data),
  delete: (id: number) => api.delete(`/addresses/${id}`),
};

export const adminApi = {
  overview: () => api.get("/admin/analytics/overview"),
  orders: (status?: string) =>
    api.get("/admin/orders", { params: status ? { status } : {} }),
  customers: () => api.get("/admin/customers"),
  approveReview: (reviewId: number) =>
    api.patch(`/admin/reviews/${reviewId}/approve`),
  uploadImage: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);
    return api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const blogApi = {
  list: () => api.get("/blog"),
  get: (slug: string) => api.get(`/blog/${slug}`),
};

// ── Type stubs (expand with proper types) ───────────────────────────────────
interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ProductListParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_featured?: boolean;
  sort_by?: string;
}
