import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed, Menu, X, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRestaurantStore } from "@/store";
import { useUIStore } from "@/store/uiStore";
import { RestaurantSelector } from "@/components/restaurant/RestaurantSelector";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/booking", label: "Book Table" },
  { href: "/orders", label: "My Orders" },
];

export function TopNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [restaurantSelectorOpen, setRestaurantSelectorOpen] = useState(false);
  const { selectedRestaurant } = useRestaurantStore();
  const { toggleCart } = useUIStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <UtensilsCrossed className="h-6 w-6" />
          <span>Bhojanālaya</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Restaurant Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRestaurantSelectorOpen(true)}
            className="gap-2"
          >
            <Store className="h-4 w-4" />
            <span className="text-sm font-medium">{selectedRestaurant?.name || 'Select Restaurant'}</span>
          </Button>

          <Link to="/admin">
            <Button variant="ghost" size="sm">
              Admin
            </Button>
          </Link>
          <Link to="/booking">
            <Button variant="secondary" size="sm">
              Book Now
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={toggleCart}>
            Cart
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-soft-lg animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full mt-2">
                Admin Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      )}

      {/* Restaurant Selector Modal */}
      <RestaurantSelector
        open={restaurantSelectorOpen}
        onOpenChange={setRestaurantSelectorOpen}
      />
    </header>
  );
}
