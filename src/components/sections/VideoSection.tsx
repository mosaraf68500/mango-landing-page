import SectionBanner from '@/components/ui/SectionBanner';
import OrderButton from '@/components/ui/OrderButton';

export default function VideoSection(): React.JSX.Element {
  return (
    <section className="bg-slate-50 px-4 py-10" aria-labelledby="video-section-heading">
      <div className="mx-auto max-w-4xl space-y-6">
        <SectionBanner id="video-section-heading">
          দেশে প্রথম ঢাকনা সহ আধুনিক স্মার্ট প্যাক
        </SectionBanner>

        <div className="overflow-hidden rounded-xl border-4 border-mango-orange bg-white shadow-lg">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute top-0 left-0 h-full w-full"
              src="https://www.youtube.com/embed/dzr9paofuEU?si=dWkinFeTwTWz6eFD"
              title="স্মার্ট প্যাকেজিং ভিডিও"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex justify-center">
          <OrderButton label="অর্ডার করতে চাই" />
        </div>
      </div>
    </section>
  );
}
