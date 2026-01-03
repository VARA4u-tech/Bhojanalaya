import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  TableProperties,
  BarChart3,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/store/adminStore";

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ClipboardList, label: "Orders" },
  { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu" },
  { href: "/admin/tables", icon: TableProperties, label: "Tables" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-card/70 backdrop-blur-md border-r border-border shadow-soft transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
            <UtensilsCrossed className="h-5 w-5" />
            <span>Bhojanālaya</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "p-2 rounded-xl hover:bg-muted transition-colors",
            collapsed && "mx-auto"
          )}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform duration-300",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => useAdminStore.getState().logout()}
          className={cn(
            "flex items-center gap-3 w-full p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all",
            collapsed ? "justify-center" : "px-4"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
