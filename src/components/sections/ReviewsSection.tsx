import SectionBanner from '@/components/ui/SectionBanner';
import type { IReview } from '@/types';

interface ReviewsSectionProps {
  reviews: IReview[];
}

export default function ReviewsSection({
  reviews,
}: ReviewsSectionProps): React.JSX.Element {
  const displayReviews = reviews.length > 0 ? reviews.slice(0, 4) : [];

  return (
    <section className="bg-white px-4 py-10" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionBanner id="reviews-heading">
          আমাদের ফেসবুক পেজ পর্যালোচনা থেকে শত শত মানুষ উপকৃত হয়েছে। এখানে কিছু
          পর্যালোচনা আছে:
        </SectionBanner>

        {displayReviews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mango-orange bg-orange-50 p-8 text-center text-slate-700">
            শীঘ্রই গ্রাহক পর্যালোচনা যোগ করা হবে।
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayReviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border-2 border-mango-orange bg-white p-4 shadow-sm"
                aria-label={`${review.customerName} এর পর্যালোচনা`}
              >
                <header className="mb-3 flex items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800"
                    aria-hidden="true"
                  >
                    {review.customerName.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {review.customerName}
                    </p>
                    <p
                      className="text-xs text-amber-600"
                      aria-label={`${review.rating} এর মধ্যে ৫ তারা`}
                    >
                      {'★'.repeat(review.rating)}
                    </p>
                  </div>
                </header>
                <p className="text-sm leading-relaxed text-slate-700">{review.comment}</p>
                <footer className="mt-3 rounded-2xl bg-slate-100 p-3 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">MonoCore Mart</p>
                  <p className="mt-1">ধন্যবাদ! আমাদের সাথে থাকার জন্য।</p>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
