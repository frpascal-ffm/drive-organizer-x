import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import { de } from "date-fns/locale";
import type { Zeitraum } from "@/lib/calculations";
import type { DateRange } from "react-day-picker";

type Preset = "woche" | "monat" | "quartal" | "custom";

const PRESET_LABELS: Record<Preset, string> = {
  woche: "Woche",
  monat: "Monat",
  quartal: "Quartal",
  custom: "Benutzerdefiniert",
};

interface ZeitraumFilterProps {
  value: Zeitraum | undefined;
  onChange: (z: Zeitraum | undefined) => void;
  className?: string;
}

function getPresetRange(preset: Preset): Zeitraum | undefined {
  const now = new Date();
  switch (preset) {
    case "woche":
      return { von: format(startOfWeek(now, { locale: de }), "yyyy-MM-dd"), bis: format(endOfWeek(now, { locale: de }), "yyyy-MM-dd") };
    case "monat":
      return { von: format(startOfMonth(now), "yyyy-MM-dd"), bis: format(endOfMonth(now), "yyyy-MM-dd") };
    case "quartal":
      return { von: format(startOfQuarter(now), "yyyy-MM-dd"), bis: format(endOfQuarter(now), "yyyy-MM-dd") };
    default:
      return undefined;
  }
}

export function ZeitraumFilter({ value, onChange, className }: ZeitraumFilterProps) {
  const [activePreset, setActivePreset] = useState<Preset>("monat");
  const [customOpen, setCustomOpen] = useState(false);

  const dateRange: DateRange | undefined = value
    ? { from: new Date(value.von), to: new Date(value.bis) }
    : undefined;

  const handlePreset = (preset: Preset) => {
    setActivePreset(preset);
    if (preset === "custom") {
      setCustomOpen(true);
    } else {
      onChange(getPresetRange(preset));
    }
  };

  const handleCustomRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onChange({ von: format(range.from, "yyyy-MM-dd"), bis: format(range.to, "yyyy-MM-dd") });
    } else if (range?.from) {
      onChange({ von: format(range.from, "yyyy-MM-dd"), bis: format(range.from, "yyyy-MM-dd") });
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setActivePreset("monat");
  };

  const label = useMemo(() => {
    if (!value) return "Alle Zeiträume";
    const von = new Date(value.von);
    const bis = new Date(value.bis);
    return `${format(von, "dd.MM.yy", { locale: de })} – ${format(bis, "dd.MM.yy", { locale: de })}`;
  }, [value]);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-0.5 bg-muted/50 p-0.5 rounded-lg">
        {(["woche", "monat", "quartal"] as Preset[]).map(preset => (
          <button
            key={preset}
            onClick={() => handlePreset(preset)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              activePreset === preset && value
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {PRESET_LABELS[preset]}
          </button>
        ))}
        <Popover open={customOpen} onOpenChange={setCustomOpen}>
          <PopoverTrigger asChild>
            <button
              onClick={() => handlePreset("custom")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1",
                activePreset === "custom" && value
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              Zeitraum
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleCustomRange}
              numberOfMonths={2}
              locale={de}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      {value && (
        <div className="flex items-center gap-1.5 ml-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <button onClick={handleClear} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
