import crypto from "crypto";
import Payment from "../model/Payment.model.js";
import Order from "../model/Order.model.js";
import razorpay from "../utils/razorpayInstance.js";
import dotenv from "dotenv";
dotenv.config();


export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: "Amount and Order ID are required" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order
    });
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      orderId // your internal order ID
    } = req.body;


    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // // Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // console.log(expectedSignature, razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      return res.status(403).json({ error: "Invalid signature" });
    }

    // Save payment to DB
    const payment = new Payment({
      orderId,
      userId: req.user.id,
      amount,
      currency: "INR",
      paymentMethod: "card", // or "UPI", etc.
      paymentGateway: "razorpay",
      transactionId: razorpay_payment_id,
      status: "success",
      gatewayResponse: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      }
    });

    await payment.save();

    // Optionally mark the order as paid
    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and saved",
      payment
    });
  } catch (err) {
    console.error("Payment Verification Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};






