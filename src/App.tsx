import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import BookingPage from "./pages/BookingPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminMenuPage from "./pages/admin/AdminMenuPage";
import AdminTablesPage from "./pages/admin/AdminTablesPage";
import NotFound from "./pages/NotFound";
import { AdminGuard } from "./components/admin/AdminGuard";
import MenuItemDemo from "./pages/demo/MenuItemDemo";

import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { PageTransition } from "./components/layout/PageTransition";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
          <Route path="/booking" element={<PageTransition><BookingPage /></PageTransition>} />
          <Route path="/orders" element={<PageTransition><OrderStatusPage /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
          <Route path="/demo/menu-item" element={<PageTransition><MenuItemDemo /></PageTransition>} />
        </Route>

        {/* Admin Routes */}
        {/* Note: AdminGuard already wraps the component, so PageTransition is inside it. */}
        <Route path="/admin" element={<AdminGuard><PageTransition><AdminDashboard /></PageTransition></AdminGuard>} />
        <Route path="/admin/orders" element={<AdminGuard><PageTransition><AdminOrdersPage /></PageTransition></AdminGuard>} />
        <Route path="/admin/menu" element={<AdminGuard><PageTransition><AdminMenuPage /></PageTransition></AdminGuard>} />
        <Route path="/admin/tables" element={<AdminGuard><PageTransition><AdminTablesPage /></PageTransition></AdminGuard>} />

        {/* Catch-all */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary fallback={<ErrorFallback fullPage />}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

