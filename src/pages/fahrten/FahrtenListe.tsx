import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { fahrten, getFahrer, getFahrzeug, fahrtTypLabels, formatCurrency, formatDate } from "@/data/mockData";
import { Plus, Search, ArrowUpDown, CalendarIcon, X, Settings2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Fahrt } from "@/data/mockData";

interface ColumnDef {
  key: string;
  label: string;
  fixed?: boolean;
  render: (f: Fahrt, fa: ReturnType<typeof getFahrer>, fz: ReturnType<typeof getFahrzeug>) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: "datum" | "preis";
}

const ALL_COLUMNS: ColumnDef[] = [
  {
    key: "id", label: "ID", fixed: true,
    render: (f) => <span className="text-xs font-mono text-muted-foreground">{f.fahrtNummer}</span>,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3",
  },
  {
    key: "datum", label: "Datum", sortable: "datum",
    render: (f) => <span className="text-sm whitespace-nowrap">{formatDate(f.datum)} · {f.uhrzeit}</span>,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3 cursor-pointer",
  },
  {
    key: "typ", label: "Typ",
    render: (f) => <span className="text-sm">{fahrtTypLabels[f.typ]}</span>,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3",
  },
  {
    key: "route", label: "Route",
    render: (f) => <span className="text-sm"><span className="text-muted-foreground">{f.von}</span> → {f.nach}</span>,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3",
  },
  {
    key: "fahrer", label: "Fahrer",
    render: (_, fa) => <span className="text-sm">{fa ? `${fa.vorname} ${fa.nachname}` : "–"}</span>,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3",
  },
  {
    key: "fahrzeug", label: "Fahrzeug",
    render: (_, __, fz) => <span className="text-xs font-mono">{fz?.kennzeichen || "–"}</span>,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3",
  },
  {
    key: "kunde", label: "Kunde",
    render: (f) => <span className="text-sm">{f.kunde || "–"}</span>,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3",
  },
  {
    key: "status", label: "Status",
    render: (f) => <StatusBadge status={f.status} />,
    className: "px-4 py-3",
    headerClassName: "text-left px-4 py-3",
  },
  {
    key: "preis", label: "Preis", sortable: "preis",
    render: (f) => <span className="text-sm text-right font-medium tabular-nums">{f.preis ? formatCurrency(f.preis) : "–"}</span>,
    className: "px-4 py-3 text-right",
    headerClassName: "text-right px-4 py-3 cursor-pointer",
  },
];

const DEFAULT_VISIBLE = ["id", "datum", "typ", "route", "fahrer", "fahrzeug", "status", "preis"];
const DEFAULT_ORDER = [...DEFAULT_VISIBLE];

function loadColumnConfig() {
  try {
    const saved = localStorage.getItem("fahrten-columns");
    if (saved) {
      const { visible, order } = JSON.parse(saved);
      // Ensure 'id' is always first
      const safeOrder = ["id", ...order.filter((k: string) => k !== "id")];
      return { visible: [...new Set(["id", ...visible])] as string[], order: safeOrder as string[] };
    }
  } catch {}
  return { visible: DEFAULT_VISIBLE, order: DEFAULT_ORDER };
}

function saveColumnConfig(visible: string[], order: string[]) {
  localStorage.setItem("fahrten-columns", JSON.stringify({ visible, order }));
}

