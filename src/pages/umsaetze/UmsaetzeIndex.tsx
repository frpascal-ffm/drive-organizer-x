import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { fahrten, plattformUmsaetze, getFahrer, getFahrzeug, formatCurrency, formatDate, fahrtTypLabels } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const tabs = ["Übersicht", "Eigene Fahrten", "Plattformen"] as const;

export default function UmsaetzeIndex() {
  const [tab, setTab] = useState<typeof tabs[number]>("Übersicht");
  const navigate = useNavigate();
  const erledigte = fahrten.filter(f => f.status === "erledigt" && f.preis);
  const eigenSum = erledigte.reduce((s, f) => s + (f.preis || 0), 0);
  const platNetto = plattformUmsaetze.reduce((s, p) => s + p.netto, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader title="Umsätze" description="Einnahmen aus eigenen Fahrten und Plattformen" />
        <Button onClick={() => navigate("/umsaetze/import")} size="sm">
          <Upload className="h-4 w-4 mr-1.5" />
          Plattform-Import
        </Button>
      </div>
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Übersicht" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Eigene Fahrten</p>
            <p className="text-2xl font-semibold">{formatCurrency(eigenSum)}</p>
            <p className="text-xs text-muted-foreground mt-1">{erledigte.length} erledigte Fahrten</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Plattformen (netto)</p>
            <p className="text-2xl font-semibold">{formatCurrency(platNetto)}</p>
            <p className="text-xs text-muted-foreground mt-1">{plattformUmsaetze.reduce((s, p) => s + p.fahrtenAnzahl, 0)} Fahrten</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Gesamtumsatz</p>
            <p className="text-2xl font-semibold text-primary">{formatCurrency(eigenSum + platNetto)}</p>
          </div>
        </div>
      )}

      {tab === "Eigene Fahrten" && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Datum</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Typ</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Route</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Preis</th>
            </tr></thead>
            <tbody>
              {erledigte.map(f => (
                <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrten/${f.id}`)}>
                  <td className="px-4 py-3 text-sm">{formatDate(f.datum)}</td>
                  <td className="px-4 py-3 text-sm">{fahrtTypLabels[f.typ]}</td>
                  <td className="px-4 py-3 text-sm">{f.von} → {f.nach}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(f.preis!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Plattformen" && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Plattform</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Zeitraum</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrer</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Brutto</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Netto</th>
            </tr></thead>
            <tbody>
              {plattformUmsaetze.map(p => {
                const fz = getFahrzeug(p.fahrzeugId);
                const fa = getFahrer(p.fahrerId);
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{p.plattform}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(p.zeitraumVon)} – {formatDate(p.zeitraumBis)}</td>
                    <td className="px-4 py-3 text-xs font-mono">{fz?.kennzeichen}</td>
                    <td className="px-4 py-3 text-sm">{fa ? `${fa.vorname} ${fa.nachname}` : "–"}</td>
                    <td className="px-4 py-3 text-sm text-right tabular-nums">{formatCurrency(p.betrag)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(p.netto)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
