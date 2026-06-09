'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatBdt, getProductUnitPrice } from '@/lib/formatters';
import PackageSelector from '@/components/order/PackageSelector';
import type { IProduct } from '@/types';

interface ProductDetailsPanelProps {
  product: IProduct;
  selectedPackageId: string | null;
  onPackageChange: (packageId: string | null) => void;
}

export default function ProductDetailsPanel({
  product,
  selectedPackageId,
  onPackageChange,
}: ProductDetailsPanelProps): React.JSX.Element {
  const images = product.images?.length ? product.images : [];
  const [activeImage, setActiveImage] = useState(images[0] ?? '');
  const price = getProductUnitPrice(product);
  const tags = product.instructions?.filter(Boolean) ?? [];

  return (
    <div className="space-y-5">
      {/* 1. Image */}
      <div className="w-full overflow-hidden rounded-2xl border-4 border-mango-orange bg-white shadow-md">
        <div className="relative aspect-square w-full bg-orange-50">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl">🥭</div>
          )}
        </div>

        {images.length > 1 && (
          <div className="border-t border-orange-100 p-3">
            <div className="flex gap-2 overflow-x-auto ">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20 ${
                    activeImage === src
                      ? 'border-orange-500 ring-2 ring-orange-200'
                      : 'border-transparent hover:border-orange-300'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${product.title} - ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Title */}
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
        {product.title}
      </h1>

      {/* 3. Price */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-2xl font-bold text-orange-600 sm:text-3xl">
          {formatBdt(price)}
        </span>
        {product.discountPrice != null && (
          <span className="text-lg text-slate-400 line-through">
            {formatBdt(product.price)}
          </span>
        )}
      </div>

      {/* 4. Tags */}
      {(tags.length > 0 || product.description) && (
        <div className="space-y-3">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {product.description && (
            <p className="text-base leading-relaxed text-slate-600">
              {product.description}
            </p>
          )}
        </div>
      )}

      {/* 5. Packages */}
      <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-5">
        <PackageSelector
          unitPrice={price}
          selectedPackageId={selectedPackageId}
          onChange={onPackageChange}
        />
      </div>
    </div>
  );
}
