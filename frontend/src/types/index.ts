export interface Product {
  id: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  frequency: string | null;
  gainDbi: number | null;
  maxDistanceKm: number | null;
  throughput: string | null;
  poeType: string | null;
  linkType: string | null;
  useCase: string | null;
  quantity: number;
  minStock: number;
  costPrice: number;
  sellPrice: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  type: 'in' | 'out' | 'adjust';
  quantity: number;
  notes: string;
  createdAt: string;
  product?: { name: string; sku: string; brand: string };
}

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
  categories: Record<string, { count: number; totalQty: number }>;
  brands: Record<string, number>;
}

export interface StockAlert extends Product {
  deficit: number;
  status: 'sin_stock' | 'stock_bajo';
}

export type ApiResponse<T> = {
  data: T;
  total?: number;
  message?: string;
  error?: string;
};

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  monthlyFee: number;
  paymentDay: number;
  status: 'active' | 'suspended' | 'cancelled';
  notes: string;
  equipmentIds: string; // JSON array string
  createdAt: string;
  updatedAt: string;
}

