import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge, OrderStatus } from "@/components/ui/status-badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  RefreshCw,
  LogOut,
  Settings,
  CreditCard,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Calendar,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

import { useOrderStore, useBookingStore, useCartStore } from "@/store";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { LoginView } from "@/components/auth/LoginView";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useUserStore();
  const { orders } = useOrderStore();
  const { bookings } = useBookingStore();
  const { addBulkItems } = useCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleReorder = (items: { id: number; name: string; price: number; quantity: number; image?: string }[]) => {
    addBulkItems(items);
    toast({
      title: "Added to Cart",
      description: "Previous items have been added to your cart.",
    });
    navigate("/menu");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full">
        <LoginView />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container py-6 lg:py-10 max-w-4xl"
    >
      {/* Profile Header */}
      <motion.div
        variants={itemVariants}
        className="bg-card/70 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-soft mb-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 relative z-10 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-h1 mb-2">
              {user?.name || "User"}
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full">
                <Mail className="h-4 w-4" />
                {user?.email}
              </span>
              {user?.phone && (
                <span className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-border/50 hover:bg-muted/50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Account
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: "Total Orders",
            value: orders.length.toString(),
            icon: ShoppingBag,
            color: "text-blue-500",
          },
          {
            label: "Bookings",
            value: bookings.length.toString(),
            icon: Calendar,
            color: "text-green-500",
          },
          {
            label: "Favorites",
            value: "12",
            icon: Heart,
            color: "text-red-500",
          },
          {
            label: "Rank",
            value: "Elite",
            icon: ShieldCheck,
            color: "text-amber-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-4 shadow-soft text-center group hover:border-primary/30 transition-all"
          >
            <div
              className={cn(
                "inline-flex h-8 w-8 rounded-lg bg-muted flex items-center justify-center mb-2 group-hover:scale-110 transition-transform",
                stat.color,
              )}
            >
              <stat.icon className="h-4 w-4" />
            </div>
            <div className="font-heading text-2xl font-bold text-primary mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-soft">
            <h3 className="font-heading text-lg font-bold mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-primary">Admin Dashboard</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              {[
                { label: "Saved Addresses", icon: MapPin },
                { label: "Payment Methods", icon: CreditCard },
                { label: "Food Preferences", icon: Heart },
                { label: "Notification Settings", icon: Settings },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Orders */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-heading text-h2">Recent Orders</h2>
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={() => navigate("/orders")}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-8 text-center">
                  <EmptyState
                    title="No past orders"
                    description="Delicious meals are just a few clicks away."
                    icon={ShoppingBag}
                    action={{
                      label: "Go to Menu",
                      onClick: () => navigate("/menu"),
                    }}
                  />
                </div>
              ) : (
                orders.slice(0, 3).map((order) => (
                  <motion.div
                    key={order.id}
                    layoutId={order.id}
                    className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all group"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-heading font-bold text-lg">
                              {order.orderNumber || order.id.slice(0, 8)}
                            </span>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-heading font-bold text-2xl text-primary">
                          ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-foreground/80 mb-6 flex flex-wrap gap-2">
                      {order.items.map((i, idx) => (
                        <span
                          key={idx}
                          className="bg-muted px-2 py-0.5 rounded-md border border-border/30"
                        >
                          {i.name}{" "}
                          <span className="text-muted-foreground ml-1">
                            ×{i.quantity}
                          </span>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl h-10 border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all font-medium"
                        onClick={() => handleReorder(order.items)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Quick Reorder
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-xl h-10 hover:bg-muted font-medium"
                        onClick={() => navigate("/orders")}
                      >
                        View Receipt
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.section>

          {/* Table Reservations */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-heading text-h2">Reservations</h2>
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={() => navigate("/booking")}
              >
                Book New Table
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-8 text-center">
                  <EmptyState
                    title="No reservations"
                    description="Plan your next dining experience now."
                    icon={Calendar}
                    action={{
                      label: "Book a Table",
                      onClick: () => navigate("/booking"),
                    }}
                  />
                </div>
              ) : (
                bookings.slice(0, 2).map((booking) => (
                  <motion.div
                    key={booking.id}
                    className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-heading font-bold text-lg">
                            {booking.restaurantName}
                          </span>
                          <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20">
                            Confirmed
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-md">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-md">
                            <Clock className="h-3.5 w-3.5" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-md">
                            <User className="h-3.5 w-3.5" />
                            {booking.guests} Guests
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Profile Footer */}
      <motion.div variants={itemVariants} className="mt-12 text-center pb-10">
        <Button
          variant="outline"
          onClick={() => logout()}
          className="rounded-2xl h-12 px-8 text-destructive border-destructive/30 hover:bg-destructive hover:text-white transition-all shadow-sm hover:shadow-glow-destructive"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Secure Logout
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Version 2.5.0 • Powered by Bhojanālaya Premium
        </p>
      </motion.div>
    </motion.div>
  );
}
