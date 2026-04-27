import { apiGet, apiPost } from "@/lib/api";
import type {
  CustomerProduct,
  CustomerProductDetailsResponse,
  GetCustomerProductsParams,
  ProductCategory,
  ProductReview,
} from "./types";

export async function getCustomerCategories() {
  return apiGet<ProductCategory[]>("/customer/categories");
}

export async function getCustomerProducts(params?: GetCustomerProductsParams) {
  const searchParams = new URLSearchParams();

  if (params?.category) {
    searchParams.set("category", params.category);
  }

  if (params?.subcategory) {
    searchParams.set("subcategory", params.subcategory);
  }

  if (params?.subSubcategory) {
    searchParams.set("subSubcategory", params.subSubcategory);
  }

  if (params?.color) {
    searchParams.set("color", params.color);
  }

  if (params?.size) {
    searchParams.set("size", params.size);
  }

  if (params?.sort) {
    searchParams.set("sort", params.sort);
  }

  const queryString = searchParams.toString();

  const url = queryString
    ? `/customer/products?${queryString}`
    : `/customer/products`;

  return apiGet<CustomerProduct[]>(url);
}

export async function getCustomerProductDetails(productId: string) {
  return apiGet<CustomerProductDetailsResponse>(
    `/customer/products/${productId}`,
  );
}

export async function getProductReviews(productId: string) {
  return apiGet<ProductReview[]>(`/customer/products/${productId}/reviews`);
}

export async function addProductReview(productId: string, formData: FormData) {
  return apiPost<ProductReview, FormData>(
    `/customer/products/${productId}/reviews`,
    formData,
  );
}
