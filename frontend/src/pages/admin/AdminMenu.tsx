import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ChevronDown,
  Filter,
  DollarSign,
  Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurantStore";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image?: string;
}

const mockCategories = ["All", "Main Course", "Starters", "Desserts", "Beverages"];

const mockMenuItems: MenuItem[] = [
  { id: 1, name: "Grilled Salmon", category: "Main Course", price: 1250, available: true },
  { id: 2, name: "Caesar Salad", category: "Starters", price: 450, available: true },
  { id: 3, name: "Truffle Pasta", category: "Main Course", price: 1550, available: false },
  { id: 4, name: "Chocolate Fondant", category: "Desserts", price: 350, available: true },
  { id: 5, name: "Iced Caramel Latte", category: "Beverages", price: 250, available: true },
];

export default function AdminMenu() {
  const { restaurantId } = useParams();
  const { getRestaurantById, getMenuItemsByRestaurant } = useRestaurantStore();
  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchMenu() {
      if (restaurantId) {
        const rawItems = await getMenuItemsByRestaurant(restaurantId);
        const mappedItems = rawItems.map(item => ({
          ...item,
          category: item.category === 'main' ? 'Main Course' : 
                    item.category === 'drinks' ? 'Beverages' : 
                    item.category === 'desserts' ? 'Desserts' : item.category,
          available: true
        }));
        setItems(mappedItems as MenuItem[]);
      } else {
        setItems(mockMenuItems as MenuItem[]);
      }
    }
    fetchMenu();
  }, [restaurantId, getMenuItemsByRestaurant]);

  const toggleAvailability = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const filteredItems = selectedCategory === "All" 
    ? items 
    : items.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md">
             <img src={restaurant?.image} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-slate-900 leading-tight">{restaurant?.name || "Global"} Menu</h1>
            <p className="text-slate-500 font-medium tracking-tight">Manage offerings and availability.</p>
          </div>
        </div>
        <Button className="rounded-xl gap-2 h-11 shadow-lg shadow-primary/20 font-bold px-6">
           <Plus className="w-5 h-5" />
           Add New Item
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <Filter className="w-4 h-4 text-primary" />
                 Categories
              </h3>
              <div className="space-y-1">
                 {mockCategories.map((cat) => (
                   <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                        selectedCategory === cat 
                          ? "bg-primary/5 text-primary border border-primary/20" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                      )}
                   >
                      {cat}
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-400">
                         {cat === "All" ? items.length : items.filter(i => i.category === cat).length}
                      </span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="organic-card p-6 bg-amber-50 border-amber-100">
              <h4 className="font-heading text-amber-900 font-bold mb-2 flex items-center gap-2">
                 <Utensils className="w-4 h-4" />
                 Kitchen Note
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                 Changes made to item availability reflect instantly on the customer app.
              </p>
           </div>
        </div>

        {/* Menu Items List */}
        <div className="lg:col-span-3 space-y-4">
           {/* Item Search */}
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search menu items..." 
                className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium shadow-sm"
              />
           </div>

           <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                     <Utensils className="w-8 h-8 text-slate-200" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-heading text-lg font-bold text-slate-900 truncate">{item.name}</h4>
                        <span className="px-2 py-1 rounded-lg bg-slate-50 text-[10px] text-slate-400 font-bold uppercase border border-slate-100">
                          {item.category}
                        </span>
                     </div>
                     <p className="font-bold text-primary flex items-center">
                        <DollarSign className="w-3.5 h-3.5" />
                        {item.price}
                     </p>
                  </div>

                  <div className="flex items-center gap-3 pr-2">
                    <div className="flex flex-col items-center gap-1">
                       <span className={cn(
                          "text-[9px] font-bold uppercase tracking-wider",
                          item.available ? "text-emerald-500" : "text-slate-400"
                       )}>
                          {item.available ? "Live" : "Draft"}
                       </span>
                       <button 
                          onClick={() => toggleAvailability(item.id)}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-colors duration-200",
                            item.available ? "bg-emerald-500" : "bg-slate-200"
                          )}
                       >
                          <div className={cn(
                             "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                             item.available && "translate-x-6"
                          )} />
                       </button>
                    </div>

                    <div className="h-8 w-[1px] bg-slate-100 mx-1" />

                    <div className="flex gap-1">
                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-50 hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
