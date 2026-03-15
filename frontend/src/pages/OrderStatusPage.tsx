import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge, OrderStatus } from "@/components/ui/status-badge";
import {
  Clock,
  MapPin,
  ChefHat,
  Bell,
  Check,
  RefreshCw,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useOrderStore,
  useCartStore,
  Order,
  OrderItem,
  useRestaurantStore,
} from "@/store";
import { OrderListSkeleton } from "@/components/skeletons/OrderCardSkeleton";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { CancelOrderDialog } from "@/components/order/CancelOrderDialog";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/ui/empty-state";
import { useSocket } from "@/context/SocketContext";
import { useUserStore } from "@/store/userStore";
import { EmailPreviewDialog } from "@/components/order/EmailPreviewDialog";
import { Mail } from "lucide-react";

const orderSteps: {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { status: "waiting", label: "Order Placed", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: Check },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: Bell },
];

// Mock order for empty state
const mockOrder = {
  id: "ORD-2024-001",
  orderNumber: "ORD-2024-001",
  status: "preparing" as OrderStatus,
  items: [
    { id: 1, name: "Grilled Salmon", quantity: 1, price: 24.99 },
    { id: 2, name: "Caesar Salad", quantity: 2, price: 12.99 },
    { id: 3, name: "Fresh Lemonade", quantity: 2, price: 4.99 },
  ],
  tableNumber: "5",
  estimatedTime: 15,
  createdAt: new Date(),
  updatedAt: new Date(),
  total: 0,
};

