const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(7);

router.get("/", async (req, res) => {
  try {
    const userList = await User.find();

    if (!userList) {
      res.status(400).json({ success: false });
    }
    res.send(userList);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
});

// @desc        Create a new User
// @route       Post api/v1/users
router.post("/", async (req, res) => {
  try {
    
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, salt),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      apartment: req.body.apartment,
      street: req.body.street,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    // user = await user.save();

    if (!user)
      return res.status(404).json({
        message: "The User Could not be created",
        success: false,
      });

    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

module.exports = router;
