const express = require('express');
const Category = require('../models/Category.js')
const router = express.Router();

// @desc        Retrieve all Categories
// @route       Get api/v1/categories
router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (!categoryList) {
            res.status(404).json({success: false, message: "No Categories Found!!!"});
        }
        res.status(200).send(categoryList);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            success: false
        });
    }
});

// @desc        Retrieve a particular Category using its id
// @route       Get api/v1/categories/:id
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category)
            res.status(404).json({success: false, message: "The Category with the given ID was not found!!!"});
        
        res.status(200).send(category);
    
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        });
    }
});

// @desc        Create a new Category
// @route       Post api/v1/categories
router.post('/', async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        });
        
        category = await category.save();

        if (!category)
            return res.status(404).json({
                message: 'The Category Could not be created',
                success: false
            });;
        
        res.status(200).send(category);
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        });
    }
});

// @desc        Delete a Category
// @route       Delete api/v1/categories/:id
router.delete('/:id', async (req, res) => {
    try {

        const result = await Category.findByIdAndRemove(req.params.id);

        if (!result) return res.status(404).json({
            message: "Category not Found",
            success: false
        });

        return res.status(200).json({ success: true, message: "The Category was deleted"});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            success: false
        });

        next(err);
    }
});

// @desc        Retrieve all Categories
// @route       Put api/v1/categories/:id
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {
            new: true
        }
        );

        if (!category) {
            res.status(404).json({success: false, message: "Category Could not be Updated!!!"});
        }
        res.status(200).send(category);
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        });
    }
});


module.exports = router;