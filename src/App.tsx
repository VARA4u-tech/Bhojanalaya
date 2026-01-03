import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/orders" element={<OrderStatusPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/demo/menu-item" element={<MenuItemDemo />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
      <Route path="/admin/orders" element={<AdminGuard><AdminOrdersPage /></AdminGuard>} />
      <Route path="/admin/menu" element={<AdminGuard><AdminMenuPage /></AdminGuard>} />
      <Route path="/admin/tables" element={<AdminGuard><AdminTablesPage /></AdminGuard>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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

