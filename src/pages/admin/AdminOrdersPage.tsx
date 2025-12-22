import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge, OrderStatus } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const statusOptions: OrderStatus[] = ["waiting", "confirmed", "preparing", "ready", "served", "cancelled"];

const orders = [
  {
    id: "ORD-001",
    customer: "Sarah Wilson",
    items: ["Grilled Salmon", "Caesar Salad"],
    total: 37.98,
    status: "preparing" as OrderStatus,
    table: 5,
    time: "12:35 PM",
  },
  {
    id: "ORD-002",
    customer: "Mike Johnson",
    items: ["Beef Tenderloin", "Fresh Lemonade"],
    total: 37.98,
    status: "confirmed" as OrderStatus,
    table: 2,
    time: "12:40 PM",
  },
  {
    id: "ORD-003",
    customer: "Emily Chen",
    items: ["Pasta Carbonara", "Tiramisu", "Caesar Salad", "Lemonade"],
    total: 55.95,
    status: "ready" as OrderStatus,
    table: 8,
    time: "12:20 PM",
  },
  {
    id: "ORD-004",
    customer: "David Brown",
    items: ["Chicken Parmesan"],
    total: 21.99,
    status: "waiting" as OrderStatus,
    table: 3,
    time: "12:48 PM",
  },
  {
    id: "ORD-005",
    customer: "Lisa Thompson",
    items: ["Bruschetta", "Grilled Salmon", "Chocolate Lava Cake"],
    total: 45.97,
    status: "served" as OrderStatus,
    table: 6,
    time: "11:55 AM",
  },
];

export default function AdminOrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "all">("all");
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>(
    Object.fromEntries(orders.map((o) => [o.id, o.status]))
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const filteredOrders = orders.filter(
    (order) => selectedFilter === "all" || orderStatuses[order.id] === selectedFilter
  );
  
  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
    setOpenDropdown(null);
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
        
        {/* Orders Table */}
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
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.time}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">${order.total.toFixed(2)}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {order.items.join(", ")}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">Table {order.table}</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={orderStatuses[order.id]} />
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
                          <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-soft-lg border border-border z-10 py-1 animate-fade-in">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                onClick={() => updateStatus(order.id, status)}
                                className={cn(
                                  "w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted transition-colors capitalize",
                                  orderStatuses[order.id] === status && "text-primary font-medium"
                                )}
                              >
                                {status}
                                {orderStatuses[order.id] === status && (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
