import type { ProductCategory } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  CustomerProduct,
  GetCustomerProductsParams,
  ProductSort,
} from "./types";
import type {
  ActiveFilterBadge,
  CustomerProductFilters,
  FacetKey,
} from "./product-list.shared";
import { getCustomerCategories, getCustomerProducts } from "./api";

export function useCustomerProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<CustomerProduct[]>([]);

  const [loading, setLoading] = useState(false);

  const filters = useMemo<CustomerProductFilters>(
    () => ({
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
      subSubcategory: searchParams.get("subSubcategory") || "",
      color: searchParams.get("color") || "",
      size: searchParams.get("size") || "",
    }),
    [searchParams],
  );

  const sort = (searchParams.get("sort") as ProductSort) || "recent";

  const query = useMemo<GetCustomerProductsParams>(
    () => ({
      category: filters.category || undefined,
      subcategory: filters.subcategory || undefined,
      subSubcategory: filters.subSubcategory || undefined,
      sort,
    }),
    [filters, sort],
  );

  const hasActiveFilters = Boolean(
    filters.category || filters.subcategory || filters.subSubcategory,
  );

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCustomerCategories();
      setCategories(data ?? []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts(params: GetCustomerProductsParams) {
    setLoading(true);

    try {
      const data = await getCustomerProducts(params);
      setProducts(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  //   update params -> when user will select or deselect filters/sort

  function updateParams(next: URLSearchParams) {
    setSearchParams(next);
  }

  // toggle filter facets

  const toggleFacet = (key: FacetKey, value: string) => {
    const nextValue = new URLSearchParams(searchParams);
    const currentvalue = searchParams.get(key) || "";

    if (currentvalue === value) {
      nextValue.delete(key);
    } else {
      nextValue.set(key, value);
    }

    updateParams(nextValue);
  };

  // handle sort

  const changeSort = useCallback(
    (value: ProductSort) => {
      const nextValue = new URLSearchParams(searchParams);

      if (value === "recent") {
        nextValue.delete("sort");
      } else {
        nextValue.set("sort", value);
      }

      updateParams(nextValue);
    },
    [searchParams, updateParams],
  );

  const clearFilters = () => {
    const nextValue = new URLSearchParams(searchParams);
    nextValue.delete("category");
    nextValue.delete("subcategory");
    nextValue.delete("subSubcategory");
    updateParams(nextValue);
  };



  // active filter badges
  const activeFilterBadges = useMemo<ActiveFilterBadge[]>(() => {
    const items: ActiveFilterBadge[] = [];

    if (filters.category) {
      const found = categories.find((item) => item._id === filters.category);

      items.push({
        key: "category",
        label: "Category",
        value: found?.name || filters.category,
      });
    }

    if (filters.subcategory) {
      const found = categories.find((item) => item._id === filters.subcategory);
      items.push({
        key: "subcategory",
        label: "Subcategory",
        value: found?.name || filters.subcategory,
      });
    }

    if (filters.subSubcategory) {
      const found = categories.find((item) => item._id === filters.subSubcategory);
      items.push({
        key: "subSubcategory",
        label: "Sub-Subcategory",
        value: found?.name || filters.subSubcategory,
      });
    }





    return items;
  }, [categories, filters]);

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadProducts(query);
  }, [query]);



  return {
    categories,
    products,
    loading,
    filters,
    sort,
    hasActiveFilters,
    changeSort,
    toggleFacet,
    clearFilters,
    activeFilterBadges,
  };
}
