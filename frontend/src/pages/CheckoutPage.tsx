import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore, Order } from "@/store/orderStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useUserStore } from "@/store/userStore";
import { EmailPreviewDialog } from "@/components/order/EmailPreviewDialog";
import emailjs from '@emailjs/browser';
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
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// --- Illustration components (Shared with Hero/Auth for perfect sync) ---
const Pumpkin = () => (
  <svg
    viewBox="0 0 120 100"
    className="w-full h-full drop-shadow-2xl opacity-80"
    fill="none"
  >
    <ellipse cx="30" cy="65" rx="22" ry="28" fill="#e07b39" />
    <ellipse cx="60" cy="62" rx="26" ry="32" fill="#f0913e" />
    <ellipse cx="90" cy="65" rx="22" ry="28" fill="#e07b39" />
    <ellipse cx="45" cy="64" rx="18" ry="30" fill="#f0a04a" />
    <ellipse cx="75" cy="64" rx="18" ry="30" fill="#f0a04a" />
    <path d="M58 30 Q55 15 62 8 Q68 3 65 14 Q63 22 62 30" fill="#4a7c3f" />
    <path d="M62 18 Q80 5 85 18 Q75 22 62 18Z" fill="#5a9e4a" />
  </svg>
);

const HerbPot = () => (
  <svg
    viewBox="0 0 100 130"
    className="w-full h-full drop-shadow-xl opacity-80"
    fill="none"
  >
    <path d="M25 80 Q20 115 75 115 Q90 115 85 80 Z" fill="#d4826a" />
    <rect x="18" y="75" width="64" height="12" rx="4" fill="#c6735a" />
    <ellipse cx="50" cy="80" rx="32" ry="6" fill="#6b4423" />
    <path
      d="M35 78 Q30 55 28 35"
      stroke="#4a8c3f"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <ellipse cx="44" cy="20" rx="10" ry="15" fill="#6bc05a" />
    <rect x="62" y="10" width="28" height="18" rx="3" fill="#e8b84b" />
  </svg>
);

