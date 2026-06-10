import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getProduct, getSettings } from '@/lib/server-api';
import { SITE_NAME, SITE_URL } from '@/lib/site';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProduct(id);
    const description =
      product.description ||
      product.instructions?.filter(Boolean).slice(0, 3).join(' • ') ||
      `${product.title} — প্রিমিয়াম আম অর্ডার করুন`;

    return {
      title: product.title,
      description,
      alternates: {
        canonical: `/product/${id}`,
      },
      openGraph: {
        type: 'website',
        url: `${SITE_URL}/product/${id}`,
        title: `${product.title} | ${SITE_NAME}`,
        description,
        images: product.images?.[0]
          ? [{ url: product.images[0], alt: product.title }]
          : [{ url: '/images/mango.png', alt: product.title }],
      },
    };
  } catch {
    return {
      title: 'পণ্য পাওয়া যায়নি',
      robots: { index: false, follow: false },
    };
  }
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  try {
    const [product, settings] = await Promise.all([
      getProduct(id),
      getSettings(),
    ]);

    return <ProductDetailClient product={product} settings={settings} />;
  } catch {
    notFound();
  }
}
