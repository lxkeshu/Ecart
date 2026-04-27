import { Router, type Request, type Response } from "express";
import multer from "multer";
import { getDbUserFromReq, requireAdmin } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { Category } from "../../models/Category";
import { ok } from "../../utils/envelope";
import { requireFound, requireNumber, requireText } from "../../utils/helpers";
import { Product } from "../../models/Product";
import { AppError } from "../../utils/AppError";
import { uploadManyBuffersToCloudinary } from "../../utils/cloudinary";

type UploadedImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};

export const adminProductRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
    files: 10,
  },
});

adminProductRouter.use(requireAdmin);

// categories

adminProductRouter.get(
  "/categories",
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find({}).sort({
      name: 1,
    });

    res.json(ok(categories));
  }),
);

adminProductRouter.post(
  "/categories",
  asyncHandler(async (req: Request, res: Response) => {
    const name = String(req.body.name || "").trim();
    const parent = req.body.parent || null;

    requireText(name, "Category name is needed");

    let level = 1;
    if (parent) {
      const parentCategory = await Category.findById(parent);
      requireFound(parentCategory, "Parent category not found");
      level = parentCategory.level + 1;
      if (level > 3) {
        throw new AppError(400, "Maximum category depth is 3 levels");
      }
    }

    const category = await Category.create({ name, parent, level });

    res.status(201).json(ok(category));
  }),
);

adminProductRouter.put(
  "/categories/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const name = String(req.body.name || "").trim();
    const parent = req.body.parent || null;
    const extractCategoryId = req.params.id as string;

    requireText(name, "Category name is needed");

    const existingCategory = await Category.findById(extractCategoryId);
    const category = requireFound(existingCategory, "Category not found");

    let level = 1;
    if (parent) {
      const parentCategory = await Category.findById(parent);
      requireFound(parentCategory, "Parent category not found");
      level = parentCategory.level + 1;
      if (level > 3) {
        throw new AppError(400, "Maximum category depth is 3 levels");
      }
    }

    category.name = name;
    category.parent = parent;
    category.level = level;

    await category.save();
    res.json(ok(category));
  }),
);

// products
adminProductRouter.get(
  "/products",
  asyncHandler(async (req: Request, res: Response) => {
    const search = String(req.query.search || "").trim();

    const query: Record<string, unknown> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("subSubcategory", "name")
      .sort({ createdAt: -1 });

    res.json(ok(products));
  }),
);

adminProductRouter.get(
  "/products/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id as string;

    const product = await Product.findById(productId)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("subSubcategory", "name");

    requireText(product, "Product not found", 404);

    res.json(ok(product));
  }),
);

adminProductRouter.post(
  "/products",
  upload.array("images", 10),
  asyncHandler(async (req: Request, res: Response) => {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const subcategory = req.body.subcategory || null;
    const subSubcategory = req.body.subSubcategory || null;
    const price = Number(req.body.price);
    const salePercentage = Number(req.body.salePercentage || 0);
    const stock = Number(req.body.stock);
    const status = String(req.body.status || "active").trim();
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];

    requireText(title, "Title is required");
    requireText(description, "Description is required");
    requireText(category, "Category is required");

    requireNumber(price, "Price is required");
    requireNumber(salePercentage, "Sale Percentage is required");
    requireNumber(stock, "Stock is required");

    const existingCategory = await Category.findById(category);
    requireFound(existingCategory, "Category not found", 404);

    if (subcategory) {
      const existingSub = await Category.findById(subcategory);
      requireFound(existingSub, "Subcategory not found", 404);
    }
    if (subSubcategory) {
      const existingSubSub = await Category.findById(subSubcategory);
      requireFound(existingSubSub, "Sub-subcategory not found", 404);
    }

    const files = (req.files as Express.Multer.File[]) || [];

    if (!files.length) {
      throw new AppError(400, "Atleast one image is needed");
    }

    const uploadedImages = await uploadManyBuffersToCloudinary(
      files.map((file) => file.buffer),
    );

    const images = uploadedImages.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      isCover: index === 0,
    }));

    const user = await getDbUserFromReq(req);

    const product = await Product.create({
      title,
      description,
      category,
      subcategory,
      subSubcategory,
      images,
      colors,
      sizes,
      price,
      salePercentage,
      stock,
      status,
      createdBy: user._id,
    });

    const createdProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("subSubcategory", "name");

    res.status(201).json(ok(createdProduct));
  }),
);

adminProductRouter.put(
  "/products/:id",
  upload.array("images", 10),
  asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const subcategory = req.body.subcategory || null;
    const subSubcategory = req.body.subSubcategory || null;
    const price = Number(req.body.price);
    const salePercentage = Number(req.body.salePercentage || 0);
    const stock = Number(req.body.stock);
    const status = String(req.body.status || "active").trim() as
      | "active"
      | "inactive";
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];
    const coverImagePublicId = String(req.body.coverImagePublicId || "").trim();

    requireText(title, "Title is required");
    requireText(description, "Description is required");
    requireText(category, "Category is required");

    requireNumber(price, "Price is required");
    requireNumber(salePercentage, "Sale Percentage is required");
    requireNumber(stock, "Stock is required");

    const existingCategoryDoc = await Category.findById(category);
    const existingCategory = requireFound(
      existingCategoryDoc,
      "Category not found",
    );

    if (subcategory) {
      const existingSub = await Category.findById(subcategory);
      requireFound(existingSub, "Subcategory not found", 404);
    }
    if (subSubcategory) {
      const existingSubSub = await Category.findById(subSubcategory);
      requireFound(existingSubSub, "Sub-subcategory not found", 404);
    }

    const productDoc = await Product.findById(productId);
    const product = requireFound(productDoc, "Product not found");

    const files = (req.files as Express.Multer.File[]) || [];

    const uploadNewImages = await uploadManyBuffersToCloudinary(
      files.map((file) => file.buffer),
    );

    const newlyAddedImages = uploadNewImages.map((image) => ({
      url: image.url,
      publicId: image.publicId,
      isCover: false,
    }));

    let existingImages: UploadedImage[] = product.images.map(
      (img: UploadedImage) => ({
        url: img.url,
        publicId: img.publicId,
        isCover: img.isCover,
      }),
    );

    const mergedImages: UploadedImage[] = [
      ...existingImages,
      ...newlyAddedImages,
    ];

    if (!mergedImages.length) {
      throw new AppError(400, "Atleast one img is needed");
    }

    const finalImages: UploadedImage[] = mergedImages.map(
      (image: UploadedImage, index) => ({
        url: image.url,
        publicId: image.publicId,
        isCover: coverImagePublicId
          ? image.publicId === coverImagePublicId
          : index === 0,
      }),
    );

    product.title = title;
    product.description = description;
    product.category = existingCategory._id;
    product.subcategory = subcategory;
    product.subSubcategory = subSubcategory;
    product.colors = colors;
    product.sizes = sizes;
    product.price = price;
    product.salePercentage = salePercentage;
    product.stock = stock;
    product.status = status;
    product.set("images", finalImages);

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("subSubcategory", "name");

    res.json(ok(updatedProduct));
  }),
);

adminProductRouter.delete(
  "/products/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id as string;

    const product = await Product.findByIdAndDelete(productId);
    requireFound(product, "Product not found", 404);

    res.json(ok({ message: "Product deleted successfully" }));
  }),
);
