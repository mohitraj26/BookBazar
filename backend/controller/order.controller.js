import Order from "../model/Order.model.js";
import Book from "../model/Book.model.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    let subtotal = 0;
    const orderItems = [];

    // Validate and process items
    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book || book.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Book ${item.bookId} is out of stock or does not exist`,
        });
      }

      const priceAtPurchase = book.price;
      subtotal += priceAtPurchase * item.quantity;

      orderItems.push({
        bookId: book._id,
        quantity: item.quantity,
        priceAtPurchase,
      });
    }

    const tax = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax (adjust as needed)
    const shippingCost = 50; // Flat rate or calculate based on address
    const total = parseFloat((subtotal + tax + shippingCost).toFixed(2));

    // Create the order
    const newOrder = new Order({
      userId,
      items: orderItems,
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress,
      paymentMethod,
      status: "pending",
      paymentStatus: "pending"
    });

    await newOrder.save();

    // Update stock quantities
    for (const item of items) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order failed", error: error.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets this

    const orders = await Order.find({ userId })
      .populate("items.bookId", "title author price") // Optional: populate book details
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

export const getOrderById = async(req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id

        const order = await Order.findOne({ _id: orderId, userId })
            .populate("items.bookId", "title author price") // Optional: add book info
            .exec();

        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or access denied"
            });
        }


        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order details",
            error: error.message
        });
    }
    
}
