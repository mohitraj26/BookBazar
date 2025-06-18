import express from "express";
import { placeOrder, getUserOrders, getOrderById } from "../controller/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const orderRoutes = express.Router();

orderRoutes.post("/place-order", protect, placeOrder);
orderRoutes.get("/get-user-orders", protect, getUserOrders);
orderRoutes.get("/get-order/:id", protect, getOrderById);

export default orderRoutes;