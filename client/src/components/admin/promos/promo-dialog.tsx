import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Promo, PromoFormValues } from "@/features/admin/promo/types";
import { useEffect, useState } from "react";

const dialogContentClass =
  "max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-2xl";

const layoutClass = "grid gap-6";

const firstRowClass = "grid gap-4 md:grid-cols-2";

const secondRowClass = "grid gap-4 md:grid-cols-2";

const thirdRowClass = "grid gap-4 md:grid-cols-2";

const fieldWrapClass = "space-y-2";

const inputClass = "rounded-none";

const errorTextClass = "text-sm text-destructive";

const footerClass = "flex justify-end gap-3";

const outlineButtonClass = "rounded-none";

const primaryButtonClass = "rounded-none";

type PromoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo: Promo | null;
  saving: boolean;
  onSaved: (values: PromoFormValues) => Promise<void>;
};

const defaultForm: PromoFormValues = {
  code: "",
  percentage: "",
  count: "",
  minimumOrderValue: "",
  maxDiscountAmount: "",
  startsAt: "",
  endsAt: "",
};

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function PromoDialog({
  open,
  onOpenChange,
  promo,
  saving,
  onSaved,
}: PromoDialogProps) {
  const [form, setForm] = useState<PromoFormValues>(defaultForm);
  const [error, setError] = useState<string>("");
  const isEditMode = !!promo;

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setError("");
      return;
    }

    if (promo) {
      setForm({
        code: promo.code,
        percentage: String(promo.percentage),
        count: String(promo.count),
        minimumOrderValue: String(promo.minimumOrderValue),
        maxDiscountAmount: promo.maxDiscountAmount
          ? String(promo.maxDiscountAmount)
          : "",
        startsAt: toDateTimeLocal(promo.startsAt),
        endsAt: toDateTimeLocal(promo.endsAt),
      });
      setError("");
      return;
    }

    setForm(defaultForm);
    setError("");
  }, [open, promo]);

  function updateField<K extends keyof PromoFormValues>(
    key: K,
    value: PromoFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setError("");
  }

  async function submit() {
    if (!form.code.trim()) return setError("Promo code is required");
    if (!form.percentage.trim()) return setError("Percentage is required");
    if (!form.count.trim()) return setError("Promo count is required");
    if (!form.minimumOrderValue.trim()) return setError("Minimum order value is required");
    if (!form.startsAt.trim()) return setError("Valid From date and time is required (Make sure all parts including AM/PM are filled)");
    if (!form.endsAt.trim()) return setError("Valid Till date and time is required (Make sure all parts including AM/PM are filled)");

    try {
      await onSaved({
        code: form.code.trim().toUpperCase(),
        percentage: form.percentage,
        count: form.count,
        minimumOrderValue: form.minimumOrderValue,
        maxDiscountAmount: form.maxDiscountAmount,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      });
    } catch (err) {
      console.log(err);
      setError("Failed to save promo");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Promo" : "Add Promo"}</DialogTitle>
        </DialogHeader>
        {error && <div className={errorTextClass}>{error}</div>}
        <div className={layoutClass}>
          <div className={firstRowClass}>
            <div className={fieldWrapClass}>
              <Label>Promo Code</Label>
              <Input
                className={inputClass}
                type="text"
                value={form.code}
                placeholder="SUMMARY10"
                onChange={(e) => updateField("code", e.target.value)}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label>Discount Percentage</Label>
              <Input
                className={inputClass}
                type="number"
                min={"1"}
                max={"100"}
                value={form.percentage}
                placeholder="10"
                onChange={(e) => updateField("percentage", e.target.value)}
              />
            </div>
          </div>

          <div className={secondRowClass}>
            <div className={fieldWrapClass}>
              <Label>Promo Count</Label>
              <Input
                className={inputClass}
                type="number"
                min={"1"}
                value={form.count}
                placeholder="100"
                onChange={(e) => updateField("count", e.target.value)}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label>Minimum Order Value</Label>
              <Input
                className={inputClass}
                type="number"
                min={"0"}
                value={form.minimumOrderValue}
                placeholder="999"
                onChange={(e) =>
                  updateField("minimumOrderValue", e.target.value)
                }
              />
            </div>

            <div className={fieldWrapClass}>
              <Label>Max Discount Amount (Optional)</Label>
              <Input
                className={inputClass}
                type="number"
                min={"0"}
                value={form.maxDiscountAmount}
                placeholder="500"
                onChange={(e) =>
                  updateField("maxDiscountAmount", e.target.value)
                }
              />
            </div>
          </div>

          <div className={thirdRowClass}>
            <div className={fieldWrapClass}>
              <Label>Valid From</Label>
              <Input
                className={inputClass}
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => updateField("startsAt", e.target.value)}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label>Valid Till</Label>
              <Input
                className={inputClass}
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => updateField("endsAt", e.target.value)}
              />
            </div>
          </div>

          <div className={footerClass}>
            <Button
              className={outlineButtonClass}
              variant={"secondary"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={saving}
              className={primaryButtonClass}
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Promo"
                  : "Create Promo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PromoDialog;
