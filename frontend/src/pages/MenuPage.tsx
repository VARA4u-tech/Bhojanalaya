import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, useRestaurantStore } from "@/store";
import { useUIStore } from "@/store/uiStore";
import { MenuGridSkeleton } from "@/components/skeletons/MenuItemSkeleton";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";

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
    description:
      "Authentic spicy biryani made with Seema spices and tender mutton units",
    price: 380,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 2,
    restaurantId: "southern-spice",
    name: "Andhra Special Veg Thali",
    description:
      "Complete meal with Pappu, Avakaya, Gongura, and multiple local curries",
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
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 201,
    restaurantId: "southern-spice",
    name: "Masala Majjiga (Spiced Buttermilk)",
    description:
      "Traditional refreshing buttermilk with ginger, green chilies, and curry leaves",
    price: 40,
    category: "drinks",
    image:
      "https://www.indianveggiedelight.com/wp-content/uploads/2023/01/masala-chaas-featured.jpg",
    available: true,
  },
  {
    id: 202,
    restaurantId: "southern-spice",
    name: "Fresh Lime Soda",
    description:
      "Classic thirst quencher available in sweet, salted, or mixed flavors",
    price: 55,
    category: "drinks",
    image:
      "https://www.seriouseats.com/thmb/Lkr5DnY7jNP2aP5DS3d5qE0PEkQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__08__20200816-nimbu-soda-vicky-wasik-1-28079d5d45ee4e47a37a969d1e4834a0.jpg",
    available: true,
  },
  {
    id: 7,
    restaurantId: "southern-spice",
    name: "Natu Kodi Pulusu",
    description:
      "Country chicken cooked in a spicy, thin gravy - traditional Guntur style",
    price: 350,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 8,
    restaurantId: "southern-spice",
    name: "Gutti Vankaya Curry",
    description: "Stuffed brinjal in a rich peanut and sesame gravy",
    price: 180,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 11,
    restaurantId: "southern-spice",
    name: "Natu Kodi Biryani",
    description:
      "Aromatic pulao style biryani made with country chicken and local spices",
    price: 420,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 12,
    restaurantId: "southern-spice",
    name: "Royyala Vepudu (Prawns Fry)",
    description:
      "Spicy and crispy prawns fried with curry leaves and green chilies",
    price: 390,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    available: true,
  },

  // babai-hotel (Breakfast)
  {
    id: 4,
    restaurantId: "babai-hotel",
    name: "Special Babai Idli",
    description:
      "World famous idlis served with a dollop of white butter and Guntur karampodi",
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
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop",
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
    description:
      "Soft lentil donuts soaked in seasoned, thick curd with boondi",
    price: 90,
    category: "starters",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2020/10/perugu-vada-perugu-garelu.webp",
    available: true,
  },
  {
    id: 13,
    restaurantId: "babai-hotel",
    name: "Mysore Bajji",
    description: "Fluffy fried dumplings made with fermented flour and ginger",
    price: 85,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 14,
    restaurantId: "babai-hotel",
    name: "Onion Rava Dosa",
    description:
      "Lacy and crispy semolina dosa topped with chopped onions and green chilies",
    price: 115,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 15,
    restaurantId: "babai-hotel",
    name: "Vijayawada Punugulu",
    description:
      "Local street-style small fried dumplings served with peanut chutney",
    price: 60,
    category: "starters",
    image: "https://i.ytimg.com/vi/QQ8mjkffcwM/maxresdefault.jpg",
    available: true,
  },
  {
    id: 6,
    restaurantId: "babai-hotel",
    name: "Degree Filter Coffee",
    description:
      "Strong decoction coffee made with fresh milk and traditional filter method",
    price: 45,
    category: "drinks",
    image:
      "https://images.archanaskitchen.com/images/recipes/drink-recipes/chocolate-coffee-tea-drink-recipes/Kumbakonam_filter_Coffee_Recipe_1faff1d73a.jpg",
    available: true,
  },
  {
    id: 203,
    restaurantId: "babai-hotel",
    name: "Special Ginger Tea",
    description:
      "Strong milk tea brewed with fresh crushed ginger and cardamom",
    price: 35,
    category: "drinks",
    image:
      "https://www.cookclickndevour.com/wp-content/uploads/2020/12/today-pinterest-5.jpg",
    available: true,
  },
  {
    id: 204,
    restaurantId: "babai-hotel",
    name: "Badam Milk (Hot)",
    description:
      "Warm milk with almond paste, saffron threads, and chopped nuts",
    price: 65,
    category: "drinks",
    image:
      "https://www.cookwithmanali.com/wp-content/uploads/2014/06/Badam-Milk.jpg",
    available: true,
  },

  // sweet-magic (Sweets & Meals)
  {
    id: 101,
    restaurantId: "sweet-magic",
    name: "Atreyapuram Pootharekulu",
    description:
      "Authentic paper-thin sweets stuffed with bellam (jaggery) and dry fruits",
    price: 220,
    category: "desserts",
    image: "/images/menu/pootharekulu.png",
    available: true,
  },
  {
    id: 111,
    restaurantId: "sweet-magic",
    name: "Special Bobbatlu",
    description:
      "Sweet flatbread stuffed with chana dal and jaggery paste, roasted in ghee",
    price: 150,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 112,
    restaurantId: "sweet-magic",
    name: "Apricot Delight",
    description:
      "Famous local dessert made with dried apricots and fresh cream",
    price: 180,
    category: "desserts",
    image:
      "https://www.tasteofhome.com/wp-content/uploads/2025/01/Apricot-Delight_EXPS_TOHD24_22267_AbbeyLittlejohn_06.jpg",
    available: true,
  },
  {
    id: 102,
    restaurantId: "sweet-magic",
    name: "Ulavacharu Biryani",
    description:
      "Special biryani made with thick horse-gram soup for a unique earthy flavor",
    price: 320,
    category: "mains",
    image: "/images/menu/ulavacharu_biryani.png",
    available: true,
  },
  {
    id: 107,
    restaurantId: "sweet-magic",
    name: "Avakaya Biryani",
    description:
      "Tangy and spicy biryani mixed with world-famous Andhra mango pickle",
    price: 280,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 113,
    restaurantId: "sweet-magic",
    name: "Special Veg Biryani",
    description:
      "Long grain basmati rice cooked with seasonal vegetables and aromatic spices",
    price: 250,
    category: "mains",
    image:
      "https://madhurasrecipe.com/wp-content/uploads/2023/03/Veg-Biryani-1.jpg",
    available: true,
  },
  {
    id: 108,
    restaurantId: "sweet-magic",
    name: "Badam Milk",
    description:
      "Chilled milk brewed with saffron, cardamom, and almond chunks",
    price: 75,
    category: "drinks",
    image:
      "https://www.cookwithmanali.com/wp-content/uploads/2014/06/Badam-Milk.jpg",
    available: true,
  },
  {
    id: 205,
    restaurantId: "sweet-magic",
    name: "Mango Lassi",
    description: "Thick creamy yogurt drink blended with sweet mango pulp",
    price: 95,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 206,
    restaurantId: "sweet-magic",
    name: "Special Fruit Juice",
    description: "Freshly squeezed seasonal fruit juice of your choice",
    price: 80,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop",
    available: true,
  },

  // barkas-mandi (Arabic)
  {
    id: 103,
    restaurantId: "barkas-mandi",
    name: "Special Mutton Mandi",
    description:
      "Slow-cooked mutton served over saffron rice with dry fruits and soup",
    price: 550,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 104,
    restaurantId: "barkas-mandi",
    name: "Chicken Mandi",
    description: "Charcoal grilled chicken on a bed of flavorful mandi rice",
    price: 390,
    category: "mains",
    image:
      "https://i.pinimg.com/736x/10/08/0c/10080c37d1dbe21457989cd296252070.jpg",
    available: true,
  },
  {
    id: 114,
    restaurantId: "barkas-mandi",
    name: "Mushroom Mandi",
    description:
      "Authentic mandi rice served with spicy grilled mushrooms and garnish",
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
    image:
      "https://www.sharmispassions.com/wp-content/uploads/2020/07/sulaimani-tea2.jpg",
    available: true,
  },
  {
    id: 208,
    restaurantId: "barkas-mandi",
    name: "Arabic Pulpy Grape Juice",
    description: "Refreshing dark grape juice with real fruit pulp",
    price: 110,
    category: "drinks",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Qmhjm4u39vw16nevjq0LvIraAW4Ii4V2nQ&s",
    available: true,
  },
  {
    id: 109,
    restaurantId: "barkas-mandi",
    name: "Kunafa",
    description:
      "Sweet cheese pastry soaked in sugar syrup - authentic Arabic dessert",
    price: 250,
    category: "desserts",
    image: "https://chefjar.com/wp-content/uploads/2020/01/01-1.jpg",
    available: true,
  },
  {
    id: 116,
    restaurantId: "barkas-mandi",
    name: "Special Baklava",
    description:
      "Layered pastry filled with chopped nuts and sweetened with syrup",
    price: 280,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    available: true,
  },

  // silver-spoon (Multi-cuisine)
  {
    id: 105,
    restaurantId: "silver-spoon",
    name: "Dragon Chicken",
    description:
      "Crispy chicken strips tossed in a spicy and sweet red chili sauce",
    price: 310,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 118,
    restaurantId: "silver-spoon",
    name: "Andhra Style Chicken 65",
    description:
      "Classic spicy deep-fried chicken cubes with curry leaves and green chilies",
    price: 290,
    category: "starters",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/chicken-65-swasthi.jpg",
    available: true,
  },
  {
    id: 110,
    restaurantId: "silver-spoon",
    name: "Apollo Fish",
    description:
      "Famous local appetizer with boneless fish cubes fried in spicy masala",
    price: 340,
    category: "starters",
    image: "/images/menu/apollo_fish.png",
    available: true,
  },
  {
    id: 120,
    restaurantId: "silver-spoon",
    name: "Gobi Manchurian Dry",
    description:
      "Crispy cauliflower florets tossed in a tangy Indo-Chinese sauce",
    price: 210,
    category: "starters",
    image:
      "https://palatesdesire.com/wp-content/uploads/2022/09/dry-gobi-manchurian-recipe@palates-desire.jpg",
    available: true,
  },
  {
    id: 117,
    restaurantId: "silver-spoon",
    name: "Nellore Fish Pulusu",
    description: "Traditional fish curry made with raw mango and tamarind pulp",
    price: 380,
    category: "mains",
    image:
      "https://vismaifood.com/storage/app/uploads/public/770/92e/8e6/thumb__1200_0_0_0_auto.jpg",
    available: true,
  },
  {
    id: 106,
    restaurantId: "silver-spoon",
    name: "Soft Noodles with Manchurian",
    description:
      "Classic Indo-Chinese combo with Veg Manchurian and Soft Veg Noodles",
    price: 280,
    category: "mains",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ59trh8-tOvo9ptiEj2iEMQNYpGMeJr6dYlw&s",
    available: true,
  },
  {
    id: 119,
    restaurantId: "silver-spoon",
    name: "Veg Fried Rice",
    description:
      "Flavorful basmati rice tossed with fresh vegetables and soya sauce",
    price: 220,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 121,
    restaurantId: "silver-spoon",
    name: "Chilli Chicken Gravy",
    description:
      "Batter fried chicken cubes in a spicy and savory green chili gravy",
    price: 320,
    category: "mains",
    image:
      "https://englishmeatempire.com/wp-content/uploads/2025/03/chiclli-chicken.jpg",
    available: true,
  },
  {
    id: 209,
    restaurantId: "silver-spoon",
    name: "Virgin Mojito",
    description: "Refreshing mix of lime, mint leaves, and sparkling soda",
    price: 155,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 210,
    restaurantId: "silver-spoon",
    name: "Oreo Milkshake",
    description: "Thick chocolate milkshake blended with crunchy Oreo cookies",
    price: 165,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    available: true,
  },

  // 7-days (Multi-cuisine)
  {
    id: 301,
    restaurantId: "7-days",
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in a rich, creamy tomato-based gravy",
    price: 280,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 302,
    restaurantId: "7-days",
    name: "Garlic Naan (2 pcs)",
    description: "Soft leavened bread with a hint of garlic and butter",
    price: 90,
    category: "starters",
    image:
      "https://momsbiryanica.com/wp-content/uploads/2025/11/garlicnaan2pcs.jpg",
    available: true,
  },
  {
    id: 303,
    restaurantId: "7-days",
    name: "7 Days Special Eggless Cake",
    description: "Iconic fresh cream cake, a local favorite for celebrations",
    price: 450,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 304,
    restaurantId: "7-days",
    name: "Hyderabadi Veg Biryani",
    description:
      "Aromatic basmati rice cooked with garden fresh vegetables and secret spices",
    price: 260,
    category: "mains",
    image:
      "https://www.cookshideout.com/wp-content/uploads/2017/03/Hyderabadi-Veg-Biryani-Thali-FI.jpg",
    available: true,
  },
  {
    id: 305,
    restaurantId: "7-days",
    name: "Chicken 65",
    description:
      "Spicy, deep-fried chicken morsels - a classic Andhra appetizer",
    price: 295,
    category: "starters",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/chicken-65-swasthi.jpg",
    available: true,
  },
  {
    id: 306,
    restaurantId: "7-days",
    name: "Mango Lassi",
    description: "Creamy yogurt drink blended with sweet Alphonso mangoes",
    price: 110,
    category: "drinks",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/mango-lassi-recipe.jpg",
    available: true,
  },

  // barbeque-pride (Buffet)
  {
    id: 401,
    restaurantId: "barbeque-pride",
    name: "Grand Veg Buffet",
    description:
      "Unlimited starters, main course, and desserts with live table grill",
    price: 649,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 402,
    restaurantId: "barbeque-pride",
    name: "Grand Non-Veg Buffet",
    description:
      "Unlimited meat grills, seafood, and a massive international spread",
    price: 749,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 403,
    restaurantId: "barbeque-pride",
    name: "Peri Peri Grilled Chicken",
    description:
      "Spicy and tangy charcoal grilled bird - part of the grill experience",
    price: 350,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 404,
    restaurantId: "barbeque-pride",
    name: "Crispy Corn Masala",
    description:
      "Golden fried kernels tossed with onions, chilies, and tangy spices",
    price: 180,
    category: "starters",
    image: "https://rakskitchen.net/wp-content/uploads/2022/01/crisp-corn.jpg",
    available: true,
  },
  {
    id: 405,
    restaurantId: "barbeque-pride",
    name: "Garlic Butter Fish",
    description:
      "Succulent fish fillets grilled to perfection with aromatic garlic butter",
    price: 380,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 406,
    restaurantId: "barbeque-pride",
    name: "Gulab Jamun with Ice Cream",
    description:
      "Warm milk dumplings served with a scoop of creamy vanilla ice cream",
    price: 160,
    category: "desserts",
    image:
      "https://someindiangirl.com/wp-content/uploads/2021/09/Gulab-Jamun-Ice-Cream-1-9-of-14-scaled.jpg",
    available: true,
  },

  // gad-gateway (Fine Dining)
  {
    id: 501,
    restaurantId: "gad-gateway",
    name: "Classic Pan Asian Platter",
    description: "Curated selection of dim sums, spring rolls, and satays",
    price: 890,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 502,
    restaurantId: "gad-gateway",
    name: "Tandoori Atlantic Salmon",
    description:
      "Premium salmon marinated in Indian spices and finished in the clay oven",
    price: 1250,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 503,
    restaurantId: "gad-gateway",
    name: "Sparkling Berry Cooler",
    description: "Sophisticated blend of mixed berries and effervescent water",
    price: 240,
    category: "drinks",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyrlh9FhHfQdnm66k8WEaaptZjwgYBbn-XhA&s",
    available: true,
  },
  {
    id: 504,
    restaurantId: "gad-gateway",
    name: "Truffle Mushroom Risotto",
    description:
      "Creamy Arborio rice with wild mushrooms and truffle oil drizzle",
    price: 750,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 505,
    restaurantId: "gad-gateway",
    name: "Grilled Tiger Prawns",
    description: "Giant prawns marinated in lemon-garlic butter and herbs",
    price: 980,
    category: "starters",
    image:
      "https://images.getrecipekit.com/20250711210613-grilled-tiger-prawns-seaweed-butter.jpg?aspect_ratio=1:1&quality=90&",
    available: true,
  },
  {
    id: 506,
    restaurantId: "gad-gateway",
    name: "Slow-Cooked Lamb Shank",
    description: "Tender lamb shank braised for 8 hours with root vegetables",
    price: 1100,
    category: "mains",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlnk8C_ueI4RdsN8r-eJDaS8_6cmm3XhgaQQ&s",
    available: true,
  },
  {
    id: 507,
    restaurantId: "gad-gateway",
    name: "Classic Tiramisu",
    description:
      "Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone",
    price: 420,
    category: "desserts",
    image:
      "https://static01.nyt.com/images/2017/04/05/dining/05COOKING-TIRAMISU1/05COOKING-TIRAMISU1-videoSixteenByNineJumbo1600.jpg",
    available: true,
  },
  {
    id: 508,
    restaurantId: "gad-gateway",
    name: "Espresso Martini",
    description: "Perfect blend of rich espresso, vodka, and coffee liqueur",
    price: 450,
    category: "drinks",
    image:
      "https://static-prod.remymartin.com/app/uploads/2025/02/remy-martin-cocktails-remy-espresso-1x1-250220-02.jpg",
    available: true,
  },
  {
    id: 509,
    restaurantId: "gad-gateway",
    name: "Caprese Salad",
    description:
      "Fresh buffalo mozzarella, vine-ripened tomatoes, and basil pesto",
    price: 520,
    category: "starters",
    image:
      "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop",
    available: true,
  },

  // dharani-fine-dining
  {
    id: 601,
    restaurantId: "dharani-fine-dining",
    name: "Paneer Tikka",
    description:
      "Cottage cheese cubes marinated in yogurt and spices, grilled in a tandoor.",
    price: 320,
    category: "starters",
    image:
      "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg",
    available: true,
  },
  {
    id: 602,
    restaurantId: "dharani-fine-dining",
    name: "Mutton Rogan Josh",
    description:
      "Aromatic lamb curry cooked in a rich gravy of yogurt and spices.",
    price: 450,
    category: "mains",
    image:
      "https://www.whiskaffair.com/wp-content/uploads/2019/02/Mutton-Rogan-Josh-2-3.jpg",
    available: true,
  },
  {
    id: 603,
    restaurantId: "dharani-fine-dining",
    name: "Dal Makhani",
    description:
      "Black lentils and kidney beans slow-cooked in a creamy tomato-based gravy.",
    price: 280,
    category: "mains",
    image:
      "https://www.pureindianfoods.com/cdn/shop/articles/Dal-Makhani.webp?v=1753479167",
    available: true,
  },
  {
    id: 604,
    restaurantId: "dharani-fine-dining",
    name: "Butter Chicken",
    description:
      "Tender chicken cooked in a rich and creamy tomato-cashew gravy.",
    price: 420,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 605,
    restaurantId: "dharani-fine-dining",
    name: "Vegetable Pulao",
    description:
      "Aromatic basmati rice cooked with mixed vegetables and whole spices.",
    price: 250,
    category: "mains",
    image:
      "https://www.sharmispassions.com/wp-content/uploads/2014/07/VegPulao1.jpg",
    available: true,
  },
  {
    id: 606,
    restaurantId: "dharani-fine-dining",
    name: "Blueberry Cheesecake",
    description:
      "Creamy cheesecake with a biscuit crust, topped with blueberry compote.",
    price: 280,
    category: "desserts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShmIH4Aw8JyGVHDDZ1zdWo4_WCL02QvNWcfA&s",
    available: true,
  },
  {
    id: 607,
    restaurantId: "dharani-fine-dining",
    name: "Iced Tea",
    description: "Chilled black tea sweetened and flavored with lemon.",
    price: 120,
    category: "drinks",
    image:
      "https://natashaskitchen.com/wp-content/uploads/2021/07/Iced-Tea-3-1-768x1152.jpg",
    available: true,
  },

  // minerva-coffee-shop
  {
    id: 701,
    restaurantId: "minerva-coffee-shop",
    name: "Masala Dosa",
    description:
      "Crispy rice and lentil crepe filled with spiced potato masala.",
    price: 130,
    category: "starters",
    image:
      "https://palatesdesire.com/wp-content/uploads/2022/09/Mysore-masala-dosa-recipe@palates-desire.jpg",
    available: true,
  },
  {
    id: 702,
    restaurantId: "minerva-coffee-shop",
    name: "Poori Kura",
    description: "Fluffy fried bread served with a savory potato curry.",
    price: 110,
    category: "starters",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/07/poori-masala.jpg",
    available: true,
  },
  {
    id: 703,
    restaurantId: "minerva-coffee-shop",
    name: "Filter Coffee",
    description: "Traditional South Indian drip coffee, strong and aromatic.",
    price: 50,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 704,
    restaurantId: "minerva-coffee-shop",
    name: "Rava Upma",
    description: "Savory semolina porridge cooked with vegetables and spices.",
    price: 80,
    category: "starters",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/upma-recipe.jpg",
    available: true,
  },
  {
    id: 705,
    restaurantId: "minerva-coffee-shop",
    name: "Ghee Roast Dosa",
    description: "Crispy, paper-thin dosa roasted in clarified butter (ghee).",
    price: 150,
    category: "starters",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ7BrV7T0tOkmvsG5ipmQe9SJReXPST2Hv7g&s",
    available: true,
  },
  {
    id: 706,
    restaurantId: "minerva-coffee-shop",
    name: "Cut Mirchi",
    description: "Spicy green chilies battered, fried, and cut into pieces.",
    price: 90,
    category: "starters",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9qtE7Z7q5-04apPaApKRNTuYMTJ7i1BP9aA&s",
    available: true,
  },
  {
    id: 707,
    restaurantId: "minerva-coffee-shop",
    name: "Rose Milk",
    description: "Chilled milk flavored with rose syrup.",
    price: 70,
    category: "drinks",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt_rAnk-Ju1dZODfz3YJXMHzxyr3GA5RhTvw&s",
    available: true,
  },

  // the-food-lounge
  {
    id: 801,
    restaurantId: "the-food-lounge",
    name: "Chicken Burger",
    description:
      "Grilled chicken patty in a soft bun with lettuce, tomato, and special sauce.",
    price: 250,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 802,
    restaurantId: "the-food-lounge",
    name: "Veggie Pizza",
    description:
      "Thin crust pizza topped with assorted vegetables and mozzarella cheese.",
    price: 350,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 803,
    restaurantId: "the-food-lounge",
    name: "Peri Peri Fries",
    description: "Crispy french fries tossed in spicy peri-peri seasoning.",
    price: 150,
    category: "starters",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZuPMfa8gfVQEANRAgku1F35k1FSeLMKplDw&s",
    available: true,
  },
  {
    id: 804,
    restaurantId: "the-food-lounge",
    name: "KitKat Shake",
    description: "Thick milkshake blended with KitKat chocolate bars.",
    price: 180,
    category: "drinks",
    image:
      "https://img-global.cpcdn.com/recipes/0356d515b24176dc/680x781cq80/oreo-kit-kat-shake-recipe-main-photo.jpg",
    available: true,
  },
  {
    id: 805,
    restaurantId: "the-food-lounge",
    name: "Chicken Popcorn",
    description:
      "Bite-sized pieces of chicken, battered and deep-fried until golden.",
    price: 220,
    category: "starters",
    image:
      "https://theyummydelights.com/wp-content/uploads/2025/07/popcorn-chicken-1.jpg",
    available: true,
  },
  {
    id: 806,
    restaurantId: "the-food-lounge",
    name: "Red Velvet Pastry",
    description: "Moist red velvet cake layered with cream cheese frosting.",
    price: 160,
    category: "desserts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShK9zh-xbNQwuNKNyTE6YkixOv4vUmFwZJ3A&s",
    available: true,
  },
  {
    id: 807,
    restaurantId: "the-food-lounge",
    name: "Cold Coffee",
    description: "Chilled coffee blended with milk and sugar.",
    price: 140,
    category: "drinks",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwb39dnHXFMWaZpGnWUWIvlUVgdsP40iDTUQ&s",
    available: true,
  },

  // cross-roads
  {
    id: 901,
    restaurantId: "cross-roads",
    name: "Kadai Paneer",
    description:
      "Cottage cheese cooked in a spicy gravy with bell peppers and onions.",
    price: 300,
    category: "mains",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2014/11/kadai-paneer-recipe-500x500.jpg",
    available: true,
  },
  {
    id: 902,
    restaurantId: "cross-roads",
    name: "Chicken Tikka Masala",
    description: "Grilled chicken chunks in a spiced, creamy tomato sauce.",
    price: 430,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: 903,
    restaurantId: "cross-roads",
    name: "Tandoori Roti",
    description: "Whole wheat bread cooked in a clay oven (tandoor).",
    price: 60,
    category: "starters",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsvL085SjADnnuvkRZU2pF8EPmMufyzE30Mw&s",
    available: true,
  },
  {
    id: 904,
    restaurantId: "cross-roads",
    name: "Jeera Rice",
    description: "Basmati rice flavored with cumin seeds.",
    price: 200,
    category: "mains",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/12/jeera-rice-recipe-500x500.jpg",
    available: true,
  },
  {
    id: 905,
    restaurantId: "cross-roads",
    name: "Dal Tadka",
    description: "Yellow lentils tempered with ghee, spices, and herbs.",
    price: 220,
    category: "mains",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/04/dal-tadka-recipe-500x500.jpg",
    available: true,
  },
  {
    id: 906,
    restaurantId: "cross-roads",
    name: "Gulab Jamun",
    description: "Deep-fried milk solids dumplings soaked in sugar syrup.",
    price: 120,
    category: "desserts",
    image:
      "https://bakewithzoha.com/wp-content/uploads/2023/04/gulab-jamun-featured.jpg",
    available: true,
  },
  {
    id: 907,
    restaurantId: "cross-roads",
    name: "Lassi",
    description: "A creamy, yogurt-based drink, served sweet or salted.",
    price: 100,
    category: "drinks",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZVOz2BkNNLe-ac2FRFJ-6g4sTdXk7y2JZBA&s",
    available: true,
  },

  // blue-fox
  {
    id: 1001,
    restaurantId: "blue-fox",
    name: "Chilli Chicken Dry",
    description:
      "Spicy, stir-fried chicken pieces with bell peppers and onions.",
    price: 350,
    category: "starters",
    image:
      "https://theyummydelights.com/wp-content/uploads/2022/07/chilli-chicken-dry.jpg",
    available: true,
  },
  {
    id: 1002,
    restaurantId: "blue-fox",
    name: "Veg Manchurian Gravy",
    description: "Vegetable fritters in a savory and tangy Indo-Chinese gravy.",
    price: 280,
    category: "mains",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-pmEvusI1aGv-vAbJFcqHXHK7buz3hkxP9A&s",
    available: true,
  },
  {
    id: 1003,
    restaurantId: "blue-fox",
    name: "Egg Fried Rice",
    description:
      "Stir-fried rice with scrambled eggs, vegetables, and soy sauce.",
    price: 250,
    category: "mains",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/egg-fried-rice-recipe.jpg",
    available: true,
  },
  {
    id: 1004,
    restaurantId: "blue-fox",
    name: "Hakka Noodles",
    description: "Stir-fried noodles with a variety of vegetables and sauces.",
    price: 230,
    category: "mains",
    image:
      "https://www.cubesnjuliennes.com/wp-content/uploads/2020/06/Chicken-Hakka-Noodles-Recipe-1.jpg",
    available: true,
  },
  {
    id: 1005,
    restaurantId: "blue-fox",
    name: "Spring Rolls",
    description: "Crispy fried rolls filled with a savory mix of vegetables.",
    price: 200,
    category: "starters",
    image: "https://www.recipetineats.com/tachyon/2017/09/Spring-Rolls-6.jpg",
    available: true,
  },
  {
    id: 1006,
    restaurantId: "blue-fox",
    name: "Honey Chilli Potato",
    description:
      "Crispy fried potato strips tossed in a sweet and spicy sauce.",
    price: 220,
    category: "starters",
    image:
      "https://rakskitchen.net/wp-content/uploads/2022/07/honey-chilli.jpg",
    available: true,
  },
  {
    id: 1007,
    restaurantId: "blue-fox",
    name: "Lemonade",
    description: "Freshly squeezed lemon juice with water and sugar.",
    price: 90,
    category: "drinks",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdavlQdjsItHMHiGVu0EghSABBadnytJzvUg&s",
    available: true,
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDietaryTags, setActiveDietaryTags] = useState<string[]>([]);
  const [priceSort, setPriceSort] = useState<"none" | "low-high" | "high-low">(
    "none",
  );
  const [isLoading, setIsLoading] = useState(true);

  const {
    items: cart,
    addItem,
    updateQuantity: updateCartQuantity,
    getItemCount,
    getTotal,
  } = useCartStore();
  const { restaurants, selectedRestaurant, selectRestaurant } =
    useRestaurantStore();
  const { toggleCart } = useUIStore();
  const { toast } = useToast(); // Initialize useToast

  // Pre-built Set for O(1) veg lookup (much faster than Array.includes on every filter)
  const VEG_SET = useMemo(
    () =>
      new Set([
        2, 4, 5, 6, 8, 9, 10, 13, 14, 15, 101, 111, 112, 113, 114, 116, 107,
        108, 106, 119, 120, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210,
        301, 302, 303, 304, 306, 401, 404, 406, 503, 504, 507, 508, 509, 601,
        603, 605, 606, 607, 701, 702, 703, 704, 705, 706, 707, 802, 803, 804,
        806, 807, 901, 903, 904, 905, 906, 907, 1002, 1004, 1005, 1006, 1007,
      ]),
    [],
  );

  // Mock dietary data for demo — memoised so it's computed once
  const getDiet = useCallback(
    (id: number) => {
      return VEG_SET.has(id) ? "veg" : "non-veg";
    },
    [VEG_SET],
  );

  // Smart Dietary Tags Mock — memoised per call via useCallback
  const getDietaryTags = useCallback(
    (id: number): string[] => {
      const tags: string[] = [];
      if ([4, 9, 14, 15, 202, 206, 207, 209, 803, 1007].includes(id))
        tags.push("Vegan");
      if ([2, 4, 14, 106, 119, 120, 304, 605, 904, 1003].includes(id))
        tags.push("Jain");
      if ([4, 8, 11, 102, 103, 104, 117, 305, 403, 502].includes(id))
        tags.push("Gluten-Free");
      if ([112, 108, 116, 204, 406, 507, 606, 804].includes(id))
        tags.push("Contains Nuts");
      else tags.push("Nut-Free");

      if (getDiet(id) === "non-veg" && ![301, 604, 1002].includes(id))
        tags.push("Dairy-Free");
      if (tags.includes("Vegan") && !tags.includes("Dairy-Free"))
        tags.push("Dairy-Free");

      return tags;
    },
    [getDiet],
  );

  const DIETARY_OPTIONS = [
    "Vegan",
    "Jain",
    "Gluten-Free",
    "Nut-Free",
    "Dairy-Free",
  ];

  // Simulate loading (in real app, this would be an API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedRestaurant]);

  // filteredItems is now memoised – only recomputes when filters change
  const filteredItems = useMemo(
    () =>
      menuItems
        .filter((item) => {
          const matchesRestaurant =
            !selectedRestaurant || item.restaurantId === selectedRestaurant.id;
          const matchesSearch = item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          let matchesCategory = true;
          if (activeCategory === "veg") {
            matchesCategory = getDiet(item.id) === "veg";
          } else if (activeCategory === "non-veg") {
            matchesCategory = getDiet(item.id) === "non-veg";
          } else if (activeCategory === "drinks") {
            matchesCategory = item.category === "drinks";
          }

          const itemTags = getDietaryTags(item.id);
          const matchesDietaryTags = activeDietaryTags.every((tag) =>
            itemTags.includes(tag),
          );

          return (
            matchesRestaurant &&
            matchesCategory &&
            matchesSearch &&
            matchesDietaryTags
          );
        })
        .sort((a, b) => {
          if (priceSort === "low-high") return a.price - b.price;
          if (priceSort === "high-low") return b.price - a.price;
          return 0;
        }),
    [
      selectedRestaurant,
      searchQuery,
      activeCategory,
      activeDietaryTags,
      priceSort,
      getDiet,
      getDietaryTags,
    ],
  );

  const addToCart = (item: (typeof menuItems)[0]) => {
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

  if (!selectedRestaurant) {
    return (
      <div className="container py-12 lg:py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Step 1: Choose Your Restaurant
          </div>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Select a Restaurant to{" "}
            <span className="text-primary italic">View Menu</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Each restaurant in Vijayawada offers a unique authentic experience.
            Select one below to start your order.
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-7xl mx-auto"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <RestaurantCard
                  restaurant={restaurant}
                  onClick={() => {
                    selectRestaurant(restaurant.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 p-8 rounded-3xl bg-secondary/5 border border-secondary/10 text-center max-w-3xl"
        >
          <h3 className="font-heading text-xl font-bold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            How it works
          </h3>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center font-bold text-primary mx-auto mb-3">
                1
              </div>
              <p className="text-sm font-bold">Pick Restaurant</p>
              <p className="text-xs text-muted-foreground">
                Select from iconic local spots
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center font-bold text-primary mx-auto mb-3">
                2
              </div>
              <p className="text-sm font-bold">Select Items</p>
              <p className="text-xs text-muted-foreground">
                Choose your favorite dishes
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center font-bold text-primary mx-auto mb-3">
                3
              </div>
              <p className="text-sm font-bold">Order Table</p>
              <p className="text-xs text-muted-foreground">
                Your food will be ready!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-6 lg:py-10">
      {/* Restaurant Header */}
      {selectedRestaurant && (
        <div className="bg-gradient-to-br from-primary/10 via-background to-background rounded-3xl p-5 md:p-8 mb-8 border border-primary/20 shadow-sm mt-4 md:mt-0">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover shadow-lg border-2 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-white shadow-soft p-2 rounded-xl flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">
                  {selectedRestaurant.rating}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="font-heading text-2xl md:text-3xl font-bold">
                  {selectedRestaurant.name}
                </h2>
                <span className="hidden md:inline text-muted-foreground/30">
                  •
                </span>
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <MapPin className="h-3 w-3" />
                  {selectedRestaurant.cuisine}
                </div>
              </div>

              <p className="text-muted-foreground text-sm md:text-base mb-4 max-w-xl">
                {selectedRestaurant.description}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-bold text-foreground">
                    {selectedRestaurant.reviewCount}
                  </span>
                  Reviews
                </div>
                <div className="h-1 w-1 rounded-full bg-border" />
                <div className="text-primary font-bold">
                  {selectedRestaurant.priceRange}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-bold px-6 h-11"
              onClick={() => selectRestaurant("")}
            >
              Switch Restaurant
            </Button>
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
            onChange={(e) =>
              setPriceSort(e.target.value as "none" | "low-high" | "high-low")
            }
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

        return (
          isPeak && (
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
          )
        );
      })()}

      {/* Search & Category Nav */}
      <div className="sticky top-20 md:top-24 z-20 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-0 lg:px-0 lg:mb-8 transition-all">
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
              {menuItems.map((item) => (
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
              { id: "drinks", label: "Drinks" },
            ].map((tab) => {
              // Calculate counts
              const count = menuItems.filter((item) => {
                if (tab.id === "all") return true;
                if (tab.id === "drinks") return item.category === "drinks";
                if (tab.id === "veg") return getDiet(item.id) === "veg";
                if (tab.id === "non-veg") return getDiet(item.id) === "non-veg";
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
                      : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground",
                  )}
                  aria-label={`Filter by ${tab.label}`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full",
                      activeCategory === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Dietary Filters row */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:pb-0 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">
            Dietary:
          </span>
          {DIETARY_OPTIONS.map((tag) => {
            const isActive = activeDietaryTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => {
                  setActiveDietaryTags((prev) =>
                    isActive ? prev.filter((t) => t !== tag) : [...prev, tag],
                  );
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border flex items-center gap-1 shrink-0",
                  isActive
                    ? "bg-secondary text-secondary-foreground border-secondary shadow-sm"
                    : "bg-background text-muted-foreground border-border/60 hover:border-secondary/50 hover:text-foreground",
                )}
                aria-pressed={isActive}
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    isActive ? "bg-white" : "bg-muted-foreground/30",
                  )}
                />
                {tag}
              </button>
            );
          })}
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
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {filteredItems.map((item) => {
                const isVeg = getDiet(item.id) === "veg";

                return (
                  <MenuItemCard
                    key={item.id}
                    imageUrl={item.image}
                    isVegetarian={isVeg}
                    name={item.name}
                    price={item.price}
                    // Mocking extended data for now
                    originalPrice={Math.round(item.price * 1.5)}
                    quantity={
                      item.category === "drinks" ? "450 ml" : "Serves 1"
                    }
                    prepTimeInMinutes={item.category === "starters" ? 10 : 20}
                    dietaryTags={getDietaryTags(item.id)}
                    chefStory={
                      item.id === 4
                        ? {
                            title: "The Legend of Babai Idli",
                            text: "Founded in 1942, this recipe has been passed down for generations. The true secret isn't just the fermented batter, but the pure white ghee and spicy Guntur 'Karampodi' sprinkled generously on top, creating a symphony of flavors that define Vijayawada mornings.",
                          }
                        : item.id === 102
                          ? {
                              title: "The Earthy Ulavacharu",
                              text: "Ulavacharu (Horse Gram Soup) requires over 12 hours of slow reduction. The biryani absorbs this deep, earthy essence, paired with thick cream and robust spices, creating our most polarizing but fiercely loyal dish.",
                            }
                          : undefined
                    }
                    onAdd={() =>
                      addToCart({
                        ...item,
                        restaurantId: selectedRestaurant?.id,
                      })
                    }
                    className={cn(
                      !item.available &&
                        "opacity-60 saturate-50 pointer-events-none",
                    )}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </ErrorBoundary>
    </div>
  );
}
