import { useParams, Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate, fahrtTypLabels } from "@/data/mockData";
import { berechneFahrzeugErgebnis, intervallLabels } from "@/lib/calculations";
import { Plus, Receipt, Pencil, Info } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function FahrzeugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFahrzeug, getFahrer, fahrten, kosten, plattformUmsaetze } = useAppContext();
  const fz = getFahrzeug(id || "");
  if (!fz) return <div className="p-12 text-center text-muted-foreground">Fahrzeug nicht gefunden.</div>;

  const ergebnis = useMemo(() =>
    berechneFahrzeugErgebnis(fz, fahrten, plattformUmsaetze, kosten),
    [fz, fahrten, plattformUmsaetze, kosten]
  );

  const fzFahrten = fahrten.filter(f => f.fahrzeugId === fz.id);
  const fzKosten = kosten.filter(k => k.fahrzeugId === fz.id);
  const fzFixkosten = fzKosten.filter(k => k.typ === "fix");
  const fzVarKosten = fzKosten.filter(k => k.typ === "variabel");
  const fzPlat = plattformUmsaetze.filter(p => p.fahrzeugId === fz.id);

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Einnahmen</p>
          <p className="text-xl font-semibold">{formatCurrency(ergebnis.einnahmenGesamt)}</p>
          <div className="flex gap-3 mt-2 text-[11px] text-muted-foreground">
            <span>Eigene: {formatCurrency(ergebnis.einnahmenEigen)}</span>
            <span>Plattform: {formatCurrency(ergebnis.einnahmenPlattform)}</span>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Kosten</p>
          <p className="text-xl font-semibold">{formatCurrency(ergebnis.kostenGesamt)}</p>
          <div className="flex gap-3 mt-2 text-[11px] text-muted-foreground">
            <span>Fix: {formatCurrency(ergebnis.kostenFix)}</span>
            <span>Variabel: {formatCurrency(ergebnis.kostenVariabel)}</span>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Ergebnis</p>
          <p className={cn("text-xl font-semibold", ergebnis.ergebnis >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>{formatCurrency(ergebnis.ergebnis)}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-muted/30 rounded-lg px-4 py-2.5 border">
        <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground">Ergebnis = Einnahmen minus erfasste Fahrzeugkosten. Fahrerlohn und Gemeinkosten sind nicht berücksichtigt.</p>
      </div>

      {/* Stammdaten */}
      <div className="bg-card rounded-xl border p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Stammdaten</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-foreground text-xs">Marke</p><p className="font-medium">{fz.marke}</p></div>
          <div><p className="text-muted-foreground text-xs">Modell</p><p className="font-medium">{fz.modell}</p></div>
          <div><p className="text-muted-foreground text-xs">Baujahr</p><p className="font-medium">{fz.baujahr}</p></div>
          <div><p className="text-muted-foreground text-xs">Farbe</p><p className="font-medium">{fz.farbe}</p></div>
        </div>
      </div>

      {/* Fixkosten */}
      {fzFixkosten.length > 0 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">Fixkosten ({fzFixkosten.length})</h3></div>
          <table className="w-full">
            <tbody>
              {fzFixkosten.map(k => (
                <tr key={k.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/kosten/${k.id}/bearbeiten`)}>
                  <td className="px-5 py-3 text-sm font-medium">{k.kategorie}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{k.intervall ? intervallLabels[k.intervall] || k.intervall : "–"}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(k.betrag)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Variable Kosten */}
      {fzVarKosten.length > 0 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">Variable Kosten ({fzVarKosten.length})</h3></div>
          <table className="w-full">
            <tbody>
              {fzVarKosten.map(k => (
                <tr key={k.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/kosten/${k.id}/bearbeiten`)}>
                  <td className="px-5 py-3 text-sm">{formatDate(k.datum)}</td>
                  <td className="px-5 py-3 text-sm">{k.kategorie}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(k.betrag)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Fahrten */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">Fahrten ({fzFahrten.length})</h3></div>
        <table className="w-full">
          <tbody>
            {fzFahrten.slice(0, 8).map(f => (
              <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrten/${f.id}`)}>
                <td className="px-5 py-3 text-sm">{formatDate(f.datum)}</td>
                <td className="px-5 py-3 text-sm">{fahrtTypLabels[f.typ]}</td>
                <td className="px-5 py-3 text-sm">{f.von} → {f.nach}</td>
                <td className="px-5 py-3"><StatusBadge status={f.status} /></td>
                <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{f.preis ? formatCurrency(f.preis) : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plattformumsätze */}
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
