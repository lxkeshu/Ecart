import { Router, type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Category } from "../../models/Category";
import { ok } from "../../utils/envelope";
import { Product } from "../../models/Product";
import { requireFound } from "../../utils/helpers";
import { requireAuth, getDbUserFromReq } from "../../middleware/auth";
import { Review } from "../../models/Review";
import multer from "multer";
import { uploadSingleBufferToCloudinary } from "../../utils/cloudinary";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});

export const customerProductRouter = Router();

type ProductSort = "recent" | "price-low" | "price-high";

type ProductAppliedFilterListQuery = {
  category?: string;
  subcategory?: string;
  subSubcategory?: string;
  color?: string;
  size?: string;
  sort?: ProductSort;
};

customerProductRouter.get(
  "/categories",

  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find({}).sort({ name: 1 });

    res.json(ok(categories));
  }),
);

customerProductRouter.get(
  "/products",

  asyncHandler(
    async (
      req: Request<{}, {}, {}, ProductAppliedFilterListQuery>,
      res: Response,
    ) => {
      const category = (req.query.category || "").trim();
      const subcategory = (req.query.subcategory || "").trim();
      const subSubcategory = (req.query.subSubcategory || "").trim();
      const color = (req.query.color || "").trim();
      const size = (req.query.size || "").trim();
      const sort: ProductSort = req.query.sort || "recent";

      const query: Record<string, unknown> = {
        status: "active",
      };

      if (category) {
        query.category = category;
      }
      if (subcategory) {
        query.subcategory = subcategory;
      }
      if (subSubcategory) {
        query.subSubcategory = subSubcategory;
      }
      if (color) {
        query.colors = color;
      }
      if (size) {
        query.sizes = size;
      }

      let sortOption: Record<string, 1 | -1> = { createdAt: -1 };

      if (sort === "price-low") {
        sortOption = { price: 1 };
      }

      if (sort === "price-high") {
        sortOption = { price: -1 };
      }

      const products = await Product.find(query)
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("subSubcategory", "name")
        .sort(sortOption);

      res.json(ok(products));
    },
  ),
);

customerProductRouter.get(
  "/products/:id",

  asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    })
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("subSubcategory", "name");

    const foundProduct = requireFound(product, "Product not found", 404);

    const relatedProducts = await Product.find({
      _id: { $ne: foundProduct._id },
      category: foundProduct.category,
      status: "active",
    })
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("subSubcategory", "name")
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(
      ok({
        product: foundProduct,
        relatedProducts,
      }),
    );
  }),
);

customerProductRouter.get(
  "/products/:id/reviews",
  asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(ok(reviews));
  })
);

customerProductRouter.post(
  "/products/:id/reviews",
  requireAuth,
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const productId = req.params.id;
    const { rating, text } = req.body;

    const product = await Product.findById(productId);
    requireFound(product, "Product not found", 404);

    let imageUrl;
    let imagePublicId;

    if (req.file) {
      const uploadResult = await uploadSingleBufferToCloudinary(
        req.file.buffer,
        "ecommerce-monster-video/reviews"
      );
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const review = await Review.create({
      user: dbUser._id,
      product: product._id,
      rating: Number(rating) || 5,
      text,
      imageUrl,
      imagePublicId,
    });

    await review.populate("user", "name");

    res.json(ok(review));
  })
);
