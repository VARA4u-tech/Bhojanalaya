import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge, OrderStatus } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  UtensilsCrossed, 
  DollarSign,
  Clock,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { 
    label: "Today's Orders", 
    value: "48", 
    change: "+12%", 
    icon: UtensilsCrossed,
    color: "text-primary bg-primary/10"
  },
  { 
    label: "Active Tables", 
    value: "6/8", 
    change: "75%", 
    icon: Users,
    color: "text-status-confirmed bg-status-confirmed/10"
  },
  { 
    label: "Revenue Today", 
    value: "$2,840", 
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

const liveOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Wilson",
    items: 3,
    total: 54.97,
    status: "preparing" as OrderStatus,
    time: "5 min ago",
  },
  {
    id: "ORD-002",
    customer: "Mike Johnson",
    items: 2,
    total: 38.98,
    status: "confirmed" as OrderStatus,
    time: "8 min ago",
  },
  {
    id: "ORD-003",
    customer: "Emily Chen",
    items: 4,
    total: 72.96,
    status: "ready" as OrderStatus,
    time: "12 min ago",
  },
  {
    id: "ORD-004",
    customer: "David Brown",
    items: 1,
    total: 24.99,
    status: "waiting" as OrderStatus,
    time: "Just now",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-h1 mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-status-ready">
                  <TrendingUp className="h-4 w-4" />
                  {stat.change}
                </div>
              </div>
              <div className="font-heading text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        
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
          
          <div className="divide-y divide-border">
            {liveOrders.map((order) => (
              <div 
                key={order.id}
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
                    <div className="font-bold">${order.total.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{order.time}</div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/orders" className="block">
            <div className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-heading font-semibold">Manage Orders</div>
                  <div className="text-sm text-muted-foreground">View and update order status</div>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/menu" className="block">
            <div className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="font-heading font-semibold">Menu Management</div>
                  <div className="text-sm text-muted-foreground">Add, edit, or remove items</div>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/tables" className="block sm:col-span-2 lg:col-span-1">
            <div className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-status-ready/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-status-ready" />
                </div>
                <div>
                  <div className="font-heading font-semibold">Table Management</div>
                  <div className="text-sm text-muted-foreground">Monitor table availability</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
