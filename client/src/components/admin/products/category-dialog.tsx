import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAdminCategory,
  updateAdminCategory,
} from "@/features/admin/products/api";
import type { Category } from "@/features/admin/products/types";
import { Pencil, Tag, ChevronRight } from "lucide-react";
import { useState } from "react";

const dialogContentClass = "sm:max-w-xl max-h-[92vh] overflow-y-auto";

const contentWrap = "space-y-4";

const formRow = "flex gap-3";

const categoriesList = "space-y-2";

const categoryRow =
  "flex items-center justify-between rounded-xl border border-border bg-card px-3 py-3";

const categoryInfo = "flex items-center gap-2";

const categoryIcon = "h-4 w-4 text-muted-foreground";

const categoryName = "text-sm font-medium text-foreground";

const emptyStateClass =
  "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground";

const editButtonClass = "h-4 w-4";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSaved: () => Promise<void>;
};

export function CategoryDialog({
  open,
  onOpenChange,
  categories,
  onSaved,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [parent, setParent] = useState<string>("none");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;

    try {
      setSaving(true);
      const parentId = parent === "none" ? undefined : parent;

      if (editingCategory) {
        await updateAdminCategory(editingCategory._id, {
          name: name.trim(),
          parent: parentId,
        });
      } else {
        await createAdminCategory({ name: name.trim(), parent: parentId });
      }

      setName("");
      setParent("none");
      setEditingCategory(null);
      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(getCurrentCategory: Category) {
    setEditingCategory(getCurrentCategory);
    setName(getCurrentCategory.name);
    setParent(getCurrentCategory.parent || "none");
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setName("");
      setParent("none");
      setEditingCategory(null);
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Manage Catgories</DialogTitle>
        </DialogHeader>

        <div className={contentWrap}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Category Name</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Parent Category (Optional)</label>
              <Select value={parent} onValueChange={setParent}>
                <SelectTrigger>
                  <SelectValue placeholder="No parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent (Level 1)</SelectItem>
                  {categories
                    .filter((c) => c.level < 3 && c._id !== editingCategory?._id)
                    .map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.level === 2 ? "  -- " : ""}{c.name} (Level {c.level})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleSave} disabled={saving || !name.trim()}>
              {editingCategory ? "Update Category" : "Add Category"}
            </Button>
          </div>

          <Separator />

          <div className={categoriesList}>
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={categoryRow}
                style={{ marginLeft: `${(cat.level - 1) * 20}px` }}
              >
                <div className={categoryInfo}>
                  {cat.level > 1 ? (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Tag className={categoryIcon} />
                  )}
                  <span className={categoryName}>{cat.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 ml-1">
                    L{cat.level}
                  </span>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(cat)}
                >
                  <Pencil className={editButtonClass} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
