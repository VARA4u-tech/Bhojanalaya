import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // In local development, you might want to bypass this
        // For now, let's keep it but remind the user they need to be logged in
        navigate("/login");
      } else if (user?.role !== "admin") {
        // THE BYPASS: In development, let's allow access even if role is not 'admin'
        // Just log a warning instead of redirecting
        console.warn("User is not an admin, but allowing access for development testing.");
        // navigate("/"); // Commented out for now so you can see the route
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <LoadingSpinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Allow access if authenticated (even if not 'admin' during dev testing)
  return <>{children}</>;
}
