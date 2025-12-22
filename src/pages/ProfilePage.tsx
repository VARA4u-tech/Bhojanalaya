import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge, OrderStatus } from "@/components/ui/status-badge";
import { User, Mail, Phone, MapPin, Clock, RefreshCw, LogOut } from "lucide-react";

const orderHistory = [
  {
    id: "ORD-2024-001",
    date: "Dec 20, 2024",
    items: ["Grilled Salmon", "Caesar Salad", "Lemonade"],
    total: 55.95,
    status: "served" as OrderStatus,
  },
  {
    id: "ORD-2024-002",
    date: "Dec 18, 2024",
    items: ["Beef Tenderloin", "Tiramisu"],
    total: 41.98,
    status: "served" as OrderStatus,
  },
  {
    id: "ORD-2024-003",
    date: "Dec 15, 2024",
    items: ["Pasta Carbonara", "Bruschetta"],
    total: 28.98,
    status: "cancelled" as OrderStatus,
  },
];

const bookingHistory = [
  {
    id: "BKG-2024-001",
    date: "Dec 22, 2024",
    time: "7:00 PM",
    guests: 4,
    table: 5,
    status: "confirmed" as OrderStatus,
  },
  {
    id: "BKG-2024-002",
    date: "Dec 18, 2024",
    time: "12:30 PM",
    guests: 2,
    table: 2,
    status: "served" as OrderStatus,
  },
];

export default function ProfilePage() {
  return (
    <CustomerLayout>
      <div className="container py-6 lg:py-10 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-h2 mb-1">John Doe</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  john.doe@email.com
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: "24" },
            { label: "Table Bookings", value: "8" },
            { label: "Favorite Dish", value: "Salmon" },
            { label: "Member Since", value: "2024" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-2xl p-4 shadow-soft text-center animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="font-heading text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Order History */}
        <section className="mb-8">
          <h2 className="font-heading text-h2 mb-4">Order History</h2>
          <div className="space-y-4">
            {orderHistory.map((order, index) => (
              <div 
                key={order.id}
                className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-heading font-bold">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {order.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-bold text-lg text-primary">${order.total.toFixed(2)}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {order.items.join(" • ")}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                    Reorder
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Booking History */}
        <section className="mb-8">
          <h2 className="font-heading text-h2 mb-4">Table Bookings</h2>
          <div className="space-y-4">
            {bookingHistory.map((booking, index) => (
              <div 
                key={booking.id}
                className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-heading font-bold">{booking.id}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.date} at {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {booking.guests} guests
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Table {booking.table}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Logout */}
        <div className="text-center">
          <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
}
