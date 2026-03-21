import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fahrten, getFahrer, getFahrzeug, fahrtTypLabels, formatCurrency, formatDate, type FahrtTyp } from "@/data/mockData";
import { Plus, Search, ArrowUpDown } from "lucide-react";

export default function FahrtenListe() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typFilter, setTypFilter] = useState("alle");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [sortBy, setSortBy] = useState<"datum" | "preis">("datum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let r = [...fahrten];
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(f => f.von.toLowerCase().includes(s) || f.nach.toLowerCase().includes(s) ||
        getFahrer(f.fahrerId)?.nachname.toLowerCase().includes(s) ||
        getFahrzeug(f.fahrzeugId)?.kennzeichen.toLowerCase().includes(s) ||
        f.kunde?.toLowerCase().includes(s));
    }
    if (typFilter !== "alle") r = r.filter(f => f.typ === typFilter);
    if (statusFilter !== "alle") r = r.filter(f => f.status === statusFilter);
    r.sort((a, b) => {
      const cmp = sortBy === "datum" ? a.datum.localeCompare(b.datum) : (a.preis || 0) - (b.preis || 0);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return r;
  }, [search, typFilter, statusFilter, sortBy, sortDir]);

  const toggleSort = (col: "datum" | "preis") => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Fahrten" description={`${fahrten.length} Fahrten insgesamt`}
        action={<Button asChild><Link to="/fahrten/neu"><Plus className="h-4 w-4 mr-1.5" />Neue Fahrt</Link></Button>} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Suchen…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
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
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("datum")}>
                  <span className="flex items-center gap-1">Datum <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Typ</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Route</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrer</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer" onClick={() => toggleSort("preis")}>
                  <span className="flex items-center gap-1 justify-end">Preis <ArrowUpDown className="h-3 w-3" /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => {
                const fa = getFahrer(f.fahrerId);
                const fz = getFahrzeug(f.fahrzeugId);
                return (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/fahrten/${f.id}`)}>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{formatDate(f.datum)} · {f.uhrzeit}</td>
                    <td className="px-4 py-3 text-sm">{fahrtTypLabels[f.typ]}</td>
                    <td className="px-4 py-3 text-sm"><span className="text-muted-foreground">{f.von}</span> → {f.nach}</td>
                    <td className="px-4 py-3 text-sm">{fa ? `${fa.vorname} ${fa.nachname}` : "–"}</td>
                    <td className="px-4 py-3 text-xs font-mono">{fz?.kennzeichen || "–"}</td>
                    <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                    <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">{f.preis ? formatCurrency(f.preis) : "–"}</td>
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
