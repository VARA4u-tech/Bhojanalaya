import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge, OrderStatus } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  UtensilsCrossed,
  DollarSign,
  Clock,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

import { useOrderStore, useBookingStore } from "@/store";

export default function AdminDashboard() {
  const { orders } = useOrderStore();
  const { bookings } = useBookingStore();

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const activeTables = bookings.filter(b => b.status === 'confirmed').length;

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length.toString(),
      change: "+12%",
      icon: UtensilsCrossed,
      color: "text-primary bg-primary/10"
    },
    {
      label: "Active Tables",
      value: `${activeTables}/8`,
      change: "75%",
      icon: Users,
      color: "text-status-confirmed bg-status-confirmed/10"
    },
    {
      label: "Revenue Today",
      value: `₹${revenueToday.toLocaleString()}`,
      change: "+8%",
      icon: DollarSign,
      color: "text-status-ready bg-status-ready/10"
    },
    {
      label: "Avg. Wait Time",
      value: "18 min",
      change: "-5%",
      icon: Clock,
      color: "text-status-waiting bg-status-waiting/10"
    },
  ];

  const liveOrdersData = orders.slice(0, 4).map(o => ({
    id: o.orderNumber.split('-').slice(0, 2).join('-'),
    customer: o.notes || "Guest Customer",
    items: o.items.length,
    total: o.total,
    status: o.status,
    time: "Just now",
  }));
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-h1 mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="group relative bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-status-ready">
                  <TrendingUp className="h-4 w-4" />
                  {stat.change}
                </div>
              </div>
              <div className="relative z-10">
                <div className="font-heading text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live Orders */}
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h2 className="font-heading text-h3">Live Orders</h2>
              <p className="text-sm text-muted-foreground">Real-time order tracking</p>
            </div>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <motion.div
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
            {liveOrdersData.map((order) => (
              <motion.div
                key={order.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
                className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {order.customer.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.id} • {order.items} items
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="font-bold">₹{order.total.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{order.time}</div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/admin/orders" className="block">
            <div className="group bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <UtensilsCrossed className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <div className="font-heading font-semibold">Manage Orders</div>
                  <div className="text-sm text-muted-foreground">View and update order status</div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/menu" className="block">
            <div className="group bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <UtensilsCrossed className="h-6 w-6 text-secondary group-hover:text-secondary-foreground" />
                </div>
                <div>
                  <div className="font-heading font-semibold">Menu Management</div>
                  <div className="text-sm text-muted-foreground">Add, edit, or remove items</div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/tables" className="block sm:col-span-2 lg:col-span-1">
            <div className="group bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-status-ready/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-status-ready/10 flex items-center justify-center group-hover:bg-status-ready group-hover:text-status-ready-foreground transition-colors">
                  <Users className="h-6 w-6 text-status-ready group-hover:text-status-ready-foreground" />
                </div>
                <div>
                  <div className="font-heading font-semibold">Table Management</div>
                  <div className="text-sm text-muted-foreground">Monitor table availability</div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
