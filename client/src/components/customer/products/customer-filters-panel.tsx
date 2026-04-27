import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";
import type { ProductCategory } from "@/features/admin/products/types";
import {
  getSwatchColor,
  type CustomerProductFilters,
  type FacetKey,
} from "@/features/customer/products/product-list.shared";

const panelWrapClass = "space-y-6 overflow-y-auto px-4 py-2 lg:px-0 lg:py-0";

const panelHeaderClass = "flex items-center justify-between gap-3";

const titleClass = "text-base font-semibold text-foreground";

const clearButtonClass = "rounded-none px-2 text-sm";

const sectionClass = "space-y-3";

const sectionTitleClass = "text-sm font-medium text-foreground";

const stackedOptionsClass = "space-y-1";

const fullWidthButtonClass = "w-full justify-start rounded-none";

const colorsWrapClass = "flex flex-wrap gap-3";

const colorButtonBaseClass =
  "flex flex-col items-center gap-2 text-xs text-muted-foreground";

const colorButtonActiveClass = "text-foreground";

const colorSwatchBaseClass = "h-8 w-8 border";

const colorSwatchActiveClass = "border-primary ring-2 ring-primary/30";

const colorSwatchInactiveClass = "border-border";

const helperTextClass = "text-sm text-muted-foreground";

const sizesWrapClass = "flex flex-wrap gap-2";

const sizeButtonClass = "min-w-12 rounded-none";

type CustomerFiltersPanelProps = {
  categories: ProductCategory[];
  filters: CustomerProductFilters;
  hasActiveFilters: boolean;
  onToggleFacet: (key: FacetKey, value: string) => void;
  onClearFilters: () => void;
};

function CustomerFiltersPanel({
  categories,
  filters,
  hasActiveFilters,
  onClearFilters,
  onToggleFacet,
}: CustomerFiltersPanelProps) {
  const selectedCategory = categories.find((c) => c._id === filters.category);
  const selectedSubcategory = categories.find(
    (c) => c._id === filters.subcategory,
  );

  const subcategories = categories.filter((c) => c.parent === filters.category);
  const types = categories.filter((c) => c.parent === filters.subcategory);

  return (
    <div className={panelWrapClass}>
      <div className={panelHeaderClass}>
        <div>
          <h2 className={titleClass}>Filters</h2>
        </div>
        {hasActiveFilters ? (
          <Button
            variant={"ghost"}
            className={clearButtonClass}
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        ) : null}
      </div>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Categories</h3>

        <div className={stackedOptionsClass}>
          {categories
            .filter((c) => !c.parent || (c.level ?? 1) === 1)
            .map((item) => {
              const isActive = filters.category === item._id;

              return (
                <Button
                  key={item._id}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  className={fullWidthButtonClass}
                  onClick={() => onToggleFacet("category", item._id)}
                >
                  {item.name}
                </Button>
              );
            })}
        </div>
      </section>

      {subcategories.length > 0 && (
        <section className={sectionClass}>
          <h3 className={sectionTitleClass}>
            {selectedCategory?.name || "Subcategories"}
          </h3>
          <div className={stackedOptionsClass}>
            {subcategories.map((item) => {
              const isActive = filters.subcategory === item._id;

              return (
                <Button
                  key={item._id}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  className={fullWidthButtonClass}
                  onClick={() => onToggleFacet("subcategory", item._id)}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </section>
      )}

      {types.length > 0 && (
        <section className={sectionClass}>
          <h3 className={sectionTitleClass}>
            {selectedSubcategory?.name || "Types"}
          </h3>
          <div className={stackedOptionsClass}>
            {types.map((item) => {
              const isActive = filters.subSubcategory === item._id;

              return (
                <Button
                  key={item._id}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  className={fullWidthButtonClass}
                  onClick={() => onToggleFacet("subSubcategory", item._id)}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default CustomerFiltersPanel;
