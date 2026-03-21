import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { fahrten, fahrzeuge, fahrerList, kosten, plattformUmsaetze, formatCurrency, fahrtTypLabels } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(158,40%,36%)", "hsl(200,50%,45%)", "hsl(38,85%,52%)", "hsl(0,70%,55%)", "hsl(280,40%,50%)"];

export default function StatistikIndex() {
  const [zeitraum, setZeitraum] = useState("monat");
  const erledigte = fahrten.filter(f => f.status === "erledigt" && f.preis);
  const eigenSum = erledigte.reduce((s, f) => s + (f.preis || 0), 0);
  const platSum = plattformUmsaetze.reduce((s, p) => s + p.netto, 0);
  const kostenSum = kosten.reduce((s, k) => s + k.betrag, 0);

  const fzVergleich = fahrzeuge.filter(f => f.status !== "inaktiv").map(fz => {
    const e = erledigte.filter(f => f.fahrzeugId === fz.id).reduce((s, f) => s + (f.preis || 0), 0)
      + plattformUmsaetze.filter(p => p.fahrzeugId === fz.id).reduce((s, p) => s + p.netto, 0);
    const k = kosten.filter(ko => ko.fahrzeugId === fz.id).reduce((s, ko) => s + ko.betrag, 0);
    return { name: fz.kennzeichen, Einnahmen: e, Kosten: k, Ergebnis: e - k };
  });

  const faVergleich = fahrerList.filter(f => f.status === "aktiv").map(fa => ({
    name: `${fa.vorname.charAt(0)}. ${fa.nachname}`,
    Einnahmen: erledigte.filter(f => f.fahrerId === fa.id).reduce((s, f) => s + (f.preis || 0), 0),
  }));

  const typBreakdown = (Object.entries(fahrtTypLabels) as [string, string][]).map(([k, l]) => ({
    name: l, value: erledigte.filter(f => f.typ === k).reduce((s, f) => s + (f.preis || 0), 0),
  })).filter(d => d.value > 0);

  const trendData = [
    { name: "Jan", Einnahmen: 5200, Kosten: 3800 },
    { name: "Feb", Einnahmen: 6100, Kosten: 4200 },
    { name: "Mär", Einnahmen: eigenSum + platSum, Kosten: kostenSum },
  ];

  const tooltipStyle = { borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Statistik" description="Auswertungen und Vergleiche" />

      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
        {["woche", "monat", "quartal"].map(t => (
          <button key={t} onClick={() => setZeitraum(t)}
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${zeitraum === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Einnahmen- & Kostenentwicklung</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="Einnahmen" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Kosten" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Fahrzeugvergleich</h3>
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
          <h3 className="text-sm font-semibold mb-4">Fahrervergleich</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={faVergleich} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
              <Bar dataKey="Einnahmen" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Umsatz nach Fahrttyp</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={typBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {typBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center">
            {typBreakdown.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />{d.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
