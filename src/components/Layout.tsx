import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Plus, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Layout() {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-20">
          <Button variant="ghost" size="icon" onClick={handleToggle} className="shrink-0">
            <Menu className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm hidden sm:block">MietFleet GmbH</span>
          <div className="flex-1" />
          <div className="relative w-56 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Suchen…" className="pl-9 h-9 text-sm" />
          </div>
          <Button asChild size="sm">
            <Link to="/fahrten/neu"><Plus className="h-4 w-4 mr-1.5" />Neue Fahrt</Link>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
