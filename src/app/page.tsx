import type { Metadata } from 'next';
import LandingPageContent from '@/components/LandingPageContent';
import LandingPageError from '@/components/LandingPageError';
import { getLandingPageData } from '@/lib/server-api';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `ফলের রাজা আম | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'আম',
    'mango',
    'রাজশাহী আম',
    'ল্যাংড়া',
    'ক্ষীরশাপাত',
    'আম্রপালি',
    'ফরমালিন মুক্ত আম',
    'বাংলাদেশ আম',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `ফলের রাজা আম | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/mango.png',
        width: 800,
        height: 800,
        alt: 'গাছে পাকা প্রিমিয়াম আম',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `ফলের রাজা আম | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: ['/images/mango.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function HomePage(): Promise<React.JSX.Element> {
  try {
    const data = await getLandingPageData();

    return (
      <LandingPageContent
        products={data.products}
        reviews={data.reviews}
        settings={data.settings}
      />
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'পেজ লোড করা যায়নি। ব্যাকএন্ড চালু আছে কিনা দেখুন।';

    return <LandingPageError message={message} />;
  }
}
