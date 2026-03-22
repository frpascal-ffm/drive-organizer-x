import { useState, useMemo } from "react";
import { KPICard } from "@/components/KPICard";
import { PageHeader } from "@/components/PageHeader";
import { ZeitraumFilter } from "@/components/ZeitraumFilter";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, fahrtTypLabels } from "@/data/mockData";
import {
  berechneAlleFahrzeugErgebnisse, getGesamtEinnahmen, getGesamtKosten, getGesamtErgebnis,
  getTopFahrzeuge, getFlopFahrzeuge, getFahrzeugeOhneKosten, getFahrzeugeOhneFahrten,
  getErledigteFahrtenOhnePreis, type Zeitraum, type FahrzeugErgebnis,
} from "@/lib/calculations";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, DollarSign, Car, AlertTriangle, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const COLORS = ["hsl(158,40%,36%)", "hsl(200,50%,45%)", "hsl(38,85%,52%)", "hsl(280,40%,50%)"];

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fahrten, fahrzeuge, fahrer, kosten, plattformUmsaetze } = useAppContext();
  const [zeitraum, setZeitraum] = useState<Zeitraum | undefined>(undefined);

  const ergebnisse = useMemo(() =>
    berechneAlleFahrzeugErgebnisse(fahrzeuge, fahrten, plattformUmsaetze, kosten, zeitraum),
    [fahrzeuge, fahrten, plattformUmsaetze, kosten, zeitraum]
  );

  const gesamtEinnahmen = useMemo(() => getGesamtEinnahmen(fahrten, plattformUmsaetze, zeitraum), [fahrten, plattformUmsaetze, zeitraum]);
  const gesamtKosten = useMemo(() => getGesamtKosten(kosten, zeitraum), [kosten, zeitraum]);
  const gesamtErgebnis = gesamtEinnahmen - gesamtKosten;
  const erledigte = fahrten.filter(f => f.status === "erledigt" && f.preis && (!zeitraum || (f.datum >= zeitraum.von && f.datum <= zeitraum.bis)));

  const aktiveErgebnisse = ergebnisse.filter(e => e.fahrzeug.status !== "inaktiv");
  const topFahrzeuge = getTopFahrzeuge(aktiveErgebnisse);
  const flopFahrzeuge = getFlopFahrzeuge(aktiveErgebnisse);
  const ohneKosten = getFahrzeugeOhneKosten(fahrzeuge, kosten, zeitraum);
  const ohneFahrten = getFahrzeugeOhneFahrten(fahrzeuge, fahrten, zeitraum);
  const ohnePreis = getErledigteFahrtenOhnePreis(fahrten, zeitraum);

  const chartData = aktiveErgebnisse
    .sort((a, b) => b.ergebnis - a.ergebnis)
    .map(v => ({ name: v.fahrzeug.kennzeichen, Ergebnis: v.ergebnis }));

  const typData = (Object.keys(fahrtTypLabels) as Array<keyof typeof fahrtTypLabels>).map(key => ({
    name: t(`fahrtTyp.${key}`), value: erledigte.filter(f => f.typ === key).reduce((s, f) => s + (f.preis || 0), 0),
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader title={t("dashboard.title")} description={t("dashboard.description")} />
        <ZeitraumFilter value={zeitraum} onChange={setZeitraum} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label={t("dashboard.einnahmen")} value={formatCurrency(gesamtEinnahmen)} icon={TrendingUp} />
        <KPICard label={t("dashboard.kosten")} value={formatCurrency(gesamtKosten)} icon={TrendingDown} />
        <KPICard label="Ergebnis" value={formatCurrency(gesamtErgebnis)}
          trend={{ value: gesamtErgebnis >= 0 ? "positiv" : "negativ", positive: gesamtErgebnis >= 0 }} icon={DollarSign} />
        <KPICard label={t("dashboard.fahrtenErledigt")} value={String(erledigte.length)}
          trend={{ value: `${fahrten.filter(f => f.status === "geplant").length} ${t("dashboard.geplant")}`, positive: true }} icon={Car} />
      </div>

      {/* Ergebnis-Erklärung */}
      <div className="flex items-start gap-2 bg-muted/30 rounded-lg px-4 py-3 border">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Ergebnis</span> = Einnahmen aus erledigten Fahrten + Plattformumsätze − erfasste Fahrzeugkosten (Fix- und variable Kosten). Fahrerlohn, Gemeinkosten und Steuern sind noch nicht berücksichtigt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">Ergebnis pro Fahrzeug</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="Ergebnis" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.Ergebnis < 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Handlungsorientierte Alerts */}
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Handlungsbedarf
          </h2>
          <div className="space-y-2.5">
            {flopFahrzeuge.length > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-xs font-medium text-red-700 dark:text-red-300">
                {flopFahrzeuge.length} {flopFahrzeuge.length === 1 ? "Fahrzeug ist" : "Fahrzeuge sind"} im gewählten Zeitraum negativ
              </div>
            )}
            {ohnePreis.length > 0 && (
              <button onClick={() => navigate("/fahrten")} className="w-full text-left p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors">
                {ohnePreis.length} erledigte {ohnePreis.length === 1 ? "Fahrt hat" : "Fahrten haben"} keinen Preis → Umsatz fehlt
              </button>
            )}
            {ohneKosten.length > 0 && (
              <button onClick={() => navigate("/kosten/neu")} className="w-full text-left p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors">
                {ohneKosten.length} {ohneKosten.length === 1 ? "Fahrzeug hat" : "Fahrzeuge haben"} keine Kosten erfasst
              </button>
            )}
            {ohneFahrten.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-300">
                {ohneFahrten.length} aktive {ohneFahrten.length === 1 ? "Fahrzeug" : "Fahrzeuge"} ohne Fahrten im Zeitraum
              </div>
            )}
            {flopFahrzeuge.length === 0 && ohnePreis.length === 0 && ohneKosten.length === 0 && ohneFahrten.length === 0 && (
              <p className="text-muted-foreground text-sm">{t("dashboard.allesOk")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Fahrzeuge */}
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">Top Fahrzeuge</h2>
          <div className="space-y-1">
            {topFahrzeuge.filter(e => e.ergebnis > 0).map((e, i) => (
              <Link key={e.fahrzeug.id} to={`/fahrzeuge/${e.fahrzeug.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <span className="text-sm font-medium font-mono">{e.fahrzeug.kennzeichen}</span>
                    <span className="text-xs text-muted-foreground ml-2">{e.fahrzeug.marke} {e.fahrzeug.modell}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{formatCurrency(e.ergebnis)}</span>
              </Link>
            ))}
            {topFahrzeuge.filter(e => e.ergebnis > 0).length === 0 && (
              <p className="text-sm text-muted-foreground py-2">Keine Fahrzeuge mit positivem Ergebnis.</p>
            )}
          </div>
        </div>

        {/* Einnahmen nach Typ */}
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">{t("dashboard.einnahmenNachTyp")}</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={typData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {typData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {typData.map((d, i) => <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />{d.name}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
