import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { formatPrice } from "@/lib/utils";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const dialogClass = "max-h-[90vh] overflow-hidden border-border bg-background p-0 sm:max-w-2xl";

const headerClass = "flex items-center justify-between border-b border-border/50 px-6 py-5";

const titleWrapClass = "flex items-center gap-3";

const iconWrapClass = "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary";

const scrollAreaClass = "max-h-[calc(90vh-80px)] overflow-y-auto p-6";

const listClass = "grid gap-4";

const itemClass = "group flex items-center gap-5 rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md";

const imageWrapClass = "relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-muted";

const imageClass = "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110";

const bodyClass = "flex min-w-0 flex-1 flex-col gap-1.5";

const brandClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground";

const titleClass = "line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary";

const priceClass = "text-sm font-bold text-foreground";

const actionsClass = "flex items-center gap-2 pt-1";

const actionButtonClass = "h-9 rounded-xl px-4 text-xs font-medium";

const emptyStateClass = "flex flex-col items-center justify-center py-16 text-center";

const emptyIconWrapClass = "mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 text-primary/40";

const emptyTitleClass = "text-xl font-semibold text-foreground";

const emptyDescClass = "mt-2 max-w-[280px] text-sm text-muted-foreground";

function CustomerWishlistDialog() {
  const { isOpen, setOpen, items, removeItem } = useCustomerWishlistStore(
    (state) => state,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className={dialogClass}>
        <div className={headerClass}>
          <div className={titleWrapClass}>
            <div className={iconWrapClass}>
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Your Wishlist</h2>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            {items.length} Items
          </span>
        </div>

        <div className={scrollAreaClass}>
          {!items.length ? (
            <div className={emptyStateClass}>
              <div className={emptyIconWrapClass}>
                <ShoppingBag className="h-10 w-10" />
              </div>
              <h3 className={emptyTitleClass}>Wishlist is empty</h3>
              <p className={emptyDescClass}>
                Explore our collections and save your favorite items for later!
              </p>
              <Button 
                className="mt-8 rounded-xl"
                onClick={() => setOpen(false)}
                asChild
              >
                <Link to="/collections">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className={listClass}>
              {items.map((item) => (
                <div key={item.productId} className={itemClass}>
                  <div className={imageWrapClass}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className={imageClass}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground uppercase font-bold">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className={bodyClass}>
                    <p className={brandClass}>{item.brand}</p>
                    <Link
                      to={`/collection/${item.productId}`}
                      className={titleClass}
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                    <p className={priceClass}>{formatPrice(item.finalPrice)}</p>
                    
                    <div className={actionsClass}>
                      <Button
                        asChild
                        variant="default"
                        className={actionButtonClass}
                        onClick={() => setOpen(false)}
                      >
                        <Link to={`/collection/${item.productId}`}>
                          View Details
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        className={`${actionButtonClass} text-destructive hover:bg-destructive/10 hover:text-destructive`}
                        onClick={() => void removeItem(item.productId)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerWishlistDialog;
