import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store";
import { EmptyState } from "@/components/ui/empty-state"; // Import EmptyState

interface Table {
  id: number;
  seats: number;
  status: "available" | "occupied" | "reserved";
  currentGuests?: number;
  reservedFor?: string;
}

// Simple Table Card Skeleton component for loading state
const TableCardSkeleton = () => (
  <div className="relative p-5 rounded-2xl border-2 border-border/50 bg-card shadow-soft h-40 animate-pulse">
    <div className="absolute top-3 right-3 w-5 h-5 bg-muted rounded-full" />
    <div className="text-center mt-4">
      <div className="font-heading text-2xl font-bold mb-2 h-7 w-3/4 bg-muted mx-auto rounded" />
      <div className="flex items-center justify-center gap-1 text-sm mb-2 h-4 w-1/2 bg-muted mx-auto rounded" />
      <div className="h-4 w-1/3 bg-muted mx-auto rounded" />
    </div>
  </div>
);

export default function AdminTablesPage() {
  const { bookings } = useBookingStore();
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate an API call delay
    return () => clearTimeout(timer);
  }, []);

  const initialTables: Table[] = [
    { id: 1, seats: 2, status: "available" },
    { id: 2, seats: 2, status: "available" },
    { id: 3, seats: 4, status: "available" },
    { id: 4, seats: 4, status: "available" },
    { id: 5, seats: 4, status: "available" },
    { id: 6, seats: 6, status: "available" },
    { id: 7, seats: 6, status: "available" },
    { id: 8, seats: 8, status: "available" },
  ];

  // Sync tables with active bookings
  const tables = initialTables.map(table => {
    const booking = bookings.find(b => b.tableNumber === table.id.toString() && b.status === 'confirmed');
    if (booking) {
      return {
        ...table,
        status: 'occupied' as const,
        currentGuests: booking.guests,
      };
    }
    return table;
  });

  const setTables = (val: any) => console.log("Manual update not implemented yet - syncs with bookings");

  const statusColors = {
    available: "bg-status-ready/20 border-status-ready text-status-ready",
    occupied: "bg-destructive/20 border-destructive text-destructive",
    reserved: "bg-status-waiting/20 border-status-waiting text-status-waiting",
  };

  const toggleStatus = (id: number) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== id) return table;
        const nextStatus =
          table.status === "available" ? "occupied" :
            table.status === "occupied" ? "available" : "available";
        return {
          ...table,
          status: nextStatus,
          currentGuests: nextStatus === "occupied" ? table.seats : undefined,
          reservedFor: undefined,
        };
      })
    );
  };

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-h1 mb-1">Table Management</h1>
          <p className="text-muted-foreground">Monitor and manage table availability</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tables</div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="text-2xl font-bold text-status-ready">{stats.available}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="text-2xl font-bold text-destructive">{stats.occupied}</div>
            <div className="text-sm text-muted-foreground">Occupied</div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="text-2xl font-bold text-status-waiting">{stats.reserved}</div>
            <div className="text-sm text-muted-foreground">Reserved</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-ready/40 border-2 border-status-ready" />
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/40 border-2 border-destructive" />
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-waiting/40 border-2 border-status-waiting" />
            <span className="text-sm">Reserved</span>
          </div>
        </div>

        {/* Conditional Rendering for Loading/Empty/Tables */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => ( // Show 6 skeleton cards
              <TableCardSkeleton key={i} />
            ))}
          </div>
        ) : tables.length === 0 ? (
          <EmptyState
            title="No tables configured"
            description="It looks like there are no tables set up in the system. Please add new tables to manage them."
            icon={Users}
            action={{
              label: "Add New Table",
              onClick: () => console.log("Add new table functionality goes here") // Placeholder for now
            }}
          />
        ) : (
          /* Table Grid */
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
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
            {tables.map((table) => (
              <motion.div
                key={table.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
                className={cn(
                  "group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-soft-lg overflow-hidden",
                  statusColors[table.status]
                )}
                onClick={() => toggleStatus(table.id)}
                aria-label={`Table ${table.id}, ${table.seats} seats, status ${table.status}`} // Added aria-label
                role="button" // Indicate it's an interactive element
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-3 right-3 z-10">
                  {table.status === "available" && (
                    <Check className="h-5 w-5" />
                  )}
                  {table.status === "occupied" && (
                    <X className="h-5 w-5" />
                  )}
                </div>

                <div className="text-center relative z-10">
                  <div className="font-heading text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">
                    Table {table.id}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm mb-2 opacity-80">
                    <Users className="h-4 w-4" />
                    <span>{table.seats} seats</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest bg-black/10 py-1 px-2 rounded-full inline-block">
                    {table.status}
                  </div>
                  {table.currentGuests && (
                    <div className="text-xs mt-2 font-medium">
                      {table.currentGuests} / {table.seats} Guests
                    </div>
                  )}
                  {table.reservedFor && (
                    <div className="text-xs mt-2 font-medium">
                      Reserved: {table.reservedFor}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" aria-label="Add a new table for management">
            Add New Table
          </Button>
          <Button variant="ghost" aria-label="Reset all table statuses and data">
            Reset All
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
