import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ZeitraumFilter } from "@/components/ZeitraumFilter";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/data/mockData";
import { isInZeitraum, isPlattformInZeitraum, type Zeitraum } from "@/lib/calculations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UmsaetzeIndex() {
  const { t } = useTranslation();
  const tabs = [t("umsaetze.uebersicht"), t("umsaetze.eigeneFahrten"), t("umsaetze.plattformen")] as const;
  const [tab, setTab] = useState(0);
  const [zeitraum, setZeitraum] = useState<Zeitraum | undefined>(undefined);
  const navigate = useNavigate();
  const { fahrten, plattformUmsaetze, getFahrer, getFahrzeug } = useAppContext();

  const erledigte = useMemo(() =>
    fahrten.filter(f => f.status === "erledigt" && f.preis && isInZeitraum(f.datum, zeitraum)),
    [fahrten, zeitraum]
  );
  const filteredPlat = useMemo(() =>
    plattformUmsaetze.filter(p => isPlattformInZeitraum(p, zeitraum)),
    [plattformUmsaetze, zeitraum]
  );
  const eigenSum = erledigte.reduce((s, f) => s + (f.preis || 0), 0);
  const platNetto = filteredPlat.reduce((s, p) => s + p.netto, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader title={t("umsaetze.title")} description={t("umsaetze.description")} />
        <Button onClick={() => navigate("/umsaetze/import")} size="sm">
          <Upload className="h-4 w-4 mr-1.5" />
          {t("umsaetze.plattformImport")}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
          {tabs.map((label, i) => (
            <button key={label} onClick={() => setTab(i)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === i ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>
        <ZeitraumFilter value={zeitraum} onChange={setZeitraum} />
      </div>

      {tab === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t("umsaetze.eigeneFahrtenLabel")}</p>
            <p className="text-2xl font-semibold">{formatCurrency(eigenSum)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("umsaetze.erledigteFahrten", { count: erledigte.length })}</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t("umsaetze.plattformenNetto")}</p>
            <p className="text-2xl font-semibold">{formatCurrency(platNetto)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("umsaetze.fahrtenLabel", { count: filteredPlat.reduce((s, p) => s + p.fahrtenAnzahl, 0) })}</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{t("umsaetze.gesamtumsatz")}</p>
            <p className="text-2xl font-semibold text-primary">{formatCurrency(eigenSum + platNetto)}</p>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.datum")}</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.typ")}</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.route")}</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.preis")}</th>
            </tr></thead>
            <tbody>
              {erledigte.map(f => {
                const fz = getFahrzeug(f.fahrzeugId);
                return (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/umsaetze/fahrt/${f.id}`)}>
                    <td className="px-4 py-3 text-sm">{formatDate(f.datum)}</td>
                    <td className="px-4 py-3 text-sm">{t(`fahrtTyp.${f.typ}`)}</td>
                    <td className="px-4 py-3 text-sm">{f.von} → {f.nach}</td>
                    <td className="px-4 py-3 text-xs font-mono">{fz?.kennzeichen || "–"}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">{formatCurrency(f.preis!)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {erledigte.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Keine Umsätze im gewählten Zeitraum.</div>}
        </div>
      )}

      {tab === 2 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.plattform")}</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.zeitraum")}</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.fahrzeug")}</th>
              <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.fahrer")}</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.brutto")}</th>
              <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("umsaetze.netto")}</th>
            </tr></thead>
            <tbody>
              {filteredPlat.map(p => {
                const fz = getFahrzeug(p.fahrzeugId);
                const fa = getFahrer(p.fahrerId);
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/umsaetze/plattform/${p.id}`)}>
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
          {filteredPlat.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Keine Plattformumsätze im gewählten Zeitraum.</div>}
        </div>
      )}
    </div>
  );
}
