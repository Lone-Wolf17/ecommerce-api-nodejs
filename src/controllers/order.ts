import { Response } from "express";
import { isValidObjectId } from "mongoose";

import { CustomRequestObject } from "../models/custom-request-object";
import { OrderModel } from "../models/Order";
import { OrderItem, OrderItemModel } from "../models/OrderItem";
import { ProductModel } from "../models/Product";

export const getOrders = async (req: CustomRequestObject, res: Response) => {
  const orderList = await OrderModel.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
};

export const getOrderById = async (req: CustomRequestObject, res: Response) => {
  const order = await OrderModel.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    return res.status(500).json({ success: false, message: "Order not Found" });
  }
  res.send(order);
};

export const createOrder = async (req: CustomRequestObject, res: Response) => {
  let totalPrice = 0;

  const orderItemsIds = await Promise.all(
    req.body.orderItems.map(async (orderItem: OrderItem) => {
      const product = await ProductModel.findById(orderItem.product)
        .select("price")
        .lean();

      if (!product) {
        return res.status(400).json({
          message: `The Product ${orderItem.product} not found in Database`,
          success: false,
        });
      }

      let newOrderItem = new OrderItemModel({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      totalPrice += orderItem.quantity * +product.price;

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  console.log(`Total Price:: ${totalPrice}`);

  let order = new OrderModel({
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
};

export const updateOrder = async (req: CustomRequestObject, res: Response) => {
  try {
    /// Checks if id is a valid Object ID
    if (!isValidObjectId(req.params.id))
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

    const order = await OrderModel.findByIdAndUpdate(
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
};

export const deleteOrder = async (req: CustomRequestObject, res: Response) => {
  /// Checks if id is a valid Object ID
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({
      success: false,
      message: "Invalid Category ID",
    });

  const deletedOrder = await OrderModel.findByIdAndRemove(req.params.id);

  if (deletedOrder) {
    await deletedOrder.orderItems.map(async (orderItem) => {
      await OrderItemModel.findByIdAndRemove(orderItem);
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
};

export const getTotalSales = async (
  req: CustomRequestObject,
  res: Response
) => {
  const totalSales = await OrderModel.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    res
      .status(500)
      .json({ success: false, message: "The Total Sales cannit be generated" });
  }
  res.send({ totalsales: totalSales.pop().totalsales });
};

export const getOrdersCount = async (
  req: CustomRequestObject,
  res: Response
) => {
  const orderCount = await OrderModel.countDocuments((count) => count);

  if (!orderCount) {
    res
      .status(500)
      .json({ success: false, message: "The Order Count cannot be generated" });
  }
  res.send({ orderCount: orderCount });
};

export const getUserOrders = async (
  req: CustomRequestObject,
  res: Response
) => {
  const userOrderList = await OrderModel.find({ user: req.params.userId })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res
      .status(500)
      .json({ success: false, message: "The Order Count cannot be generated" });
  }
  res.send(userOrderList);
};
