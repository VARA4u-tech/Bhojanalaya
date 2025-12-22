import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const menuItems = [
  // Starters
  {
    id: 1,
    name: "Caesar Salad",
    description: "Fresh romaine, parmesan, croutons, caesar dressing",
    price: 12.99,
    category: "Starters",
    available: true,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Bruschetta",
    description: "Toasted bread with tomatoes, basil, and garlic",
    price: 9.99,
    category: "Starters",
    available: true,
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Soup of the Day",
    description: "Chef's daily special soup with artisan bread",
    price: 7.99,
    category: "Starters",
    available: true,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Crispy Calamari",
    description: "Lightly battered squid with marinara sauce",
    price: 14.99,
    category: "Starters",
    available: true,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Garlic Bread",
    description: "Toasted ciabatta with garlic butter and herbs",
    price: 6.99,
    category: "Starters",
    available: true,
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=100&h=100&fit=crop",
  },
  // Main Course
  {
    id: 6,
    name: "Grilled Salmon",
    description: "Atlantic salmon with herbs, lemon butter sauce",
    price: 24.99,
    category: "Main Course",
    available: true,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop",
  },
  {
    id: 7,
    name: "Beef Tenderloin",
    description: "Prime beef with red wine reduction",
    price: 32.99,
    category: "Main Course",
    available: true,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=100&h=100&fit=crop",
  },
  {
    id: 8,
    name: "Pasta Carbonara",
    description: "Spaghetti with pancetta, egg, parmesan",
    price: 18.99,
    category: "Main Course",
    available: true,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100&h=100&fit=crop",
  },
  {
    id: 9,
    name: "Chicken Parmesan",
    description: "Breaded chicken breast, marinara, mozzarella",
    price: 21.99,
    category: "Main Course",
    available: false,
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=100&h=100&fit=crop",
  },
  {
    id: 10,
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms and truffle oil",
    price: 19.99,
    category: "Main Course",
    available: true,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=100&h=100&fit=crop",
  },
  {
    id: 11,
    name: "Lamb Chops",
    description: "Herb-crusted lamb with mint jelly and roasted potatoes",
    price: 34.99,
    category: "Main Course",
    available: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop",
  },
  {
    id: 12,
    name: "Fish & Chips",
    description: "Beer-battered cod with fries and tartar sauce",
    price: 17.99,
    category: "Main Course",
    available: true,
    image: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=100&h=100&fit=crop",
  },
  {
    id: 13,
    name: "Vegetable Stir Fry",
    description: "Fresh seasonal vegetables in garlic soy sauce with rice",
    price: 15.99,
    category: "Main Course",
    available: true,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=100&h=100&fit=crop",
  },
  // Desserts
  {
    id: 14,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee and mascarpone",
    price: 8.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop",
  },
  {
    id: 15,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center",
    price: 10.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=100&h=100&fit=crop",
  },
  {
    id: 16,
    name: "Crème Brûlée",
    description: "Vanilla custard with caramelized sugar crust",
    price: 9.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=100&h=100&fit=crop",
  },
  {
    id: 17,
    name: "New York Cheesecake",
    description: "Creamy cheesecake with berry compote",
    price: 8.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=100&h=100&fit=crop",
  },
  // Drinks
  {
    id: 18,
    name: "Fresh Lemonade",
    description: "House-made with fresh lemons and mint",
    price: 4.99,
    category: "Drinks",
    available: true,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=100&h=100&fit=crop",
  },
  {
    id: 19,
    name: "Iced Coffee",
    description: "Cold brew coffee over ice with cream",
    price: 5.49,
    category: "Drinks",
    available: true,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&h=100&fit=crop",
  },
  {
    id: 20,
    name: "Mango Smoothie",
    description: "Fresh mango blended with yogurt and honey",
    price: 6.99,
    category: "Drinks",
    available: true,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=100&h=100&fit=crop",
  },
  {
    id: 21,
    name: "Sparkling Water",
    description: "Premium Italian sparkling mineral water",
    price: 3.99,
    category: "Drinks",
    available: true,
    image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=100&h=100&fit=crop",
  },
];

export default function AdminMenuPage() {
  const [items, setItems] = useState(menuItems);
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
                <div className="divide-y divide-border">
                  {categoryItems.map((item) => (
                    <div 
                      key={item.id}
                      className={cn(
                        "flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors",
                        !item.available && "opacity-60"
                      )}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-heading font-semibold">{item.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{item.description}</div>
                        <div className="text-primary font-bold mt-1">${item.price.toFixed(2)}</div>
                      </div>
                      
                      <div className="flex items-center gap-4">
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
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