export default function OrderStatusPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);

  const { orders, activeOrder, setActiveOrder, updateOrderStatus } =
    useOrderStore();
  const { getRestaurantById } = useRestaurantStore();
  const { addBulkItems } = useCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserStore();

  // Use active order or show mock data
  const displayOrder = activeOrder || (mockOrder as unknown as Order);
  const total =
    displayOrder.items?.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0,
    ) || 0;
  const canCancelOrder =
    displayOrder &&
    (displayOrder.status === "waiting" || displayOrder.status === "confirmed");

  // Scroll to top on mount to prevent glitchy transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Join order room and listen for updates
  const { socket } = useSocket();

  useEffect(() => {
    if (orders.length > 0 && !activeOrder) {
      setActiveOrder(orders[0].id);
    }
  }, [orders, activeOrder, setActiveOrder]);

  useEffect(() => {
    if (socket && displayOrder?.id) {
      socket.emit("join_order", displayOrder.id);

      socket.on("order_status_updated", (data: { status: OrderStatus }) => {
        console.log("Received status update:", data);

        // Find the index of the new status
        const newStepIndex = orderSteps.findIndex(
          (step) => step.status === data.status,
        );
        if (newStepIndex !== -1) {
          setCurrentStep(newStepIndex);
          // You might also want to update the store here
          // updateOrderStatus(displayOrder.id, data.status);
        }
      });

      return () => {
        socket.emit("leave_order", displayOrder.id);
        socket.off("order_status_updated");
      };
    }
  }, [socket, displayOrder?.id]);

  const handleReorder = () => {
    if (!displayOrder) return;

    addBulkItems(displayOrder.items);
    toast({
      title: "Added to Cart",
      description: "Previous items have been added to your cart.",
    });
    navigate("/menu");
  };

  // Simulate status change
  const simulateProgress = () => {
    if (currentStep < orderSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleCancelOrder = async () => {
    if (!displayOrder) return;

    // Use a small delay for cancellation too
    await updateOrderStatus(displayOrder.id, "cancelled");

    toast({
      title: "Order Cancelled! 🚨",
      description: `Refund of ₹${(displayOrder.total * 0.8).toFixed(2)} initiated. Returning to menu...`,
    });
    setCancelDialogOpen(false);
    
    // Redirect to menu after a short delay so they see the toast
    setTimeout(() => {
      navigate('/menu');
    }, 1500);
  };

  return (
    <>
      <div className="container py-6 lg:py-10 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-h1 mb-2">Order Status</h1>
          <p className="text-muted-foreground">Track your order in real-time</p>
        </div>

        <ErrorBoundary
          fallback={<ErrorFallback title="Failed to load orders" />}
        >
          {isLoading ? (
            <OrderListSkeleton count={1} />
          ) : !activeOrder && orders.length === 0 ? (
            <EmptyState
              title="No active orders"
              description="You haven't placed any orders yet. Check out our menu to get started!"
              icon={Clock}
              action={{
                label: "Browse Menu",
                onClick: () => (window.location.href = "/menu"),
              }}
            />
          ) : (
            <>
              {/* Order Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl p-6 shadow-soft mb-6 relative overflow-hidden group border border-border/50"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Order Tracking
                    </div>
                    <div className="font-heading font-bold text-2xl">
                      {displayOrder.orderNumber || displayOrder.id}
                    </div>
                  </div>
                  <StatusBadge status={orderSteps[currentStep].status} />
                </div>

                <div className="flex gap-6 text-sm relative z-10">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>Table {displayOrder.tableNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span>
                      {new Date(displayOrder.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Progress Stepper */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-3xl p-8 shadow-soft mb-6 border border-border/50"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-h3">Order Progress</h2>
                  <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {Math.round((currentStep / (orderSteps.length - 1)) * 100)}%
                    Complete
                  </div>
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-muted">
                    <motion.div
                      className="absolute top-0 left-0 w-full bg-primary origin-top"
                      initial={{ scaleY: 0 }}
                      animate={{
                        scaleY: currentStep / (orderSteps.length - 1),
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ height: "100%" }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="space-y-8">
                    {orderSteps.map((step, index) => {
                      const isCompleted = index < currentStep;
                      const isCurrent = index === currentStep;
                      const isPending = index > currentStep;

                      return (
                        <motion.div
                          key={step.status}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className={cn(
                            "relative flex items-start gap-6 transition-all duration-300",
                            isPending && "opacity-40",
                          )}
                        >
                          {/* Icon Circle */}
                          <div
                            className={cn(
                              "relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 shadow-sm",
                              isCompleted &&
                                "bg-status-ready text-white scale-90",
                              isCurrent &&
                                "bg-primary text-white shadow-glow scale-110",
                              isPending && "bg-muted text-muted-foreground",
                            )}
                          >
                            <AnimatePresence mode="wait">
                              {isCompleted ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, rotate: -45 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 45 }}
                                >
                                  <Check className="h-6 w-6" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="icon"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <step.icon
                                    className={cn(
                                      "h-6 w-6",
                                      isCurrent && "animate-pulse",
                                    )}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <div
                              className={cn(
                                "font-heading text-lg font-bold transition-colors duration-300",
                                isCurrent ? "text-primary" : "text-foreground",
                              )}
                            >
                              {step.label}
                            </div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {isCurrent
                                ? step.status === "preparing"
                                  ? `Cooking your delicious meal... (${displayOrder.estimatedTime || mockOrder.estimatedTime} mins left)`
                                  : "Processing your order"
                                : isCompleted
                                  ? "Requirement met"
                                  : "Coming up next"}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="rounded-xl px-8 h-12 border-slate-200 font-bold gap-2"
                    onClick={() => setEmailPreviewOpen(true)}
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    View Email Receipt
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl px-8 h-12 border-slate-200 font-bold"
                  >
                    Download Invoice
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-10">
                  {currentStep < orderSteps.length - 1 ? (
                    <Button
                      onClick={simulateProgress}
                      disabled={isAnimating}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-dashed hover:border-solid transition-all"
                    >
                      <RefreshCw
                        className={cn(
                          "h-4 w-4 mr-2",
                          isAnimating && "animate-spin",
                        )}
                      />
                      Simulate Status Update
                    </Button>
                  ) : (
                    <Button
                      onClick={handleReorder}
                      className="w-full h-14 rounded-2xl text-lg font-heading shadow-glow hover:shadow-glow-lg transition-all"
                    >
                      Enjoy your meal? Reorder!
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}

                  {canCancelOrder && (
                    <Button
                      onClick={() => setCancelDialogOpen(true)}
                      variant="ghost"
                      className="w-full h-12 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Order Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-3xl p-8 shadow-soft relative overflow-hidden border border-border/50"
              >
                <h2 className="font-heading text-h3">Items Summary</h2>
                {displayOrder?.restaurantId && (
                  <p className="text-muted-foreground text-sm mb-6 flex items-center gap-2">
                    from{" "}
                    <span className="font-bold text-primary">
                      {getRestaurantById(displayOrder.restaurantId)?.name ||
                        "Restaurant"}
                    </span>
                  </p>
                )}

                <div className="space-y-5 mb-8">
                  {displayOrder.items?.map((item: OrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                          {item.quantity}
                        </div>
                        <div className="font-medium text-lg">{item.name}</div>
                      </div>
                      <span className="font-bold text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-6 mt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xl">
                      Grand Total
                    </span>
                    <span className="font-heading font-bold text-2xl text-primary">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </ErrorBoundary>

        <CancelOrderDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          onConfirm={handleCancelOrder}
          orderTotal={displayOrder?.total || 0}
          refundAmount={(displayOrder?.total || 0) * 0.8}
        />
        <EmailPreviewDialog
          open={emailPreviewOpen}
          onOpenChange={setEmailPreviewOpen}
          order={displayOrder}
          userEmail={user?.email || "user@example.com"}
        />
      </div>
    </>
  );
}
