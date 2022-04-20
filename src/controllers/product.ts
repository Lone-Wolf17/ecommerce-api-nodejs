import { Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";


import { CustomRequestObject } from "../models/custom-request-object";
import { ProductModel } from "../models/Product";
import { CategoryModel } from "../models/Category";



export const getAllProducts = async (
  req: CustomRequestObject,
  res: Response
) => {
    try {
        let filter = {};
        if (req.query.categories) {
            const categories: string = req.query.categories as string;
          filter = { category: categories.split(",") };
        }
    
        const productList = await ProductModel.find(filter).select(
          "name image brand category"
        );
    
        res.status(200).send(productList);
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
};

export const getProductsCount = async (
  req: CustomRequestObject,
  res: Response
) => {
    try {
        const productCount = await ProductModel.countDocuments();
    
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
};

export const getFeaturedProducts = async (
  req: CustomRequestObject,
  res: Response
) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const products = await ProductModel.find({ isFeatured: true }).limit(+count);
    
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
};

export const getProductById = async (
  req: CustomRequestObject,
  res: Response
) => {
    try {
        /// Validates that Category Exists
        const category = await CategoryModel.findById(req.body.category);
        if (!category)
          return res.status(400).json({
            success: false,
            message: "Invalid Category",
          });
    
        const product = await ProductModel.findById(req.params.id).populate("category");
    
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
};

export const createProduct = async (
  req: CustomRequestObject,
  res: Response
) => {
    try {
        const category = await CategoryModel.findById(req.body.category);
        if (!category)
          return res.status(400).json({
            success: false,
            message: "Invalid Category",
          });
    
        const file = req.file;
        if (!file) return res.status(400).send("The Image field is required...");
    
        const fileName = file.filename;
        const basePath = `images/`;
    
        const newProduct = await ProductModel.create({
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          imageUrl: `${basePath}${fileName}`,
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
};

export const updateProduct = async (
  req: CustomRequestObject,
  res: Response
) => {
    try {
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid Product ID",
          });
    
        /// Checks if prodduect exists in DB
        const product = await ProductModel.findById(req.params.id);
        if (!product)
          return res.status(400).json({
            success: false,
            message: "Product to be Updated was not found in Database",
          });
    
        const category = await CategoryModel.findById(req.body.category);
        if (!category)
          return res.status(400).json({
            success: false,
            message: "Invalid Category",
          });
    
          const file = req.file;
          if (!file) return res.status(400).send("The Image field is required...");
      
          const fileName = file.filename;
          const basePath = `images/`;
      
    
        const updatedProduct = await ProductModel.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            imageUrl: `${basePath}${fileName}`,
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
};

export const updateProductImages = async (
  req: CustomRequestObject,
  res: Response
) => {
    try {
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid Product ID",
          });
  
        const files = req.files as Express.Multer.File[];
        if (!files) return res.status(400).send("The Images field is required...");
  
        let imagesPaths : string[]= [];
        const basePath = `images/`;
        if (files) {
          files.forEach((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
          });
        }
  
        const updatedProduct = await ProductModel.findByIdAndUpdate(
          req.params.id,
          {
            images: imagesPaths,
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
};

export const deleteProduct = async (
  req: CustomRequestObject,
  res: Response,
  next: NextFunction
) => {
    try {
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid Product ID",
          });
    
        /// Checks if prodduect exists in DB
        const product = await ProductModel.findById(req.params.id);
        if (!product)
          return res.status(400).json({
            success: false,
            message: "Product to be Deleted was not found in Database",
          });
    
        const result = await ProductModel.findByIdAndRemove(req.params.id);
    
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
};
