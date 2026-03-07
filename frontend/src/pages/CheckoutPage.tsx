import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useRestaurantStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

import { useUserStore } from "@/store/userStore";
import { supabase } from "@/lib/supabase";
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { selectedRestaurant } = useRestaurantStore();
  const { toast } = useToast();
  const { isAuthenticated } = useUserStore();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cash">(
    "card",
  );
  const [tableNumber, setTableNumber] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotal();
  const tax = total * 0.05; // 5% tax
  const deliveryFee = 0; // Free for dine-in
  const grandTotal = total + tax + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or sign up to complete your payment.",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    if (!tableNumber) {
      toast({
        title: "Table Number Required",
        description: "Please enter your table number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Create order local data items
    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const processLocalOrder = () => {
      const newOrder = createOrder(
        orderItems,
        tableNumber,
        specialNotes,
        selectedRestaurant?.id,
        selectedRestaurant?.name,
      );

      clearCart();

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order ${newOrder.orderNumber} has been confirmed`,
      });

      setIsProcessing(false);
      navigate("/orders");
    };

    if (paymentMethod === "cash") {
      processLocalOrder();
      return;
    }

    // Razorpay integration for 'card' or 'upi'
    try {
      // 1. Get auth token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      // 2. Load Razorpay SDK (only if not already loaded)
      let sdkLoaded = !!(window as unknown as { Razorpay: unknown }).Razorpay;
      if (!sdkLoaded) {
        sdkLoaded = await new Promise<boolean>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      }

      if (!sdkLoaded) {
        toast({
          title: "Failed",
          description: "Razorpay SDK failed to load.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // 3. Fetch order from backend
      const response = await fetch(
        "http://localhost:3000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            items: orderItems,
            restaurantId: selectedRestaurant?.id,
          }),
        },
      );
      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(
          orderData.error ||
            "Failed to initiate payment. Ensure backend is running.",
        );
      }

      // 4. Initialize Razorpay popup
      const options = {
        key: orderData.key || "rzp_test_placeholder",
        amount: orderData.amount || Math.round((total + tax) * 100),
        currency: orderData.currency || "INR",
        name: "BiteBook Direct",
        description: "Test Student Transaction",
        order_id: orderData.id,
        handler: function (response: { razorpay_payment_id: string }) {
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          processLocalOrder();
        },
        prefill: {
          name: "Test User",
          email: "test@student.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f97316", // primary orange color
        },
      };

      // Define types to avoid 'any'
      interface RazorpayInstance {
        on(
          event: string,
          handler: (res: { error: { description: string } }) => void,
        ): void;
        open(): void;
      }
      const RazorpayClient = (
        window as unknown as {
          Razorpay: new (opts: typeof options) => RazorpayInstance;
        }
      ).Razorpay;
      const rzp = new RazorpayClient(options);
      rzp.on(
        "payment.failed",
        function (response: { error: { description: string } }) {
          toast({
            title: "Payment Failed",
            description: response.error.description,
            variant: "destructive",
          });
          setIsProcessing(false);
        },
      );
      rzp.open();
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Gateway Initialization Failed",
        description:
          err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      });
      // Due to this being a student project demo, fallback if backend is down
      console.log("Falling back to local order processing");
      processLocalOrder();
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 max-w-2xl">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out
          </p>
          <Button onClick={() => navigate("/menu")}>Browse Menu</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 lg:py-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-heading text-h1">Checkout</h1>
          <p className="text-muted-foreground text-sm">Complete your order</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table Information */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-bold mb-4">
              Table Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tableNumber">Table Number*</Label>
                <Input
                  id="tableNumber"
                  type="text"
                  placeholder="e.g., T-12"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any dietary restrictions or special requests..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-bold mb-4">
              Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Card</p>
              </button>
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Wallet className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">UPI</p>
              </button>
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "cash"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Building2 className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Cash</p>
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-heading text-lg font-bold mb-4">
              Order Summary
            </h3>

            {/* Items */}
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="space-y-2 py-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg pt-4 border-t">
              <span>Total</span>
              <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
            </div>

            <Button
              size="lg"
              className="w-full mt-6"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    ⏳
                  </motion.div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Place Order
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By placing this order, you agree to our terms and conditions
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
