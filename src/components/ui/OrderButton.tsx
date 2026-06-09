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
  const classes = `inline-flex items-center gap-2 rounded-lg bg-mango-green-dark px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-mango-green ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {label}
        <ShoppingCart className="h-5 w-5" />
      </button>
    );
  }

  return (
    <a href={href} className={classes}>
      {label}
      <Pointer className="h-5 w-5" />
    </a>
  );
}
