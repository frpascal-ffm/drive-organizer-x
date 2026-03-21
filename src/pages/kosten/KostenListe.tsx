import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { kosten, fahrzeuge, getFahrzeug, formatCurrency, formatDate } from "@/data/mockData";
import { Plus, CalendarIcon, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DisplayRow {
  id: string;
  datum: string;
  label: string;
  typ: "fix" | "variabel";
  fahrzeugId: string;
  betrag: number;
  notiz?: string;
}

export default function KostenListe() {
  const [fzFilter, setFzFilter] = useState("alle");
  const [typFilter, setTypFilter] = useState("alle");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const dateFrom = dateRange?.from;
  const dateTo = dateRange?.to;
  const hasDateFilter = dateFrom || dateTo;
  const clearDates = () => setDateRange(undefined);

  const rows = useMemo(() => {
    // Group monthly fix costs by (yearMonth + fahrzeugId), keep variable costs as-is
    const fixByGroup = new Map<string, { ids: string[]; betrag: number; fahrzeugId: string; datum: string }>();
    const result: DisplayRow[] = [];

    for (const k of kosten) {
      if (k.typ === "fix" && k.intervall === "monatlich") {
        const ym = k.datum.slice(0, 7); // "2026-03"
        const key = `${ym}_${k.fahrzeugId}`;
        const existing = fixByGroup.get(key);
        if (existing) {
          existing.betrag += k.betrag;
          existing.ids.push(k.id);
        } else {
          fixByGroup.set(key, { ids: [k.id], betrag: k.betrag, fahrzeugId: k.fahrzeugId, datum: k.datum });
        }
      } else {
        result.push({
          id: k.id,
          datum: k.datum,
          label: k.kategorie,
          typ: k.typ,
          fahrzeugId: k.fahrzeugId,
          betrag: k.betrag,
          notiz: k.notiz,
        });
      }
    }

    // Add grouped fix cost rows
    for (const [key, group] of fixByGroup) {
      const fz = getFahrzeug(group.fahrzeugId);
      result.push({
        id: `fix_${key}`,
        datum: group.datum,
        label: `Fixkosten ${fz?.kennzeichen || ""}`.trim(),
        typ: "fix",
        fahrzeugId: group.fahrzeugId,
        betrag: group.betrag,
      });
    }

    return result;
  }, []);

  const filtered = useMemo(() => {
    let r = [...rows];
    if (fzFilter !== "alle") r = r.filter(k => k.fahrzeugId === fzFilter);
    if (typFilter !== "alle") r = r.filter(k => k.typ === typFilter);
    if (dateFrom) {
      const fromStr = format(dateFrom, "yyyy-MM-dd");
      r = r.filter(k => k.datum >= fromStr);
    }
    if (dateTo) {
      const toStr = format(dateTo, "yyyy-MM-dd");
      r = r.filter(k => k.datum <= toStr);
    }
    return r.sort((a, b) => b.datum.localeCompare(a.datum));
  }, [rows, fzFilter, typFilter, dateFrom, dateTo]);

  const summe = filtered.reduce((s, k) => s + k.betrag, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kosten" description={`${filtered.length} Einträge · Summe: ${formatCurrency(summe)}`}
        action={<Button asChild><Link to="/kosten/neu"><Plus className="h-4 w-4 mr-1.5" />Kosten erfassen</Link></Button>} />

      <div className="flex flex-wrap gap-3 items-center">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-9 text-sm gap-1.5 font-normal min-w-[220px] justify-start", !hasDateFilter && "text-muted-foreground")}>
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              {dateFrom && dateTo
                ? `${format(dateFrom, "dd.MM.yy", { locale: de })} – ${format(dateTo, "dd.MM.yy", { locale: de })}`
                : dateFrom
                  ? `Ab ${format(dateFrom, "dd.MM.yy", { locale: de })}`
                  : dateTo
                    ? `Bis ${format(dateTo, "dd.MM.yy", { locale: de })}`
                    : "Zeitraum wählen"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              locale={de}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
            {hasDateFilter && (
              <div className="border-t px-3 py-2 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={clearDates}>
                  <X className="h-3 w-3 mr-1" /> Zurücksetzen
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Select value={fzFilter} onValueChange={setFzFilter}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue placeholder="Fahrzeug" /></SelectTrigger>
          <SelectContent><SelectItem value="alle">Alle Fahrzeuge</SelectItem>
            {fahrzeuge.map(f => <SelectItem key={f.id} value={f.id}>{f.kennzeichen}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typFilter} onValueChange={setTypFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Typ" /></SelectTrigger>
          <SelectContent><SelectItem value="alle">Alle Typen</SelectItem>
            <SelectItem value="fix">Fixkosten</SelectItem><SelectItem value="variabel">Variable Kosten</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Datum</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Bezeichnung</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Typ</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Betrag</th>
          </tr></thead>
          <tbody>
            {filtered.map(k => {
              const fz = getFahrzeug(k.fahrzeugId);
              return (
                <tr key={k.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{formatDate(k.datum)}</td>
                  <td className="px-4 py-3 text-sm">{k.label}</td>
                  <td className="px-4 py-3 text-sm capitalize">{k.typ === "fix" ? "Fixkosten" : "Variabel"}</td>
                  <td className="px-4 py-3 text-xs font-mono">{fz?.kennzeichen || "–"}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(k.betrag)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Keine Kosten gefunden.</div>}
      </div>
    </div>
  );
}
