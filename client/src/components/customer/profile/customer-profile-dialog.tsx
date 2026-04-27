import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useUser } from "@clerk/react";
import { Pencil, Plus, Trash2, MapPin, User, Mail, Wallet, Check } from "lucide-react";

const dialogClass = "max-h-[95vh] overflow-hidden border-border bg-background p-0 sm:max-w-4xl";

const headerSectionClass = "relative overflow-hidden bg-secondary/30 px-8 py-10";

const headerContentClass = "relative z-10 flex flex-wrap items-center justify-between gap-6";

const userProfileClass = "flex items-center gap-5";

const avatarWrapClass = "flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20";

const userTextClass = "space-y-1";

const userNameClass = "text-2xl font-semibold tracking-tight text-foreground";

const userEmailClass = "flex items-center gap-2 text-sm text-muted-foreground";

const statsWrapClass = "flex items-center gap-4";

const statItemClass = "flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-5 py-3 shadow-sm transition-all hover:border-primary/30";

const statIconWrapClass = "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary";

const statTextClass = "space-y-0.5";

const statLabelClass = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground";

const statValueClass = "text-sm font-bold text-foreground";

const scrollAreaClass = "max-h-[calc(95vh-160px)] overflow-y-auto px-8 py-8";

const contentGridClass = "grid gap-10 lg:grid-cols-[1.2fr_0.8fr]";

const singleColumnClass = "mx-auto max-w-2xl";

const sectionClass = "space-y-6";

const sectionHeadClass = "flex items-center justify-between gap-4";

const sectionTitleWrapClass = "space-y-1";

const sectionTitleClass = "text-xl font-semibold tracking-tight text-foreground";

const sectionDescClass = "text-sm text-muted-foreground";

const addressListClass = "grid gap-4";

const addressCardClass = "group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5";

const addressCardHeaderClass = "flex items-start justify-between gap-3";

const addressInfoClass = "space-y-2";

const addressNameClass = "font-semibold text-foreground";

const addressDetailClass = "text-sm leading-relaxed text-muted-foreground";

const badgeClass = "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary";

const addressActionsClass = "flex items-center gap-2 pt-4 opacity-0 transition-opacity group-hover:opacity-100";

const actionButtonClass = "h-8 rounded-lg px-3 text-xs";

const formContainerClass = "sticky top-0 h-fit rounded-3xl border border-border/60 bg-secondary/20 p-8 backdrop-blur-sm";

const fieldGroupClass = "space-y-2";

const inputClass = "h-11 rounded-xl border-border/50 bg-background/50 focus:ring-primary/20";

const checkboxRowClass = "flex cursor-pointer items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-4 transition-colors hover:bg-background";

const checkboxClass = "h-4 w-4 rounded-md border-border accent-primary";

const emptyStateClass = "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-12 text-center";

const emptyIconWrapClass = "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground";

import { useState } from "react";
import { toast } from "sonner";

