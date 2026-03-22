import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ZeitraumFilter } from "@/components/ZeitraumFilter";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/data/mockData";
import { berechneAlleFahrzeugErgebnisse, getGesamtEinnahmen, getGesamtKosten, isInZeitraum, type Zeitraum } from "@/lib/calculations";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = ["hsl(158,40%,36%)", "hsl(200,50%,45%)", "hsl(38,85%,52%)", "hsl(0,70%,55%)", "hsl(280,40%,50%)"];

export default function StatistikIndex() {
  const { t } = useTranslation();
  const { fahrten, fahrzeuge, fahrer, kosten, plattformUmsaetze } = useAppContext();
  const [zeitraum, setZeitraum] = useState<Zeitraum | undefined>(undefined);

  const ergebnisse = useMemo(() =>
    berechneAlleFahrzeugErgebnisse(fahrzeuge, fahrten, plattformUmsaetze, kosten, zeitraum).filter(e => e.fahrzeug.status !== "inaktiv"),
    [fahrzeuge, fahrten, plattformUmsaetze, kosten, zeitraum]
  );

  const erledigte = fahrten.filter(f => f.status === "erledigt" && f.preis && isInZeitraum(f.datum, zeitraum));

  const fzVergleich = ergebnisse.map(e => ({
    name: e.fahrzeug.kennzeichen,
    Einnahmen: e.einnahmenGesamt,
    Kosten: e.kostenGesamt,
    Ergebnis: e.ergebnis,
  }));

  const faVergleich = fahrer.filter(f => f.status === "aktiv").map(fa => ({
    name: `${fa.vorname.charAt(0)}. ${fa.nachname}`,
    Einnahmen: erledigte.filter(f => f.fahrerId === fa.id).reduce((s, f) => s + (f.preis || 0), 0),
  }));

  const typBreakdown = (["krankenfahrt", "flughafentransfer", "privatfahrt", "firmenfahrt"] as const).map(k => ({
    name: t(`fahrtTyp.${k}`), value: erledigte.filter(f => f.typ === k).reduce((s, f) => s + (f.preis || 0), 0),
  })).filter(d => d.value > 0);

  const tooltipStyle = { borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader title={t("statistik.title")} description={t("statistik.description")} />
        <ZeitraumFilter value={zeitraum} onChange={setZeitraum} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Ergebnis pro Fahrzeug</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fzVergleich}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
              <Bar dataKey="Einnahmen" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Kosten" fill="hsl(var(--destructive))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">{t("statistik.fahrervergleich")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={faVergleich} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
              <Bar dataKey="Einnahmen" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">{t("statistik.umsatzNachTyp")}</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={typBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                  {typBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {typBreakdown.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                  <span className="text-xs font-medium ml-auto tabular-nums">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
