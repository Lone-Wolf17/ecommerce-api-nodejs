const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");

// @desc        Retrieve all Products
// @route       Get api/v1/products
router.get("/", async (req, res) => {
  try {
    const productList = await Product.find();

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

    console.log("Point C");

    // newProduct = await newProduct.save();

    // console.log("Point C");

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



module.exports = router;
