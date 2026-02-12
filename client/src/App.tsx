import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ClientWelcome from "./pages/ClientWelcome";
import ClientDashboard from "./pages/ClientDashboard";
import ClientProjects from "./pages/ClientProjects";
import ClientConversation from "./pages/ClientConversation";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import ConsultantPipeline from "./pages/ConsultantPipeline";
import ConsultantAnalytics from "./pages/ConsultantAnalytics";
import ConsultantProjectDetail from "./pages/ConsultantProjectDetail";
import ConsultantTemplates from "./pages/ConsultantTemplates";
import ConsultantTemplateEditor from "./pages/ConsultantTemplateEditor";
import AdminNotifications from "./pages/AdminNotifications";
import ClientOnboarding from "./pages/ClientOnboarding";
import VerifyEmail from "./pages/VerifyEmail";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { OnboardingGuard } from "./components/OnboardingGuard";
import { EmailVerificationGuard } from "./components/EmailVerificationGuard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ClientWelcome} />
      
      {/* Email Verification (Public) */}
      <Route path="/verify-email/:token" component={VerifyEmail} />
      
      {/* Client Routes */}
      <Route path="/client/dashboard">
        <ProtectedRoute requiredRole="client" redirectTo="/">
          <ClientDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/client/onboarding">
        <ProtectedRoute requiredRole="client" redirectTo="/">
          <ClientOnboarding />
        </ProtectedRoute>
      </Route>
      <Route path="/client/projects">
        <ProtectedRoute requiredRole="client" redirectTo="/">
          <ClientProjects />
        </ProtectedRoute>
      </Route>
      <Route path="/client/conversation/:id">
        <ProtectedRoute requiredRole="client" redirectTo="/">
          <ClientConversation />
        </ProtectedRoute>
      </Route>
      
      {/* Consultant Routes */}
      <Route path="/consultant/dashboard">
        <ProtectedRoute requiredRole="consultant" redirectTo="/">
          <ConsultantDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/consultant/pipeline">
        <ProtectedRoute requiredRole="consultant" redirectTo="/">
          <ConsultantPipeline />
        </ProtectedRoute>
      </Route>
      <Route path="/consultant/analytics">
        <ProtectedRoute requiredRole="consultant" redirectTo="/">
          <ConsultantAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/consultant/project/:id">
        <ProtectedRoute requiredRole="consultant" redirectTo="/">
          <ConsultantProjectDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/consultant/templates">
        <ProtectedRoute requiredRole="consultant" redirectTo="/">
          <ConsultantTemplates />
        </ProtectedRoute>
      </Route>
      <Route path="/consultant/templates/new">
        <ProtectedRoute requiredRole="consultant" redirectTo="/">
          <ConsultantTemplateEditor />
        </ProtectedRoute>
      </Route>
      <Route path="/consultant/templates/edit/:id">
        <ProtectedRoute requiredRole="consultant" redirectTo="/">
          <ConsultantTemplateEditor />
        </ProtectedRoute>
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/notifications">
        <ProtectedRoute requiredRole="admin" redirectTo="/">
          <AdminNotifications />
        </ProtectedRoute>
      </Route>
      
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <EmailVerificationGuard>
            <OnboardingGuard>
              <Router />
            </OnboardingGuard>
          </EmailVerificationGuard>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
