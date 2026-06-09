'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchProduct, fetchSettings } from '@/lib/api';
import ProductDetailsPanel from '@/components/product/ProductDetailsPanel';
import ProductOrderForm from '@/components/order/ProductOrderForm';
import Footer from '@/components/sections/Footer';
import type { IProduct, ISettings } from '@/types';

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps): React.JSX.Element {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productData, paymentSettings] = await Promise.all([
        fetchProduct(productId),
        fetchSettings(),
      ]);
      setProduct(productData);
      setSettings(paymentSettings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'পণ্যের তথ্য লোড করা যায়নি।',
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="font-medium text-slate-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-red-600">{error || 'পণ্য পাওয়া যায়নি।'}</p>
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            সব আম দেখুন
          </Link>
        </div>
      </header>

      <main className="bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_400px] lg:items-start xl:grid-cols-[1fr_440px] xl:gap-10">
          <ProductDetailsPanel
            product={product}
            selectedPackageId={selectedPackageId}
            onPackageChange={setSelectedPackageId}
          />

          <div className="lg:sticky lg:top-6">
            <ProductOrderForm
              product={product}
              settings={settings}
              selectedPackageId={selectedPackageId}
              onPackageChange={setSelectedPackageId}
              hidePackageSelector
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
