import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  Bell,
  Search,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { user, logout } = useUserStore();
  const { getRestaurantById } = useRestaurantStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeRestaurant = restaurantId ? getRestaurantById(restaurantId) : null;

  const navItems = [
    { label: "Overview", href: restaurantId ? `/admin/${restaurantId}` : "/admin", icon: LayoutDashboard },
    { label: "Orders", href: restaurantId ? `/admin/${restaurantId}/orders` : "/admin", icon: ShoppingBag, disabled: !restaurantId },
    { label: "Menu Manager", href: restaurantId ? `/admin/${restaurantId}/menu` : "/admin", icon: Utensils, disabled: !restaurantId },
    { label: "Bookings", href: restaurantId ? `/admin/${restaurantId}/bookings` : "/admin", icon: Calendar, disabled: !restaurantId },
    { label: "Customers", href: restaurantId ? `/admin/${restaurantId}/customers` : "/admin", icon: Users, disabled: !restaurantId },
    { label: "Settings", href: restaurantId ? `/admin/${restaurantId}/settings` : "/admin", icon: Settings, disabled: !restaurantId },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
               <Utensils className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900 overflow-hidden whitespace-nowrap">
                Bhojana Admin
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            if (item.disabled && !isActive) return null;

            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                {isSidebarOpen && (
                  <span className="font-semibold text-sm">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 italic font-serif text-[10px] text-center text-slate-400">
             {isSidebarOpen ? "Bhojanālaya v3.0 Hub" : "v3.0"}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-20">
          <div className="flex items-center gap-4">
             {restaurantId ? (
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate("/admin")}
                    className="rounded-full hover:bg-slate-100 text-slate-400"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{activeRestaurant?.name || "Restaurant"}</p>
                    <h2 className="text-lg font-bold text-slate-900 leading-none">Management Dashboard</h2>
                  </div>
                </div>
             ) : (
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden lg:flex rounded-full hover:bg-slate-100"
                  >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                  </Button>
                  <div className="lg:hidden w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-none">Global Administration</h2>
                </div>
             )}
             <div className="hidden sm:flex relative max-w-md w-64 lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Universal search..." 
                  className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
             </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-slate-100">
               <Bell className="w-5 h-5 text-slate-500" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
            </Button>

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 pl-1">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user?.name || "Admin"}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                 {user?.avatar ? (
                   <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                 ) : (
                   <Users className="w-5 h-5 text-slate-400" />
                 )}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-8">
          <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
             >
               {children}
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
