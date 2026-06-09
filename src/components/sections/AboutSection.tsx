import Image from 'next/image';
import SectionBanner from '@/components/ui/SectionBanner';
import OrderButton from '@/components/ui/OrderButton';
import type { IProduct } from '@/types';

interface AboutSectionProps {
  products: IProduct[];
}

const BENEFITS = [
  'প্রত্যেকে তাদের নিজস্ব বাগান থেকে আম বিক্রি করে এবং আমরা এলাকার সেরা বাগান থেকে আম সংগ্রহ করে বিক্রি করি।',
  'সবাই এক এলাকা থেকে আম সংগ্রহ করে এবং আমরা রাজশাহী, চাঁপাইনবাবগঞ্জ, রংপুর, খাগড়াছড়ি থেকে আম সংগ্রহ করি।',
  'সবাই কুরিয়ার করে আম ডেলিভারি করে এবং আমরা আমাদের নিজস্ব ডেলিভারি পিকআপের মাধ্যমে আম ডেলিভারি করে, আপনি আপনার পছন্দের আম বেছে নিতে পারেন।',
  'এত কিছুর পরেও, যদি আম খারাপ হয় এবং আমরা উপযুক্ত প্রমাণ পাই, আমরা আংশিক ফেরত দেই।',
  'সর্বোপরি ঢাকায় আমাদের নিজস্ব অফিস এবং আমাদের ই-কমার্স শপ রয়েছে।',
];

export default function AboutSection({ products }: AboutSectionProps): React.JSX.Element {
  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* আমাদের আমের আড়ৎ - ইমেজ সেকশন */}
          <div className="overflow-hidden rounded-xl border-4 border-mango-orange shadow-md bg-white">
            <div className="bg-mango-orange px-4 py-3 text-center font-bold text-black">
              আমাদের আমের আড়ৎ
            </div>
            <div className="relative h-56 w-full md:h-64">
              <Image
                src="/images/amerbari.png" // আপনার আপলোড করা ইমেজটির পাথ এখানে দিন (যেমন: public ফোল্ডারে রাখলে এভাবে দিতে পারেন)
                alt="আমাদের আমের আড়ৎ"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* আমাদের আম সম্পর্কে - ভিডিও সেকশন */}
          <div className="overflow-hidden rounded-xl border-4 border-mango-orange shadow-md bg-white">
            <div className="bg-mango-orange px-4 py-3 text-center font-bold text-black">
              আমাদের আম সম্পর্কে
            </div>
            <div className="relative aspect-video w-full h-[224px] md:h-[256px]">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/Nb9mKHbl8yQ?si=nSqd2f5pIMjTpDKS"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
          
        </div>

        {/* কেন আমাদের থেকে নিবেন সেকশন */}
        <div className="overflow-hidden rounded-xl border-4 border-mango-orange shadow-md">
          <div className="bg-mango-orange px-4 py-3 text-center text-lg font-bold text-black">
            আমাদের থেকে কেন নিবেন?
          </div>
          <div className="grid gap-6 bg-slate-100 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <ul className="space-y-4">
              {BENEFITS.map((text, index) => (
                <li key={index} className="flex gap-3 text-sm font-medium text-slate-800 sm:text-base">
                  <span className="mt-0.5 shrink-0 text-lg text-green-600">✔✔</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="hidden text-[220px] font-black text-yellow-400 drop-shadow-[4px_4px_0_#000] md:block">
              ?
            </div>
          </div>
          <div className="bg-slate-100 px-6 pb-6">
            <OrderButton />
          </div>
        </div>
      </div>
    </section>
  );
}