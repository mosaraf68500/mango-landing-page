import Image from 'next/image';
import { Pointer } from 'lucide-react';
import {
  HERO_BG_IMAGE,
  HERO_DESCRIPTION,
  HERO_GUARANTEE,
  MANGO_IMAGE,
  HERO_SITE_NAME,
  HERO_SITE_TAGLINE,
  HERO_TITLE,
} from '@/lib/heroContent';

export default function HeroSection(): React.JSX.Element {
  return (
    <section className="relative min-h-[560px] overflow-hidden sm:min-h-[640px] lg:min-h-[720px]">
      <Image
        src={HERO_BG_IMAGE}
        alt="Premium mango hero background"
        fill
        priority
        className="object-cover "
        sizes=""
      />

      {/* Left-side readability gradient — keeps background visible on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-60/95 via-yellow-50/75 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center gap-8 px-5 py-16 sm:min-h-[640px] sm:px-8 lg:min-h-[720px] lg:flex-row lg:items-center lg:gap-10 lg:px-12">
        <div className="w-full shrink-0 space-y-5 sm:space-y-6 lg:max-w-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mango-green shadow-sm">
              <span className="text-lg text-white">✓</span>
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-red-600 sm:text-lg">
                {HERO_SITE_NAME}
              </p>
              <p className="text-xs font-medium text-slate-700 sm:text-sm">
                {HERO_SITE_TAGLINE}
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold leading-[1.2] text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            {HERO_TITLE}
          </h1>

          <p className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
            {HERO_DESCRIPTION}
          </p>
          <p className="text-sm font-bold text-slate-900 sm:text-base">
            {HERO_GUARANTEE}
          </p>

          <div className="pt-1">
            <a
              href="#order"
              className="inline-flex items-center gap-2 rounded-md border-2 border-white bg-mango-green-dark px-6 py-3 text-base font-bold text-white shadow-lg transition hover:bg-mango-green sm:px-7 sm:py-3.5"
            >
              অর্ডার করতে চাই
              <Pointer className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-auto lg:flex-1 lg:justify-end">
          <div className="relative h-72 w-56 sm:h-80 sm:w-64 lg:h-[28rem] lg:w-72 xl:h-[32rem] xl:w-80">
            <Image
              src={MANGO_IMAGE}
              alt="গাছে পাকা আম"
              fill
              priority
              className=" object-cover object-center"
              sizes="(max-width: 1024px) 256px, 320px"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-20 w-full leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-14 w-full fill-white sm:h-20"
          aria-hidden="true"
        >
          <path d="M0,64 C300,120 900,0 1200,64 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
