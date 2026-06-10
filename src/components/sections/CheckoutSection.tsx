'use client';

import { useEffect, useState, useTransition, type FormEvent } from 'react';
import Image from 'next/image';
import { ChevronDown, Lock, Minus, Plus } from 'lucide-react';
import { placeOrder } from '@/lib/api';
import {
  SHIPPING_INSIDE_DHAKA,
  SHIPPING_OUTSIDE_DHAKA,
} from '@/lib/constants';
import { formatBdt, getProductUnitPrice } from '@/lib/formatters';
import {
  calculateProductSubtotal,
  getOrderQuantity,
  getPackageById,
} from '@/lib/packages';
import PackageSelector from '@/components/order/PackageSelector';
import type {
  CheckoutPaymentOption,
  IProduct,
  ISettings,
  ShippingZone,
} from '@/types';

interface CheckoutSectionProps {
  products: IProduct[];
  settings: ISettings | null;
}

interface CustomerForm {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
}

export default function CheckoutSection({
  products,
  settings,
}: CheckoutSectionProps): React.JSX.Element {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?._id ?? '',
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((p) => [p._id, 1])),
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [shippingZone, setShippingZone] = useState<ShippingZone>('inside_dhaka');
  const [paymentOption, setPaymentOption] = useState<CheckoutPaymentOption>(
    settings?.activePaymentMethod === 'gateway' ? 'gateway' : 'bkash',
  );
  const [customer, setCustomer] = useState<CustomerForm>({
    customerName: '',
    email: '',
    phone: '',
    shippingAddress: '',
  });
  const [bkashAccount, setBkashAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );
  const [showMoreProducts, setShowMoreProducts] = useState(false);

  const selectedProduct = products.find((p) => p._id === selectedProductId) ?? products[0];
  const visibleProducts = products.length > 2 ? products.slice(0, 2) : products;
  const extraProducts = products.length > 2 ? products.slice(2) : [];
  const selectedInExtras = extraProducts.some((p) => p._id === selectedProductId);

  useEffect(() => {
    if (selectedInExtras) {
      setShowMoreProducts(true);
    }
  }, [selectedInExtras, selectedProductId]);
  const quantity = selectedProduct ? (quantities[selectedProduct._id] ?? 1) : 1;
  const unitPrice = selectedProduct ? getProductUnitPrice(selectedProduct) : 0;
  const selectedPackage = getPackageById(selectedPackageId);
  const subtotal = calculateProductSubtotal(unitPrice, quantity, selectedPackageId);
  const shippingCost =
    shippingZone === 'inside_dhaka' ? SHIPPING_INSIDE_DHAKA : SHIPPING_OUTSIDE_DHAKA;
  const total = subtotal + shippingCost;
  const isGatewayMode = settings?.activePaymentMethod === 'gateway';
  const merchantBkash = settings?.bkashNumber || '01700000000';
  const showBkashForm = !isGatewayMode && paymentOption === 'bkash';

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] ?? 1) + delta),
    }));
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setSelectedPackageId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) {
      setMessage({ type: 'error', text: 'কোনো পণ্য নির্বাচন করা হয়নি।' });
      return;
    }

    startTransition(async () => {
      setMessage(null);

      try {
        const payloadPaymentMethod: 'manual_bkash' | 'gateway' = isGatewayMode
          ? 'gateway'
          : 'manual_bkash';

        const payload: Parameters<typeof placeOrder>[0] = {
          customerName: customer.customerName.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          shippingAddress: customer.shippingAddress.trim(),
          product: selectedProduct._id,
          quantity: getOrderQuantity(quantity, selectedPackageId),
          paymentMethod: payloadPaymentMethod,
        };

        if (selectedPackageId) {
          payload.packageId = selectedPackageId;
        }

        if (isGatewayMode) {
          payload.gatewayTransactionId = `GW-PENDING-${Date.now()}`;
        } else if (paymentOption === 'bkash') {
          payload.bkashNumber = bkashAccount.trim();
          payload.transactionId = transactionId.trim();
        } else {
          payload.bkashNumber = merchantBkash;
          payload.transactionId = `COD-${Date.now()}`;
        }

        const response = await placeOrder(payload);
        setMessage({
          type: 'success',
          text: response.message || 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
        });
        setCustomer({ customerName: '', email: '', phone: '', shippingAddress: '' });
        setBkashAccount('');
        setTransactionId('');
        setSelectedPackageId(null);
      } catch (error) {
        const text =
          error instanceof Error ? error.message : 'অর্ডার সম্পন্ন করা যায়নি।';
        setMessage({ type: 'error', text });
      }
    });
  };

  if (products.length === 0) {
    return (
      <section id="order" className="bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-mango-orange bg-white p-8 text-center">
          <p className="text-lg font-semibold text-slate-700">
            বর্তমানে কোনো পণ্য উপলব্ধ নেই। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-xl bg-mango-orange px-4 py-4 text-center text-base font-bold text-black sm:text-lg">
          অর্ডার করতে সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 rounded-2xl border-2 border-mango-orange bg-white p-4 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-6"
        >
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">
                আপনার ইনফরমেশন দিন
              </h2>
              <div className="space-y-4">
                <Field
                  label="আপনার নাম লিখুন *"
                  value={customer.customerName}
                  onChange={(v) => setCustomer((p) => ({ ...p, customerName: v }))}
                  placeholder="Md. Mosaraf"
                  required
                />
                <Field
                  label="ইমেইল *"
                  type="email"
                  value={customer.email}
                  onChange={(v) => setCustomer((p) => ({ ...p, email: v }))}
                  placeholder="you@email.com"
                  required
                />
                <Field
                  label="মোবাইল নাম্বার *"
                  value={customer.phone}
                  onChange={(v) => setCustomer((p) => ({ ...p, phone: v }))}
                  placeholder="+8801XXXXXXXXX"
                  required
                />
                <Field
                  label="আপনার ঠিকানা *"
                  value={customer.shippingAddress}
                  onChange={(v) => setCustomer((p) => ({ ...p, shippingAddress: v }))}
                  placeholder="আপনার সম্পূর্ণ ঠিকানা"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-3 hidden grid-cols-3 rounded-t-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 sm:grid">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
              </div>

              <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                {visibleProducts.map((product) =>
                  renderProductRow({
                    product,
                    selectedProductId,
                    quantities,
                    selectedPackageId,
                    selectedPackage,
                    onSelect: handleProductSelect,
                    onQuantityChange: updateQuantity,
                  }),
                )}

                {extraProducts.length > 0 && (
                  <div className="border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowMoreProducts((open) => !open)}
                      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                      aria-expanded={showMoreProducts}
                    >
                      <span>
                        আরও আম দেখুন ({extraProducts.length}টি)
                        {selectedInExtras && selectedProduct
                          ? ` — নির্বাচিত: ${selectedProduct.title}`
                          : ''}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition ${showMoreProducts ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {showMoreProducts && (
                      <div className="divide-y divide-slate-200 border-t border-slate-200">
                        {extraProducts.map((product) =>
                          renderProductRow({
                            product,
                            selectedProductId,
                            quantities,
                            selectedPackageId,
                            selectedPackage,
                            onSelect: handleProductSelect,
                            onQuantityChange: updateQuantity,
                          }),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedProduct && (
              <PackageSelector
                unitPrice={unitPrice}
                selectedPackageId={selectedPackageId}
                onChange={setSelectedPackageId}
              />
            )}
          </div>

          <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:sticky lg:top-4 lg:self-start">
            <h3 className="text-lg font-bold text-slate-900">অর্ডার লিস্ট</h3>

            {selectedProduct && (
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-orange-100">
                  {selectedProduct.images?.[0] ? (
                    <Image
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xl">🥭</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{selectedProduct.title}</p>
                  <p className="text-sm text-slate-500">
                    {selectedPackage
                      ? `প্যাকেজ: ${selectedPackage.label}`
                      : `× ${quantity}`}
                  </p>
                </div>
                <p className="shrink-0 font-bold">{formatBdt(subtotal)}</p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">{formatBdt(subtotal)}</span>
              </div>

              <fieldset className="space-y-2 pt-2">
                <legend className="mb-1 text-sm font-semibold text-slate-700">
                  Shipment
                </legend>
                <RadioRow
                  name="shipping"
                  checked={shippingZone === 'inside_dhaka'}
                  onChange={() => setShippingZone('inside_dhaka')}
                  label={`ঢাকার ভিতরে: ${formatBdt(SHIPPING_INSIDE_DHAKA)}`}
                />
                <RadioRow
                  name="shipping"
                  checked={shippingZone === 'outside_dhaka'}
                  onChange={() => setShippingZone('outside_dhaka')}
                  label={`ঢাকার বাহিরে: ${formatBdt(SHIPPING_OUTSIDE_DHAKA)}`}
                />
              </fieldset>

              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatBdt(total)}</span>
              </div>
            </div>

            {!isGatewayMode ? (
              <fieldset className="space-y-2">
                <legend className="mb-1 text-sm font-semibold text-slate-700">
                  Payment Method
                </legend>
                <RadioRow
                  name="payment"
                  checked={paymentOption === 'cod'}
                  onChange={() => setPaymentOption('cod')}
                  label="ক্যাশ অন ডেলিভারি"
                />
                <RadioRow
                  name="payment"
                  checked={paymentOption === 'bkash'}
                  onChange={() => setPaymentOption('bkash')}
                  label="bKash"
                />
              </fieldset>
            ) : (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                পেমেন্ট গেটওয়ে মোড সক্রিয়।
              </div>
            )}

            {showBkashForm && (
              <div className="space-y-3 rounded-lg bg-slate-200/60 p-4 text-xs leading-relaxed text-slate-700">
                <p className="font-semibold text-slate-900">Manual bKash Payment</p>
                <p>
                  <strong>Account:</strong> {merchantBkash}
                </p>
                <p>
                  <strong>Amount:</strong> {formatBdt(total)}
                </p>
                <Field
                  label="Your bKash Account Number"
                  value={bkashAccount}
                  onChange={setBkashAccount}
                  placeholder="01XXXXXXXXX"
                  required
                />
                <Field
                  label="Your bKash Transaction ID"
                  value={transactionId}
                  onChange={setTransactionId}
                  placeholder="2M7A5"
                  required
                />
              </div>
            )}

            {message && (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              aria-label={isPending ? 'অর্ডার প্রক্রিয়াধীন' : `অর্ডার করুন ${formatBdt(total)}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60 sm:text-base"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              {isPending ? 'অর্ডার হচ্ছে...' : `অর্ডার করুন ${formatBdt(total)}`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function renderProductRow({
  product,
  selectedProductId,
  quantities,
  selectedPackageId,
  selectedPackage,
  onSelect,
  onQuantityChange,
}: {
  product: IProduct;
  selectedProductId: string;
  quantities: Record<string, number>;
  selectedPackageId: string | null;
  selectedPackage: ReturnType<typeof getPackageById>;
  onSelect: (productId: string) => void;
  onQuantityChange: (productId: string, delta: number) => void;
}): React.JSX.Element {
  const isSelected = product._id === selectedProductId;
  const qty = quantities[product._id] ?? 1;
  const price = getProductUnitPrice(product);
  const lineTotal =
    isSelected && selectedPackageId
      ? calculateProductSubtotal(price, qty, selectedPackageId)
      : price * qty;

  return (
    <label
      key={product._id}
      className={`flex cursor-pointer flex-col gap-3 p-4 transition sm:flex-row sm:items-center ${
        isSelected ? 'bg-orange-50' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <input
          type="radio"
          name="product"
          checked={isSelected}
          onChange={() => onSelect(product._id)}
          className="h-4 w-4 shrink-0 accent-orange-500"
        />
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl">🥭</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{product.title}</p>
          <p className="text-xs text-slate-500">
            {isSelected && selectedPackage
              ? `প্যাকেজ: ${selectedPackage.label}`
              : `× ${qty}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {isSelected && !selectedPackageId ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuantityChange(product._id, -1);
              }}
              className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuantityChange(product._id, 1);
              }}
              className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-500 sm:w-24 sm:text-center">
            {isSelected && selectedPackage ? 'প্যাকেজ' : ''}
          </span>
        )}
        <p className="min-w-[5.5rem] text-right font-bold text-slate-900">
          {formatBdt(isSelected ? lineTotal : price * qty)}
        </p>
      </div>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}): React.JSX.Element {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-orange-400 focus:border-orange-400 focus:ring-2"
      />
    </label>
  );
}

function RadioRow({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}): React.JSX.Element {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 accent-orange-500"
      />
      <span className="leading-snug">{label}</span>
    </label>
  );
}
