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
const CARD_IMAGE_SIZES = '(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 20vw';

function ProductCard({
  product,
  priority = false,
}: {
  product: IProduct;
  priority?: boolean;
}): React.JSX.Element {
  const price = getProductUnitPrice(product);
  const imageSrc = product.images?.[0];
  const instructions = product.instructions?.filter(Boolean).slice(0, 3) ?? [];

  return (
    <Link
      href={`/product/${product._id}`}
      className="group block h-full overflow-hidden rounded-xl border-4 border-mango-orange bg-white shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      aria-label={`${product.title} — বিস্তারিত দেখুন`}
    >
      <article className="h-full">
        <div className="relative aspect-square overflow-hidden bg-orange-50">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              priority={priority}
              className="object-cover transition group-hover:scale-105"
              sizes={CARD_IMAGE_SIZES}
              unoptimized
            />
          ) : (
            <div
              className="flex h-full items-center justify-center text-5xl"
              role="img"
              aria-label="আমের ছবি উপলব্ধ নয়"
            >
              🥭
            </div>
          )}
        </div>
        <div className="space-y-2 p-3 text-center">
          <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
            {product.title}
          </h3>
          {product.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
              {product.description}
            </p>
          )}
          {instructions.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1" aria-label="আমের বৈশিষ্ট্য">
              {instructions.map((instruction, index) => (
                <li
                  key={`${instruction}-${index}`}
                  className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-900"
                >
                  {instruction}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-bold text-orange-700">{formatBdt(price)}</span>
            {product.discountPrice != null && (
              <span className="text-xs text-slate-500 line-through">
                {formatBdt(product.price)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ProductGalleryCarousel({
  products,
}: ProductGalleryCarouselProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const canSlide = products.length > 1;
  const lcpProductId = products[0]?._id;

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
    <div className="w-full" aria-label="আমের গ্যালারি ক্যারোসেল" aria-live="polite">
      <div className="hidden overflow-hidden md:block">
        <div key={activeIndex} className="grid grid-cols-4 gap-4">
          {desktopRow.map((product, index) => (
            <div key={`${product._id}-${activeIndex}-${index}`} className="min-w-0">
              <ProductCard
                product={product}
                priority={product._id === lcpProductId}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden md:hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div key={product._id} className="w-full shrink-0 px-1">
              <ProductCard
                product={product}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
