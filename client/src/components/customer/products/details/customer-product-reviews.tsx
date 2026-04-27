import { useCustomerProductDetailsStore } from "@/features/customer/products/details/store";
import { CustomerProductReviewDialog } from "./customer-product-review-dialog";
import { Star } from "lucide-react";
import { useAuth } from "@clerk/react";

const reviewsSectionClass = "mt-14 space-y-6";
const reviewsHeaderClass = "flex items-center justify-between";
const reviewsTitleClass = "text-2xl font-semibold tracking-tight text-foreground";
const reviewCardClass = "flex flex-col gap-4 border-b border-border/40 py-6 last:border-0";
const reviewHeaderClass = "flex items-center justify-between";
const reviewerNameClass = "font-medium text-foreground";
const reviewDateClass = "text-sm text-muted-foreground";
const reviewTextClass = "text-muted-foreground";
const reviewImageWrapClass = "h-24 w-24 overflow-hidden rounded-lg border border-border/50";
const reviewImageClass = "h-full w-full object-cover";

export default function CustomerProductReviews({ productId }: { productId: string }) {
  const reviews = useCustomerProductDetailsStore((state) => state.reviews);
  const { isSignedIn } = useAuth();

  return (
    <section className={reviewsSectionClass}>
      <div className={reviewsHeaderClass}>
        <h2 className={reviewsTitleClass}>Customer Reviews ({reviews.length})</h2>
        {isSignedIn && <CustomerProductReviewDialog productId={productId} />}
      </div>

      <div className="space-y-2">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className={reviewCardClass}>
              <div className={reviewHeaderClass}>
                <div className="space-y-1">
                  <p className={reviewerNameClass}>{review.user?.name || "Anonymous"}</p>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4" fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className={reviewDateClass}>{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <p className={reviewTextClass}>{review.text}</p>
              {review.imageUrl && (
                <div className={reviewImageWrapClass}>
                  <img src={review.imageUrl} alt="Review" className={reviewImageClass} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
