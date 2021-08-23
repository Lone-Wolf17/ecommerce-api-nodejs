const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(7);

router.get("/", async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");

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

// @desc        Retrieve a particular User using its id
// @route       Get api/v1/users/:id
router.get("/:id", async (req, res) => {
  try {
    console.log("Point A");
    /// Checks if id is a valid Object ID
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    console.log("Point B");
    const user = await User.findById(req.params.id).select("-passwordHash");
    console.log("Point C");
    if (!user)
      res.status(404).json({
        success: false,
        message: "The User with the given ID was not found!!!",
      });

    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
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

// @desc        Login User
// @route       Post api/v1/users/login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.JWT_SECRET;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "The User Not Found",
      });
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin
        },
        secret,
        { expiresIn: "1d" }
      );

      return res.status(200).send({ user: user.email, token: token });
    } else {
      return res.status(400).send("Password is wrong");
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
});


// @desc        register a User
// @route       Post api/v1/users/register
/// This is technically a twin to POST api/v1/users/
/// This is for regular users, that one is expected to be used by Admins Panel
router.post("/register", async (req, res) => {
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

// @desc        Get Count of User in DB
// @route       Get api/v1/users/get/count
router.get("/get/count", async (req, res) => {
  try {
    const userCount = await User.countDocuments((count) => count);

    if (!userCount) return res.status(400).json({ success: false });

    res.status(200).send({
      userCount: userCount,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

// @desc        Delete a User
// @route       Delete api/v1/user/:id
router.delete("/:id", async (req, res) => {
  try {
    /// Checks if id is a valid Object ID
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });

    /// Checks if prodduect exists in DB
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User to be Deleted was not found in Database",
      });

    // This is the line that does the deleting from DB
    const result = await User.findByIdAndRemove(req.params.id);

    if (!result)
      return res.status(404).json({
        message: "User not Found in DB",
        success: false,
      });

    return res
      .status(200)
      .json({ success: true, message: "The User was deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
      success: false,
    });

    next(err);
  }
});


module.exports = router;
