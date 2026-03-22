import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getFahrer, fahrten, getFahrzeug, formatCurrency, formatDate, getAbrechnungenByFahrer } from "@/data/mockData";
import { useTranslation } from "react-i18next";

export default function FahrerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const f = getFahrer(id || "");
  if (!f) return <div className="p-12 text-center text-muted-foreground">{t("fahrerDetail.nichtGefunden")}</div>;

  const fFahrten = fahrten.filter(ft => ft.fahrerId === f.id);
  const erledigte = fFahrten.filter(ft => ft.status === "erledigt" && ft.preis);
  const einnahmen = erledigte.reduce((s, ft) => s + (ft.preis || 0), 0);
  const fzIds = [...new Set(fFahrten.map(ft => ft.fahrzeugId))];
  const fahrerAbrechnungen = getAbrechnungenByFahrer(f.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={`${f.vorname} ${f.nachname}`} back action={<StatusBadge status={f.status} />} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("fahrerDetail.einnahmen")}</p>
          <p className="text-xl font-semibold">{formatCurrency(einnahmen)}</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("fahrerDetail.erledigteFahrten")}</p>
          <p className="text-xl font-semibold">{erledigte.length}</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("fahrerDetail.genutzeFahrzeuge")}</p>
          <p className="text-xl font-semibold">{fzIds.length}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">{t("fahrerDetail.stammdaten")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground text-xs">{t("fahrerDetail.adresse")}</p><p className="font-medium">{f.adresse}</p></div>
          <div><p className="text-muted-foreground text-xs">{t("fahrerDetail.telefon")}</p><p className="font-medium">{f.telefon}</p></div>
          {f.email && <div><p className="text-muted-foreground text-xs">{t("fahrerDetail.email")}</p><p className="font-medium">{f.email}</p></div>}
          <div className="sm:col-span-2">
            <p className="text-muted-foreground text-xs">{t("fahrerDetail.notiz")}</p>
            <p className="font-medium">{f.notiz || "–"}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">{t("fahrerDetail.letzteFahrten")}</h3></div>
        <table className="w-full">
          <tbody>
            {fFahrten.slice(0, 10).map(ft => {
              const fz = getFahrzeug(ft.fahrzeugId);
              return (
                <tr key={ft.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/fahrten/${ft.id}`)}>
                  <td className="px-5 py-3 text-sm">{formatDate(ft.datum)}</td>
                  <td className="px-5 py-3 text-sm">{t(`fahrtTyp.${ft.typ}`)}</td>
                  <td className="px-5 py-3 text-xs font-mono">{fz?.kennzeichen}</td>
                  <td className="px-5 py-3"><StatusBadge status={ft.status} /></td>
                  <td className="px-5 py-3 text-sm text-right font-medium tabular-nums">{ft.preis ? formatCurrency(ft.preis) : "–"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {fahrerAbrechnungen.length > 0 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b"><h3 className="text-sm font-semibold">{t("fahrerDetail.abrechnungen")}</h3></div>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="text-left px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerDetail.monat")}</th>
                <th className="text-right px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerDetail.ergebnis")}</th>
                <th className="text-center px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerDetail.status")}</th>
              </tr>
            </thead>
            <tbody>
              {fahrerAbrechnungen.map(abr => {
                const total = abr.positionen.reduce((s, p) => s + (p.vorzeichen === '+' ? p.betrag : -p.betrag), 0);
                const monatLabel = new Date(abr.monat + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
                return (
                  <tr key={abr.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate('/abrechnungen')}>
                    <td className="px-5 py-3 text-sm font-medium capitalize">{monatLabel}</td>
                    <td className={`px-5 py-3 text-sm text-right font-semibold tabular-nums ${total >= 0 ? '' : 'text-destructive'}`}>{formatCurrency(total)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${abr.status === 'abgeschlossen' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {t(`status.${abr.status}`)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {fzIds.length > 0 && (
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">{t("fahrerDetail.genutzeFahrzeuge")}</h3>
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
