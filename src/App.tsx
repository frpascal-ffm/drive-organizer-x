import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import FahrtenListe from "./pages/fahrten/FahrtenListe";
import FahrtNeu from "./pages/fahrten/FahrtNeu";
import FahrtDetail from "./pages/fahrten/FahrtDetail";
import UmsaetzeIndex from "./pages/umsaetze/UmsaetzeIndex";
import PlattformImport from "./pages/umsaetze/PlattformImport";
import FahrzeugeListe from "./pages/fahrzeuge/FahrzeugeListe";
import FahrzeugDetail from "./pages/fahrzeuge/FahrzeugDetail";
import FahrzeugNeu from "./pages/fahrzeuge/FahrzeugNeu";
import FahrerListe from "./pages/fahrer/FahrerListe";
import FahrerDetail from "./pages/fahrer/FahrerDetail";
import FahrerNeu from "./pages/fahrer/FahrerNeu";
import KostenListe from "./pages/kosten/KostenListe";
import KostenNeu from "./pages/kosten/KostenNeu";
import AbrechnungenIndex from "./pages/abrechnungen/AbrechnungenIndex";
import StatistikIndex from "./pages/statistik/StatistikIndex";
import EinstellungenIndex from "./pages/einstellungen/EinstellungenIndex";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/fahrten" element={<FahrtenListe />} />
              <Route path="/fahrten/neu" element={<FahrtNeu />} />
              <Route path="/fahrten/:id" element={<FahrtDetail />} />
              <Route path="/umsaetze" element={<UmsaetzeIndex />} />
              <Route path="/fahrzeuge" element={<FahrzeugeListe />} />
              <Route path="/fahrzeuge/neu" element={<FahrzeugNeu />} />
              <Route path="/fahrzeuge/:id" element={<FahrzeugDetail />} />
              <Route path="/fahrer" element={<FahrerListe />} />
              <Route path="/fahrer/neu" element={<FahrerNeu />} />
              <Route path="/fahrer/:id" element={<FahrerDetail />} />
              <Route path="/kosten" element={<KostenListe />} />
              <Route path="/kosten/neu" element={<KostenNeu />} />
              <Route path="/abrechnungen" element={<AbrechnungenIndex />} />
              <Route path="/statistik" element={<StatistikIndex />} />
              <Route path="/einstellungen" element={<EinstellungenIndex />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
