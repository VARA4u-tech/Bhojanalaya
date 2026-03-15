import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import ProjectDocsPage from "./pages/ProjectDocsPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import NotFound from "./pages/NotFound";
import MenuItemDemo from "./pages/demo/MenuItemDemo";

// Admin Pages
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRestaurantList from "./pages/admin/AdminRestaurantList";
import { useUserStore } from "@/store/userStore";

import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { PageTransition } from "./components/layout/PageTransition";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const { checkSession } = useUserStore();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Check auth session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Index />
              </PageTransition>
            }
          />
          <Route
            path="/menu"
            element={
              <PageTransition>
                <MenuPage />
              </PageTransition>
            }
          />
          <Route
            path="/booking"
            element={
              <PageTransition>
                <BookingPage />
              </PageTransition>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTransition>
                <CheckoutPage />
              </PageTransition>
            }
          />
          <Route
            path="/orders"
            element={
              <PageTransition>
                <OrderStatusPage />
              </PageTransition>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <ProfilePage />
              </PageTransition>
            }
          />
          {/* Redirect legacy profile path to new dashboard */}
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageTransition>
                <PrivacyPolicyPage />
              </PageTransition>
            }
          />
          <Route
            path="/terms"
            element={
              <PageTransition>
                <TermsOfServicePage />
              </PageTransition>
            }
          />
          <Route
            path="/refund"
            element={
              <PageTransition>
                <RefundPolicyPage />
              </PageTransition>
            }
          />
          <Route
            path="/docs"
            element={
              <PageTransition>
                <ProjectDocsPage />
              </PageTransition>
            }
          />
          <Route
            path="/help"
            element={
              <PageTransition>
                <HelpCenterPage />
              </PageTransition>
            }
          />
          <Route
            path="/demo/menu-item"
            element={
              <PageTransition>
                <MenuItemDemo />
              </PageTransition>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminRestaurantList />} />
          <Route path=":restaurantId" element={<AdminOverview />} />
          <Route path=":restaurantId/orders" element={<AdminOrders />} />
          <Route path=":restaurantId/menu" element={<AdminMenu />} />
          <Route path=":restaurantId/bookings" element={<AdminBookings />} />
          <Route path=":restaurantId/customers" element={<div className="p-8 text-center text-slate-500 font-bold">Customer Management (Coming Soon)</div>} />
          <Route path=":restaurantId/settings" element={<div className="p-8 text-center text-slate-500 font-bold">Admin Settings (Coming Soon)</div>} />
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary fallback={<ErrorFallback fullPage />}>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