export default function FahrtenListe() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typFilter, setTypFilter] = useState("alle");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [sortBy, setSortBy] = useState<"datum" | "preis">("datum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const [columnConfig, setColumnConfig] = useState(loadColumnConfig);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const visibleColumns = useMemo(() => {
    return columnConfig.order
      .filter(key => columnConfig.visible.includes(key))
      .map(key => ALL_COLUMNS.find(c => c.key === key)!)
      .filter(Boolean);
  }, [columnConfig]);

  const toggleColumn = (key: string) => {
    if (key === "id") return;
    const isVisible = columnConfig.visible.includes(key);
    const col = ALL_COLUMNS.find(c => c.key === key);
    const newVisible = isVisible
      ? columnConfig.visible.filter(k => k !== key)
      : [...columnConfig.visible, key];
    const newConfig = { ...columnConfig, visible: newVisible };
    setColumnConfig(newConfig);
    saveColumnConfig(newVisible, columnConfig.order);
    toast(isVisible ? `„${col?.label}" ausgeblendet` : `„${col?.label}" eingeblendet`, { duration: 1500 });
  };

  const handleDragStart = (idx: number) => {
    if (idx === 0) return; // can't drag ID
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (idx === 0 || dragIdx === null || dragIdx === idx) return;
    const newOrder = [...columnConfig.order];
    const visOrder = newOrder.filter(k => columnConfig.visible.includes(k));
    const dragKey = visOrder[dragIdx];
    const targetKey = visOrder[idx];
    const dragI = newOrder.indexOf(dragKey);
    const targetI = newOrder.indexOf(targetKey);
    newOrder.splice(dragI, 1);
    newOrder.splice(targetI, 0, dragKey);
    const newConfig = { ...columnConfig, order: newOrder };
    setColumnConfig(newConfig);
    saveColumnConfig(columnConfig.visible, newOrder);
    setDragIdx(idx);
  };

  const filtered = useMemo(() => {
    let r = [...fahrten];
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(f =>
        f.fahrtNummer.toLowerCase().includes(s) ||
        f.von.toLowerCase().includes(s) ||
        f.nach.toLowerCase().includes(s) ||
        getFahrer(f.fahrerId)?.nachname.toLowerCase().includes(s) ||
        getFahrer(f.fahrerId)?.vorname.toLowerCase().includes(s) ||
        getFahrzeug(f.fahrzeugId)?.kennzeichen.toLowerCase().includes(s) ||
        f.kunde?.toLowerCase().includes(s)
      );
    }
    if (typFilter !== "alle") r = r.filter(f => f.typ === typFilter);
    if (statusFilter !== "alle") r = r.filter(f => f.status === statusFilter);
    if (dateFrom) {
      const fromStr = format(dateFrom, "yyyy-MM-dd");
      r = r.filter(f => f.datum >= fromStr);
    }
    if (dateTo) {
      const toStr = format(dateTo, "yyyy-MM-dd");
      r = r.filter(f => f.datum <= toStr);
    }
    r.sort((a, b) => {
      const cmp = sortBy === "datum" ? a.datum.localeCompare(b.datum) : (a.preis || 0) - (b.preis || 0);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return r;
  }, [search, typFilter, statusFilter, sortBy, sortDir, dateFrom, dateTo]);

  const toggleSort = (col: "datum" | "preis") => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const clearDates = () => { setDateFrom(undefined); setDateTo(undefined); };
  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Fahrten" description={`${filtered.length} von ${fahrten.length} Fahrten`}
        action={<Button asChild><Link to="/fahrten/neu"><Plus className="h-4 w-4 mr-1.5" />Neue Fahrt</Link></Button>} />

      {/* Row 1: Search + Date Range */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="ID, Route, Fahrer, Kunde…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>

        {/* Combined Date Range Picker */}
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
            <div className="flex">
              <div className="border-r">
                <div className="px-3 py-2 border-b">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Von</p>
                </div>
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </div>
              <div>
                <div className="px-3 py-2 border-b">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Bis</p>
                </div>
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  disabled={(date) => dateFrom ? date < dateFrom : false}
                  className={cn("p-3 pointer-events-auto")}
                />
              </div>
            </div>
            {hasDateFilter && (
              <div className="border-t px-3 py-2 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={clearDates}>
                  <X className="h-3 w-3 mr-1" /> Zurücksetzen
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Row 2: Filters + Column Settings */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={typFilter} onValueChange={setTypFilter}>
          <SelectTrigger className="w-[170px] h-9 text-sm"><SelectValue placeholder="Fahrttyp" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Typen</SelectItem>
            {Object.entries(fahrtTypLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Status</SelectItem>
            <SelectItem value="geplant">Geplant</SelectItem>
            <SelectItem value="erledigt">Erledigt</SelectItem>
            <SelectItem value="storniert">Storniert</SelectItem>
          </SelectContent>
        </Select>

        {/* Column Settings Toggle */}
        <Popover open={showColumnSettings} onOpenChange={setShowColumnSettings}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="px-3 py-2.5 border-b">
              <p className="text-xs font-semibold">Spalten anpassen</p>
              <p className="text-[10px] text-muted-foreground">Ziehen zum Sortieren, klicken zum Ein-/Ausblenden</p>
            </div>
            <div className="p-1.5 space-y-0.5 max-h-80 overflow-y-auto">
              {columnConfig.order.map((key, idx) => {
                const col = ALL_COLUMNS.find(c => c.key === key);
                if (!col) return null;
                const isVisible = columnConfig.visible.includes(key);
                const isFixed = col.fixed;
                return (
                  <div
                    key={key}
                    draggable={!isFixed}
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={() => setDragIdx(null)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                      dragIdx === idx && "bg-primary/10",
                      !isFixed && "cursor-grab active:cursor-grabbing hover:bg-muted/50"
                    )}
                  >
                    {!isFixed ? (
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    ) : (
                      <div className="w-3.5 shrink-0" />
                    )}
                    <Checkbox
                      checked={isVisible}
                      disabled={isFixed}
                      onCheckedChange={() => toggleColumn(key)}
                      className="shrink-0"
                    />
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
                  <th
                    key={col.key}
                    className={cn("text-[11px] font-medium text-muted-foreground uppercase tracking-wider", col.headerClassName)}
                    onClick={col.sortable ? () => toggleSort(col.sortable!) : undefined}
                  >
                    {col.sortable ? (
                      <span className="flex items-center gap-1">{col.label} <ArrowUpDown className="h-3 w-3" /></span>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => {
                const fa = getFahrer(f.fahrerId);
                const fz = getFahrzeug(f.fahrzeugId);
                return (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/fahrten/${f.id}`)}>
                    {visibleColumns.map(col => (
                      <td key={col.key} className={col.className}>
                        {col.render(f, fa, fz)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">Keine Fahrten gefunden.</div>
        )}
      </div>
    </div>
  );
}
