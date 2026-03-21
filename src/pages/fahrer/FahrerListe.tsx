import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fahrerList, fahrten, fahrzeuge, getFahrzeug, formatCurrency } from "@/data/mockData";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export default function FahrerListe() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const data = fahrerList.filter(f => !search || `${f.vorname} ${f.nachname}`.toLowerCase().includes(search.toLowerCase())).map(f => {
    const fFahrten = fahrten.filter(ft => ft.fahrerId === f.id && ft.status === "erledigt" && ft.preis);
    const einnahmen = fFahrten.reduce((s, ft) => s + (ft.preis || 0), 0);
    const fzIds = [...new Set(fahrten.filter(ft => ft.fahrerId === f.id).map(ft => ft.fahrzeugId))];
    return { ...f, fahrtenCount: fFahrten.length, einnahmen, fahrzeugeCount: fzIds.length };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Fahrer" description={`${fahrerList.length} Fahrer`}
        action={<Button asChild><Link to="/fahrer/neu"><Plus className="h-4 w-4 mr-1.5" />Neuer Fahrer</Link></Button>} />
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Nach Name suchen…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
      </div>
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Name</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrten</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Einnahmen</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeuge</th>
          </tr></thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrer/${d.id}`)}>
                <td className="px-4 py-3 text-sm font-medium">{d.vorname} {d.nachname}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-sm text-right tabular-nums">{d.fahrtenCount}</td>
                <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(d.einnahmen)}</td>
                <td className="px-4 py-3 text-sm text-right tabular-nums">{d.fahrzeugeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
