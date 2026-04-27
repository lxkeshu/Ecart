export type Category = {
  _id: string;
  name: string;
  parent?: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};

export type ProductCategory = {
  _id: string;
  name: string;
  level?: number;
  parent?: string;
};

export type ProductStatus = "active" | "inactive";

export type Product = {
  _id: string;
  title: string;
  description: string;
  category: ProductCategory;
  subcategory?: ProductCategory;
  subSubcategory?: ProductCategory;
  images: ProductImage[];
  colors: string[];
  sizes: string[];
  price: number;
  salePercentage: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryBody = {
  name: string;
  parent?: string;
};

export type UpdateCategoryBody = {
  name: string;
  parent?: string;
};

export type CreateProductBody = {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  subSubcategory?: string;
  colors: string[];
  sizes: string[];
  price: number;
  salePercentage: number;
  stock: number;
  status: ProductStatus;
};

export type UpdateProductBody = {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  subSubcategory?: string;
  colors: string[];
  sizes: string[];
  price: number;
  salePercentage: number;
  stock: number;
  status: ProductStatus;
  existingImages?: ProductImage[];
  coverImagePublicId?: string;
};

export type ProductFormState = {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  subSubcategory: string;
  colors: string[];
  sizes: string[];
  price: string;
  salePercentage: string;
  stock: string;
  status: ProductStatus;
  existingImages: ProductImage[];
  newFiles: File[];
  coverImagePublicId: string;
};
