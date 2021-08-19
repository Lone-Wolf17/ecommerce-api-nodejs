const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
const mongoose = require("mongoose");

// @desc        Retrieve all Products
// @route       Get api/v1/products
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }

    const productList = await Product.find(filter).select(
      "name image brand category"
    );

    res.status(200).send(productList);
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

// @desc        Create a New Product
// @route       Post api/v1/products
router.post("/", async (req, res) => {
  try {
    console.log("Point A");
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).json({
        success: false,
        message: "Invalid Category",
      });

    console.log("Point B");

    const newProduct = await Product.create({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    if (!newProduct)
      return res.status(404).json({
        success: false,
        message: "Product Could not be created",
      });

    return res.status(200).json(newProduct);
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

// @desc        Retrieve product with id
// @route       Get api/v1/products/:id
router.get("/:id", async (req, res) => {
  try {
    /// Validates that Category Exists
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).json({
        success: false,
        message: "Invalid Category",
      });

    const product = await Product.findById(req.params.id).populate("category");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product with Id not found" });

    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

// @desc        Update a Product
// @route       Put api/v1/products/:id
router.put("/:id", async (req, res) => {
  try {
    /// Checks if id is a valid Object ID
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });

    /// Checks if prodduect exists in DB
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).json({
        success: false,
        message: "Product to be Updated was not found in Database",
      });

    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).json({
        success: false,
        message: "Invalid Category",
      });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      res
        .status(404)
        .json({ success: false, message: "Product Could not be Updated!!!" });
    }
    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

// @desc        Delete a Product
// @route       Delete api/v1/products/:id
router.delete("/:id", async (req, res) => {
  try {
    /// Checks if id is a valid Object ID
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });

    /// Checks if prodduect exists in DB
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).json({
        success: false,
        message: "Product to be Deleted was not found in Database",
      });

    const result = await Product.findByIdAndRemove(req.params.id);

    if (!result)
      return res.status(404).json({
        message: "Product not Found",
        success: false,
      });

    return res
      .status(200)
      .json({ success: true, message: "The Product was deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
      success: false,
    });

    next(err);
  }
});

// @desc        Get Count of Products in DB
// @route       Get api/v1/products/get/count
router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) return res.status(400).json({ success: false });

    res.status(200).send({
      productCount: productCount,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

// @desc        Get Featured Products
// @route       Get api/v1/products/get/featured
router.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) return res.status(400).json({ success: false });

    res.status(200).send({
      productCount: products,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

module.exports = router;
