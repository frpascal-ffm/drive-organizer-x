import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kosten, fahrzeuge, getFahrzeug, formatCurrency, formatDate } from "@/data/mockData";
import { Plus } from "lucide-react";

export default function KostenListe() {
  const [fzFilter, setFzFilter] = useState("alle");
  const [katFilter, setKatFilter] = useState("alle");
  const [typFilter, setTypFilter] = useState("alle");
  const kategorien = [...new Set(kosten.map(k => k.kategorie))];

  const filtered = useMemo(() => {
    let r = [...kosten];
    if (fzFilter !== "alle") r = r.filter(k => k.fahrzeugId === fzFilter);
    if (katFilter !== "alle") r = r.filter(k => k.kategorie === katFilter);
    if (typFilter !== "alle") r = r.filter(k => k.typ === typFilter);
    return r.sort((a, b) => b.datum.localeCompare(a.datum));
  }, [fzFilter, katFilter, typFilter]);

  const summe = filtered.reduce((s, k) => s + k.betrag, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kosten" description={`${kosten.length} Kosteneinträge · Summe: ${formatCurrency(summe)}`}
        action={<Button asChild><Link to="/kosten/neu"><Plus className="h-4 w-4 mr-1.5" />Kosten erfassen</Link></Button>} />
      <div className="flex flex-wrap gap-3">
        <Select value={fzFilter} onValueChange={setFzFilter}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue placeholder="Fahrzeug" /></SelectTrigger>
          <SelectContent><SelectItem value="alle">Alle Fahrzeuge</SelectItem>
            {fahrzeuge.map(f => <SelectItem key={f.id} value={f.id}>{f.kennzeichen}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={katFilter} onValueChange={setKatFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Kategorie" /></SelectTrigger>
          <SelectContent><SelectItem value="alle">Alle Kategorien</SelectItem>
            {kategorien.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
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
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Kategorie</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Typ</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Intervall</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Betrag</th>
          </tr></thead>
          <tbody>
            {filtered.map(k => {
              const fz = getFahrzeug(k.fahrzeugId);
              return (
                <tr key={k.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{formatDate(k.datum)}</td>
                  <td className="px-4 py-3 text-sm">{k.kategorie}</td>
                  <td className="px-4 py-3 text-sm capitalize">{k.typ}</td>
                  <td className="px-4 py-3 text-xs font-mono">{fz?.kennzeichen || "–"}</td>
                  <td className="px-4 py-3 text-sm capitalize">{k.intervall || "–"}</td>
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
