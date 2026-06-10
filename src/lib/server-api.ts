import { API_BASE_URL } from '@/lib/constants';
import type {
  ApiSuccessResponse,
  IProduct,
  ISettings,
  LandingPageData,
} from '@/types';

const DEFAULT_REVALIDATE_SECONDS = 60;

async function fetchFromApi<T>(path: string, tags: string[]): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: {
      revalidate: DEFAULT_REVALIDATE_SECONDS,
      tags,
    },
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${path}`);
  }

  const payload = (await response.json()) as ApiSuccessResponse<T>;

  if (!payload?.success || payload.data == null) {
    throw new Error(payload?.message || `Failed to load ${path}`);
  }

  return payload.data;
}

export async function getLandingPageData(): Promise<LandingPageData> {
  return fetchFromApi<LandingPageData>('/landing-page', ['landing-page']);
}

export async function getProduct(productId: string): Promise<IProduct> {
  return fetchFromApi<IProduct>(`/product/${productId}`, [
    'product',
    `product-${productId}`,
  ]);
}

export async function getSettings(): Promise<ISettings> {
  return fetchFromApi<ISettings>('/settings', ['settings']);
}
