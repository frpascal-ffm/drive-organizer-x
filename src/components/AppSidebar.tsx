import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Route, TrendingUp, Car, Users, Receipt, FileText, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/fahrten", icon: Route, label: "Fahrten" },
  { to: "/umsaetze", icon: TrendingUp, label: "Umsätze" },
  { to: "/fahrzeuge", icon: Car, label: "Fahrzeuge" },
  { to: "/fahrer", icon: Users, label: "Fahrer" },
  { to: "/kosten", icon: Receipt, label: "Kosten" },
  { to: "/abrechnungen", icon: FileText, label: "Abrechnungen" },
  { to: "/statistik", icon: BarChart3, label: "Statistik" },
];

interface AppSidebarProps {
  collapsed: boolean;
  open: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export function AppSidebar({ collapsed, open, isMobile, onClose }: AppSidebarProps) {
  const location = useLocation();

  if (isMobile && !open) return null;

  const handleNavClick = () => {
    if (isMobile) onClose();
  };

  return (
    <aside className={cn(
      "h-screen border-r bg-card flex flex-col transition-all duration-200 shrink-0",
      isMobile
        ? "fixed top-0 left-0 z-40 w-[260px] shadow-xl"
        : cn("sticky top-0", collapsed ? "w-[60px]" : "w-[220px]")
    )}>
      <div className={cn("h-14 flex items-center border-b px-4 gap-2", collapsed && !isMobile && "justify-center px-2")}>
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-xs">M</span>
        </div>
        {(!collapsed || isMobile) && <span className="font-bold text-base tracking-tight">MietFleet</span>}
      </div>
      <nav className="flex-1 py-2 flex flex-col gap-0.5 px-2 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"}
            onClick={handleNavClick}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && !isMobile && "justify-center px-0"
            )}>
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="py-2 px-2 border-t">
        <NavLink to="/einstellungen"
          onClick={handleNavClick}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && !isMobile && "justify-center px-0"
          )}>
          <Settings className="h-[18px] w-[18px] shrink-0" />
          {(!collapsed || isMobile) && <span>Einstellungen</span>}
        </NavLink>
      </div>
    </aside>
  );
}
