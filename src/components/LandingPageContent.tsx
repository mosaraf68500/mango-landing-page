import AboutSection from '@/components/sections/AboutSection';
import CheckoutSection from '@/components/sections/CheckoutSection';
import Footer from '@/components/sections/Footer';
import GallerySection from '@/components/sections/GallerySection';
import HeroSection from '@/components/sections/HeroSection';
import PackagingSection from '@/components/sections/PackagingSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import TermsSection from '@/components/sections/TermsSection';
import VideoSection from '@/components/sections/VideoSection';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import type { IProduct, IReview, ISettings } from '@/types';

interface LandingPageContentProps {
  products: IProduct[];
  reviews: IReview[];
  settings: ISettings | null;
}

function ProductJsonLd({ products }: { products: IProduct[] }): React.JSX.Element {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} — Premium Mango Collection`,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images?.[0],
        url: `${SITE_URL}/product/${product._id}`,
        offers: {
          '@type': 'Offer',
          price: product.discountPrice ?? product.price,
          priceCurrency: 'BDT',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function LandingPageContent({
  products,
  reviews,
  settings,
}: LandingPageContentProps): React.JSX.Element {
  return (
    <>
      <ProductJsonLd products={products} />
      <main id="main-content">
        <HeroSection />
        <VideoSection />
        <GallerySection products={products} />
        <PackagingSection products={products} />
        <AboutSection />
        <ReviewsSection reviews={reviews} />
        <TermsSection />
        <CheckoutSection products={products} settings={settings} />
      </main>
      <Footer />
    </>
  );
}
