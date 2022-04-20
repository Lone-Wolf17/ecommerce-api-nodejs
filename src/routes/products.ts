import { Router } from "express";

import * as ProductController from '../controllers/product';
import { uploadOptions } from "../util/file";

const router = Router();

// @desc        Retrieve all Products
// @route       Get api/v1/products
router.get("/", ProductController.getAllProducts);

// @desc        Get Count of Products in DB
// @route       Get api/v1/products/get/count
router.get("/get/count", ProductController.getProductsCount);

// @desc        Get Featured Products
// @route       Get api/v1/products/get/featured
router.get("/get/featured/:count", ProductController.getFeaturedProducts);

// @desc        Retrieve product with id
// @route       Get api/v1/products/:id
router.get("/:id", ProductController.getProductById);

// @desc        Create a New Product
// @route       Post api/v1/products
router.post("/", uploadOptions.single("image"), ProductController.createProduct);

// @desc        Update a Product
// @route       Put api/v1/products/:id
router.put("/:id", uploadOptions.single("image"), ProductController.updateProduct);

// @desc        Update a Product
// @route       Put api/v1/products/:id
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  ProductController.updateProductImages
);

// @desc        Delete a Product
// @route       Delete api/v1/products/:id
router.delete("/:id", ProductController.deleteProduct);

export default router;
