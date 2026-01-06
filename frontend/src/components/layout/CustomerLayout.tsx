import { useLocation, useOutlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { CartSheet } from "@/components/cart/CartSheet";

export function CustomerLayout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      {/* Increased top padding for floating top nav and bottom padding for floating bottom nav */}
      <main className="flex-1 pt-24 pb-32 lg:pt-28 lg:pb-0">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname} className="h-full">
            {currentOutlet}
          </PageTransition>
        </AnimatePresence>
      </main>
      <CartSheet />
      <BottomNav />
    </div>
  );
}
