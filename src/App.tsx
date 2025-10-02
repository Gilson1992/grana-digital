import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuickAdd from "./pages/QuickAdd";
import Transactions from "./pages/Transactions";
import Purchases from "./pages/Purchases";
import Cards from "./pages/Cards";
import Budgets from "./pages/Budgets";
import Rules from "./pages/Rules";
import Reports from "./pages/Reports";
import Accounts from "./pages/Accounts";
import Integrations from "./pages/Integrations";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="quick-add" element={<QuickAdd />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="cards" element={<Cards />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="rules" element={<Rules />} />
                <Route path="reports" element={<Reports />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
