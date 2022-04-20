import { Response, NextFunction } from "express";
import {isValidObjectId} from 'mongoose';

import { CategoryModel } from "../models/Category";
import { CustomRequestObject } from "../models/custom-request-object";

export const getAllCategories = async (req: CustomRequestObject, res: Response) => {
    try {
        const categoryList = await CategoryModel.find();
    
        if (!categoryList) {
          res
            .status(404)
            .json({ success: false, message: "No Categories Found!!!" });
        }
        res.status(200).send(categoryList);
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

export const getCategoryById = async (req: CustomRequestObject, res: Response) => {
    try {
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid Category ID",
          });
    
        const category = await CategoryModel.findById(req.params.id);
    
        if (!category)
          res.status(404).json({
            success: false,
            message: "The Category with the given ID was not found!!!",
          });
    
        res.status(200).send(category);
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

export const createCategory = async (req: CustomRequestObject, res: Response) => {
    try {
        let category = await CategoryModel.create({
          name: req.body.name,
          icon: req.body.icon,
          color: req.body.color,
        });
    
        if (!category)
          return res.status(404).json({
            message: "The Category Could not be created",
            success: false,
          });
    
        res.status(200).send(category);
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

export const deleteCategory = async (req: CustomRequestObject, res: Response, next: NextFunction) => {
    try {
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid Category ID",
          });
    
        const result = await CategoryModel.findByIdAndRemove(req.params.id);
    
        if (!result)
          return res.status(404).json({
            message: "Category not Found",
            success: false,
          });
    
        return res
          .status(200)
          .json({ success: true, message: "The Category was deleted" });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: err,
          success: false,
        });
    
        next(err);
      }
}

export const updateCategory = async (req: CustomRequestObject, res: Response) => {
    try {
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid Category ID",
          });
    
        const category = await CategoryModel.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
          },
          {
            new: true,
          }
        );
    
        if (!category) {
          res
            .status(404)
            .json({ success: false, message: "Category Could not be Updated!!!" });
        }
        res.status(200).send(category);
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

export const getCategoriesCount = async (req: CustomRequestObject, res: Response)=>  {
    try {
        const categoryCount = await CategoryModel.countDocuments();
    
        if (!categoryCount) return res.status(400).json({ success: false });
    
        res.status(200).send({
          categoryCount: categoryCount,
        });
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}