import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import type {
  ApiSuccessResponse,
  IProduct,
  ISettings,
  LandingPageData,
  PlaceOrderPayload,
} from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchLandingPage(): Promise<LandingPageData> {
  const { data } = await api.get<ApiSuccessResponse<LandingPageData>>('/landing-page');

  if (!data?.success || !data.data) {
    throw new Error(data?.message || 'Failed to load landing page data.');
  }

  return data.data;
}

export async function fetchProduct(productId: string): Promise<IProduct> {
  const { data } = await api.get<ApiSuccessResponse<IProduct>>(`/product/${productId}`);

  if (!data?.success || !data.data) {
    throw new Error(data?.message || 'Failed to load product.');
  }

  return data.data;
}

export async function fetchSettings(): Promise<ISettings> {
  const { data } = await api.get<ApiSuccessResponse<ISettings>>('/settings');

  if (!data?.success || !data.data) {
    throw new Error(data?.message || 'Failed to load payment settings.');
  }

  return data.data;
}

export async function placeOrder(payload: PlaceOrderPayload) {
  const { data } = await api.post<ApiSuccessResponse<unknown>>(
    '/order/place-order',
    payload,
  );

  if (!data?.success) {
    throw new Error(data?.message || 'Failed to place order.');
  }

  return data;
}

export default api;
