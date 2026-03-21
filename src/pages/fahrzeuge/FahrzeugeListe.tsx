import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { fahrzeuge, fahrten, kosten, plattformUmsaetze, formatCurrency } from "@/data/mockData";
import { Plus } from "lucide-react";

export default function FahrzeugeListe() {
  const navigate = useNavigate();
  const data = fahrzeuge.map(fz => {
    const fzFahrten = fahrten.filter(f => f.fahrzeugId === fz.id && f.status === "erledigt" && f.preis);
    const eigen = fzFahrten.reduce((s, f) => s + (f.preis || 0), 0);
    const plat = plattformUmsaetze.filter(p => p.fahrzeugId === fz.id).reduce((s, p) => s + p.netto, 0);
    const kost = kosten.filter(k => k.fahrzeugId === fz.id).reduce((s, k) => s + k.betrag, 0);
    const einnahmen = eigen + plat;
    const ergebnis = einnahmen - kost;
    return { ...fz, fahrtenCount: fzFahrten.length, einnahmen, kosten: kost, ergebnis, marge: einnahmen > 0 ? (ergebnis / einnahmen * 100) : 0 };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Fahrzeuge" description={`${fahrzeuge.length} Fahrzeuge im Betrieb`}
        action={<Button asChild><Link to="/fahrzeuge/neu"><Plus className="h-4 w-4 mr-1.5" />Neues Fahrzeug</Link></Button>} />
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrten</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Einnahmen</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Kosten</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Ergebnis</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Marge</th>
          </tr></thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrzeuge/${d.id}`)}>
                <td className="px-4 py-3"><div><span className="font-mono text-sm font-medium">{d.kennzeichen}</span><p className="text-xs text-muted-foreground">{d.marke} {d.modell}</p></div></td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-sm text-right tabular-nums">{d.fahrtenCount}</td>
                <td className="px-4 py-3 text-sm text-right tabular-nums">{formatCurrency(d.einnahmen)}</td>
                <td className="px-4 py-3 text-sm text-right tabular-nums">{formatCurrency(d.kosten)}</td>
                <td className={`px-4 py-3 text-sm text-right font-medium tabular-nums ${d.ergebnis >= 0 ? "text-success" : "text-destructive"}`}>{formatCurrency(d.ergebnis)}</td>
                <td className="px-4 py-3 text-sm text-right tabular-nums">{d.marge.toFixed(1)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
