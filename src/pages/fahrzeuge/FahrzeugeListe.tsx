import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ZeitraumFilter } from "@/components/ZeitraumFilter";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/data/mockData";
import { berechneAlleFahrzeugErgebnisse, type Zeitraum, type FahrzeugErgebnis } from "@/lib/calculations";
import { Plus, Search, Settings2, GripVertical, ArrowUpDown, Info, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useVehicleGuard } from "@/hooks/use-guarded-action";

interface ColumnDef {
  key: string; label: string; fixed?: boolean;
  render: (d: FahrzeugErgebnis) => React.ReactNode;
  className?: string; headerClassName?: string; sortKey?: string;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "kennzeichen", label: "Kennzeichen", fixed: true, render: (d) => <span className="font-mono text-sm font-medium">{d.fahrzeug.kennzeichen}</span>, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
  { key: "modell", label: "Fahrzeugmodell", render: (d) => <span className="text-sm">{d.fahrzeug.marke} {d.fahrzeug.modell}</span>, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
  { key: "status", label: "Status", render: (d) => <StatusBadge status={d.fahrzeug.status} />, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
  { key: "fahrten", label: "Fahrten", render: (d) => <span className="text-sm tabular-nums">{d.fahrtenCount}</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3" },
  { key: "einnahmen", label: "Einnahmen", sortKey: "einnahmenGesamt", render: (d) => <span className="text-sm tabular-nums">{formatCurrency(d.einnahmenGesamt)}</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3 cursor-pointer" },
  { key: "kosten", label: "Kosten", sortKey: "kostenGesamt", render: (d) => <span className="text-sm tabular-nums">{formatCurrency(d.kostenGesamt)}</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3 cursor-pointer" },
  { key: "ergebnis", label: "Ergebnis", sortKey: "ergebnis", render: (d) => {
    const label = d.ergebnis > 0 ? "Profitabel" : d.ergebnis < 0 ? "Nicht rentabel" : "";
    return (
      <div className="text-right">
        <span className={cn("text-sm font-medium tabular-nums", d.ergebnis >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>{formatCurrency(d.ergebnis)}</span>
        {label && <p className={cn("text-[10px]", d.ergebnis >= 0 ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-destructive/70")}>{label}</p>}
      </div>
    );
  }, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3 cursor-pointer" },
  { key: "baujahr", label: "Baujahr", render: (d) => <span className="text-sm tabular-nums">{d.fahrzeug.baujahr}</span>, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
];

const DEFAULT_VISIBLE = ["kennzeichen", "modell", "status", "fahrten", "einnahmen", "kosten", "ergebnis"];
const DEFAULT_ORDER = [...DEFAULT_VISIBLE, "baujahr"];

function loadConfig() {
  try {
    const saved = localStorage.getItem("fahrzeuge-columns");
    if (saved) {
      const { visible, order } = JSON.parse(saved);
      return { visible: [...new Set(["kennzeichen", ...visible])] as string[], order: ["kennzeichen", ...order.filter((k: string) => k !== "kennzeichen")] as string[] };
    }
  } catch {}
  return { visible: DEFAULT_VISIBLE, order: DEFAULT_ORDER };
}

function saveConfig(visible: string[], order: string[]) {
  localStorage.setItem("fahrzeuge-columns", JSON.stringify({ visible, order }));
}

export default function FahrzeugeListe() {
  const navigate = useNavigate();
  const { fahrzeuge, fahrten, kosten, plattformUmsaetze } = useAppContext();
  const [search, setSearch] = useState("");
  const [zeitraum, setZeitraum] = useState<Zeitraum | undefined>(undefined);
  const [columnConfig, setColumnConfig] = useState(loadConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string | null>("ergebnis");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const guardVehicle = useVehicleGuard();

  const allData = useMemo(() =>
    berechneAlleFahrzeugErgebnisse(fahrzeuge, fahrten, plattformUmsaetze, kosten, zeitraum),
    [fahrzeuge, fahrten, plattformUmsaetze, kosten, zeitraum]
  );

  const filtered = useMemo(() => {
    let r = [...allData];
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(d => d.fahrzeug.kennzeichen.toLowerCase().includes(s) || d.fahrzeug.marke.toLowerCase().includes(s) || d.fahrzeug.modell.toLowerCase().includes(s));
    }
    if (sortKey) {
      r.sort((a, b) => { const av = (a as any)[sortKey] ?? 0; const bv = (b as any)[sortKey] ?? 0; return sortDir === "desc" ? bv - av : av - bv; });
    }
    return r;
  }, [allData, search, sortKey, sortDir]);

  const visibleColumns = useMemo(() => columnConfig.order.filter(key => columnConfig.visible.includes(key)).map(key => ALL_COLUMNS.find(c => c.key === key)!).filter(Boolean), [columnConfig]);

  const toggleColumn = (key: string) => {
    if (key === "kennzeichen") return;
    const isVisible = columnConfig.visible.includes(key);
    const col = ALL_COLUMNS.find(c => c.key === key);
    const newVisible = isVisible ? columnConfig.visible.filter(k => k !== key) : [...columnConfig.visible, key];
    setColumnConfig(prev => ({ ...prev, visible: newVisible }));
    saveConfig(newVisible, columnConfig.order);
    toast(isVisible ? `„${col?.label}" ausgeblendet` : `„${col?.label}" eingeblendet`, { duration: 1500 });
  };

  const handleDragStart = (idx: number) => { if (idx > 0) setDragIdx(idx); };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (idx === 0 || dragIdx === null || dragIdx === idx) return;
    const newOrder = [...columnConfig.order];
    const visOrder = newOrder.filter(k => columnConfig.visible.includes(k));
    const dragKey = visOrder[dragIdx]; const targetKey = visOrder[idx];
    const dragI = newOrder.indexOf(dragKey); const targetI = newOrder.indexOf(targetKey);
    newOrder.splice(dragI, 1); newOrder.splice(targetI, 0, dragKey);
    setColumnConfig(prev => ({ ...prev, order: newOrder }));
    saveConfig(columnConfig.visible, newOrder);
    setDragIdx(idx);
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  if (fahrzeuge.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Fahrzeuge" description="0 Fahrzeuge"
          action={<Button asChild><Link to="/fahrzeuge/neu"><Plus className="h-4 w-4 mr-1.5" />Neues Fahrzeug</Link></Button>} />
        <EmptyState
          icon={Car}
          title="Noch keine Fahrzeuge angelegt"
          description="Legen Sie Ihr erstes Fahrzeug an, um Einnahmen und Kosten zuordnen zu können. Fahrzeuge sind das wirtschaftliche Zentrum Ihres Betriebs."
          actionLabel="Erstes Fahrzeug anlegen"
          actionTo="/fahrzeuge/neu"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Fahrzeuge" description={`${filtered.length} von ${fahrzeuge.length} Fahrzeuge`}
        action={<Button asChild><Link to="/fahrzeuge/neu"><Plus className="h-4 w-4 mr-1.5" />Neues Fahrzeug</Link></Button>} />

      <ZeitraumFilter value={zeitraum} onChange={setZeitraum} />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Kennzeichen, Marke, Modell…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Popover open={showSettings} onOpenChange={setShowSettings}>
          <PopoverTrigger asChild><Button variant="outline" size="icon" className="h-9 w-9 shrink-0"><Settings2 className="h-4 w-4" /></Button></PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="px-3 py-2.5 border-b">
              <p className="text-xs font-semibold">Spalten anpassen</p>
              <p className="text-[10px] text-muted-foreground">Ziehen zum Sortieren, klicken zum Ein-/Ausblenden</p>
            </div>
            <div className="p-1.5 space-y-0.5 max-h-80 overflow-y-auto">
              {columnConfig.order.map((key, idx) => {
                const col = ALL_COLUMNS.find(c => c.key === key); if (!col) return null;
                const isVisible = columnConfig.visible.includes(key); const isFixed = col.fixed;
                return (
                  <div key={key} draggable={!isFixed} onDragStart={() => handleDragStart(idx)} onDragOver={(e) => handleDragOver(e, idx)} onDragEnd={() => setDragIdx(null)}
                    className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors", dragIdx === idx && "bg-primary/10", !isFixed && "cursor-grab active:cursor-grabbing hover:bg-muted/50")}>
                    {!isFixed ? <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" /> : <div className="w-3.5 shrink-0" />}
                    <Checkbox checked={isVisible} disabled={isFixed} onCheckedChange={() => toggleColumn(key)} className="shrink-0" />
                    <span className={cn("text-xs", isFixed && "text-muted-foreground")}>{col.label}{isFixed ? " (fix)" : ""}</span>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-start gap-2 bg-muted/30 rounded-lg px-4 py-2.5 border">
        <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground">Ergebnis = Einnahmen minus erfasste Fahrzeugkosten</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                {visibleColumns.map(col => (
                  <th key={col.key} className={cn("text-[11px] font-medium text-muted-foreground uppercase tracking-wider", col.headerClassName)}
                    onClick={col.sortKey ? () => toggleSort(col.sortKey!) : undefined}>
                    {col.sortKey ? <span className="flex items-center gap-1">{col.label} <ArrowUpDown className="h-3 w-3" /></span> : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.fahrzeug.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrzeuge/${d.fahrzeug.id}`)}>
                  {visibleColumns.map(col => <td key={col.key} className={col.className}>{col.render(d)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Keine Fahrzeuge gefunden.</div>}
      </div>
    </div>
  );
}
