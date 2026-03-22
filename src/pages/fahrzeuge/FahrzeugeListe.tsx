import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/data/mockData";
import { Plus, Search, Settings2, GripVertical, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FzRow {
  id: string; kennzeichen: string; marke: string; modell: string;
  baujahr: number; farbe: string; status: string;
  fahrtenCount: number; einnahmen: number; kosten: number; ergebnis: number; marge: number;
}

interface ColumnDef {
  key: string; label: string; fixed?: boolean;
  render: (d: FzRow) => React.ReactNode;
  className?: string; headerClassName?: string; sortKey?: string;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "kennzeichen", label: "Kennzeichen", fixed: true, render: (d) => <span className="font-mono text-sm font-medium">{d.kennzeichen}</span>, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
  { key: "modell", label: "Fahrzeugmodell", render: (d) => <span className="text-sm">{d.marke} {d.modell}</span>, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
  { key: "status", label: "Status", render: (d) => <StatusBadge status={d.status} />, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
  { key: "fahrten", label: "Fahrten", render: (d) => <span className="text-sm tabular-nums">{d.fahrtenCount}</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3" },
  { key: "einnahmen", label: "Einnahmen", sortKey: "einnahmen", render: (d) => <span className="text-sm tabular-nums">{formatCurrency(d.einnahmen)}</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3 cursor-pointer" },
  { key: "kosten", label: "Kosten", sortKey: "kosten", render: (d) => <span className="text-sm tabular-nums">{formatCurrency(d.kosten)}</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3 cursor-pointer" },
  { key: "ergebnis", label: "Ergebnis", sortKey: "ergebnis", render: (d) => <span className={cn("text-sm font-medium tabular-nums", d.ergebnis >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>{formatCurrency(d.ergebnis)}</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3 cursor-pointer" },
  { key: "marge", label: "Marge", sortKey: "marge", render: (d) => <span className="text-sm tabular-nums">{d.marge.toFixed(1)} %</span>, className: "px-4 py-3 text-right", headerClassName: "text-right px-4 py-3 cursor-pointer" },
  { key: "baujahr", label: "Baujahr", render: (d) => <span className="text-sm tabular-nums">{d.baujahr}</span>, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
  { key: "farbe", label: "Farbe", render: (d) => <span className="text-sm">{d.farbe}</span>, className: "px-4 py-3", headerClassName: "text-left px-4 py-3" },
];

const DEFAULT_VISIBLE = ["kennzeichen", "modell", "status", "fahrten", "einnahmen", "kosten", "ergebnis", "marge"];
const DEFAULT_ORDER = [...DEFAULT_VISIBLE, "baujahr", "farbe"];

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
  const [columnConfig, setColumnConfig] = useState(loadConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const allData: FzRow[] = useMemo(() => fahrzeuge.map(fz => {
    const fzFahrten = fahrten.filter(f => f.fahrzeugId === fz.id && f.status === "erledigt" && f.preis);
    const eigen = fzFahrten.reduce((s, f) => s + (f.preis || 0), 0);
    const plat = plattformUmsaetze.filter(p => p.fahrzeugId === fz.id).reduce((s, p) => s + p.netto, 0);
    const kost = kosten.filter(k => k.fahrzeugId === fz.id).reduce((s, k) => s + k.betrag, 0);
    const einnahmen = eigen + plat;
    const ergebnis = einnahmen - kost;
    return { ...fz, fahrtenCount: fzFahrten.length, einnahmen, kosten: kost, ergebnis, marge: einnahmen > 0 ? (ergebnis / einnahmen * 100) : 0 };
  }), [fahrzeuge, fahrten, kosten, plattformUmsaetze]);

  const filtered = useMemo(() => {
    let r = [...allData];
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(d => d.kennzeichen.toLowerCase().includes(s) || d.marke.toLowerCase().includes(s) || d.modell.toLowerCase().includes(s) || d.farbe.toLowerCase().includes(s));
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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Fahrzeuge" description={`${filtered.length} von ${fahrzeuge.length} Fahrzeuge`}
        action={<Button asChild><Link to="/fahrzeuge/neu"><Plus className="h-4 w-4 mr-1.5" />Neues Fahrzeug</Link></Button>} />

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
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrzeuge/${d.id}`)}>
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
