import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = ["hsl(158,40%,36%)", "hsl(200,50%,45%)", "hsl(38,85%,52%)", "hsl(0,70%,55%)", "hsl(280,40%,50%)"];

export default function StatistikIndex() {
  const { t } = useTranslation();
  const { fahrten, fahrzeuge, fahrer, kosten, plattformUmsaetze } = useAppContext();
  const [zeitraum, setZeitraum] = useState("monat");
  const erledigte = fahrten.filter(f => f.status === "erledigt" && f.preis);
  const eigenSum = erledigte.reduce((s, f) => s + (f.preis || 0), 0);
  const platSum = plattformUmsaetze.reduce((s, p) => s + p.netto, 0);
  const kostenSum = kosten.reduce((s, k) => s + k.betrag, 0);

  const fzVergleich = fahrzeuge.filter(f => f.status !== "inaktiv").map(fz => {
    const e = erledigte.filter(f => f.fahrzeugId === fz.id).reduce((s, f) => s + (f.preis || 0), 0)
      + plattformUmsaetze.filter(p => p.fahrzeugId === fz.id).reduce((s, p) => s + p.netto, 0);
    const k = kosten.filter(ko => ko.fahrzeugId === fz.id).reduce((s, ko) => s + ko.betrag, 0);
    return { name: fz.kennzeichen, [t("dashboard.einnahmen")]: e, [t("dashboard.kosten")]: k, Ergebnis: e - k };
  });

  const faVergleich = fahrer.filter(f => f.status === "aktiv").map(fa => ({
    name: `${fa.vorname.charAt(0)}. ${fa.nachname}`,
    [t("dashboard.einnahmen")]: erledigte.filter(f => f.fahrerId === fa.id).reduce((s, f) => s + (f.preis || 0), 0),
  }));

  const typBreakdown = (["krankenfahrt", "flughafentransfer", "privatfahrt", "firmenfahrt"] as const).map(k => ({
    name: t(`fahrtTyp.${k}`), value: erledigte.filter(f => f.typ === k).reduce((s, f) => s + (f.preis || 0), 0),
  })).filter(d => d.value > 0);

  const trendData = [
    { name: "Jan", [t("dashboard.einnahmen")]: 5200, [t("dashboard.kosten")]: 3800 },
    { name: "Feb", [t("dashboard.einnahmen")]: 6100, [t("dashboard.kosten")]: 4200 },
    { name: "Mar", [t("dashboard.einnahmen")]: eigenSum + platSum, [t("dashboard.kosten")]: kostenSum },
  ];

  const tooltipStyle = { borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" };
  const zeitraumKeys = ["woche", "monat", "quartal"] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={t("statistik.title")} description={t("statistik.description")} />
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {zeitraumKeys.map(key => (
          <button key={key} onClick={() => setZeitraum(key)}
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${zeitraum === key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t(`statistik.${key}`)}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">{t("statistik.einnahmenKosten")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey={t("dashboard.einnahmen")} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey={t("dashboard.kosten")} stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">{t("statistik.fahrzeugvergleich")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fzVergleich}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
              <Bar dataKey={t("dashboard.einnahmen")} fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              <Bar dataKey={t("dashboard.kosten")} fill="hsl(var(--destructive))" radius={[3, 3, 0, 0]} />
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
              <Bar dataKey={t("dashboard.einnahmen")} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">{t("statistik.umsatzNachTyp")}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={typBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {typBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center">
            {typBreakdown.map((d, i) => <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />{d.name}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
