export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-black px-4 py-10 text-center text-sm text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <nav className="flex flex-wrap items-center justify-center gap-2 text-slate-300">
          <a href="#" className="hover:text-white">
            Refund policy
          </a>
          <span>|</span>
          <a href="#" className="hover:text-white">
            Privacy policy
          </a>
          <span>|</span>
          <a href="#" className="hover:text-white">
            Terms of service
          </a>
        </nav>
        <p className="text-slate-400">
          Copyright © {new Date().getFullYear()} Landing Product Page | This
          website was made with <span className="text-red-500">❤️</span> by{' '}
          <span className="font-bold text-white">MonoCore Engine</span>
        </p>
      </div>
    </footer>
  );
}
