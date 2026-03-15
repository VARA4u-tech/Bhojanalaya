import { useLocation, useOutlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { CartSheet } from "@/components/cart/CartSheet";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";

export function CustomerLayout() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { isAuthenticated } = useUserStore();
  
  const isPosterPage = 
    location.pathname === "/checkout" || 
    location.pathname === "/login" || 
    location.pathname === "/signup" ||
    (location.pathname === "/dashboard" && !isAuthenticated);

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", isPosterPage && "h-screen overflow-hidden")}>
      {!isPosterPage && <TopNav />}
      {/* Adjusted padding for responsive nav heights */}
      <main className={cn("flex-1", isPosterPage ? "relative" : "pt-[4.5rem] sm:pt-24 md:pt-28 pb-24 sm:pb-28 md:pb-0")}>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname} className="h-full">
            {currentOutlet}
          </PageTransition>
        </AnimatePresence>
      </main>
      {!isPosterPage && <Footer />}
      <CartSheet />
      {!isPosterPage && <BottomNav />}
    </div>
  );
}
