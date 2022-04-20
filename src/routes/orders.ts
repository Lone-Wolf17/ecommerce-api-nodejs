import {Router} from 'express';

import * as OrdersController from '../controllers/order';


const router = Router();

// @desc        Retrieve all Orders
// @route       GET api/v1/orders
router.get("/", OrdersController.getOrders);

// @desc        Get Order By ID
// @route       GET api/v1/orders/:id
router.get("/:id", OrdersController.getOrderById);

// @desc        Create a new Order
// @route       Post api/v1/order
router.post("/", OrdersController.createOrder);


// @desc        Update Order Status
// @route       Put api/v1/orders/:id
router.put("/:id", OrdersController.updateOrderStatus);

// @desc        Delete an Order
// @route       Delete api/v1/orders/:id
router.delete("/:id", OrdersController.deleteOrder);

// @desc        Get Total Sales for EShop
// @route       GET api/v1/orders/get/totalsales
router.get("/get/totalsales", OrdersController.getTotalSales);

// @desc        Retrieve the number of Orders in DB
// @route       GET api/v1/orders/get/count
router.get("/get/count", OrdersController.getOrdersCount);

// @desc        Retrieve orders of a particular user
// @route       GET api/v1/orders/get/userorders/:userid
router.get("/get/userorders/:userId", OrdersController.getUserOrders);

export default router;
