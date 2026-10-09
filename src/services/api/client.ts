// URL base do Keeper Core API
// Ordem de precedência:
// 1. localStorage.getItem('keeper_api_url') (override manual em tempo de execução para testes)
// 2. import.meta.env.VITE_KEEPER_API_URL (variável de ambiente do build/deploy)
// 3. '/api/v1' (proxy relativo padrão)
export function getKeeperApiUrl(): string {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('keeper_api_url');
    if (override) return override.replace(/\/+$/, '');
  }
  const envUrl = (import.meta as any).env?.VITE_KEEPER_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  return '/api/v1';
}

export interface RequestOptions extends RequestInit {
  producerId?: string;
  tenantId?: string;
  companyId?: string;
  idempotencyKey?: string;
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('producer_token');
}

export function saveAuthSession(session: {
  token: string;
  user: any;
  producer: any;
  tenantId?: string;
  companyId?: string;
}) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('producer_token', session.token);
  localStorage.setItem('producer_user', JSON.stringify(session.user));
  localStorage.setItem('producer_data', JSON.stringify(session.producer));
  if (session.producer?.id) {
    localStorage.setItem('producer_id', session.producer.id);
  }
  if (session.tenantId) {
    localStorage.setItem('tenant_id', session.tenantId);
  }
  if (session.companyId) {
    localStorage.setItem('company_id', session.companyId);
  }
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('producer_token');
  localStorage.removeItem('producer_user');
  localStorage.removeItem('producer_data');
  localStorage.removeItem('producer_id');
  localStorage.removeItem('tenant_id');
  localStorage.removeItem('company_id');
}

export async function keeperRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getAuthToken();
  const tenantId = options.tenantId || (typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null);
  const companyId = options.companyId || (typeof window !== 'undefined' ? localStorage.getItem('company_id') : null);
  const producerId = options.producerId || (typeof window !== 'undefined' ? localStorage.getItem('producer_id') : null);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
    ...(companyId ? { 'x-company-id': companyId } : {}),
    ...(producerId ? { 'x-producer-id': producerId } : {}),
    ...(options.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const baseUrl = getKeeperApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `Erro ${response.status}: ${response.statusText}`;
      let errorData = null;
      try {
        errorData = await response.json();
        errorMsg = errorData.detail || errorData.message || errorMsg;
      } catch {
        // use status text
      }
      throw new ApiError(errorMsg, response.status, errorData);
    }

    return await response.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network / offline error
    const msg = err.message || 'Falha de conexão com o Keeper ERP';
    console.error(`[Keeper Core API] Erro ao comunicar com ${url}:`, msg);
    throw new ApiError(msg, 0, { endpoint, originalError: err.message });
  }
}
