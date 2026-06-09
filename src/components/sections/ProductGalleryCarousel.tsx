'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatBdt, getProductUnitPrice } from '@/lib/formatters';
import type { IProduct } from '@/types';

interface ProductGalleryCarouselProps {
  products: IProduct[];
}

const DESKTOP_CARDS = 4;
const AUTO_PLAY_MS = 3000;

function ProductCard({ product }: { product: IProduct }): React.JSX.Element {
  const price = getProductUnitPrice(product);
  const imageSrc = product.images?.[0];

  return (
    <Link
      href={`/product/${product._id}`}
      className="group block h-full overflow-hidden rounded-xl border-4 border-mango-orange bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-orange-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover transition group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🥭</div>
        )}
      </div>
      <div className="space-y-1 p-3 text-center">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
          {product.title}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-bold text-orange-600">
            {formatBdt(price)}
          </span>
          {product.discountPrice != null && (
            <span className="text-xs text-slate-400 line-through">
              {formatBdt(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductGalleryCarousel({
  products,
}: ProductGalleryCarouselProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const canSlide = products.length > 1;

  const desktopRow = useMemo(
    () =>
      Array.from({ length: Math.min(DESKTOP_CARDS, products.length) }, (_, offset) => {
        const index = (activeIndex + offset) % products.length;
        return products[index];
      }),
    [activeIndex, products],
  );

  const goNext = useCallback((): void => {
    if (!canSlide) {
      return;
    }
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, [canSlide, products.length]);

  useEffect(() => {
    if (!canSlide) {
      return;
    }

    const timer = window.setInterval(goNext, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [canSlide, goNext]);

  return (
    <div className="w-full">
      {/* Desktop: 4 cards in one row */}
      <div className="hidden overflow-hidden md:block">
        <div key={activeIndex} className="grid grid-cols-4 gap-4">
          {desktopRow.map((product, index) => (
            <div key={`${product._id}-${activeIndex}-${index}`} className="min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: 1 card slide */}
      <div className="overflow-hidden md:hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {products.map((product) => (
            <div key={product._id} className="w-full shrink-0 px-1">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
