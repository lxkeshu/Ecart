import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import CustomerCartItems from "./customer-cart-items";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useAuth, useUser } from "@clerk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* ── shared tokens ── */
const sectionTitleClass = "text-sm font-medium text-foreground";
const helperClass = "text-xs text-muted-foreground";
const cardClass = "border border-border bg-background/50 p-3 text-sm";
const rowClass = "flex items-center justify-between text-sm";
const totalRowClass =
  "flex items-center justify-between border-t border-border pt-4 text-base font-semibold";
const promoRowClass = "flex gap-2";
const promoTitle =
  "flex items-center gap-2 text-sm font-medium text-foreground";
const infoBoxClass =
  "rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground";

/* ── drawer content ── */
const contentClass =
  "ml-auto flex h-[100dvh] max-h-[100dvh] lg:h-[90dvh] lg:max-h-[90dvh] w-full overflow-hidden rounded-none border-l border-border bg-background p-0";

/* ── mobile: single scrollable column / desktop: side-by-side grid ── */
const shellClass =
  "h-full w-full overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-[1.7fr_1fr]";

/* left pane (cart items) — hidden on mobile (rendered inline in scroll), visible on desktop */
const desktopLeftClass =
  "hidden lg:flex h-full min-h-0 overflow-hidden border-r border-border";

/* right pane (checkout) — hidden on mobile (rendered inline in scroll), visible on desktop */
const desktopRightClass =
  "hidden lg:flex h-full min-h-0 overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background";
const desktopRightInner = "flex h-full min-h-0 flex-col p-5 w-full";
const desktopPanelClass =
  "flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm";
const desktopPanelHeader = "border-b border-border px-5 py-4";
const desktopScrollClass = "min-h-0 flex-1";
const desktopBodyClass = "space-y-4 px-5 py-4";
const desktopActionClass =
  "shrink-0 flex flex-row gap-3 border-t border-border px-5 py-4";
const desktopBtnClass = "h-11 flex-1";

/* mobile inline sections */
const mobileOnlyClass = "lg:hidden";
const mobileCheckoutCard =
  "mx-4 mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4";
const mobileActionClass = "flex flex-row gap-3 px-4 pb-6 pt-2";
const mobileBtnClass = "h-12 flex-1 text-sm";

function SummaryRow(props: { label: string; value: string | number }) {
  return (
    <div className={rowClass}>
      <span className="text-muted-foreground">{props.label}</span>
      <span>{props.value}</span>
    </div>
  );
}

