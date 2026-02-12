import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

/**
 * OnboardingGuard ensures that clients complete their profile before accessing other pages
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  const { data: profile, isLoading: profileLoading } = trpc.clientProfile.get.useQuery(
    undefined,
    { enabled: !!user && user.role === "client" }
  );

  useEffect(() => {
    // Only redirect clients who don't have a profile
    if (!authLoading && !profileLoading && user?.role === "client") {
      // If no profile exists and not already on onboarding page
      if (!profile && location !== "/client/onboarding") {
        setLocation("/client/onboarding");
      }
      // If profile exists and on onboarding page, redirect to projects
      if (profile && location === "/client/onboarding") {
        setLocation("/client/projects");
      }
    }
  }, [user, profile, authLoading, profileLoading, location, setLocation]);

  // Show loading state while checking
  if (authLoading || (user?.role === "client" && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
