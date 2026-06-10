import type { Review } from "@/lib/reviews";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="h-full rounded-lg border border-border bg-surface/80 p-6">
      <div
        className="text-sm tracking-[0.2em] text-accent-warm"
        aria-label={`${review.rating} étoiles sur 5`}
      >
        ★★★★★
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">“{review.text}”</p>
      <div className="mt-5">
        <p className="font-semibold text-foreground">{review.name}</p>
        <p className="mt-1 text-xs text-muted-dark">{review.date}</p>
      </div>
    </article>
  );
}
