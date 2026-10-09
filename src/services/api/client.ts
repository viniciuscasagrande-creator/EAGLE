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

export async function keeperRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = localStorage.getItem('producer_token') || 'demo-producer-token';
  const tenantId =
    options.tenantId ||
    localStorage.getItem('tenant_id') ||
    '00000000-0000-0000-0000-000000000001';
  const companyId =
    options.companyId ||
    localStorage.getItem('company_id') ||
    '00000000-0000-0000-0000-000000000001';
  const producerId =
    options.producerId ||
    localStorage.getItem('producer_id') ||
    'prod-01';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-tenant-id': tenantId,
    'x-company-id': companyId,
    'x-producer-id': producerId,
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
    // Network / offline error - log informative message for debugging
    console.warn(`[Keeper Core API Adapter] Requisição offline para ${url}. Usando fallback local resiliente.`);
    throw err;
  }
}
