'use client';

import { formatBdt } from '@/lib/formatters';
import { MANGO_PACKAGES, type MangoPackage } from '@/lib/packages';

interface PackageSelectorProps {
  unitPrice: number;
  selectedPackageId: string | null;
  onChange: (packageId: string | null) => void;
}

function getPackagePrice(unitPrice: number, pkg: MangoPackage): number {
  const regular = unitPrice * pkg.weightKg;
  return regular * (1 - pkg.discountPercent / 100);
}

export default function PackageSelector({
  unitPrice,
  selectedPackageId,
  onChange,
}: PackageSelectorProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900 sm:text-base">প্যাকেজ নির্বাচন</h3>
        {selectedPackageId && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            প্যাকেজ বাতিল
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MANGO_PACKAGES.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          const packagePrice = getPackagePrice(unitPrice, pkg);
          const regularPrice = unitPrice * pkg.weightKg;

          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onChange(isSelected ? null : pkg.id)}
              className={`rounded-xl border-2 p-3 text-left transition sm:p-4 ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-orange-300'
              }`}
            >
              <p className="text-base font-bold text-slate-900 sm:text-lg">{pkg.label}</p>
              <p className="mt-1 text-xs text-slate-500">{pkg.labelEn} প্যাক</p>
              <p className="mt-2 text-sm font-bold text-orange-600">
                {formatBdt(packagePrice)}
              </p>
              <p className="text-xs text-slate-400 line-through">{formatBdt(regularPrice)}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600">
                {pkg.discountPercent}% ছাড়
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
