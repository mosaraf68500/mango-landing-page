import ProductDetailPage from '@/components/ProductDetailPage';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  return <ProductDetailPage productId={id} />;
}
