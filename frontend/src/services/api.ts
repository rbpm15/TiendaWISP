import type { Product, DashboardStats, StockAlert, StockMovement, ApiResponse, ChatMessage, Customer } from '../types/index.js';

const BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error en la petición');
  }
  return res.json();
}

// ── Products ──
export async function getProducts(filters?: {
  category?: string;
  brand?: string;
  search?: string;
  lowStock?: boolean;
}): Promise<{ data: Product[]; total: number }> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.brand) params.set('brand', filters.brand);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.lowStock) params.set('lowStock', 'true');
  const qs = params.toString();
  return fetchJSON(`${BASE}/products${qs ? `?${qs}` : ''}`);
}

export async function getProduct(id: number): Promise<ApiResponse<Product & { movements: StockMovement[] }>> {
  return fetchJSON(`${BASE}/products/${id}`);
}

export async function createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
  return fetchJSON(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<ApiResponse<Product>> {
  return fetchJSON(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  return fetchJSON(`${BASE}/products/${id}`, { method: 'DELETE' });
}

// ── Stock ──
export async function getStockAlerts(): Promise<{ data: StockAlert[]; total: number }> {
  return fetchJSON(`${BASE}/stock/alerts`);
}

export async function recordStockMovement(data: {
  productId: number;
  type: 'in' | 'out' | 'adjust';
  quantity: number;
  notes?: string;
}): Promise<ApiResponse<{ movement: StockMovement; product: Product }>> {
  return fetchJSON(`${BASE}/stock/movement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function getStockMovements(limit?: number): Promise<{ data: StockMovement[] }> {
  const qs = limit ? `?limit=${limit}` : '';
  return fetchJSON(`${BASE}/stock/movements${qs}`);
}

// ── Dashboard ──
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return fetchJSON(`${BASE}/dashboard/stats`);
}

// ── AI Chat ──
export async function getSessions(): Promise<{ data: string[] }> {
  return fetchJSON(`${BASE}/ai/sessions`);
}

export async function getChatHistory(sessionId = 'default'): Promise<{ data: ChatMessage[] }> {
  return fetchJSON(`${BASE}/ai/history?sessionId=${sessionId}`);
}

export async function clearChatHistory(sessionId = 'default'): Promise<void> {
  await fetchJSON(`${BASE}/ai/history?sessionId=${sessionId}`, { method: 'DELETE' });
}

export async function sendChatMessage(
  message: string,
  sessionId: string = 'default',
  model: string = 'openai/gpt-4o-mini',
  onChunk: (content: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): Promise<void> {
  try {
    const res = await fetch(`${BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, model }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error' }));
      onError(err.error || 'Error en el asistente');
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError('No se pudo leer la respuesta');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) onChunk(parsed.content);
            if (parsed.error) onError(parsed.error);
          } catch { /* skip */ }
        }
      }
    }
    onDone();
  } catch (err: any) {
    onError(err.message || 'Error de conexión');
  }
}

// ── Customers ──
export async function getCustomers(filters?: {
  search?: string;
  status?: string;
}): Promise<{ data: Customer[]; total: number }> {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.status) params.set('status', filters.status);
  const qs = params.toString();
  return fetchJSON(`${BASE}/customers${qs ? `?${qs}` : ''}`);
}

export async function createCustomer(data: Partial<Customer> & { equipmentIds?: number[] }): Promise<ApiResponse<Customer>> {
  return fetchJSON(`${BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(id: number, data: Partial<Customer> & { equipmentIds?: number[] }): Promise<ApiResponse<Customer>> {
  return fetchJSON(`${BASE}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: number): Promise<{ message: string }> {
  return fetchJSON(`${BASE}/customers/${id}`, { method: 'DELETE' });
}
