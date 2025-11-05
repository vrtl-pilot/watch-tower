import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Migration from "./pages/Migration";
import FundEligibility from "./pages/FundEligibility";
import NotFound from "./pages/NotFound";
import Servers from "./pages/Servers";
import Requests from "./pages/Requests";
import MigrationDecoder from "./pages/MigrationDecoder";
import JsonFormatter from "./pages/JsonFormatter";
import Settings from "./pages/Settings";
import Redis from "./pages/Redis";
import ClearInvalidRequests from "./pages/ClearInvalidRequests";
import AnalyticsPerformance from "./pages/AnalyticsPerformance";
import AnalyticsUsers from "./pages/AnalyticsUsers";
import { useMigrationStore } from "./hooks/use-migration-store";

const queryClient = new QueryClient();

const App = () => {
  const { initializeConnection } = useMigrationStore();

  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/migration" element={<Migration />} />
              <Route path="/migration-decoder" element={<MigrationDecoder />} />
              <Route path="/stat-json" element={<JsonFormatter />} />
              <Route path="/fund-eligibility" element={<FundEligibility />} />
              <Route path="/servers" element={<Servers />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/redis" element={<Redis />} />
              <Route path="/clear-invalid-requests" element={<ClearInvalidRequests />} />
              <Route path="/analytics/performance" element={<AnalyticsPerformance />} />
              <Route path="/analytics/users" element={<AnalyticsUsers />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;