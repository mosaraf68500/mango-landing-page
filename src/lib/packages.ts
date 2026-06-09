export interface MangoPackage {
  id: string;
  label: string;
  labelEn: string;
  weightKg: number;
  discountPercent: number;
}

export const MANGO_PACKAGES: MangoPackage[] = [
  { id: '6kg', label: '৬ কেজি', labelEn: '6 KG', weightKg: 6, discountPercent: 5 },
  { id: '12kg', label: '১২ কেজি', labelEn: '12 KG', weightKg: 12, discountPercent: 8 },
  { id: '20kg', label: '২০ কেজি', labelEn: '20 KG', weightKg: 20, discountPercent: 12 },
  { id: '25kg', label: '২৫ কেজি', labelEn: '25 KG', weightKg: 25, discountPercent: 15 },
];

export function getPackageById(packageId: string | null | undefined): MangoPackage | null {
  if (!packageId) {
    return null;
  }
  return MANGO_PACKAGES.find((pkg) => pkg.id === packageId) ?? null;
}

export function calculateProductSubtotal(
  unitPrice: number,
  quantity: number,
  packageId?: string | null,
): number {
  const selectedPackage = getPackageById(packageId);

  if (selectedPackage) {
    const regular = unitPrice * selectedPackage.weightKg;
    return regular * (1 - selectedPackage.discountPercent / 100);
  }

  return unitPrice * quantity;
}

export function getOrderQuantity(quantity: number, packageId?: string | null): number {
  const selectedPackage = getPackageById(packageId);
  return selectedPackage ? 1 : quantity;
}
