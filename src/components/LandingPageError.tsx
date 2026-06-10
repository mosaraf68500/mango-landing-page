import Link from 'next/link';

interface LandingPageErrorProps {
  message?: string;
}

export default function LandingPageError({
  message = 'পেজ লোড করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
}: LandingPageErrorProps): React.JSX.Element {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
    >
      <section
        className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
        aria-labelledby="error-heading"
      >
        <h1 id="error-heading" className="mb-4 text-lg font-bold text-red-700">
          সমস্যা হয়েছে
        </h1>
        <p className="mb-6 text-slate-700">{message}</p>
        <Link
          href="/"
          className="inline-flex rounded-lg bg-orange-600 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-700"
          aria-label="হোমপেজে ফিরে যান এবং আবার চেষ্টা করুন"
        >
          আবার চেষ্টা করুন
        </Link>
      </section>
    </main>
  );
}
