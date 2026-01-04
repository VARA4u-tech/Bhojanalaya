import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed, Store, ShoppingCart, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRestaurantStore } from "@/store";
import { useUIStore } from "@/store/uiStore";
import { RestaurantSelector } from "@/components/restaurant/RestaurantSelector";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/booking", label: "Table" },
  { href: "/orders", label: "Orders" },
];

export function TopNav() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [restaurantSelectorOpen, setRestaurantSelectorOpen] = useState(false);
  const { selectedRestaurant } = useRestaurantStore();
  const { toggleCart } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4",
        isScrolled ? "top-2" : "top-4"
      )}
    >
      <div
        className={cn(
          "container mx-auto h-16 px-4 md:px-6 rounded-2xl flex items-center justify-between transition-all duration-300 border backdrop-blur-xl shadow-lg",
          isScrolled
            ? "bg-background/80 border-primary/20 shadow-primary/5"
            : "bg-white/70 border-white/20 shadow-black/5"
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 md:gap-2 font-heading text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <img src="/brand/logo.png" alt="Bhojanālaya Logo" className="w-full h-full object-contain" />
          </div>
          <span className="hidden xs:inline tracking-tight">Bhojanālaya</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <motion.div whileTap={{ scale: 0.95 }} key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 block",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Action Group */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Restaurant Switcher - Compact on mobile */}
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRestaurantSelectorOpen(true)}
              className="flex items-center gap-2 h-9 px-3 rounded-full hover:bg-primary/5 text-primary font-bold border border-primary/10 md:border-transparent"
            >
              <Store className="h-4 w-4" />
              <span className="text-xs md:text-sm truncate max-w-[80px] md:max-w-[150px]">
                {selectedRestaurant?.name || 'Select'}
              </span>
            </Button>
          </motion.div>

          <div className="h-4 w-[1px] bg-border mx-1 hidden xs:block" />

          <div className="flex items-center gap-1">
            <Link to="/profile" className="hidden md:block">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative group">
                <User className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="h-9 w-9 rounded-full relative group bg-primary/5 hover:bg-primary/10"
              >
                <ShoppingCart className="h-5 w-5 text-primary" />
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center animate-pulse shadow-sm">
                  !
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Restaurant Selector Modal */}
      <RestaurantSelector
        open={restaurantSelectorOpen}
        onOpenChange={setRestaurantSelectorOpen}
      />
    </header>
  );
}
