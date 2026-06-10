interface SectionBannerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionBanner({
  children,
  className = '',
  id,
}: SectionBannerProps): React.JSX.Element {
  return (
    <header
      id={id}
      className={`rounded-xl bg-mango-orange px-4 py-4 text-center text-lg font-bold text-black sm:text-xl ${className}`}
    >
      <h2 className="text-inherit">{children}</h2>
    </header>
  );
}
