import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  icon?: LucideIcon;
}

export function KPICard({ label, value, trend, icon: Icon }: Props) {
  return (
    <div className="bg-card rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/60" />}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {trend && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium",
          trend.positive ? "text-success" : "text-destructive"
        )}>
          {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend.value}
        </div>
      )}
    </div>
  );
}
