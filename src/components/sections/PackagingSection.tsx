import Link from 'next/link';
import SectionBanner from '@/components/ui/SectionBanner';
import { formatBdt, getProductUnitPrice } from '@/lib/formatters';
import { MANGO_PACKAGES } from '@/lib/packages';
import type { IProduct } from '@/types';

interface PackagingSectionProps {
  products: IProduct[];
}

export default function PackagingSection({
  products,
}: PackagingSectionProps): React.JSX.Element {
  const sampleUnitPrice =
    products.length > 0 ? getProductUnitPrice(products[0]) : 200;
  return (
    <section id="packaging" className="bg-slate-50 px-4 py-10" aria-labelledby="packaging-heading">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionBanner id="packaging-heading">প্যাকেজিং — বেশি নিলে বেশি সেভ</SectionBanner>

        <p className="text-center text-sm text-slate-600 sm:text-base">
          ৬, ১২, ২০ বা ২৫ কেজি প্যাকেজ নিলে দাম কমে যাবে। অর্ডার পেজে প্যাকেজ বেছে নিন।
        </p>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {MANGO_PACKAGES.map((pkg) => {
            const regular = sampleUnitPrice * pkg.weightKg;
            const discounted = regular * (1 - pkg.discountPercent / 100);

            return (
              <div
                key={pkg.id}
                className="rounded-xl border-4 border-mango-orange bg-white p-4 text-center shadow-sm"
              >
                <p className="text-xl font-bold text-slate-900">{pkg.label}</p>
                <p className="mt-1 text-xs text-slate-500">{pkg.labelEn}</p>
                <p className="mt-3 text-lg font-bold text-orange-600">
                  {formatBdt(discounted)}
                </p>
                <p className="text-xs text-slate-400 line-through">{formatBdt(regular)}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  {pkg.discountPercent}% ছাড়
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link
            href="#order"
            aria-label="প্যাকেজ সহ অর্ডার সেকশনে যান"
            className="rounded-lg bg-mango-green-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-mango-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mango-green sm:text-base"
          >
            প্যাকেজ সহ অর্ডার করুন
          </Link>
        </div>
      </div>
    </section>
  );
}
