export type PaymentMethod = 'manual_bkash' | 'gateway';

export interface IProduct {
  _id: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  videoUrl?: string;
  instructions?: string[];
  images?: string[];
}

export interface IReview {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export interface IBanner {
  _id?: string;
  heroTitle: string;
  heroSubtitle?: string;
  bannerImage?: string;
}

export interface ISettings {
  bkashNumber: string;
  activePaymentMethod: PaymentMethod;
}

export interface LandingPageData {
  banner: IBanner | null;
  products: IProduct[];
  reviews: IReview[];
  settings: ISettings | null;
}

export interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

export interface PlaceOrderPayload {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  product: string;
  quantity: number;
  source?: string;
  packageId?: string;
  paymentMethod: PaymentMethod;
  bkashNumber?: string;
  transactionId?: string;
  gatewayTransactionId?: string;
  gatewayPaymentId?: string;
}

export type ShippingZone = 'inside_dhaka' | 'outside_dhaka';
export type CheckoutPaymentOption = 'cod' | 'bkash' | 'gateway';
