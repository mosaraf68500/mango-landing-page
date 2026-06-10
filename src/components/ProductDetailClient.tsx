'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductDetailsPanel from '@/components/product/ProductDetailsPanel';
import ProductOrderForm from '@/components/order/ProductOrderForm';
import Footer from '@/components/sections/Footer';
import type { IProduct, ISettings } from '@/types';

interface ProductDetailClientProps {
  product: IProduct;
  settings: ISettings | null;
}

export default function ProductDetailClient({
  product,
  settings,
}: ProductDetailClientProps): React.JSX.Element {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  return (
    <>
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            aria-label="সব আম দেখতে ফিরে যান"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            সব আম দেখুন
          </Link>
        </div>
      </header>

      <main id="main-content" className="bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_400px] lg:items-start xl:grid-cols-[1fr_440px] xl:gap-10">
          <ProductDetailsPanel
            product={product}
            selectedPackageId={selectedPackageId}
            onPackageChange={setSelectedPackageId}
          />

          <aside className="lg:sticky lg:top-6" aria-label="অর্ডার ফর্ম">
            <ProductOrderForm
              product={product}
              settings={settings}
              selectedPackageId={selectedPackageId}
              onPackageChange={setSelectedPackageId}
              hidePackageSelector
            />
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
