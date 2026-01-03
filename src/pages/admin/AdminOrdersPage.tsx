import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, Check, PackageOpen } from "lucide-react"; // Added PackageOpen for EmptyState
import { cn } from "@/lib/utils";
import { useOrderStore, type OrderStatus } from "@/store";
import { OrderListSkeleton } from "@/components/skeletons/OrderCardSkeleton"; // Import skeleton
import { EmptyState } from "@/components/ui/empty-state"; // Import EmptyState
import { useToast } from "@/hooks/use-toast"; // Import useToast

const statusOptions: OrderStatus[] = ["waiting", "confirmed", "preparing", "ready", "served", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "all">("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state
  const { toast } = useToast(); // Initialize useToast
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set()); // New state for highlighting

  // Simulate loading and identify initial new orders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Identify initial "new" orders if the store is pre-populated
      setNewOrderIds(new Set(orders.map(order => order.id)));
    }, 800);
    return () => clearTimeout(timer);
  }, [orders]); // Depend on orders to initially populate newOrderIds

  // Effect to detect newly added orders dynamically
  useEffect(() => {
    // Only run if not initially loading
    if (!isLoading) {
      setNewOrderIds(prev => {
        const currentOrderIds = new Set(orders.map(order => order.id));
        const newlyAdded = new Set<string>();
        currentOrderIds.forEach(id => {
          if (!prev.has(id)) {
            newlyAdded.add(id);
          }
        });
        // Combine previously unacknowledged new orders with truly new ones
        return new Set([...prev, ...newlyAdded]);
      });
    }
  }, [orders, isLoading]); // Depend on orders and isLoading


  const filteredOrders = orders.filter(
    (order) => selectedFilter === "all" || order.status === selectedFilter
  );

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId.substring(0, 8)} status changed to ${newStatus}.`,
    });
    setOpenDropdown(null);
    // Remove from newOrderIds once status is updated
    setNewOrderIds(prev => {
      const updated = new Set(prev);
      updated.delete(orderId);
      return updated;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-h1 mb-1">Orders</h1>
            <p className="text-muted-foreground">Manage and update order statuses</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full h-11 pl-12 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                selectedFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              All
            </button>
            {statusOptions.slice(0, -1).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize",
                  selectedFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Rendering for Loading/Empty/Orders */}
        {isLoading ? (
          <OrderListSkeleton count={5} /> // Show 5 skeleton rows
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="There are no orders matching your current filters or no orders have been placed yet."
            icon={PackageOpen}
          />
        ) : (
          /* Orders Table */
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Items</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Table</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <motion.tbody
                  className="divide-y divide-border"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => {
                      const isNew = newOrderIds.has(order.id); // Check if order is new
                      return (
                        <motion.tr
                          key={order.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className={cn(
                            "hover:bg-muted/30 transition-colors",
                            isNew && "bg-blue-100/10 border-l-4 border-blue-500" // Highlight new orders
                          )}
                        >
                          <td className="p-4">
                            <div className="font-medium">{order.orderNumber.split('-').slice(0, 2).join('-')}</div>
                            <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{order.notes || "Guest"}</div>
                            <div className="text-sm text-muted-foreground">₹{order.total.toLocaleString()}</div>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {order.items.map(i => i.name).join(", ")}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium">{order.tableNumber ? `Table ${order.tableNumber}` : "Delivery"}</span>
                          </td>
                          <td className="p-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="p-4">
                            <div className="relative">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                                className="gap-2"
                              >
                                Update
                                <ChevronDown className="h-4 w-4" />
                              </Button>

                              {openDropdown === order.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-soft-lg border border-border z-50 py-1 animate-fade-in backdrop-blur-md bg-card/90">
                                  {statusOptions.map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleUpdateStatus(order.id, status)}
                                      className={cn(
                                        "w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted transition-colors capitalize",
                                        order.status === status && "text-primary font-medium"
                                      )}
                                    >
                                      {status}
                                      {order.status === status && (
                                        <Check className="h-4 w-4" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
