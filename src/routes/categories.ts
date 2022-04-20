import {Router} from 'express'

import * as CategoryController from '../controllers/category';

const router = Router();

// @desc        Retrieve all Categories
// @route       Get api/v1/categories
router.get("/", CategoryController.getAllCategories);

// @desc        Retrieve a particular Category using its id
// @route       Get api/v1/categories/:id
router.get("/:id", CategoryController.getCategoryById);

// @desc        Create a new Category
// @route       Post api/v1/categories
router.post("/", CategoryController.createCategory);

// @desc        Delete a Category
// @route       Delete api/v1/categories/:id
router.delete("/:id", CategoryController.deleteCategory);

// @desc        Update Category with ID
// @route       Put api/v1/categories/:id
router.put("/:id", CategoryController.updateCategory);

// @desc        Get Count of Categories in DB
// @route       Get api/v1/categories/get/count
router.get("/get/count", CategoryController.getCategoriesCount);


export default router;
