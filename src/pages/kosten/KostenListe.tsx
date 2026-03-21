import { useState, useMemo, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kosten, fahrzeuge, getFahrzeug, formatCurrency } from "@/data/mockData";
import { Plus, Search, ChevronDown, ChevronRight } from "lucide-react";

export default function KostenListe() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typFilter, setTypFilter] = useState("alle");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Aggregate monthly costs per vehicle
  const perFahrzeug = useMemo(() => {
    return fahrzeuge.map(fz => {
      const fzKosten = kosten.filter(k => k.fahrzeugId === fz.id);
      const fix = fzKosten.filter(k => k.typ === "fix").reduce((s, k) => s + k.betrag, 0);
      const variabel = fzKosten.filter(k => k.typ === "variabel").reduce((s, k) => s + k.betrag, 0);
      const gesamt = fix + variabel;
      return { fz, fzKosten, fix, variabel, gesamt };
    }).filter(d => d.fzKosten.length > 0);
  }, []);

  const filtered = useMemo(() => {
    let r = [...perFahrzeug];
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(d =>
        d.fz.kennzeichen.toLowerCase().includes(s) ||
        d.fz.marke.toLowerCase().includes(s) ||
        d.fz.modell.toLowerCase().includes(s) ||
        d.fzKosten.some(k => k.kategorie.toLowerCase().includes(s))
      );
    }
    if (typFilter === "fix") r = r.filter(d => d.fix > 0);
    if (typFilter === "variabel") r = r.filter(d => d.variabel > 0);
    return r.sort((a, b) => b.gesamt - a.gesamt);
  }, [perFahrzeug, search, typFilter]);

  const gesamtSumme = filtered.reduce((s, d) => s + d.gesamt, 0);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Kosten"
        description={`${fahrzeuge.length} Fahrzeuge · Gesamt: ${formatCurrency(gesamtSumme)}`}
        action={<Button asChild><Link to="/kosten/neu"><Plus className="h-4 w-4 mr-1.5" />Kosten erfassen</Link></Button>}
      />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Kennzeichen, Kategorie…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={typFilter} onValueChange={setTypFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Kostenart" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Kostenarten</SelectItem>
            <SelectItem value="fix">Fixkosten</SelectItem>
            <SelectItem value="variabel">Variable Kosten</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-8"></th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fixkosten</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Variable Kosten</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Gesamt</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const isOpen = expanded.has(d.fz.id);
              const displayKosten = typFilter === "fix"
                ? d.fzKosten.filter(k => k.typ === "fix")
                : typFilter === "variabel"
                  ? d.fzKosten.filter(k => k.typ === "variabel")
                  : d.fzKosten;

              return (
                <Fragment key={d.fz.id}>
                  <tr
                    className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => toggleExpand(d.fz.id)}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium">{d.fz.kennzeichen}</span>
                      <span className="text-xs text-muted-foreground ml-2">{d.fz.marke} {d.fz.modell}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums font-medium">{formatCurrency(d.fix)}</td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums font-medium">{formatCurrency(d.variabel)}</td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums font-semibold">{formatCurrency(typFilter === "fix" ? d.fix : typFilter === "variabel" ? d.variabel : d.gesamt)}</td>
                  </tr>
                  {isOpen && displayKosten.sort((a, b) => b.datum.localeCompare(a.datum)).map(k => (
                    <tr key={k.id} className="border-b last:border-0 bg-muted/10">
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2 text-xs text-muted-foreground pl-10">
                        {k.kategorie}
                        {k.intervall && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium capitalize">{k.intervall}</span>}
                        {k.notiz && <span className="ml-1.5 text-[10px] italic">{k.notiz}</span>}
                      </td>
                      <td className="px-4 py-2 text-xs text-right tabular-nums text-muted-foreground">
                        {k.typ === "fix" ? formatCurrency(k.betrag) : ""}
                      </td>
                      <td className="px-4 py-2 text-xs text-right tabular-nums text-muted-foreground">
                        {k.typ === "variabel" ? formatCurrency(k.betrag) : ""}
                      </td>
                      <td className="px-4 py-2 text-xs text-right tabular-nums text-muted-foreground">
                        {formatCurrency(k.betrag)}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Keine Kosten gefunden.</div>}
      </div>
    </div>
  );
}
