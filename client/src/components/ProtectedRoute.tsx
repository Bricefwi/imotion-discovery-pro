import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "client" | "consultant" | "admin";
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = "/"
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    // Not authenticated -> redirect to login
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    // Check role requirement
    if (requiredRole && user) {
      // Consultant and admin can access consultant routes
      if (requiredRole === "consultant") {
        if (user.role !== "consultant" && user.role !== "admin") {
          setLocation(redirectTo);
        }
      } 
      // Client can only access client routes
      else if (requiredRole === "client") {
        if (user.role !== "client") {
          setLocation(redirectTo);
        }
      }
      // Admin only
      else if (requiredRole === "admin") {
        if (user.role !== "admin") {
          setLocation(redirectTo);
        }
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, redirectTo, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="spinner-imotion"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check role before rendering
  if (requiredRole && user) {
    if (requiredRole === "consultant" && user.role !== "consultant" && user.role !== "admin") {
      return null;
    }
    if (requiredRole === "client" && user.role !== "client") {
      return null;
    }
    if (requiredRole === "admin" && user.role !== "admin") {
      return null;
    }
  }

  return <>{children}</>;
}
