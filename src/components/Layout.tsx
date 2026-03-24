import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Plus, ChevronLeft, ChevronRight, Menu, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { SubscriptionModal } from "./SubscriptionModal";

export function Layout() {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <AppSidebar
        collapsed={!isMobile && collapsed}
        open={isMobile ? mobileOpen : true}
        isMobile={isMobile}
        onClose={() => setMobileOpen(false)}
      />

      {/* Sidebar edge toggle (desktop only) */}
      {!isMobile && (
        <div className="relative shrink-0 w-0">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className="absolute top-4 -left-3.5 z-30 h-7 w-7 rounded-full border bg-card shadow-md"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-20">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={handleToggle} className="shrink-0">
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <span className="font-semibold text-sm hidden sm:block ml-4">MietFleet</span>
          <div className="flex-1" />
          <div className="relative w-56 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder={t("common.search")} className="pl-9 h-9 text-sm" />
          </div>
          <Button asChild size="sm">
            <Link to="/fahrten/neu"><Plus className="h-4 w-4 mr-1.5" />{t("common.newRide")}</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={async () => { await signOut(); navigate("/login"); }} title="Abmelden">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
