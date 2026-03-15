import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  MapPin, 
  ChevronDown,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useOrderStore, OrderStatus } from "@/store/orderStore";

// Local type for UI state if needed, but we'll use the store type
type AdminOrderStatus = OrderStatus;

interface Order {
  id: string;
  orderNumber?: string;
  customer: string;
  table: string;
  items: string[];
  total: number;
  status: OrderStatus;
  time: string;
}

const mockOrders: Order[] = [
  { id: "ORD-2024-001", customer: "Rahul Sharma", table: "T-05", items: ["Grilled Salmon", "Caesar Salad"], total: 1250, status: "preparing", time: "10:30 AM" },
  { id: "ORD-2024-002", customer: "Priya Varma", table: "T-12", items: ["Pasta Carbonara", "Red Wine"], total: 850, status: "ready", time: "10:45 AM" },
  { id: "ORD-2024-003", customer: "Anand Kumar", table: "T-01", items: ["Butter Chicken", "Naan", "Lassi"], total: 1800, status: "waiting", time: "11:00 AM" },
  { id: "ORD-2024-004", customer: "Sneha Reddy", table: "T-08", items: ["Margherita Pizza", "Coke"], total: 650, status: "served", time: "11:15 AM" },
  { id: "ORD-2024-005", customer: "Vikram Singh", table: "T-03", items: ["Fish & Chips"], total: 950, status: "cancelled", time: "11:20 AM" },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  waiting: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-700 border-purple-200", icon: CheckCircle2 },
  preparing: { label: "Cooking", color: "bg-blue-100 text-blue-700 border-blue-200", icon: RefreshCcw },
  ready: { label: "Ready", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  served: { label: "Served", color: "bg-slate-100 text-slate-700 border-slate-200", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
};

export default function AdminOrders() {
  const { restaurantId } = useParams();
  const { getRestaurantById } = useRestaurantStore();
  const { orders: storeOrders, updateOrderStatus, fetchOrders, subscribeToOrders, isLoading } = useOrderStore();
  
  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    fetchOrders();
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, [fetchOrders, subscribeToOrders]);

  const combinedOrders = [
    ...storeOrders
      .filter(o => o.restaurantId === restaurantId)
      .map(o => ({
        id: o.id, // Use actual UUID
        orderNumber: o.orderNumber,
        customer: o.tableNumber ? `Table ${o.tableNumber}` : "Direct Customer",
        table: o.tableNumber || "N/A",
        items: o.items.map(i => i.name),
        total: o.total,
        status: o.status as AdminOrderStatus,
        time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })),
    // Only show mock orders if we aren't in a specific restaurant view or for padding
    ...(restaurantId ? [] : mockOrders.map(m => ({ ...m, orderNumber: m.id })))
  ];

  const filteredOrders = filter === "all" ? combinedOrders : combinedOrders.filter(o => o.status === filter);

  const handleStatusUpdate = (id: string, newStatus: OrderStatus) => {
    // Update store order using UUID
    const isStoreOrder = storeOrders.some(o => o.id === id);
    if (isStoreOrder) {
      updateOrderStatus(id, newStatus as AdminOrderStatus);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md">
             <img src={restaurant?.image} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-slate-900 leading-tight">{restaurant?.name || "Global"} Orders</h1>
            <p className="text-slate-500 font-medium tracking-tight">Real-time order management system.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200 gap-2 h-11 bg-white shadow-sm font-bold text-slate-600">
              <RefreshCcw className="w-4 h-4" />
              Refresh
           </Button>
           <Button className="rounded-xl gap-2 h-11 shadow-lg shadow-primary/20 font-bold">
              Print Report
           </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID or customer..." 
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          {(["all", "waiting", "preparing", "ready", "served"] as const).map((s) => (
             <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  filter === s 
                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                )}
             >
                {s}
             </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
         {filteredOrders.map((order, i) => {
           const config = statusConfig[order.status];
           return (
             <motion.div
               key={order.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-primary/20 transition-all group"
             >
               <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                 {/* ID & Info */}
                 <div className="flex items-start gap-5">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border", config.color)}>
                       <config.icon className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="font-heading text-xl font-bold text-slate-900">{order.orderNumber || order.id}</h3>
                           <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", config.color)}>
                             {config.label}
                           </span>
                        </div>
                       <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{order.time}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Table {order.table}</span>
                          <span className="font-bold text-slate-900">{order.customer}</span>
                       </div>
                    </div>
                 </div>

                 {/* Items */}
                 <div className="flex-1 flex flex-wrap gap-2 lg:max-w-md">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                        {item}
                      </span>
                    ))}
                 </div>

                 {/* Actions */}
                 <div className="flex items-center gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-none border-slate-50">
                    <div className="text-right mr-4 hidden sm:block">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">TotalAmount</p>
                       <p className="text-2xl font-heading font-bold text-primary">₹{order.total}</p>
                    </div>
                                        <div className="flex-1 lg:flex-none flex items-center gap-2">
                        {order.status === "waiting" && (
                          <Button 
                             onClick={() => handleStatusUpdate(order.id, "confirmed")}
                             className="flex-1 lg:flex-none bg-amber-600 hover:bg-amber-700 rounded-xl font-bold shadow-lg shadow-amber-200"
                          >
                             Confirm Order
                          </Button>
                        )}
                        {order.status === "confirmed" && (
                          <Button 
                             onClick={() => handleStatusUpdate(order.id, "preparing")}
                             className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-200"
                          >
                             Start Cooking
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button 
                             onClick={() => handleStatusUpdate(order.id, "ready")}
                             className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-lg shadow-emerald-200"
                          >
                             Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button 
                             onClick={() => handleStatusUpdate(order.id, "served")}
                             className="flex-1 lg:flex-none bg-slate-800 hover:bg-slate-900 rounded-xl font-bold"
                          >
                             Mark Served
                          </Button>
                        )}
                        {order.status === "served" && (
                          <Button 
                             onClick={() => handleStatusUpdate(order.id, "completed")}
                             className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 rounded-xl font-bold"
                          >
                             Complete
                          </Button>
                        )}
                        
                        {(order.status !== "completed" && order.status !== "cancelled") && (
                           <Button 
                              variant="ghost"
                              onClick={() => handleStatusUpdate(order.id, "cancelled")}
                              className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl"
                           >
                              Cancel
                           </Button>
                        )}
                       
                       <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                       </Button>
                    </div>
                 </div>
               </div>
             </motion.div>
           );
         })}
      </div>
    </div>
  );
}