const Sunflower = () => (
  <svg
    viewBox="0 0 100 140"
    className="w-full h-full drop-shadow-xl opacity-80"
    fill="none"
  >
    <path
      d="M50 70 Q48 105 50 135"
      stroke="#4a8c3f"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <ellipse
        key={i}
        cx="50"
        cy="50"
        rx="12"
        ry="32"
        fill={i % 2 === 0 ? "#f5c842" : "#f0b830"}
        transform={`rotate(${deg} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="14" fill="#7a4010" />
  </svg>
);

const POSTER_ITEMS_CHECKOUT = [
  {
    Component: Pumpkin,
    className: "w-24 sm:w-40 xl:w-48 top-[4%] left-2 sm:left-6 z-40",
    delay: 0,
  },
  {
    Component: HerbPot,
    className: "w-20 sm:w-32 xl:w-40 top-[2%] right-2 sm:right-10 z-40",
    delay: 0.2,
  },
  {
    Component: Sunflower,
    className: "w-16 sm:w-24 xl:w-32 top-[45%] right-2 sm:right-6 z-40 opacity-40 sm:opacity-80",
    delay: 0.4,
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { user } = useUserStore();
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
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
      navigate("/dashboard");
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

    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const sendConfirmationEmail = async (order: Order) => {
      if (!user?.email) return;

      const templateParams = {
        user_name: user.name || user.email.split('@')[0],
        user_email: user.email,
        order_number: order.orderNumber,
        restaurant_name: selectedRestaurant?.name || 'BiteBook Restaurant',
        total_amount: order.total,
        table_number: order.tableNumber || 'Direct Order',
        message: "Your order is being prepared with love!"
      };

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID, 
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
          templateParams, 
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log('Email sent successfully!');
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    };

    const processLocalOrder = async () => {
      // Get restaurantId from the first item in cart (assuming one restaurant per cart)
      const cartRestaurantId = items[0]?.restaurantId || selectedRestaurant?.id;

      const newOrder = await createOrder(
        orderItems,
        tableNumber,
        specialNotes,
        cartRestaurantId,
        selectedRestaurant?.name,
        paymentMethod === 'cash' ? 'waiting' : 'confirmed'
      );

      if (!newOrder) {
        setIsProcessing(false);
        return;
      }

      clearCart();

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order ${newOrder.orderNumber} has been confirmed. Receipt sent to ${user?.email}`,
      });

      // Send the real email in background
      sendConfirmationEmail(newOrder);

      setLatestOrder(newOrder);
      setIsProcessing(false);
      setShowEmailPreview(true);
      
      // Wait a bit before navigating so they can see the email preview if they want, 
      // or just navigate after they close it. For now, let's just stay on page till closed.
    };

    if (paymentMethod === "cash") {
      await processLocalOrder();
      return;
    }

    // Simulated Payment for Card/UPI
    try {
      // Just a small delay to feel like a process is happening
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Payment Successful",
        description: `Simulated ${paymentMethod.toUpperCase()} payment completed successfully.`,
      });
      
      await processLocalOrder();
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Payment Failed",
        description: "Something went wrong during simulation.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (items.length === 0 && !latestOrder) {
    return (
      <div className="container py-20 max-w-2xl px-4">
        <Card className="p-8 sm:p-12 text-center organic-card">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out
          </p>
          <Button onClick={() => navigate("/menu")} className="rounded-xl">
            Browse Menu
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[45] w-full bg-[#d9ede1] overflow-y-auto font-sans">
      
      {/* --- Poster Frame - Neater Inset - TOP LAYER --- */}
      <div className="fixed inset-2 sm:inset-5 lg:inset-8 rounded-[2rem] sm:rounded-[3rem] border-[4px] sm:border-[12px] border-primary/80 pointer-events-none z-[75]" />

      {/* --- Decorations - STYLED TOP LAYER --- */}
      <div className="absolute inset-0 pointer-events-none z-[60] overflow-visible">
        {POSTER_ITEMS_CHECKOUT.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: item.delay }}
            className={cn("absolute", item.className)}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <item.Component />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* --- Scrollable Content - MIDDLE LAYER --- */}
      <div className="relative z-50 h-full px-6 sm:px-10 lg:px-16 py-12 lg:py-24">
        <div className="container mx-auto max-w-6xl">
          {/* --- Header --- */}
          <div className="relative flex flex-col items-center mb-8 lg:mb-12 pt-12 sm:pt-0 text-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="absolute left-0 top-0 sm:left-[-1rem] lg:left-[-4rem] rounded-full hover:bg-primary/10 text-primary"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-8 sm:w-12 bg-primary/30" />
                <Sparkles className="w-5 h-5 text-secondary" />
                <div className="h-px w-8 sm:w-12 bg-primary/30" />
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl text-primary mb-2">
                Checkout
              </h1>

              {selectedRestaurant && (
                <p className="font-serif italic text-muted-foreground text-base sm:text-xl">
                  Finishing your order at{" "}
                  <span className="text-primary font-bold not-italic">
                    {selectedRestaurant.name}
                  </span>
                </p>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-32">
            {/* Right Column - Order Summary (Show first on Mobile for visibility) */}
            <div className="order-first lg:order-last lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:sticky lg:top-0"
              >
                <div className="organic-card p-5 sm:p-8 bg-white/95 backdrop-blur-xl shadow-2xl border-2 border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Sparkles className="w-16 h-16" />
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-heading text-xl sm:text-2xl text-primary">
                      Order Summary
                    </h3>
                    {selectedRestaurant && (
                      <p className="text-xs font-serif italic text-muted-foreground mt-1">
                        at <span className="text-secondary font-bold not-italic">{selectedRestaurant.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-muted/10 p-2.5 sm:p-3 rounded-xl border border-primary/5"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-xs sm:text-sm leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-serif italic">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <span className="font-heading text-base sm:text-lg text-primary">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing details */}
                  <div className="space-y-2 sm:space-y-3 py-4 sm:py-6 border-t border-primary/10">
                    <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{total.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span>GST (5%)</span>
                      <span>₹{tax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-green-600">
                      <span>Booking Fee</span>
                      <span>FREE</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-center pt-4 sm:pt-6 border-t-2 border-primary/10 mb-6 sm:mb-8">
                    <span className="font-heading text-xl sm:text-2xl text-foreground">
                      Total
                    </span>
                    <span className="font-heading text-2xl sm:text-3xl text-primary">
                      ₹{grandTotal.toFixed(0)}
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-14 sm:h-16 rounded-[2rem] font-heading text-xl sm:text-2xl bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        Place Order
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    )}
                  </Button>

                  <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground mt-4 sm:mt-6 font-serif italic">
                    Join our exclusive farm-to-table community.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Table Info section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="organic-card p-5 sm:p-8 bg-white/90 backdrop-blur-md shadow-lg border border-primary/5">
                  <h3 className="font-heading text-xl sm:text-2xl text-primary mb-4 sm:mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Table Information
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <Label
                        htmlFor="tableNumber"
                        className="ml-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-muted-foreground"
                      >
                        Table Number*
                      </Label>
                      <Input
                        id="tableNumber"
                        type="text"
                        placeholder="Ex: T-42"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="h-11 sm:h-13 bg-muted/20 border-primary/10 rounded-xl focus:bg-white transition-all shadow-inner mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="notes"
                        className="ml-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-muted-foreground"
                      >
                        Special Instructions
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Chef's notes, allergies, or mood settings..."
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="min-h-[80px] sm:min-h-[100px] bg-muted/20 border-primary/10 rounded-xl focus:bg-white transition-all shadow-inner mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment selection section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="organic-card p-5 sm:p-8 bg-white/90 backdrop-blur-md shadow-lg border border-primary/5">
                  <h3 className="font-heading text-xl sm:text-2xl text-primary mb-4 sm:mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { id: "card", label: "Card", Icon: CreditCard },
                      { id: "upi", label: "UPI", Icon: Wallet },
                      { id: "cash", label: "Cash", Icon: Building2 },
                    ].map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() =>
                          setPaymentMethod(id as "card" | "upi" | "cash")
                        }
                        className={cn(
                          "p-4 sm:p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 sm:gap-3",
                          paymentMethod === id
                            ? "border-primary bg-primary/5 shadow-soft shadow-primary/10"
                            : "border-primary/10 hover:border-primary/40 bg-white/50",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-6 w-6 sm:h-7 sm:w-7",
                            paymentMethod === id
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                        <p
                          className={cn(
                            "text-[10px] sm:text-xs font-bold uppercase tracking-widest",
                            paymentMethod === id
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          {label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <EmailPreviewDialog 
        open={showEmailPreview}
        onOpenChange={(open) => {
          setShowEmailPreview(open);
          if (!open) navigate("/orders");
        }}
        order={latestOrder}
        userEmail={user?.email || "user@example.com"}
      />
    </div>
  );
}
