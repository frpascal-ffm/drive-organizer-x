import { cn } from "@/lib/utils";

const variants: Record<string, { label: string; className: string }> = {
  geplant: { label: "Geplant", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  erledigt: { label: "Erledigt", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  storniert: { label: "Storniert", className: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300" },
  aktiv: { label: "Aktiv", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  inaktiv: { label: "Inaktiv", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  werkstatt: { label: "Werkstatt", className: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
};

export function StatusBadge({ status }: { status: string }) {
  const v = variants[status] || { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold", v.className)}>
      {v.label}
    </span>
  );
}
