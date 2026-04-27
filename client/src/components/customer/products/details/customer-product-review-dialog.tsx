import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addProductReview } from "@/features/customer/products/api";
import { useCustomerProductDetailsStore } from "@/features/customer/products/details/store";
import { toast } from "sonner";
import { Star } from "lucide-react";

export function CustomerProductReviewDialog({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const loadReviews = useCustomerProductDetailsStore((state) => state.loadReviews);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter a review text");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating.toString());
      formData.append("text", text);
      if (file) {
        formData.append("image", file);
      }
      
      await addProductReview(productId, formData);
      toast.success("Review added successfully");
      setOpen(false);
      setText("");
      setFile(null);
      setRating(5);
      await loadReviews(productId);
    } catch (error: any) {
      toast.error(error.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl focus:outline-none ${star <= rating ? "text-yellow-500" : "text-muted"}`}
                >
                  <Star fill={star <= rating ? "currentColor" : "none"} className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-text">Review</Label>
            <Textarea
              id="review-text"
              placeholder="What did you think about this product?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-image">Image (Optional)</Label>
            <Input
              id="review-image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
