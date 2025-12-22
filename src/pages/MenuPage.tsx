import { useState } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Search, Plus, Minus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All" },
  { id: "starters", name: "Starters" },
  { id: "mains", name: "Main Course" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
];

const menuItems = [
  {
    id: 1,
    name: "Caesar Salad",
    description: "Fresh romaine, parmesan, croutons, caesar dressing",
    price: 12.99,
    category: "starters",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "Bruschetta",
    description: "Toasted bread with tomatoes, basil, and garlic",
    price: 9.99,
    category: "starters",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 3,
    name: "Grilled Salmon",
    description: "Atlantic salmon with herbs, lemon butter sauce",
    price: 24.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 4,
    name: "Beef Tenderloin",
    description: "Prime beef with red wine reduction, seasonal vegetables",
    price: 32.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 5,
    name: "Pasta Carbonara",
    description: "Spaghetti with pancetta, egg, parmesan, black pepper",
    price: 18.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 6,
    name: "Chicken Parmesan",
    description: "Breaded chicken breast, marinara, mozzarella",
    price: 21.99,
    category: "mains",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop",
    available: false,
  },
  {
    id: 7,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee and mascarpone",
    price: 8.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 8,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center",
    price: 10.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 9,
    name: "Fresh Lemonade",
    description: "House-made with fresh lemons and mint",
    price: 4.99,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
    available: true,
  },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const addToCart = (item: typeof menuItems[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };
  
  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => 
      prev
        .map((item) => 
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  
  const getItemQuantity = (id: number) => {
    return cart.find((item) => item.id === id)?.quantity || 0;
  };
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <CustomerLayout>
      <div className="container py-6 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-h1 mb-2">Our Menu</h1>
          <p className="text-muted-foreground">Discover our delicious offerings</p>
        </div>
        
        {/* Search & Filter */}
        <div className="sticky top-16 z-20 bg-background py-4 -mx-4 px-4 lg:static lg:py-0 lg:mx-0 lg:px-0 lg:mb-8">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 lg:mb-0">
          {filteredItems.map((item, index) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div 
                key={item.id}
                className={cn(
                  "group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 animate-slide-up",
                  !item.available && "opacity-60"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      item.available 
                        ? "bg-accent text-accent-foreground" 
                        : "bg-destructive text-destructive-foreground"
                    )}>
                      {item.available ? "Available" : "Sold Out"}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${item.price}</span>
                    {item.available && (
                      quantity > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => addToCart(item)}
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Floating Cart Button (Mobile) */}
        {totalItems > 0 && (
          <div className="fixed bottom-20 left-4 right-4 lg:hidden animate-slide-up">
            <Button className="w-full h-14 shadow-soft-xl" variant="secondary">
              <ShoppingCart className="h-5 w-5" />
              <span>View Cart ({totalItems} items)</span>
              <span className="ml-auto">${totalPrice.toFixed(2)}</span>
            </Button>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
