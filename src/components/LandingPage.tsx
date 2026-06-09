'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchLandingPage, fetchSettings } from '@/lib/api';
import AboutSection from '@/components/sections/AboutSection';
import CheckoutSection from '@/components/sections/CheckoutSection';
import Footer from '@/components/sections/Footer';
import GallerySection from '@/components/sections/GallerySection';
import PackagingSection from '@/components/sections/PackagingSection';
import HeroSection from '@/components/sections/HeroSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import TermsSection from '@/components/sections/TermsSection';
import VideoSection from '@/components/sections/VideoSection';
import type { ISettings, LandingPageData } from '@/types';

export default function LandingPage(): React.JSX.Element {
  const [data, setData] = useState<LandingPageData | null>(null);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [landing, paymentSettings] = await Promise.all([
        fetchLandingPage(),
        fetchSettings(),
      ]);

      setData(landing);
      setSettings(paymentSettings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load page. Is the backend running on port 8000?',
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <VideoSection products={data.products} />
      <GallerySection products={data.products} />
      <PackagingSection products={data.products} />
      <AboutSection products={data.products} />
      <ReviewsSection reviews={data.reviews} />
      <TermsSection />
      <CheckoutSection products={data.products} settings={settings} />
      <Footer />
    </>
  );
}