function CustomerProfileDialog() {
  const {
    isOpen,
    closeProfile,
    mode,
    startAdd,
    startEdit,
    updateForm,
    cancelForm,
    saveForm,
    removeAddress,
    items,
    form,
  } = useCustomerProfileStore();

  const { points } = useCustomerCartAndCheckoutStore((state) => state);
  const { user } = useUser();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const startEditName = () => {
    setTempName(user?.fullName || "");
    setIsEditingName(true);
  };

  const saveName = async () => {
    if (!user || !tempName.trim()) return;

    try {
      setIsSavingName(true);
      const parts = tempName.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");

      await user.update({
        firstName,
        lastName,
      });

      toast.success("Name updated successfully");
      setIsEditingName(false);
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setIsSavingName(false);
    }
  };

  const showForm = mode !== "none";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeProfile()}>
      <DialogContent className={dialogClass}>
        <div className={headerSectionClass}>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          
          <div className={headerContentClass}>
            <div className={userProfileClass}>
              <div className={avatarWrapClass}>
                <User className="h-8 w-8" />
              </div>
              <div className={userTextClass}>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-9 w-48 rounded-lg bg-background/50"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      className="h-8 w-8 rounded-lg p-0"
                      onClick={saveName}
                      disabled={isSavingName}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg p-0"
                      onClick={() => setIsEditingName(false)}
                      disabled={isSavingName}
                    >
                      <Plus className="h-4 w-4 rotate-45" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className={userNameClass}>{user?.fullName}</h1>
                    <button
                      onClick={startEditName}
                      className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className={userEmailClass}>
                  <Mail className="h-3.5 w-3.5" />
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            </div>

            <div className={statsWrapClass}>
              <div className={statItemClass}>
                <div className={statIconWrapClass}>
                  <Wallet className="h-5 w-5" />
                </div>
                <div className={statTextClass}>
                  <p className={statLabelClass}>Rewards</p>
                  <p className={statValueClass}>{points} Points</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={scrollAreaClass}>
          <div className={showForm ? contentGridClass : singleColumnClass}>
            <div className={sectionClass}>
              <div className={sectionHeadClass}>
                <div className={sectionTitleWrapClass}>
                  <h2 className={sectionTitleClass}>Delivery Addresses</h2>
                  <p className={sectionDescClass}>Manage your saved shipping locations</p>
                </div>
                {!showForm && (
                  <Button size="sm" className="rounded-xl" onClick={startAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Address
                  </Button>
                )}
              </div>

              {!items.length && !showForm ? (
                <div className={emptyStateClass}>
                  <div className={emptyIconWrapClass}>
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold">No addresses saved</h3>
                  <p className="text-sm text-muted-foreground mt-1">Add your first address to speed up checkout</p>
                  <Button variant="outline" className="mt-6 rounded-xl" onClick={startAdd}>
                    Add your first address
                  </Button>
                </div>
              ) : (
                <div className={addressListClass}>
                  {items.map((item) => (
                    <div key={item._id} className={addressCardClass}>
                      <div className={addressCardHeaderClass}>
                        <div className={addressInfoClass}>
                          <div className="flex items-center gap-3">
                            <span className={addressNameClass}>{item.fullName}</span>
                            {item.isDefault && (
                              <span className={badgeClass}>
                                <Check className="mr-1 h-2.5 w-2.5" />
                                Default
                              </span>
                            )}
                          </div>
                          <p className={addressDetailClass}>
                            {item.address}<br />
                            {item.state}, {item.postalCode}
                          </p>
                        </div>
                      </div>
                      <div className={addressActionsClass}>
                        <Button
                          variant="secondary"
                          className={actionButtonClass}
                          onClick={() => startEdit(item)}
                        >
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className={`${actionButtonClass} text-destructive hover:bg-destructive/10 hover:text-destructive`}
                          onClick={() => removeAddress(item._id)}
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showForm && (
              <div className={formContainerClass}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{mode === "edit" ? "Update Address" : "New Address"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Please provide accurate shipping details</p>
                </div>

                <div className="space-y-5">
                  <div className={fieldGroupClass}>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <Input
                      className={inputClass}
                      value={form.fullName}
                      onChange={(e) => updateForm("fullName", e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  <div className={fieldGroupClass}>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address</Label>
                    <Input
                      className={inputClass}
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      placeholder="e.g. 123 Fashion St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={fieldGroupClass}>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State</Label>
                      <Input
                        className={inputClass}
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div className={fieldGroupClass}>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Postal Code</Label>
                      <Input
                        className={inputClass}
                        value={form.postalCode}
                        onChange={(e) => updateForm("postalCode", e.target.value)}
                        placeholder="Code"
                      />
                    </div>
                  </div>

                  <label className={checkboxRowClass}>
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => updateForm("isDefault", e.target.checked)}
                      className={checkboxClass}
                    />
                    <span className="font-medium">Set as primary address</span>
                  </label>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      className="h-11 rounded-xl"
                      onClick={() => void saveForm()}
                    >
                      {mode === "edit" ? "Save Changes" : "Create Address"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-11 rounded-xl"
                      onClick={cancelForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerProfileDialog;
