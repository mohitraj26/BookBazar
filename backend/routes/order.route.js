import express from "express";
import { placeOrder, getUserOrders, getOrderById } from "../controller/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import  { verifyApiKey }  from "../middleware/apiKey.middleware.js";

const orderRoutes = express.Router();

orderRoutes.post("/place-order", protect, verifyApiKey,placeOrder);
orderRoutes.get("/get-user-orders", protect, verifyApiKey, getUserOrders);
orderRoutes.get("/get-order/:id", protect, verifyApiKey, getOrderById);

export default orderRoutes;