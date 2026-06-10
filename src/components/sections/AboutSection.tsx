import Image from 'next/image';
import SectionBanner from '@/components/ui/SectionBanner';
import OrderButton from '@/components/ui/OrderButton';

const BENEFITS = [
  'প্রত্যেকে তাদের নিজস্ব বাগান থেকে আম বিক্রি করে এবং আমরা এলাকার সেরা বাগান থেকে আম সংগ্রহ করে বিক্রি করি।',
  'সবাই এক এলাকা থেকে আম সংগ্রহ করে এবং আমরা রাজশাহী, চাঁপাইনবাবগঞ্জ, রংপুর, খাগড়াছড়ি থেকে আম সংগ্রহ করি।',
  'সবাই কুরিয়ার করে আম ডেলিভারি করে এবং আমরা আমাদের নিজস্ব ডেলিভারি পিকআপের মাধ্যমে আম ডেলিভারি করে, আপনি আপনার পছন্দের আম বেছে নিতে পারেন।',
  'এত কিছুর পরেও, যদি আম খারাপ হয় এবং আমরা উপযুক্ত প্রমাণ পাই, আমরা আংশিক ফেরত দেই।',
  'সর্বোপরি ঢাকায় আমাদের নিজস্ব অফিস এবং আমাদের ই-কমার্স শপ রয়েছে।',
];

export default function AboutSection(): React.JSX.Element {
  return (
    <section className="bg-slate-50 px-4 py-10" aria-labelledby="about-section-heading">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-xl border-4 border-mango-orange bg-white shadow-md">
            <header className="bg-mango-orange px-4 py-3 text-center font-bold text-black">
              <h3>আমাদের আমের আড়ৎ</h3>
            </header>
            <div className="relative h-56 w-full md:h-64">
              <Image
                src="/images/amerbari.png"
                alt="আমাদের আমের আড়ৎ"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border-4 border-mango-orange bg-white shadow-md">
            <header className="bg-mango-orange px-4 py-3 text-center font-bold text-black">
              <h3>আমাদের আম সম্পর্কে</h3>
            </header>
            <div className="relative aspect-video h-[224px] w-full md:h-[256px]">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/Nb9mKHbl8yQ?si=nSqd2f5pIMjTpDKS"
                title="আমাদের আম সম্পর্কে ভিডিও"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </article>
        </div>

        <article className="overflow-hidden rounded-xl border-4 border-mango-orange shadow-md">
          <SectionBanner id="about-section-heading">আমাদের থেকে কেন নিবেন?</SectionBanner>
          <div className="grid gap-6 bg-slate-100 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <ul className="space-y-4">
              {BENEFITS.map((text, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm font-medium text-slate-800 sm:text-base"
                >
                  <span className="mt-0.5 shrink-0 text-lg text-green-700" aria-hidden="true">
                    ✔✔
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div
              className="hidden text-[220px] font-black text-yellow-400 drop-shadow-[4px_4px_0_#000] md:block"
              aria-hidden="true"
            >
              ?
            </div>
          </div>
          <div className="bg-slate-100 px-6 pb-6">
            <OrderButton />
          </div>
        </article>
      </div>
    </section>
  );
}
