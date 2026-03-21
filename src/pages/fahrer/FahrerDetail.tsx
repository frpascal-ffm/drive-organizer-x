import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getFahrer, fahrten, getFahrzeug, formatCurrency, formatDate, fahrtTypLabels } from "@/data/mockData";

export default function FahrerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const f = getFahrer(id || "");
  if (!f) return <div className="p-12 text-center text-muted-foreground">Fahrer nicht gefunden.</div>;

  const fFahrten = fahrten.filter(ft => ft.fahrerId === f.id);
  const erledigte = fFahrten.filter(ft => ft.status === "erledigt" && ft.preis);
  const einnahmen = erledigte.reduce((s, ft) => s + (ft.preis || 0), 0);
  const fzIds = [...new Set(fFahrten.map(ft => ft.fahrzeugId))];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={`${f.vorname} ${f.nachname}`} back action={<StatusBadge status={f.status} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Einnahmen</p>
          <p className="text-xl font-semibold">{formatCurrency(einnahmen)}</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Erledigte Fahrten</p>
          <p className="text-xl font-semibold">{erledigte.length}</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Genutzte Fahrzeuge</p>
          <p className="text-xl font-semibold">{fzIds.length}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Stammdaten</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground text-xs">Adresse</p><p className="font-medium">{f.adresse}</p></div>
          <div><p className="text-muted-foreground text-xs">Telefon</p><p className="font-medium">{f.telefon}</p></div>
          {f.email && <div><p className="text-muted-foreground text-xs">E-Mail</p><p className="font-medium">{f.email}</p></div>}
          {f.notiz && <div><p className="text-muted-foreground text-xs">Notiz</p><p className="font-medium">{f.notiz}</p></div>}
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">Letzte Fahrten</h3></div>
        <table className="w-full">
          <tbody>
            {fFahrten.slice(0, 10).map(ft => {
              const fz = getFahrzeug(ft.fahrzeugId);
              return (
                <tr key={ft.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrten/${ft.id}`)}>
                  <td className="px-5 py-3 text-sm">{formatDate(ft.datum)}</td>
                  <td className="px-5 py-3 text-sm">{fahrtTypLabels[ft.typ]}</td>
                  <td className="px-5 py-3 text-xs font-mono">{fz?.kennzeichen}</td>
                  <td className="px-5 py-3"><StatusBadge status={ft.status} /></td>
                  <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{ft.preis ? formatCurrency(ft.preis) : "–"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {fzIds.length > 0 && (
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Genutzte Fahrzeuge</h3>
          <div className="flex flex-wrap gap-2">
            {fzIds.map(fzId => { const fz = getFahrzeug(fzId); return fz ? (
              <span key={fzId} onClick={() => navigate(`/fahrzeuge/${fzId}`)} className="px-3 py-1.5 bg-muted rounded-lg text-xs font-mono font-medium cursor-pointer hover:bg-muted/70 transition-colors">{fz.kennzeichen}</span>
            ) : null; })}
          </div>
        </div>
      )}
    </div>
  );
}
