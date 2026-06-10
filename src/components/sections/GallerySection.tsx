import SectionBanner from '@/components/ui/SectionBanner';
import OrderButton from '@/components/ui/OrderButton';
import ProductGalleryCarousel from '@/components/sections/ProductGalleryCarousel';
import type { IProduct } from '@/types';

interface GallerySectionProps {
  products: IProduct[];
}

export default function GallerySection({
  products,
}: GallerySectionProps): React.JSX.Element {
  return (
    <section id="products" className="bg-white px-4 py-10" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionBanner id="gallery-heading">এক নজরে আমাদের আমগুলো</SectionBanner>

        {products.length === 0 ? (
          <p className="rounded-xl bg-orange-50 px-4 py-10 text-center text-slate-700">
            এখনো কোনো আম যোগ করা হয়নি। শীঘ্রই নতুন আম আসছে।
          </p>
        ) : (
          <ProductGalleryCarousel products={products} />
        )}

        <div className="flex justify-center pt-2">
          <OrderButton />
        </div>
      </div>
    </section>
  );
}
