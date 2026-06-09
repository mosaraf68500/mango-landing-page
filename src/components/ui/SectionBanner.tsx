interface SectionBannerProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionBanner({
  children,
  className = '',
}: SectionBannerProps): React.JSX.Element {
  return (
    <div
      className={`rounded-xl bg-mango-orange px-4 py-4 text-center text-lg font-bold text-black sm:text-xl ${className}`}
    >
      {children}
    </div>
  );
}