function CustomerCartAndCheckoutDrawer() {
  const { isBootstrapped } = useAuthStore();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    isOpen,
    setOpen,
    loadCart,
    selectedAddressId,
    addresses,
    promoInput,
    appliedPromo,
    availablePromos,
    points,
    promoLoading,
    checkoutLoading,
    pointsCheckoutLoading,
    setPromoInput,
    clearPromo,
    applyPromo,
    startRazorpayCheckout,
    startPointsCheckout,
    loading,
    cart,
  } = useCustomerCartAndCheckoutStore((state) => state);

  useEffect(() => {
    if (!isOpen || !isLoaded || !isBootstrapped) return;
    void loadCart(Boolean(isSignedIn));
  }, [isBootstrapped, isLoaded, isOpen, isSignedIn, loadCart]);

  const selectedAddress =
    addresses.find((item) => item._id === selectedAddressId) || null;

  const subTotal = cart.items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  let discountAmount = appliedPromo
    ? Math.round((subTotal * appliedPromo.percentage) / 100)
    : 0;

  if (
    appliedPromo?.maxDiscountAmount &&
    discountAmount > appliedPromo.maxDiscountAmount
  ) {
    discountAmount = appliedPromo.maxDiscountAmount;
  }

  const totalAmount = Math.max(subTotal - discountAmount, 0);

  /* ── reusable checkout summary ── */
  function renderCheckoutSummary(bodyClassName: string) {
    if (!isSignedIn) {
      return (
        <div className={bodyClassName}>
          <div className={infoBoxClass}>
            Sign in to continue to checkout
          </div>
        </div>
      );
    }

    return (
      <div className={bodyClassName}>
        <section className="space-y-2">
          <p className={sectionTitleClass}>Default Address</p>
          {selectedAddress ? (
            <div className={cardClass}>
              <p className={helperClass}>{selectedAddress.fullName}</p>
              <p className={helperClass}>
                {selectedAddress.address} {selectedAddress.state}
              </p>
              <p className={helperClass}>{selectedAddress.postalCode}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No default address present. Add one from profile dialog
            </p>
          )}
        </section>

        <section className="space-y-2">
          <p className={promoTitle}>Promo Code</p>
          {!appliedPromo ? (
            <div className={promoRowClass}>
              <div className="flex-1">
                <Select value={promoInput} onValueChange={setPromoInput}>
                  <SelectTrigger className="w-full rounded-none">
                    <SelectValue placeholder="Select Promo Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePromos.length > 0 ? (
                      availablePromos.map((promo) => (
                        <SelectItem key={promo.code} value={promo.code}>
                          {promo.code} ({promo.percentage}% OFF
                          {promo.maxDiscountAmount
                            ? ` up to ₹${promo.maxDiscountAmount}`
                            : ""}
                          )
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                        No promos available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant={"default"}
                onClick={() => void applyPromo()}
                disabled={promoLoading || !promoInput.trim()}
              >
                {promoLoading ? "Applying..." : "Apply"}
              </Button>
            </div>
          ) : (
            <div>
              <span>
                {appliedPromo.code} ({appliedPromo.percentage}%)
              </span>
              <Button
                type="button"
                variant={"default"}
                onClick={clearPromo}
              >
                Remove
              </Button>
            </div>
          )}
        </section>
        <SummaryRow label="Items" value={cart.totalQuantity} />
        <SummaryRow label="Subtotal" value={formatPrice(subTotal)} />
        <SummaryRow label="Discount" value={formatPrice(discountAmount)} />
        <SummaryRow label="Points" value={points} />
        <div className={totalRowClass}>
          <span>Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>
    );
  }

  /* ── reusable payment buttons ── */
  function renderPaymentButtons(btnClass: string) {
    if (!isSignedIn) return null;

    return (
      <>
        <Button
          onClick={() => {
            if (!selectedAddressId) {
              toast.error("Please add a default address first");
              return;
            }
            void setOpen(false);
            void startRazorpayCheckout({
              isSignedIn: Boolean(isSignedIn),
              name: user?.fullName || "Customer",
              email: user?.primaryEmailAddress?.emailAddress || "",
              onSuccess: () => navigate("/order-success"),
            });
          }}
          type="button"
          className={btnClass}
          disabled={
            loading ||
            !cart.items.length ||
            checkoutLoading ||
            pointsCheckoutLoading
          }
        >
          {checkoutLoading ? "Processing..." : "Pay with Razorpay"}
        </Button>
        <Button
          onClick={() => {
            if (!selectedAddressId) {
              toast.error("Please add a default address first");
              return;
            }
            if (points < totalAmount) {
              toast.error("You don't have enough points");
              return;
            }
            void startPointsCheckout({
              isSignedIn: Boolean(isSignedIn),
              onSuccess: () => navigate("/order-success"),
            });
          }}
          disabled={
            !(
              Boolean(isSignedIn) &&
              Boolean(cart.items.length) &&
              !checkoutLoading &&
              !pointsCheckoutLoading
            )
          }
          type="button"
          className={btnClass}
        >
          {pointsCheckoutLoading ? "Processing..." : "Pay with Points"}
        </Button>
      </>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent className={contentClass}>
        <div className={shellClass}>

          {/* ═══ MOBILE: everything in one scroll ═══ */}
          <div className={mobileOnlyClass}>
            <CustomerCartItems />

            <div className={mobileCheckoutCard}>
              <p className="text-lg font-semibold text-foreground">Checkout</p>
              {renderCheckoutSummary("space-y-4")}
            </div>

            <div className={mobileActionClass}>
              {renderPaymentButtons(mobileBtnClass)}
            </div>
          </div>

          {/* ═══ DESKTOP: left pane (cart) ═══ */}
          <div className={desktopLeftClass}>
            <CustomerCartItems />
          </div>

          {/* ═══ DESKTOP: right pane (checkout) ═══ */}
          <aside className={desktopRightClass}>
            <div className={desktopRightInner}>
              <div className={desktopPanelClass}>
                <DrawerHeader className={desktopPanelHeader}>
                  <DrawerTitle className="flex items-center gap-2 text-left">
                    Checkout
                  </DrawerTitle>
                </DrawerHeader>

                <ScrollArea className={desktopScrollClass}>
                  {renderCheckoutSummary(desktopBodyClass)}
                </ScrollArea>

                <DrawerFooter className={desktopActionClass}>
                  {renderPaymentButtons(desktopBtnClass)}
                </DrawerFooter>
              </div>
            </div>
          </aside>

        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CustomerCartAndCheckoutDrawer;
