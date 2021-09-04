const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order.js");
const OrderItem = require("../models/OrderItem.js");
const Product = require("../models/Product.js");
const router = express.Router();

// @desc        Retrieve all Orders
// @route       GET api/v1/orders
router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

// @desc        Create a new Order
// @route       Post api/v1/order
router.post("/", async (req, res) => {
  let totalPrice = 0;

  const orderItemsIds = await Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      const product = await Product.findById(orderItem.product)
        .select("price")
        .lean();

      if (!product) {
        return res.status(400).json({
          message: `The Product ${orderItem.product} not found in Database`,
          success: false,
        });
      }

      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      totalPrice += orderItem.quantity * +product.price;

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  console.log(`Total Price:: ${totalPrice}`);

  let order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order)
    return res.status(404).json({
      message: "The Order Could not be created",
      success: false,
    });

  res.status(200).send(order);
});

// @desc        Get Order By ID
// @route       GET api/v1/orders/:id
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    return res.status(500).json({ success: false, message: "Order not Found" });
  }
  res.send(order);
});

// @desc        Update Order with ID
// @route       Put api/v1/orders/:id
router.put("/:id", async (req, res) => {
  try {
    /// Checks if id is a valid Object ID
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });

    /// Checks if id is a valid Object ID
    if (!req.body.status)
      return res.status(400).json({
        success: false,
        message: "Please Pass the Updated Status",
      });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!order) {
      res
        .status(404)
        .json({ success: false, message: "Order Could not be Updated!!!" });
    }
    res.status(200).send(order);
  } catch (err) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
});

// @desc        Delete an Order
// @route       Delete api/v1/orders/:id
router.delete("/:id", async (req, res) => {
  /// Checks if id is a valid Object ID
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({
      success: false,
      message: "Invalid Category ID",
    });

  const deletedOrder = await Order.findByIdAndRemove(req.params.id);

  if (deletedOrder) {
    await deletedOrder.orderItems.map(async (orderItem) => {
      await OrderItem.findByIdAndRemove(orderItem);
    });

    return res
      .status(200)
      .json({ success: true, message: "The Order was deleted" });
  } else {
    return res.status(404).json({
      message: "Order not Found",
      success: false,
    });
  }
});

// @desc        Get Total Sales for EShop
// @route       GET api/v1/orders/get/totalsales
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    res
      .status(500)
      .json({ success: false, message: "The Total Sales cannit be generated" });
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});

// @desc        Retrieve the number of Orders in DB
// @route       GET api/v1/orders/get/count
router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    res
      .status(500)
      .json({ success: false, message: "The Order Count cannot be generated" });
  }
  res.send({ orderCount: orderCount });
});

module.exports = router;
