'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { Lock, Minus, Plus } from 'lucide-react';
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
import { OrderField, OrderRadioRow } from '@/components/order/OrderFormFields';
import type {
  CheckoutPaymentOption,
  IProduct,
  ISettings,
  ShippingZone,
} from '@/types';

interface ProductOrderFormProps {
  product: IProduct;
  settings: ISettings | null;
  className?: string;
  selectedPackageId?: string | null;
  onPackageChange?: (packageId: string | null) => void;
  hidePackageSelector?: boolean;
}

interface CustomerForm {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
}

export default function ProductOrderForm({
  product,
  settings,
  className = '',
  selectedPackageId: controlledPackageId,
  onPackageChange,
  hidePackageSelector = false,
}: ProductOrderFormProps): React.JSX.Element {
  const [quantity, setQuantity] = useState(1);
  const [internalPackageId, setInternalPackageId] = useState<string | null>(null);
  const selectedPackageId = controlledPackageId ?? internalPackageId;
  const setSelectedPackageId = onPackageChange ?? setInternalPackageId;
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

  const unitPrice = getProductUnitPrice(product);
  const selectedPackage = getPackageById(selectedPackageId);
  const subtotal = calculateProductSubtotal(unitPrice, quantity, selectedPackageId);
  const shippingCost =
    shippingZone === 'inside_dhaka' ? SHIPPING_INSIDE_DHAKA : SHIPPING_OUTSIDE_DHAKA;
  const total = subtotal + shippingCost;
  const isGatewayMode = settings?.activePaymentMethod === 'gateway';
  const merchantBkash = settings?.bkashNumber || '01700000000';
  const showBkashForm = !isGatewayMode && paymentOption === 'bkash';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
          product: product._id,
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
        setQuantity(1);
        setSelectedPackageId(null);
      } catch (error) {
        const text =
          error instanceof Error ? error.message : 'অর্ডার সম্পন্ন করা যায়নি।';
        setMessage({ type: 'error', text });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 rounded-2xl border-2 border-mango-orange bg-white p-4 shadow-sm sm:p-6 ${className}`}
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900">অর্ডার করুন</h2>
        <p className="mt-1 text-sm text-slate-600">
          সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন
        </p>
      </div>

      <div className="space-y-4">
        <OrderField
          label="আপনার নাম লিখুন *"
          value={customer.customerName}
          onChange={(v) => setCustomer((p) => ({ ...p, customerName: v }))}
          placeholder="Md. Mosaraf"
          required
        />
        <OrderField
          label="ইমেইল *"
          type="email"
          value={customer.email}
          onChange={(v) => setCustomer((p) => ({ ...p, email: v }))}
          placeholder="you@email.com"
          required
        />
        <OrderField
          label="মোবাইল নাম্বার *"
          value={customer.phone}
          onChange={(v) => setCustomer((p) => ({ ...p, phone: v }))}
          placeholder="+8801XXXXXXXXX"
          required
        />
        <OrderField
          label="আপনার ঠিকানা *"
          value={customer.shippingAddress}
          onChange={(v) => setCustomer((p) => ({ ...p, shippingAddress: v }))}
          placeholder="আপনার সম্পূর্ণ ঠিকানা"
          required
        />
      </div>

      {!hidePackageSelector && (
        <PackageSelector
          unitPrice={unitPrice}
          selectedPackageId={selectedPackageId}
          onChange={setSelectedPackageId}
        />
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900">{product.title}</p>
            <p className="text-sm text-orange-600">{formatBdt(unitPrice)} / unit</p>
            {selectedPackage && (
              <p className="text-xs text-slate-500">প্যাকেজ: {selectedPackage.label}</p>
            )}
          </div>
          {!selectedPackageId && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold">{formatBdt(subtotal)}</span>
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-1 text-sm font-semibold text-slate-700">
              Shipment
            </legend>
            <OrderRadioRow
              name="shipping"
              checked={shippingZone === 'inside_dhaka'}
              onChange={() => setShippingZone('inside_dhaka')}
              label={`ঢাকার ভিতরে: ${formatBdt(SHIPPING_INSIDE_DHAKA)}`}
            />
            <OrderRadioRow
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
      </div>

      {!isGatewayMode ? (
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-semibold text-slate-700">
            Payment Method
          </legend>
          <OrderRadioRow
            name="payment"
            checked={paymentOption === 'cod'}
            onChange={() => setPaymentOption('cod')}
            label="ক্যাশ অন ডেলিভারি"
          />
          <OrderRadioRow
            name="payment"
            checked={paymentOption === 'bkash'}
            onChange={() => setPaymentOption('bkash')}
            label="bKash"
          />
        </fieldset>
      ) : (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          পেমেন্ট গেটওয়ে মোড সক্রিয়। অর্ডার কনফার্ম করলে গেটওয়ে চেকআউট শুরু হবে।
        </div>
      )}

      {showBkashForm && (
        <div className="space-y-3 rounded-lg bg-slate-100 p-4 text-xs leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900">Manual bKash Payment</p>
          <p>
            <strong>Account Number:</strong> {merchantBkash}
          </p>
          <OrderField
            label="Your bKash Account Number"
            value={bkashAccount}
            onChange={setBkashAccount}
            placeholder="01XXXXXXXXX"
            required
          />
          <OrderField
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
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3.5 text-base font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
      >
        <Lock className="h-4 w-4" aria-hidden="true" />
        {isPending ? 'অর্ডার হচ্ছে...' : `অর্ডার করুন ${formatBdt(total)}`}
      </button>
    </form>
  );
}
