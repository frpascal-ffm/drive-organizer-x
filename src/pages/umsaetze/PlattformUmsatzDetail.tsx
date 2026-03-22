import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/data/mockData";

export default function PlattformUmsatzDetail() {
  const { id } = useParams();
  const { plattformUmsaetze, getFahrer, getFahrzeug } = useAppContext();
  const p = plattformUmsaetze.find(x => x.id === id);

  if (!p) return <div className="p-12 text-center text-muted-foreground">Plattformumsatz nicht gefunden.</div>;

  const fahrer = getFahrer(p.fahrerId);
  const fz = getFahrzeug(p.fahrzeugId);

  const info = [
    ["Plattform", p.plattform],
    ["Bruttoumsatz", formatCurrency(p.betrag)],
    ["Provision", formatCurrency(p.provision)],
    ["Nettoumsatz", formatCurrency(p.netto)],
    ["Zeitraum", `${formatDate(p.zeitraumVon)} – ${formatDate(p.zeitraumBis)}`],
    ["Anzahl Fahrten", String(p.fahrtenAnzahl)],
    ["Fahrer", fahrer ? <Link to={`/fahrer/${fahrer.id}`} className="text-primary hover:underline">{fahrer.vorname} {fahrer.nachname}</Link> : "–"],
    ["Fahrzeug", fz ? <Link to={`/fahrzeuge/${fz.id}`} className="text-primary hover:underline font-mono text-xs">{fz.kennzeichen}</Link> : "–"],
    ["Quelle", "Plattform-Import"],
  ];

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title={`Umsatzdetail – ${p.plattform}`} back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-1">
        <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nettoumsatz</p>
          <p className="text-2xl font-bold text-primary tabular-nums">{formatCurrency(p.netto)}</p>
        </div>
        {info.map(([label, value]) => (
          <div key={String(label)} className="flex justify-between py-2.5 border-b last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
