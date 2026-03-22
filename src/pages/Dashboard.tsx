import { KPICard } from "@/components/KPICard";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { fahrten, fahrzeuge, fahrerList, kosten, plattformUmsaetze, getFahrzeug, formatCurrency, fahrtTypLabels } from "@/data/mockData";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, DollarSign, Car, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTranslation } from "react-i18next";

const erledigte = fahrten.filter(f => f.status === "erledigt" && f.preis);
const eigenUmsatz = erledigte.reduce((s, f) => s + (f.preis || 0), 0);
const plattformNetto = plattformUmsaetze.reduce((s, p) => s + p.netto, 0);
const gesamtEinnahmen = eigenUmsatz + plattformNetto;
const gesamtKosten = kosten.reduce((s, k) => s + k.betrag, 0);
const ergebnis = gesamtEinnahmen - gesamtKosten;

const vehicleResults = fahrzeuge.filter(f => f.status !== "inaktiv").map(fz => {
  const fzE = erledigte.filter(f => f.fahrzeugId === fz.id).reduce((s, f) => s + (f.preis || 0), 0);
  const fzP = plattformUmsaetze.filter(p => p.fahrzeugId === fz.id).reduce((s, p) => s + p.netto, 0);
  const fzK = kosten.filter(k => k.fahrzeugId === fz.id).reduce((s, k) => s + k.betrag, 0);
  return { ...fz, einnahmen: fzE + fzP, kosten: fzK, ergebnis: fzE + fzP - fzK };
}).sort((a, b) => b.ergebnis - a.ergebnis);

const fahrtenOhnePreis = fahrten.filter(f => f.status === "erledigt" && !f.preis);
const fzOhneKosten = fahrzeuge.filter(fz => fz.status === "aktiv" && !kosten.some(k => k.fahrzeugId === fz.id));

const chartData = vehicleResults.map(v => ({ name: v.kennzeichen, Ergebnis: v.ergebnis }));
const COLORS = ["hsl(158,40%,36%)", "hsl(200,50%,45%)", "hsl(38,85%,52%)", "hsl(280,40%,50%)"];

export default function Dashboard() {
  const { t } = useTranslation();

  const typData = (Object.keys(fahrtTypLabels) as Array<keyof typeof fahrtTypLabels>).map(key => ({
    name: t(`fahrtTyp.${key}`), value: erledigte.filter(f => f.typ === key).reduce((s, f) => s + (f.preis || 0), 0),
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={t("dashboard.title")} description={t("dashboard.description")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label={t("dashboard.einnahmen")} value={formatCurrency(gesamtEinnahmen)} trend={{ value: `+8,2 % ${t("dashboard.vsVormonat")}`, positive: true }} icon={TrendingUp} />
        <KPICard label={t("dashboard.kosten")} value={formatCurrency(gesamtKosten)} trend={{ value: `+3,1 % ${t("dashboard.vsVormonat")}`, positive: false }} icon={TrendingDown} />
        <KPICard label={t("dashboard.ergebnis")} value={formatCurrency(ergebnis)} trend={{ value: `+14,5 % ${t("dashboard.vsVormonat")}`, positive: true }} icon={DollarSign} />
        <KPICard label={t("dashboard.fahrtenErledigt")} value={String(erledigte.length)} trend={{ value: `${fahrten.filter(f => f.status === "geplant").length} ${t("dashboard.geplant")}`, positive: true }} icon={Car} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">{t("dashboard.ergebnisProFahrzeug")}</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="Ergebnis" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> {t("dashboard.hinweise")}
          </h2>
          <div className="space-y-2.5">
            {fahrtenOhnePreis.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300">
                {t("dashboard.fahrtenOhnePreis", { count: fahrtenOhnePreis.length })}
              </div>
            )}
            {fzOhneKosten.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300">
                {t("dashboard.fahrzeugeOhneKosten", { count: fzOhneKosten.length })}
              </div>
            )}
            {fahrtenOhnePreis.length === 0 && fzOhneKosten.length === 0 && (
              <p className="text-muted-foreground text-sm">{t("dashboard.allesOk")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">{t("dashboard.topFahrer")}</h2>
          <div className="space-y-1">
            {fahrerList.filter(f => f.status === "aktiv").map((f, i) => {
              const e = erledigte.filter(ft => ft.fahrerId === f.id).reduce((s, ft) => s + (ft.preis || 0), 0);
              return (
                <Link key={f.id} to={`/fahrer/${f.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium">{f.vorname} {f.nachname}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatCurrency(e)}</span>
                </Link>
              );
            })}
          </div>
        </div>

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
            {typData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
