import { useParams, Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate, fahrtTypLabels } from "@/data/mockData";
import { Plus, Receipt, Pencil } from "lucide-react";

export default function FahrzeugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFahrzeug, getFahrer, fahrten, kosten, plattformUmsaetze } = useAppContext();
  const fz = getFahrzeug(id || "");
  if (!fz) return <div className="p-12 text-center text-muted-foreground">Fahrzeug nicht gefunden.</div>;

  const fzFahrten = fahrten.filter(f => f.fahrzeugId === fz.id);
  const erledigte = fzFahrten.filter(f => f.status === "erledigt" && f.preis);
  const eigen = erledigte.reduce((s, f) => s + (f.preis || 0), 0);
  const fzPlat = plattformUmsaetze.filter(p => p.fahrzeugId === fz.id);
  const platNetto = fzPlat.reduce((s, p) => s + p.netto, 0);
  const fzKosten = kosten.filter(k => k.fahrzeugId === fz.id);
  const kostenSum = fzKosten.reduce((s, k) => s + k.betrag, 0);
  const ergebnis = eigen + platNetto - kostenSum;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={fz.kennzeichen} description={`${fz.marke} ${fz.modell} · ${fz.baujahr}`} back
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={fz.status} />
            <Button size="sm" variant="outline" onClick={() => navigate(`/fahrzeuge/${fz.id}/bearbeiten`)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />Bearbeiten
            </Button>
          </div>
        }
      />

      <div className="flex gap-3">
        <Button asChild><Link to="/fahrten/neu"><Plus className="h-4 w-4 mr-1.5" />Fahrt erfassen</Link></Button>
        <Button variant="outline" asChild><Link to="/kosten/neu"><Receipt className="h-4 w-4 mr-1.5" />Kosten erfassen</Link></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Einnahmen</p>
          <p className="text-xl font-semibold">{formatCurrency(eigen + platNetto)}</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Kosten</p>
          <p className="text-xl font-semibold">{formatCurrency(kostenSum)}</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Ergebnis</p>
          <p className={`text-xl font-semibold ${ergebnis >= 0 ? "text-success" : "text-destructive"}`}>{formatCurrency(ergebnis)}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Stammdaten</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-foreground text-xs">Marke</p><p className="font-medium">{fz.marke}</p></div>
          <div><p className="text-muted-foreground text-xs">Modell</p><p className="font-medium">{fz.modell}</p></div>
          <div><p className="text-muted-foreground text-xs">Baujahr</p><p className="font-medium">{fz.baujahr}</p></div>
          <div><p className="text-muted-foreground text-xs">Farbe</p><p className="font-medium">{fz.farbe}</p></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">Fahrten ({fzFahrten.length})</h3></div>
        <table className="w-full">
          <tbody>
            {fzFahrten.slice(0, 8).map(f => {
              const fa = getFahrer(f.fahrerId);
              return (
                <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrten/${f.id}`)}>
                  <td className="px-5 py-3 text-sm">{formatDate(f.datum)}</td>
                  <td className="px-5 py-3 text-sm">{fahrtTypLabels[f.typ]}</td>
                  <td className="px-5 py-3 text-sm">{f.von} → {f.nach}</td>
                  <td className="px-5 py-3"><StatusBadge status={f.status} /></td>
                  <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{f.preis ? formatCurrency(f.preis) : "–"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {fzKosten.length > 0 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">Kosten ({fzKosten.length})</h3></div>
          <table className="w-full">
            <tbody>
              {fzKosten.map(k => (
                <tr key={k.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/kosten/${k.id}/bearbeiten`)}>
                  <td className="px-5 py-3 text-sm">{formatDate(k.datum)}</td>
                  <td className="px-5 py-3 text-sm">{k.kategorie}</td>
                  <td className="px-5 py-3"><StatusBadge status={k.typ === "fix" ? "geplant" : "erledigt"} /></td>
                  <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(k.betrag)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fzPlat.length > 0 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">Plattformumsätze ({fzPlat.length})</h3></div>
          <table className="w-full">
            <tbody>
              {fzPlat.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/umsaetze/plattform/${p.id}`)}>
                  <td className="px-5 py-3 text-sm font-medium">{p.plattform}</td>
                  <td className="px-5 py-3 text-sm">{formatDate(p.zeitraumVon)} – {formatDate(p.zeitraumBis)}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(p.netto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
