import { Router, Response } from "express";
import Razorpay from "razorpay";
import { config } from "../config/env";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import crypto from "crypto";

const router = Router();

const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret,
});

// Endpoint to create a Razorpay order
router.post("/create-order", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, restaurantId } = req.body;
    const userId = req.user!.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "No items provided" });
      return;
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0,
    );

    // Add 5% tax and format for paise
    const finalAmount = Math.round((totalAmount + totalAmount * 0.05) * 100);

    const options = {
      amount: finalAmount, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${userId}`,
      notes: {
        userId,
        restaurantId,
        items: JSON.stringify(
          items.map((i: any) => ({ id: i.id, q: i.quantity })),
        ).substring(0, 500),
      },
    };

    const order = await razorpay.orders.create(options);

    // Also send key to frontend so it doesn't need to be hardcoded in frontend
    res.json({
      ...order,
      key: config.razorpayKeyId,
    });
  } catch (error: any) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to verify payment signature
router.post("/verify", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", config.razorpayKeySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is successful
      // You can update database order status here
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } catch (error: any) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
