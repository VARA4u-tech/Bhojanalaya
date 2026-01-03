import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useRestaurantStore } from "@/store";

export default function AdminMenuPage() {
  const { getMenuItemsByRestaurant } = useRestaurantStore();
  const menuItemsFromStore = getMenuItemsByRestaurant('southern-spice');

  const [items, setItems] = useState(menuItemsFromStore);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAvailability = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const categories = [...new Set(items.map((item) => item.category))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-h1 mb-1">Menu Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove menu items</p>
          </div>
          <Button variant="secondary">
            <Plus className="h-5 w-5" />
            Add Item
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Menu Items by Category */}
        {categories.map((category) => {
          const categoryItems = filteredItems.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="font-heading text-h3 mb-4">{category}</h2>
              <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
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
                  <AnimatePresence mode="popLayout">
                    {categoryItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                          "group relative flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors overflow-hidden",
                          !item.available && "opacity-60"
                        )}
                      >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 relative z-10 shadow-sm">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 relative z-10">
                          <div className="font-heading font-semibold text-lg">{item.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{item.description}</div>
                          <div className="text-primary font-bold mt-1 text-base">₹{item.price.toLocaleString()}</div>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                              {item.available ? "Available" : "Unavailable"}
                            </span>
                            <Switch
                              checked={item.available}
                              onCheckedChange={() => toggleAvailability(item.id)}
                            />
                          </div>

                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 hover:text-primary rounded-xl">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
