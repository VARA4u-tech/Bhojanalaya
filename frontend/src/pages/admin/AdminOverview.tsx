import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useOrderStore } from "@/store/orderStore";

const stats = [
  { 
    label: "Total Revenue", 
    value: "₹1,24,500", 
    change: "+12.5%", 
    isPositive: true, 
    icon: DollarSign, 
    color: "bg-emerald-500" 
  },
  { 
    label: "Total Orders", 
    value: "482", 
    change: "+18.2%", 
    isPositive: true, 
    icon: ShoppingBag, 
    color: "bg-blue-500" 
  },
  { 
    label: "New Customers", 
    value: "124", 
    change: "-3.1%", 
    isPositive: false, 
    icon: Users, 
    color: "bg-amber-500" 
  },
  { 
    label: "Active Tables", 
    value: "18", 
    change: "+24.0%", 
    isPositive: true, 
    icon: TrendingUp, 
    color: "bg-purple-500" 
  },
];

const recentOrders = [
  { id: "#ORD-7281", customer: "Rahul Sharma", items: 3, total: "₹1,250", status: "Preparing", time: "5 mins ago" },
  { id: "#ORD-7280", customer: "Priya Varma", items: 1, total: "₹450", status: "Ready", time: "12 mins ago" },
  { id: "#ORD-7279", customer: "Anand Kumar", items: 5, total: "₹3,800", status: "Preparing", time: "15 mins ago" },
  { id: "#ORD-7278", customer: "Sneha Reddy", items: 2, total: "₹890", status: "Delivered", time: "25 mins ago" },
];

export default function AdminOverview() {
  const { restaurantId } = useParams();
  const { getRestaurantById } = useRestaurantStore();
  const { orders, fetchOrders, subscribeToOrders } = useOrderStore();
  
  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;

  useEffect(() => {
    fetchOrders();
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, [fetchOrders, subscribeToOrders]);

  // Real-time calculations for this specific restaurant
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurantId);
  const totalRevenue = restaurantOrders.reduce((sum, o) => sum + o.total, 0);
  const orderCount = restaurantOrders.length;
  // For now, let's treat unique table numbers or customers as "Active Tables"
  const activeTables = new Set(restaurantOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').map(o => o.tableNumber)).size;

  const dynamicStats = [
    { 
      label: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      change: "+0%", 
      isPositive: true, 
      icon: DollarSign, 
      color: "bg-emerald-500" 
    },
    { 
      label: "Total Orders", 
      value: orderCount.toString(), 
      change: "+0%", 
      isPositive: true, 
      icon: ShoppingBag, 
      color: "bg-blue-500" 
    },
    { 
      label: "Active Tables", 
      value: activeTables.toString(), 
      change: "Live", 
      isPositive: true, 
      icon: TrendingUp, 
      color: "bg-purple-500" 
    },
    { 
      label: "Avg. Order Value", 
      value: orderCount > 0 ? `₹${Math.round(totalRevenue / orderCount)}` : "₹0", 
      change: "Steady", 
      isPositive: true, 
      icon: Users, 
      color: "bg-amber-500" 
    },
  ];

  const displayOrders = restaurantOrders.slice(0, 5).map(o => ({
    id: o.orderNumber.substring(0, 15),
    customer: o.tableNumber ? `Table ${o.tableNumber}` : "Customer",
    items: o.items.length,
    total: `₹${o.total}`,
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1).replace('waiting', 'Pending'),
    time: "Just now"
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-[2rem] overflow-hidden border-2 border-primary/20 shadow-lg shrink-0">
           <img src={restaurant?.image} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-1">{restaurant?.name || "Dashboard"} Overview</h1>
          <p className="text-slate-500 font-medium tracking-tight">Managing live {restaurant?.cuisine} operations.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl font-heading font-bold text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-slate-900">Active Orders</h2>
            <Button variant="link" className="text-primary font-bold">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                       <span className="font-bold text-slate-900">{order.id}</span>
                       <p className="text-[10px] text-slate-400 font-medium">{order.time}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="font-semibold text-slate-700">{order.customer}</span>
                       <p className="text-[10px] text-slate-400">{order.items} items</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          order.status === "Preparing" ? "bg-blue-50 text-blue-600" :
                          order.status === "Ready" ? "bg-emerald-50 text-emerald-600" :
                          "bg-slate-50 text-slate-600"
                       )}>
                         {order.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="font-bold text-primary">{order.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Status / Alerts */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-heading text-lg font-bold text-slate-900 mb-6">Kitchen Status</h2>
              <div className="space-y-6">
                 {[
                   { label: "Active Orders", value: 12, total: 20, color: "bg-primary" },
                   { label: "Booked Tables", value: 8, total: 10, color: "bg-secondary" },
                   { label: "Inventory Level", value: 65, total: 100, color: "bg-blue-500" },
                 ].map((item) => (
                   <div key={item.label} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-slate-500">{item.label}</span>
                       <span className="text-slate-900">{item.value}/{item.total}</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(item.value / item.total) * 100}%` }}
                           className={cn("h-full rounded-full", item.color)} 
                        />
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-primary rounded-3xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                 <TrendingUp className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                 <h2 className="font-heading text-lg font-bold mb-2">Growth Target</h2>
                 <p className="text-white/80 text-sm mb-6 font-medium">You are at 85% of your monthly revenue goal. Keep it up!</p>
                 <Button className="w-full bg-white text-primary hover:bg-slate-50 font-bold rounded-xl shadow-md">
                    View Strategy
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


