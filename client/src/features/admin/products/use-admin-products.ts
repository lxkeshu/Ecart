import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "./types";
import { getAdminCategories, getAdminProducts, deleteAdminProduct } from "./api";
import { toast } from "sonner";

export function useAdminProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setcategoryDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    const data = await getAdminCategories();
    setcategories(data ?? []);
  }, []);

  const loadProducts = useCallback(async (searchValue = "") => {
    setLoading(true);

    try {
      const data = await getAdminProducts(searchValue);
      setProducts(data ?? []);
    } catch {
      console.log("fetching failed");
    } finally {
      setLoading(false);
    }
  }, []);

  function openCreateDialog() {
    setEditingProduct(null);
    setProductDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setProductDialogOpen(true);
  }

  function closeProductDialog() {
    setProductDialogOpen(false);
    setEditingProduct(null);
  }

  async function removeProduct(productId: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingProductId(productId);
      await deleteAdminProduct(productId);
      toast.success("Product deleted successfully");
      await loadProducts(search);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  }

  const refreshAll = useCallback(async () => {
    await Promise.all([loadCategories(), loadProducts(search)]);
  }, [loadCategories, loadProducts, search]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, loadProducts]);

  return {
    search,
    setSearch,
    products,
    categories,
    loading,
    refreshAll,
    categoryDialogOpen,
    setcategoryDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    editingProduct,
    openCreateDialog,
    closeProductDialog,
    openEditDialog,
    removeProduct,
    deletingProductId,
  };
}
