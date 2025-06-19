import express from "express";
import { verifyApiKey } from "../middleware/apiKey.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controller/payment.controller.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-payment", protect, verifyApiKey, createRazorpayOrder);
paymentRoutes.post("/verify-payment", protect, verifyApiKey, verifyRazorpayPayment);

export default paymentRoutes;
