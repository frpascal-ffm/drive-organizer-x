import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ZeitraumFilter } from "@/components/ZeitraumFilter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/data/mockData";
import { intervallLabels, isInZeitraum, type Zeitraum } from "@/lib/calculations";
import { Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisplayRow {
  id: string; datum: string; label: string; typ: "fix" | "variabel"; fahrzeugId: string; betrag: number; notiz?: string; intervall?: string;
}

export default function KostenListe() {
  const { kosten, fahrzeuge, getFahrzeug } = useAppContext();
  const navigate = useNavigate();
  const [fzFilter, setFzFilter] = useState<string[]>([]);
  const [fzSearch, setFzSearch] = useState("");
  const [fzDropdownOpen, setFzDropdownOpen] = useState(false);
  const [typFilter, setTypFilter] = useState("alle");
  const [zeitraum, setZeitraum] = useState<Zeitraum | undefined>(undefined);

  const rows = useMemo(() => {
    const fixByGroup = new Map<string, { ids: string[]; betrag: number; fahrzeugId: string; datum: string; items: typeof kosten }>();
    const result: DisplayRow[] = [];
    for (const k of kosten) {
      if (k.typ === "fix" && k.intervall === "monatlich") {
        const ym = k.datum.slice(0, 7);
        const key = `${ym}_${k.fahrzeugId}`;
        const existing = fixByGroup.get(key);
        if (existing) { existing.betrag += k.betrag; existing.ids.push(k.id); existing.items.push(k); }
        else fixByGroup.set(key, { ids: [k.id], betrag: k.betrag, fahrzeugId: k.fahrzeugId, datum: k.datum, items: [k] });
      } else {
        result.push({ id: k.id, datum: k.datum, label: k.kategorie, typ: k.typ, fahrzeugId: k.fahrzeugId, betrag: k.betrag, notiz: k.notiz, intervall: k.intervall });
      }
    }
    for (const [key, group] of fixByGroup) {
      const fz = getFahrzeug(group.fahrzeugId);
      result.push({ id: `fix_${key}`, datum: group.datum, label: `Fixkosten ${fz?.kennzeichen || ""}`.trim(), typ: "fix", fahrzeugId: group.fahrzeugId, betrag: group.betrag, intervall: "monatlich" });
    }
    return result;
  }, [kosten, getFahrzeug]);

  const filtered = useMemo(() => {
    let r = [...rows];
    if (fzFilter.length > 0) r = r.filter(k => fzFilter.includes(k.fahrzeugId));
    if (typFilter !== "alle") r = r.filter(k => k.typ === typFilter);
    if (zeitraum) r = r.filter(k => isInZeitraum(k.datum, zeitraum));
    return r.sort((a, b) => b.datum.localeCompare(a.datum));
  }, [rows, fzFilter, typFilter, zeitraum]);

  const summe = filtered.reduce((s, k) => s + k.betrag, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kosten" description={`${filtered.length} Einträge · Summe: ${formatCurrency(summe)}`}
        action={<Button asChild><Link to="/kosten/neu"><Plus className="h-4 w-4 mr-1.5" />Kosten erfassen</Link></Button>} />

      <ZeitraumFilter value={zeitraum} onChange={setZeitraum} />

      <div className="flex flex-wrap gap-3 items-center">
        <Popover open={fzDropdownOpen} onOpenChange={setFzDropdownOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-9 text-sm gap-1.5 font-normal min-w-[180px] justify-start", fzFilter.length === 0 && "text-muted-foreground")}>
              <Search className="h-3.5 w-3.5 shrink-0" />
              {fzFilter.length === 0 ? "Alle Fahrzeuge" : fzFilter.length === 1 ? getFahrzeug(fzFilter[0])?.kennzeichen : `${fzFilter.length} Fahrzeuge`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <div className="p-2 border-b"><Input placeholder="Kennzeichen suchen…" value={fzSearch} onChange={e => setFzSearch(e.target.value)} className="h-8 text-sm" autoFocus /></div>
            <div className="max-h-48 overflow-y-auto p-1">
              {fahrzeuge.filter(f => !fzSearch || f.kennzeichen.toLowerCase().includes(fzSearch.toLowerCase()) || `${f.marke} ${f.modell}`.toLowerCase().includes(fzSearch.toLowerCase())).map(f => {
                const selected = fzFilter.includes(f.id);
                return (
                  <button key={f.id} onClick={() => setFzFilter(prev => selected ? prev.filter(id => id !== f.id) : [...prev, f.id])}
                    className={cn("w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-muted flex items-center gap-2", selected && "bg-accent text-accent-foreground")}>
                    <div className={cn("h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0", selected ? "bg-primary border-primary" : "border-input")}>{selected && <X className="h-2.5 w-2.5 text-primary-foreground" />}</div>
                    <span className="font-mono font-medium">{f.kennzeichen}</span>
                    <span className="text-muted-foreground text-xs">{f.marke} {f.modell}</span>
                  </button>
                );
              })}
            </div>
            {fzFilter.length > 0 && <div className="border-t px-3 py-2 flex justify-end"><Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setFzFilter([])}><X className="h-3 w-3 mr-1" /> Zurücksetzen</Button></div>}
          </PopoverContent>
        </Popover>
        <Select value={typFilter} onValueChange={setTypFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Typ" /></SelectTrigger>
          <SelectContent><SelectItem value="alle">Alle Typen</SelectItem><SelectItem value="fix">Fixkosten</SelectItem><SelectItem value="variabel">Variable Kosten</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Datum</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Bezeichnung</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Typ</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Intervall</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Betrag</th>
          </tr></thead>
          <tbody>
            {filtered.map(k => {
              const fz = getFahrzeug(k.fahrzeugId);
              const isEditable = !k.id.startsWith("fix_");
              return (
                <tr key={k.id} className={cn("border-b last:border-0 hover:bg-muted/30 transition-colors", isEditable && "cursor-pointer")}
                  onClick={() => isEditable && navigate(`/kosten/${k.id}/bearbeiten`)}>
                  <td className="px-4 py-3 text-sm">{formatDate(k.datum)}</td>
                  <td className="px-4 py-3 text-sm">{k.label}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                      k.typ === "fix" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                    )}>
                      {k.typ === "fix" ? "Fixkosten" : "Variabel"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{k.intervall ? intervallLabels[k.intervall] || k.intervall : "–"}</td>
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
