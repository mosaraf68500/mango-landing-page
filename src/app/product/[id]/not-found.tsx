import Link from 'next/link';

export default function ProductNotFound(): React.JSX.Element {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
    >
      <section
        className="max-w-md rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm"
        aria-labelledby="not-found-heading"
      >
        <h1 id="not-found-heading" className="mb-4 text-xl font-bold text-slate-900">
          পণ্য পাওয়া যায়নি
        </h1>
        <p className="mb-6 text-slate-700">
          আপনি যে আমটি খুঁজছেন তা উপলব্ধ নেই বা সরিয়ে নেওয়া হয়েছে।
        </p>
        <Link
          href="/#products"
          className="inline-flex rounded-lg bg-orange-600 px-6 py-2.5 font-semibold text-white transition hover:bg-orange-700"
          aria-label="সব আম দেখতে হোমপেজে ফিরে যান"
        >
          সব আম দেখুন
        </Link>
      </section>
    </main>
  );
}
