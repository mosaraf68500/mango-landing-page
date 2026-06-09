export function formatBdt(amount: number): string {
  return `৳ ${amount.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getProductUnitPrice(product: {
  price: number;
  discountPrice?: number | null;
}): number {
  return product.discountPrice != null ? product.discountPrice : product.price;
}
