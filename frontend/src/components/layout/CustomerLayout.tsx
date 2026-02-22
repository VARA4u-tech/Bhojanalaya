import { useLocation, useOutlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { CartSheet } from "@/components/cart/CartSheet";
import { Footer } from "./Footer";

export function CustomerLayout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      {/* Adjusted padding for responsive nav heights */}
      <main className="flex-1 pt-[4.5rem] sm:pt-24 pb-24 sm:pb-28 lg:pt-28 lg:pb-0">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname} className="h-full">
            {currentOutlet}
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <CartSheet />
      <BottomNav />
    </div>
  );
}
