import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ClientWelcome from "./pages/ClientWelcome";
import ClientProjects from "./pages/ClientProjects";
import ClientConversation from "./pages/ClientConversation";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import ConsultantPipeline from "./pages/ConsultantPipeline";
import ConsultantAnalytics from "./pages/ConsultantAnalytics";
import { ProtectedRoute } from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ClientWelcome} />
      
      {/* Client Routes */}
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
