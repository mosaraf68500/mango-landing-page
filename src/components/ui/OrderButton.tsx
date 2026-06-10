'use client';

import { useTransition } from 'react';
import { Pointer, ShoppingCart } from 'lucide-react';

interface OrderButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function OrderButton({
  label = 'অর্ডার করতে চাই',
  href = '#order',
  onClick,
  className = '',
}: OrderButtonProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition();

  const classes = `inline-flex items-center gap-2 rounded-lg bg-mango-green-dark px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-mango-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mango-green ${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => startTransition(() => onClick())}
        disabled={isPending}
        className={`${classes} disabled:cursor-wait disabled:opacity-70`}
        aria-label={label}
        aria-busy={isPending}
      >
        {isPending ? 'অপেক্ষা করুন...' : label}
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <a href={href} className={classes} aria-label={label}>
      {label}
      <Pointer className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}
