import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Search, Plus, Minus, ShoppingCart, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, useRestaurantStore } from "@/store";
import { useUIStore } from "@/store/uiStore";
import { MenuGridSkeleton } from "@/components/skeletons/MenuItemSkeleton";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { useToast } from "@/hooks/use-toast"; // Import useToast

const categories = [
  { id: "all", name: "All" },
  { id: "starters", name: "Starters" },
  { id: "mains", name: "Main Course" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
];

const menuItems = [
  // southern-spice (Andhra Cuisine)
  {
    id: 1,
    restaurantId: "southern-spice",
    name: "Rayalaseema Mutton Biryani",
    description: "Authentic spicy biryani made with Seema spices and tender mutton units",
    price: 380,
    category: "mains",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 2,
    restaurantId: "southern-spice",
    name: "Andhra Special Veg Thali",
    description: "Complete meal with Pappu, Avakaya, Gongura, and multiple local curries",
    price: 240,
    category: "mains",
    image: "https://i.ytimg.com/vi/WvrbDOHGGMM/maxresdefault.jpg",
    available: true,
  },
  {
    id: 3,
    restaurantId: "southern-spice",
    name: "Gongura Chicken Dry",
    description: "Tangy and spicy chicken fried with fresh Gongura leaves",
    price: 290,
    category: "starters",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 201,
    restaurantId: "southern-spice",
    name: "Masala Majjiga (Spiced Buttermilk)",
    description: "Traditional refreshing buttermilk with ginger, green chilies, and curry leaves",
    price: 40,
    category: "drinks",
    image: "https://www.indianveggiedelight.com/wp-content/uploads/2023/01/masala-chaas-featured.jpg",
    available: true,
  },
  {
    id: 202,
    restaurantId: "southern-spice",
    name: "Fresh Lime Soda",
    description: "Classic thirst quencher available in sweet, salted, or mixed flavors",
    price: 55,
    category: "drinks",
    image: "https://www.seriouseats.com/thmb/Lkr5DnY7jNP2aP5DS3d5qE0PEkQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__08__20200816-nimbu-soda-vicky-wasik-1-28079d5d45ee4e47a37a969d1e4834a0.jpg",
    available: true,
  },
  {
    id: 7,
    restaurantId: "southern-spice",
    name: "Natu Kodi Pulusu",
    description: "Country chicken cooked in a spicy, thin gravy - traditional Guntur style",
    price: 350,
    category: "mains",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 8,
    restaurantId: "southern-spice",
    name: "Gutti Vankaya Curry",
    description: "Stuffed brinjal in a rich peanut and sesame gravy",
    price: 180,
    category: "mains",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 11,
    restaurantId: "southern-spice",
    name: "Natu Kodi Biryani",
    description: "Aromatic pulao style biryani made with country chicken and local spices",
    price: 420,
    category: "mains",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 12,
    restaurantId: "southern-spice",
    name: "Royyala Vepudu (Prawns Fry)",
    description: "Spicy and crispy prawns fried with curry leaves and green chilies",
    price: 390,
    category: "starters",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    available: true,
  },

  // babai-hotel (Breakfast)
  {
    id: 4,
    restaurantId: "babai-hotel",
    name: "Special Babai Idli",
    description: "World famous idlis served with a dollop of white butter and Guntur karampodi",
    price: 80,
    category: "starters",
    image: "/images/menu/babai_idli.png",
    available: true,
  },
  {
    id: 5,
    restaurantId: "babai-hotel",
    name: "Ghee Karam Dosa",
    description: "Crispy dosa roasted in desi ghee with spicy Karampodi layer",
    price: 120,
    category: "starters",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 9,
    restaurantId: "babai-hotel",
    name: "Pesarattu Upma",
    description: "Green gram crepe stuffed with ginger-flavored semolina upma",
    price: 110,
    category: "starters",
    image: "/images/menu/pesarattu_upma.png",
    available: true,
  },
  {
    id: 10,
    restaurantId: "babai-hotel",
    name: "Perugu Wada",
    description: "Soft lentil donuts soaked in seasoned, thick curd with boondi",
    price: 90,
    category: "starters",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/10/perugu-vada-perugu-garelu.webp",
    available: true,
  },
  {
    id: 13,
    restaurantId: "babai-hotel",
    name: "Mysore Bajji",
    description: "Fluffy fried dumplings made with fermented flour and ginger",
    price: 85,
    category: "starters",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 14,
    restaurantId: "babai-hotel",
    name: "Onion Rava Dosa",
    description: "Lacy and crispy semolina dosa topped with chopped onions and green chilies",
    price: 115,
    category: "starters",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 15,
    restaurantId: "babai-hotel",
    name: "Vijayawada Punugulu",
    description: "Local street-style small fried dumplings served with peanut chutney",
    price: 60,
    category: "starters",
    image: "https://i.ytimg.com/vi/QQ8mjkffcwM/maxresdefault.jpg",
    available: true,
  },
  {
    id: 6,
    restaurantId: "babai-hotel",
    name: "Degree Filter Coffee",
    description: "Strong decoction coffee made with fresh milk and traditional filter method",
    price: 45,
    category: "drinks",
    image: "https://images.archanaskitchen.com/images/recipes/drink-recipes/chocolate-coffee-tea-drink-recipes/Kumbakonam_filter_Coffee_Recipe_1faff1d73a.jpg",
    available: true,
  },
  {
    id: 203,
    restaurantId: "babai-hotel",
    name: "Special Ginger Tea",
    description: "Strong milk tea brewed with fresh crushed ginger and cardamom",
    price: 35,
    category: "drinks",
    image: "https://www.cookclickndevour.com/wp-content/uploads/2020/12/today-pinterest-5.jpg",
    available: true,
  },
  {
    id: 204,
    restaurantId: "babai-hotel",
    name: "Badam Milk (Hot)",
    description: "Warm milk with almond paste, saffron threads, and chopped nuts",
    price: 65,
    category: "drinks",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2014/06/Badam-Milk.jpg",
    available: true,
  },

  // sweet-magic (Sweets & Meals)
  {
    id: 101,
    restaurantId: "sweet-magic",
    name: "Atreyapuram Pootharekulu",
    description: "Authentic paper-thin sweets stuffed with bellam (jaggery) and dry fruits",
    price: 220,
    category: "desserts",
    image: "/images/menu/pootharekulu.png",
    available: true,
  },
  {
    id: 111,
    restaurantId: "sweet-magic",
    name: "Special Bobbatlu",
    description: "Sweet flatbread stuffed with chana dal and jaggery paste, roasted in ghee",
    price: 150,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 112,
    restaurantId: "sweet-magic",
    name: "Apricot Delight",
    description: "Famous local dessert made with dried apricots and fresh cream",
    price: 180,
    category: "desserts",
    image: "https://www.tasteofhome.com/wp-content/uploads/2025/01/Apricot-Delight_EXPS_TOHD24_22267_AbbeyLittlejohn_06.jpg",
    available: true,
  },
  {
    id: 102,
    restaurantId: "sweet-magic",
    name: "Ulavacharu Biryani",
    description: "Special biryani made with thick horse-gram soup for a unique earthy flavor",
    price: 320,
    category: "mains",
    image: "/images/menu/ulavacharu_biryani.png",
    available: true,
  },
  {
    id: 107,
    restaurantId: "sweet-magic",
    name: "Avakaya Biryani",
    description: "Tangy and spicy biryani mixed with world-famous Andhra mango pickle",
    price: 280,
    category: "mains",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 113,
    restaurantId: "sweet-magic",
    name: "Special Veg Biryani",
    description: "Long grain basmati rice cooked with seasonal vegetables and aromatic spices",
    price: 250,
    category: "mains",
    image: "https://madhurasrecipe.com/wp-content/uploads/2023/03/Veg-Biryani-1.jpg",
    available: true,
  },
  {
    id: 108,
    restaurantId: "sweet-magic",
    name: "Badam Milk",
    description: "Chilled milk brewed with saffron, cardamom, and almond chunks",
    price: 75,
    category: "drinks",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2014/06/Badam-Milk.jpg",
    available: true,
  },
  {
    id: 205,
    restaurantId: "sweet-magic",
    name: "Mango Lassi",
    description: "Thick creamy yogurt drink blended with sweet mango pulp",
    price: 95,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 206,
    restaurantId: "sweet-magic",
    name: "Special Fruit Juice",
    description: "Freshly squeezed seasonal fruit juice of your choice",
    price: 80,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop",
    available: true,
  },

  // barkas-mandi (Arabic)
  {
    id: 103,
    restaurantId: "barkas-mandi",
    name: "Special Mutton Mandi",
    description: "Slow-cooked mutton served over saffron rice with dry fruits and soup",
    price: 550,
    category: "mains",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 104,
    restaurantId: "barkas-mandi",
    name: "Chicken Mandi",
    description: "Charcoal grilled chicken on a bed of flavorful mandi rice",
    price: 390,
    category: "mains",
    image: "https://i.pinimg.com/736x/10/08/0c/10080c37d1dbe21457989cd296252070.jpg",
    available: true,
  },
  {
    id: 114,
    restaurantId: "barkas-mandi",
    name: "Mushroom Mandi",
    description: "Authentic mandi rice served with spicy grilled mushrooms and garnish",
    price: 320,
    category: "mains",
    image: "https://i.ytimg.com/vi/Lb3Qe1jlbgc/maxresdefault.jpg",
    available: true,
  },
  {
    id: 207,
    restaurantId: "barkas-mandi",
    name: "Sulaimani Tea",
    description: "Traditional Arabic black tea with lemon and a hint of mint",
    price: 30,
    category: "drinks",
    image: "https://www.sharmispassions.com/wp-content/uploads/2020/07/sulaimani-tea2.jpg",
    available: true,
  },
  {
    id: 208,
    restaurantId: "barkas-mandi",
    name: "Arabic Pulpy Grape Juice",
    description: "Refreshing dark grape juice with real fruit pulp",
    price: 110,
    category: "drinks",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Qmhjm4u39vw16nevjq0LvIraAW4Ii4V2nQ&s",
    available: true,
  },
  {
    id: 109,
    restaurantId: "barkas-mandi",
    name: "Kunafa",
    description: "Sweet cheese pastry soaked in sugar syrup - authentic Arabic dessert",
    price: 250,
    category: "desserts",
    image: "https://chefjar.com/wp-content/uploads/2020/01/01-1.jpg",
    available: true
  },
  {
    id: 116,
    restaurantId: "barkas-mandi",
    name: "Special Baklava",
    description: "Layered pastry filled with chopped nuts and sweetened with syrup",
    price: 280,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    available: true,
  },

  // silver-spoon (Multi-cuisine)
  {
    id: 105,
    restaurantId: "silver-spoon",
    name: "Dragon Chicken",
    description: "Crispy chicken strips tossed in a spicy and sweet red chili sauce",
    price: 310,
    category: "starters",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 118,
    restaurantId: "silver-spoon",
    name: "Andhra Style Chicken 65",
    description: "Classic spicy deep-fried chicken cubes with curry leaves and green chilies",
    price: 290,
    category: "starters",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/chicken-65-swasthi.jpg",
    available: true,
  },
  {
    id: 110,
    restaurantId: "silver-spoon",
    name: "Apollo Fish",
    description: "Famous local appetizer with boneless fish cubes fried in spicy masala",
    price: 340,
    category: "starters",
    image: "/images/menu/apollo_fish.png",
    available: true,
  },
  {
    id: 120,
    restaurantId: "silver-spoon",
    name: "Gobi Manchurian Dry",
    description: "Crispy cauliflower florets tossed in a tangy Indo-Chinese sauce",
    price: 210,
    category: "starters",
    image: "https://palatesdesire.com/wp-content/uploads/2022/09/dry-gobi-manchurian-recipe@palates-desire.jpg",
    available: true,
  },
  {
    id: 117,
    restaurantId: "silver-spoon",
    name: "Nellore Fish Pulusu",
    description: "Traditional fish curry made with raw mango and tamarind pulp",
    price: 380,
    category: "mains",
    image: "https://vismaifood.com/storage/app/uploads/public/770/92e/8e6/thumb__1200_0_0_0_auto.jpg",
    available: true,
  },
  {
    id: 106,
    restaurantId: "silver-spoon",
    name: "Soft Noodles with Manchurian",
    description: "Classic Indo-Chinese combo with Veg Manchurian and Soft Veg Noodles",
    price: 280,
    category: "mains",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ59trh8-tOvo9ptiEj2iEMQNYpGMeJr6dYlw&s",
    available: true,
  },
  {
    id: 119,
    restaurantId: "silver-spoon",
    name: "Veg Fried Rice",
    description: "Flavorful basmati rice tossed with fresh vegetables and soya sauce",
    price: 220,
    category: "mains",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 121,
    restaurantId: "silver-spoon",
    name: "Chilli Chicken Gravy",
    description: "Batter fried chicken cubes in a spicy and savory green chili gravy",
    price: 320,
    category: "mains",
    image: "https://englishmeatempire.com/wp-content/uploads/2025/03/chiclli-chicken.jpg",
    available: true,
  },
  {
    id: 209,
    restaurantId: "silver-spoon",
    name: "Virgin Mojito",
    description: "Refreshing mix of lime, mint leaves, and sparkling soda",
    price: 155,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 210,
    restaurantId: "silver-spoon",
    name: "Oreo Milkshake",
    description: "Thick chocolate milkshake blended with crunchy Oreo cookies",
    price: 165,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    available: true,
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [priceSort, setPriceSort] = useState<"none" | "low-high" | "high-low">("none");
  const [isLoading, setIsLoading] = useState(true);

  const { items: cart, addItem, updateQuantity: updateCartQuantity, getItemCount, getTotal } = useCartStore();
  const { selectedRestaurant } = useRestaurantStore();
  const { toggleCart } = useUIStore();
  const { toast } = useToast(); // Initialize useToast

  // Mock dietary data for demo
  const getDiet = (id: number) => {
    // Veg items: Thali(2), Idli(4), Dosa(5), Coffee(6), Vankaya(8), Pesarattu(9), Wada(10), Mysore Bajji(13), Rava Dosa(14), Punugulu(15), Pootharekulu(101), Bobbatlu(111), Apricot Delight(112), Veg Biryani(113), Mush Mandi(114), Baklava(116), Avakaya Biryani(107), Badam Milk(108), Manchurian(106), Fried Rice(119), Gobi(120)
    // All drinks (201-210) are also veg
    const vegIds = [2, 4, 5, 6, 8, 9, 10, 13, 14, 15, 101, 111, 112, 113, 114, 116, 107, 108, 106, 119, 120, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210];
    return vegIds.includes(id) ? 'veg' : 'non-veg';
  };

  // Simulate loading (in real app, this would be an API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedRestaurant]);

  const filteredItems = menuItems
    .filter((item) => {
      const matchesRestaurant = !selectedRestaurant || item.restaurantId === selectedRestaurant.id;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

      // New Category Logic
      let matchesCategory = true;
      if (activeCategory === 'veg') {
        matchesCategory = getDiet(item.id) === 'veg';
      } else if (activeCategory === 'non-veg') {
        matchesCategory = getDiet(item.id) === 'non-veg';
      } else if (activeCategory === 'drinks') {
        matchesCategory = item.category === 'drinks';
      }
      // 'all' implies matchesCategory = true

      return matchesRestaurant && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (priceSort === "low-high") return a.price - b.price;
      if (priceSort === "high-low") return b.price - a.price;
      return 0;
    });

  const addToCart = (item: typeof menuItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    const currentItem = cart.find((item) => item.id === id);
    if (currentItem) {
      updateCartQuantity(id, currentItem.quantity + delta);
    }
  };

  const getItemQuantity = (id: number) => {
    return cart.find((item) => item.id === id)?.quantity || 0;
  };

  const totalItems = getItemCount();
  const totalPrice = getTotal();

  return (
    <div className="container py-6 lg:py-10">
      {/* Restaurant Header */}
      {selectedRestaurant && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-2xl p-6 mb-8 border border-primary/20">
          <div className="flex items-start gap-4">
            <img
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h2 className="font-heading text-2xl font-bold mb-1">{selectedRestaurant.name}</h2>
              <p className="text-sm text-muted-foreground mb-2">{selectedRestaurant.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{selectedRestaurant.rating}</span>
                  <span className="text-muted-foreground">({selectedRestaurant.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{selectedRestaurant.cuisine}</span>
                </div>
                <span className="text-muted-foreground">{selectedRestaurant.priceRange}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 group">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-heading text-h1 mb-2"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Discover our delicious offerings
          </motion.p>
        </div>

        {/* Quick Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="hidden">
            {/* Diet filter merged into main tabs */}
          </div>

          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="h-10 px-4 rounded-xl border border-border bg-card text-sm focus:ring-primary focus:border-primary outline-none"
            aria-label="Sort menu items by price" // Added aria-label
          >
            <option value="none">Sort by Price</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </motion.div>
      </div>

      {/* Peak Hour Indicator - Frontend AI Simulation */}
      {(() => {
        const hour = new Date().getHours();
        const isPeak = hour >= 19 && hour <= 21;

        return isPeak && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-3 text-orange-600"
          >
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium">
              High demand expected during this time. Pre-order recommended!
            </p>
          </motion.div>
        );
      })()}

      {/* Search & Category Nav */}
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-0 lg:px-0 lg:mb-8 transition-all">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              list="food-suggestions"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-card transition-all"
              aria-label="Search dishes"
            />
            <datalist id="food-suggestions">
              {menuItems.map(item => (
                <option key={item.id} value={item.name} />
              ))}
            </datalist>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:pb-0">
            {[
              { id: "all", label: "All" },
              { id: "veg", label: "Veg" },
              { id: "non-veg", label: "Non-Veg" },
              { id: "drinks", label: "Drinks" }
            ].map((tab) => {
              // Calculate counts
              const count = menuItems.filter(item => {
                if (tab.id === 'all') return true;
                if (tab.id === 'drinks') return item.category === 'drinks';
                if (tab.id === 'veg') return getDiet(item.id) === 'veg';
                if (tab.id === 'non-veg') return getDiet(item.id) === 'non-veg';
                return false;
              }).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    // Reset other filters when switching main tabs to avoid confusion
                    setActiveCategory(tab.id);
                    // If "Veg" tab is clicked, we effectively set diet filter, but here we are treating these as "Modes"
                    // We will handle the actual filtering logic in the filteredItems useMemo/logic below
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 border flex items-center gap-2",
                    activeCategory === tab.id
                      ? "bg-primary text-primary-foreground border-primary shadow-glow scale-105"
                      : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                  )}
                  aria-label={`Filter by ${tab.label}`}
                >
                  <span>{tab.label}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    activeCategory === tab.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <ErrorBoundary fallback={<ErrorFallback title="Failed to load menu" />}>
        {isLoading ? (
          <MenuGridSkeleton count={6} />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 lg:mb-0"
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
              {filteredItems.map((item) => {
                const isVeg = getDiet(item.id) === 'veg';

                return (
                  <MenuItemCard
                    key={item.id}
                    imageUrl={item.image}
                    isVegetarian={isVeg}
                    name={item.name}
                    price={item.price}
                    // Mocking extended data for now
                    originalPrice={Math.round(item.price * 1.5)}
                    quantity={item.category === 'drinks' ? "450 ml" : "Serves 1"}
                    prepTimeInMinutes={item.category === 'starters' ? 10 : 20}
                    onAdd={() => addToCart({ ...item, restaurantId: selectedRestaurant?.id })}
                    className={cn(!item.available && "opacity-60 saturate-50 pointer-events-none")}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </ErrorBoundary>

      {/* Floating Cart Button (Mobile) */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            className="fixed bottom-24 left-4 right-4 lg:hidden z-50"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <Button
              className="w-full h-16 shadow-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl flex items-center px-6 group"
              onClick={toggleCart}
              aria-label={`View your cart with ${totalItems} items, total ${totalPrice.toFixed(2)} rupees`} // Added aria-label
            >
              <div className="relative mr-4 bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-primary">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col items-start translate-y-[1px]">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 leading-none mb-0.5">View Basket</span>
                <span className="text-lg font-bold leading-none">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="ml-auto w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <Plus className="h-5 w-5 rotate-45" />
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
