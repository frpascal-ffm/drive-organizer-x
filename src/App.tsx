import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { AppProvider } from "@/context/AppContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import FahrtenListe from "./pages/fahrten/FahrtenListe";
import FahrtNeu from "./pages/fahrten/FahrtNeu";
import FahrtDetail from "./pages/fahrten/FahrtDetail";
import FahrtBearbeiten from "./pages/fahrten/FahrtBearbeiten";
import UmsaetzeIndex from "./pages/umsaetze/UmsaetzeIndex";
import PlattformImport from "./pages/umsaetze/PlattformImport";
import UmsatzFahrtDetail from "./pages/umsaetze/UmsatzFahrtDetail";
import PlattformUmsatzDetail from "./pages/umsaetze/PlattformUmsatzDetail";
import FahrzeugeListe from "./pages/fahrzeuge/FahrzeugeListe";
import FahrzeugDetail from "./pages/fahrzeuge/FahrzeugDetail";
import FahrzeugNeu from "./pages/fahrzeuge/FahrzeugNeu";
import FahrzeugBearbeiten from "./pages/fahrzeuge/FahrzeugBearbeiten";
import FahrerListe from "./pages/fahrer/FahrerListe";
import FahrerDetail from "./pages/fahrer/FahrerDetail";
import FahrerNeu from "./pages/fahrer/FahrerNeu";
import FahrerBearbeiten from "./pages/fahrer/FahrerBearbeiten";
import KostenListe from "./pages/kosten/KostenListe";
import KostenNeu from "./pages/kosten/KostenNeu";
import KostenBearbeiten from "./pages/kosten/KostenBearbeiten";
import AbrechnungenIndex from "./pages/abrechnungen/AbrechnungenIndex";
import StatistikIndex from "./pages/statistik/StatistikIndex";
import EinstellungenIndex from "./pages/einstellungen/EinstellungenIndex";
import NotFound from "./pages/NotFound";
import Impressum from "./pages/legal/Impressum";
import Datenschutz from "./pages/legal/Datenschutz";
import CookieRichtlinie from "./pages/legal/CookieRichtlinie";
import Kontakt from "./pages/legal/Kontakt";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SubscriptionProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrieren" element={<Register />} />
                <Route path="/passwort-vergessen" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/cookie-richtlinie" element={<CookieRichtlinie />} />
                <Route path="/kontakt" element={<Kontakt />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/fahrten" element={<FahrtenListe />} />
                  <Route path="/fahrten/neu" element={<FahrtNeu />} />
                  <Route path="/fahrten/:id" element={<FahrtDetail />} />
                  <Route path="/fahrten/:id/bearbeiten" element={<FahrtBearbeiten />} />
                  <Route path="/umsaetze" element={<UmsaetzeIndex />} />
                  <Route path="/umsaetze/import" element={<PlattformImport />} />
                  <Route path="/umsaetze/fahrt/:id" element={<UmsatzFahrtDetail />} />
                  <Route path="/umsaetze/plattform/:id" element={<PlattformUmsatzDetail />} />
                  <Route path="/fahrzeuge" element={<FahrzeugeListe />} />
                  <Route path="/fahrzeuge/neu" element={<FahrzeugNeu />} />
                  <Route path="/fahrzeuge/:id" element={<FahrzeugDetail />} />
                  <Route path="/fahrzeuge/:id/bearbeiten" element={<FahrzeugBearbeiten />} />
                  <Route path="/fahrer" element={<FahrerListe />} />
                  <Route path="/fahrer/neu" element={<FahrerNeu />} />
                  <Route path="/fahrer/:id" element={<FahrerDetail />} />
                  <Route path="/fahrer/:id/bearbeiten" element={<FahrerBearbeiten />} />
                  <Route path="/kosten" element={<KostenListe />} />
                  <Route path="/kosten/neu" element={<KostenNeu />} />
                  <Route path="/kosten/:id/bearbeiten" element={<KostenBearbeiten />} />
                  <Route path="/abrechnungen" element={<AbrechnungenIndex />} />
                  <Route path="/statistik" element={<StatistikIndex />} />
                  <Route path="/einstellungen" element={<EinstellungenIndex />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
