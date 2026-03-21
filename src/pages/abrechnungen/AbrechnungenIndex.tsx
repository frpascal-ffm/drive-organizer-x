import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fahrerList, fahrten, plattformUmsaetze, getFahrzeug, formatCurrency, formatDate, fahrtTypLabels } from "@/data/mockData";
import { FileText, Plus, Check, TrendingUp, Car, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Abrechnung {
  id: string;
  fahrerId: string;
  monat: string; // "2026-03"
  erstelltAm: string;
  status: "entwurf" | "abgeschlossen";
}

const MONATE = [
  { value: "2026-03", label: "März 2026" },
  { value: "2026-02", label: "Februar 2026" },
  { value: "2026-01", label: "Januar 2026" },
];

export default function AbrechnungenIndex() {
  const [fahrerId, setFahrerId] = useState("");
  const [monat, setMonat] = useState("2026-03");
  const [abrechnungen, setAbrechnungen] = useState<Abrechnung[]>([]);
  const [ansicht, setAnsicht] = useState<"liste" | "erstellen">("liste");

  const monatLabel = MONATE.find(m => m.value === monat)?.label || monat;

  // Filter rides for selected driver + month
  const fahrerFahrten = useMemo(() => {
    if (!fahrerId) return [];
    return fahrten.filter(f => {
      if (f.fahrerId !== fahrerId || f.status !== "erledigt" || !f.preis) return false;
      return f.datum.startsWith(monat);
    });
  }, [fahrerId, monat]);

  // Filter platform revenue for selected driver + month
  const fahrerPlattform = useMemo(() => {
    if (!fahrerId) return [];
    return plattformUmsaetze.filter(p => {
      if (p.fahrerId !== fahrerId) return false;
      return p.zeitraumVon.startsWith(monat) || p.zeitraumBis.startsWith(monat);
    });
  }, [fahrerId, monat]);

  const eigenUmsatz = fahrerFahrten.reduce((s, f) => s + (f.preis || 0), 0);
  const plattformNetto = fahrerPlattform.reduce((s, p) => s + p.netto, 0);
  const plattformBrutto = fahrerPlattform.reduce((s, p) => s + p.betrag, 0);
  const plattformProvision = fahrerPlattform.reduce((s, p) => s + p.provision, 0);
  const gesamt = eigenUmsatz + plattformNetto;

  const fahrer = fahrerList.find(f => f.id === fahrerId);

  // Existing settlements for list view
  const abrechnungenFiltered = abrechnungen.filter(a =>
    (!fahrerId || a.fahrerId === fahrerId) && a.monat === monat
  );

  const handleErstellen = () => {
    if (!fahrerId) {
      toast.error("Bitte wählen Sie einen Fahrer aus.");
      return;
    }
    const exists = abrechnungen.find(a => a.fahrerId === fahrerId && a.monat === monat);
    if (exists) {
      toast.error("Für diesen Fahrer und Monat existiert bereits eine Abrechnung.");
      return;
    }
    setAnsicht("erstellen");
  };

  const handleSpeichern = (status: "entwurf" | "abgeschlossen") => {
    const neu: Abrechnung = {
      id: `abr-${Date.now()}`,
      fahrerId,
      monat,
      erstelltAm: new Date().toISOString().split("T")[0],
      status,
    };
    setAbrechnungen(prev => [...prev, neu]);
    setAnsicht("liste");
    toast.success(status === "abgeschlossen" ? "Abrechnung abgeschlossen und gespeichert." : "Entwurf gespeichert.");
  };

  const handleAbschliessen = (id: string) => {
    setAbrechnungen(prev => prev.map(a => a.id === id ? { ...a, status: "abgeschlossen" } : a));
    toast.success("Abrechnung abgeschlossen.");
  };

  // --- Erstellen-Ansicht ---
  if (ansicht === "erstellen" && fahrerId) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setAnsicht("liste")}>← Zurück</Button>
          <PageHeader title="Abrechnung erstellen" description={`${fahrer?.vorname} ${fahrer?.nachname} – ${monatLabel}`} />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Eigene Fahrten</p>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(eigenUmsatz)}</p>
            <p className="text-xs text-muted-foreground mt-1">{fahrerFahrten.length} Fahrten</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Plattformen (netto)</p>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(plattformNetto)}</p>
            <p className="text-xs text-muted-foreground mt-1">{fahrerPlattform.reduce((s, p) => s + p.fahrtenAnzahl, 0)} Fahrten</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Gesamt (netto)</p>
            <p className="text-2xl font-semibold text-primary tabular-nums">{formatCurrency(gesamt)}</p>
          </div>
        </div>

        {/* Eigene Fahrten table */}
        {fahrerFahrten.length > 0 && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-muted/30">
              <h3 className="text-sm font-semibold">Eigene Fahrten</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Datum</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Typ</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Route</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Preis</th>
                </tr>
              </thead>
              <tbody>
                {fahrerFahrten.map(f => {
                  const fz = getFahrzeug(f.fahrzeugId);
                  return (
                    <tr key={f.id} className="border-b last:border-0">
                      <td className="px-4 py-2.5 text-sm">{formatDate(f.datum)}</td>
                      <td className="px-4 py-2.5 text-sm">{fahrtTypLabels[f.typ]}</td>
                      <td className="px-4 py-2.5 text-sm">{f.von} → {f.nach}</td>
                      <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{fz?.kennzeichen}</td>
                      <td className="px-4 py-2.5 text-sm text-right font-medium tabular-nums">{formatCurrency(f.preis!)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-muted/20">
                  <td colSpan={4} className="px-4 py-2.5 text-sm font-medium">Summe eigene Fahrten</td>
                  <td className="px-4 py-2.5 text-sm text-right font-semibold tabular-nums">{formatCurrency(eigenUmsatz)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Plattformen table */}
        {fahrerPlattform.length > 0 && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-muted/30">
              <h3 className="text-sm font-semibold">Plattformumsätze</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Plattform</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Zeitraum</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrzeug</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Brutto</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Provision</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Netto</th>
                </tr>
              </thead>
              <tbody>
                {fahrerPlattform.map(p => {
                  const fz = getFahrzeug(p.fahrzeugId);
                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-4 py-2.5 text-sm font-medium">{p.plattform}</td>
                      <td className="px-4 py-2.5 text-sm">{formatDate(p.zeitraumVon)} – {formatDate(p.zeitraumBis)}</td>
                      <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{fz?.kennzeichen}</td>
                      <td className="px-4 py-2.5 text-sm text-right tabular-nums">{formatCurrency(p.betrag)}</td>
                      <td className="px-4 py-2.5 text-sm text-right tabular-nums text-muted-foreground">-{formatCurrency(p.provision)}</td>
                      <td className="px-4 py-2.5 text-sm text-right font-medium tabular-nums">{formatCurrency(p.netto)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-muted/20">
                  <td colSpan={5} className="px-4 py-2.5 text-sm font-medium">Summe Plattformen (netto)</td>
                  <td className="px-4 py-2.5 text-sm text-right font-semibold tabular-nums">{formatCurrency(plattformNetto)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {fahrerFahrten.length === 0 && fahrerPlattform.length === 0 && (
          <div className="bg-card rounded-xl border p-12 shadow-sm text-center">
            <p className="text-muted-foreground text-sm">Keine Umsätze für diesen Fahrer im gewählten Monat.</p>
          </div>
        )}

        {/* Gesamtübersicht */}
        {gesamt > 0 && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-muted/30">
              <h3 className="text-sm font-semibold">Zusammenfassung</h3>
            </div>
            <div className="divide-y">
              <div className="px-5 py-3 flex justify-between">
                <span className="text-sm text-muted-foreground">Eigene Fahrten</span>
                <span className="text-sm font-medium tabular-nums">{formatCurrency(eigenUmsatz)}</span>
              </div>
              {plattformNetto > 0 && (
                <>
                  <div className="px-5 py-3 flex justify-between">
                    <span className="text-sm text-muted-foreground">Plattformen (brutto)</span>
                    <span className="text-sm tabular-nums">{formatCurrency(plattformBrutto)}</span>
                  </div>
                  <div className="px-5 py-3 flex justify-between">
                    <span className="text-sm text-muted-foreground">Abzgl. Provision</span>
                    <span className="text-sm tabular-nums text-muted-foreground">-{formatCurrency(plattformProvision)}</span>
                  </div>
                </>
              )}
              <div className="px-5 py-4 flex justify-between bg-primary/5">
                <span className="text-sm font-semibold">Gesamtumsatz (netto)</span>
                <span className="text-lg font-bold text-primary tabular-nums">{formatCurrency(gesamt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => handleSpeichern("entwurf")}>Als Entwurf speichern</Button>
          <Button onClick={() => handleSpeichern("abgeschlossen")}>
            <Check className="h-4 w-4 mr-1.5" />
            Abrechnung abschließen
          </Button>
          <Button variant="outline" onClick={() => toast.success("Abrechnung als PDF vorbereitet.")}>
            <FileText className="h-4 w-4 mr-1.5" />
            PDF exportieren
          </Button>
        </div>
      </div>
    );
  }

  // --- Liste-Ansicht ---
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader title="Abrechnungen" description="Monatliche Fahrerabrechnungen erstellen und verwalten" />
        <Button size="sm" onClick={handleErstellen}>
          <Plus className="h-4 w-4 mr-1.5" />
          Abrechnung erstellen
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={monat} onValueChange={setMonat}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MONATE.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={fahrerId} onValueChange={setFahrerId}>
          <SelectTrigger className="w-[200px] h-9 text-sm"><SelectValue placeholder="Alle Fahrer" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Fahrer</SelectItem>
            {fahrerList.filter(f => f.status === "aktiv").map(f => (
              <SelectItem key={f.id} value={f.id}>{f.vorname} {f.nachname}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick overview: All active drivers for selected month */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/30">
          <h3 className="text-sm font-semibold">Übersicht {monatLabel}</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/20">
              <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrer</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Eigene Fahrten</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Plattformen</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Gesamt</th>
              <th className="text-center px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {fahrerList.filter(f => f.status === "aktiv").filter(f => fahrerId === "" || fahrerId === "alle" || f.id === fahrerId).map(f => {
              const eigenF = fahrten.filter(ft => ft.fahrerId === f.id && ft.status === "erledigt" && ft.preis && ft.datum.startsWith(monat));
              const eigenS = eigenF.reduce((s, ft) => s + (ft.preis || 0), 0);
              const platF = plattformUmsaetze.filter(p => p.fahrerId === f.id && (p.zeitraumVon.startsWith(monat) || p.zeitraumBis.startsWith(monat)));
              const platS = platF.reduce((s, p) => s + p.netto, 0);
              const total = eigenS + platS;
              const abr = abrechnungen.find(a => a.fahrerId === f.id && a.monat === monat);

              return (
                <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{f.vorname} {f.nachname}</td>
                  <td className="px-4 py-3 text-sm text-right tabular-nums">{formatCurrency(eigenS)}</td>
                  <td className="px-4 py-3 text-sm text-right tabular-nums">{formatCurrency(platS)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold tabular-nums">{formatCurrency(total)}</td>
                  <td className="px-4 py-3 text-center">
                    {abr ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        abr.status === "abgeschlossen" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {abr.status === "abgeschlossen" ? "Abgeschlossen" : "Entwurf"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">–</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!abr ? (
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setFahrerId(f.id); setAnsicht("erstellen"); }}>
                        Erstellen
                      </Button>
                    ) : abr.status === "entwurf" ? (
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setFahrerId(f.id); setAnsicht("erstellen"); }}>
                          Bearbeiten
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleAbschliessen(abr.id)}>
                          Abschließen
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => toast.success("PDF exportiert")}>
                        <FileText className="h-3 w-3 mr-1" /> PDF
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
