import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/data/mockData";
import { useTranslation } from "react-i18next";

export default function UmsatzFahrtDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { getFahrt, getFahrer, getFahrzeug } = useAppContext();
  const fahrt = getFahrt(id || "");

  if (!fahrt) return <div className="p-12 text-center text-muted-foreground">Umsatz nicht gefunden.</div>;

  const fahrer = getFahrer(fahrt.fahrerId);
  const fz = getFahrzeug(fahrt.fahrzeugId);
  const isUmsatzrelevant = fahrt.status === "erledigt" && !!fahrt.preis;

  const info = [
    ["Betrag", fahrt.preis ? formatCurrency(fahrt.preis) : "–"],
    ["MwSt.", fahrt.mwst ? `${fahrt.mwst} %` : "–"],
    ["Datum", `${formatDate(fahrt.datum)} · ${fahrt.uhrzeit}`],
    ["Fahrttyp", t(`fahrtTyp.${fahrt.typ}`)],
    ["Fahrer", fahrer ? <Link to={`/fahrer/${fahrer.id}`} className="text-primary hover:underline">{fahrer.vorname} {fahrer.nachname}</Link> : "–"],
    ["Fahrzeug", fz ? <Link to={`/fahrzeuge/${fz.id}`} className="text-primary hover:underline font-mono text-xs">{fz.kennzeichen}</Link> : "–"],
    ["Quelle", "Eigene Fahrt"],
    ["Kunde", fahrt.kunde || "–"],
    ["Umsatzrelevant", isUmsatzrelevant ? "Ja" : "Nein"],
  ];

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title="Umsatzdetail – Eigene Fahrt" back action={<StatusBadge status={fahrt.status} />} />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-1">
        {isUmsatzrelevant && (
          <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Umsatz</p>
            <p className="text-2xl font-bold text-primary tabular-nums">{formatCurrency(fahrt.preis!)}</p>
          </div>
        )}
        {info.map(([label, value]) => (
          <div key={String(label)} className="flex justify-between py-2.5 border-b last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link to={`/fahrten/${fahrt.id}`} className="text-sm text-primary hover:underline">→ Zur Fahrt-Detailseite</Link>
      </div>
    </div>
  );
}
