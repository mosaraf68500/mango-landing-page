export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-black px-4 py-10 text-center text-sm text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <nav aria-label="ফুটার নেভিগেশন">
          <ul className="flex flex-wrap items-center justify-center gap-2 text-slate-300">
            <li>
              <a href="#" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Refund policy
              </a>
            </li>
            <li aria-hidden="true">|</li>
            <li>
              <a href="#" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Privacy policy
              </a>
            </li>
            <li aria-hidden="true">|</li>
            <li>
              <a href="#" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Terms of service
              </a>
            </li>
          </ul>
        </nav>
        <p className="text-slate-300">
          Copyright © {new Date().getFullYear()} Landing Product Page | This website was
          made with <span className="text-red-400" aria-label="ভালোবাসা">❤️</span> by{' '}
          <span className="font-bold text-white">MonoCore Engine</span>
        </p>
      </div>
    </footer>
  );
}
