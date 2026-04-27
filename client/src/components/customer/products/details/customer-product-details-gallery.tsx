import { Card } from "@/components/ui/card";
import { getCoverImage } from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";

type CustomerProductDetailsGalleryProps = {
  product: CustomerProduct;
  selectedImage: string;
  setSelectedImage: (value: string) => void;
};

const galleryWrapClass = "space-y-4";

const mainImageCardClass = "overflow-hidden border-border/60 bg-card/80";

const mainImageWrapClass = "relative h-[400px] sm:h-[500px] lg:h-[600px] w-full bg-muted/30 overflow-hidden rounded-xl";

const mainImageClass = "h-full w-full object-contain p-4";

const thumbnailImageClass = "h-full w-full object-cover";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-muted-foreground";

const thumbnailsGridClass = "grid grid-cols-4 gap-3 sm:grid-cols-5";

const thumbnailButtonBaseClass = "overflow-hidden border bg-card";

const thumbnailButtonActiveClass = "border-primary ring-2 ring-primary/30";

const thumbnailButtonInactiveClass = "border-border/60";

const thumbnailImageWrapClass = "aspect-square bg-muted";

function CustomerProductDetailsGallery({
  product,
  selectedImage,
  setSelectedImage,
}: CustomerProductDetailsGalleryProps) {
  const galleryImages = product.images || [];
  const displayImage = selectedImage || getCoverImage(product);

  return (
    <div className={galleryWrapClass}>
      <Card className={mainImageCardClass}>
        <div className={mainImageWrapClass}>
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.title}
              className={mainImageClass}
            />
          ) : (
            <div className={noImageClass}>No Image</div>
          )}
        </div>
      </Card>

      {galleryImages.length ? (
        <div className={thumbnailsGridClass}>
          {galleryImages.map((item) => {
            const isActive = displayImage === item.url;

            return (
              <button
                key={item.publicId}
                type="button"
                className={`${thumbnailButtonBaseClass} ${
                  isActive
                    ? thumbnailButtonActiveClass
                    : thumbnailButtonInactiveClass
                }`}
                onClick={() => setSelectedImage(item.url)}
              >
                <div className={thumbnailButtonBaseClass}>
                    <img
                      src={item.url}
                      alt={product.title}
                      className={thumbnailImageClass}
                    />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default CustomerProductDetailsGallery;
