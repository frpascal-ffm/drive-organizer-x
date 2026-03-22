import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate, fahrtTypLabels } from "@/data/mockData";
import { FileText, Plus, Check, ArrowLeft, Trash2, Minus } from "lucide-react";
import { toast } from "sonner";

type Vorzeichen = "+" | "-";

interface Position {
  id: string; label: string; betrag: number; vorzeichen: Vorzeichen;
}

interface Abrechnung {
  id: string; fahrerId: string; monat: string; positionen: Position[]; status: "entwurf" | "abgeschlossen"; erstelltAm: string;
}

const MONATE = [
  { value: "2026-03", label: "März 2026" },
  { value: "2026-02", label: "Februar 2026" },
  { value: "2026-01", label: "Januar 2026" },
];

type Ansicht = "liste" | "fahrer-waehlen" | "detail";

export default function AbrechnungenIndex() {
  const { fahrer, fahrten, plattformUmsaetze } = useAppContext();
  const [ansicht, setAnsicht] = useState<Ansicht>("liste");
  const [monat, setMonat] = useState("2026-03");
  const [abrechnungen, setAbrechnungen] = useState<Abrechnung[]>([]);
  const [detailFahrerId, setDetailFahrerId] = useState("");
  const [detailMonat, setDetailMonat] = useState("2026-03");
  const [positionen, setPositionen] = useState<Position[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const monatLabel = (m: string) => MONATE.find(x => x.value === m)?.label || m;

  const fahrerFahrten = useMemo(() => {
    if (!detailFahrerId) return [];
    return fahrten.filter(f => f.fahrerId === detailFahrerId && f.status === "erledigt" && f.preis && f.datum.startsWith(detailMonat));
  }, [detailFahrerId, detailMonat, fahrten]);

  const fahrerPlattform = useMemo(() => {
    if (!detailFahrerId) return [];
    return plattformUmsaetze.filter(p => p.fahrerId === detailFahrerId && (p.zeitraumVon.startsWith(detailMonat) || p.zeitraumBis.startsWith(detailMonat)));
  }, [detailFahrerId, detailMonat, plattformUmsaetze]);

  const basisUmsatz = fahrerFahrten.reduce((s, f) => s + (f.preis || 0), 0) + fahrerPlattform.reduce((s, p) => s + p.netto, 0);

  const ergebnis = useMemo(() => {
    return positionen.reduce((sum, p) => sum + (p.vorzeichen === "+" ? p.betrag : -p.betrag), basisUmsatz);
  }, [positionen, basisUmsatz]);

  const fahrerObj = fahrer.find(f => f.id === detailFahrerId);

  const handleNeu = () => { setDetailFahrerId(""); setDetailMonat(monat); setPositionen([]); setAnsicht("fahrer-waehlen"); };

  const handleFahrerGewaehlt = (fId: string) => {
    setDetailFahrerId(fId);
    const eigenF = fahrten.filter(f => f.fahrerId === fId && f.status === "erledigt" && f.preis && f.datum.startsWith(detailMonat));
    const eigenS = eigenF.reduce((s, f) => s + (f.preis || 0), 0);
    const platF = plattformUmsaetze.filter(p => p.fahrerId === fId && (p.zeitraumVon.startsWith(detailMonat) || p.zeitraumBis.startsWith(detailMonat)));
    const platS = platF.reduce((s, p) => s + p.netto, 0);
    const initial: Position[] = [];
    if (eigenS > 0) initial.push({ id: `pos-eigen`, label: `Eigene Fahrten (${eigenF.length})`, betrag: eigenS, vorzeichen: "+" });
    if (platS > 0) initial.push({ id: `pos-plat`, label: `Plattformumsätze (netto)`, betrag: platS, vorzeichen: "+" });
    setPositionen(initial);
    setAnsicht("detail");
  };

  const addPosition = (vorzeichen: Vorzeichen) => { const id = `pos-${Date.now()}`; setPositionen(prev => [...prev, { id, label: "", betrag: 0, vorzeichen }]); setEditId(id); };
  const updatePosition = (id: string, updates: Partial<Position>) => { setPositionen(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)); };
  const removePosition = (id: string) => { setPositionen(prev => prev.filter(p => p.id !== id)); };

  const handleSpeichern = (status: "entwurf" | "abgeschlossen") => {
    const exists = abrechnungen.findIndex(a => a.fahrerId === detailFahrerId && a.monat === detailMonat);
    const neu: Abrechnung = { id: exists >= 0 ? abrechnungen[exists].id : `abr-${Date.now()}`, fahrerId: detailFahrerId, monat: detailMonat, positionen: [...positionen], status, erstelltAm: new Date().toISOString().split("T")[0] };
    if (exists >= 0) setAbrechnungen(prev => prev.map((a, i) => i === exists ? neu : a));
    else setAbrechnungen(prev => [...prev, neu]);
    setAnsicht("liste");
    toast.success(status === "abgeschlossen" ? "Abrechnung abgeschlossen." : "Entwurf gespeichert.");
  };

  const handleOpenExisting = (abr: Abrechnung) => { setDetailFahrerId(abr.fahrerId); setDetailMonat(abr.monat); setPositionen([...abr.positionen]); setAnsicht("detail"); };

  // Fahrer-Auswahl
  if (ansicht === "fahrer-waehlen") {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setAnsicht("liste")}><ArrowLeft className="h-4 w-4 mr-1" /> Zurück</Button>
          <PageHeader title="Neue Abrechnung" description="Fahrer und Monat auswählen" />
        </div>
        <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Monat</label>
            <Select value={detailMonat} onValueChange={setDetailMonat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MONATE.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fahrer</label>
            {fahrer.filter(f => f.status === "aktiv").length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Keine aktiven Fahrer vorhanden. Legen Sie zuerst einen Fahrer an.</p>
            ) : (
              <div className="space-y-1">
                {fahrer.filter(f => f.status === "aktiv").map(f => {
                  const exists = abrechnungen.find(a => a.fahrerId === f.id && a.monat === detailMonat);
                  return (
                    <button key={f.id} onClick={() => !exists && handleFahrerGewaehlt(f.id)} disabled={!!exists}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors ${exists ? "opacity-50 cursor-not-allowed bg-muted/30" : "hover:bg-muted/30 hover:border-primary/30 cursor-pointer"}`}>
                      <div><p className="text-sm font-medium">{f.vorname} {f.nachname}</p><p className="text-xs text-muted-foreground">{f.telefon}</p></div>
                      {exists && <span className="text-xs text-muted-foreground">Bereits vorhanden</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detail
  if (ansicht === "detail" && detailFahrerId) {
    return (
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setAnsicht("liste")}><ArrowLeft className="h-4 w-4 mr-1" /> Zurück</Button>
          <PageHeader title={`Abrechnung – ${fahrerObj?.vorname} ${fahrerObj?.nachname}`} description={monatLabel(detailMonat)} />
        </div>
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/30 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Positionen</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => addPosition("+")}><Plus className="h-3 w-3 mr-1" /> Einnahme</Button>
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => addPosition("-")}><Minus className="h-3 w-3 mr-1" /> Abzug</Button>
            </div>
          </div>
          <div className="divide-y">
            {positionen.map((pos) => (
              <div key={pos.id} className="px-5 py-3 flex items-center gap-3 group">
                <span className={`text-sm font-bold w-5 text-center shrink-0 ${pos.vorzeichen === "+" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{pos.vorzeichen}</span>
                {editId === pos.id ? (
                  <>
                    <Input autoFocus className="h-8 text-sm flex-1" placeholder="Bezeichnung" value={pos.label} onChange={e => updatePosition(pos.id, { label: e.target.value })} onKeyDown={e => e.key === "Enter" && setEditId(null)} />
                    <Input className="h-8 text-sm w-32 text-right tabular-nums" type="number" min="0" step="0.01" placeholder="0,00" value={pos.betrag || ""} onChange={e => updatePosition(pos.id, { betrag: parseFloat(e.target.value) || 0 })} onKeyDown={e => e.key === "Enter" && setEditId(null)} />
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setEditId(null)}><Check className="h-3.5 w-3.5" /></Button>
                  </>
                ) : (
                  <>
                    <span className="text-sm flex-1 cursor-pointer hover:text-primary transition-colors" onClick={() => setEditId(pos.id)}>
                      {pos.label || <span className="text-muted-foreground italic">Bezeichnung eingeben…</span>}
                    </span>
                    <span className={`text-sm font-medium tabular-nums shrink-0 ${pos.vorzeichen === "-" ? "text-red-500 dark:text-red-400" : ""}`}>{pos.vorzeichen === "-" ? "-" : ""}{formatCurrency(pos.betrag)}</span>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditId(pos.id)}><FileText className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removePosition(pos.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {positionen.length === 0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">Keine Positionen vorhanden. Fügen Sie Einnahmen oder Abzüge hinzu.</div>}
          </div>
          <div className="px-5 py-4 border-t bg-primary/5 flex items-center justify-between">
            <span className="text-sm font-semibold">Ergebnis</span>
            <span className={`text-xl font-bold tabular-nums ${ergebnis >= 0 ? "text-primary" : "text-red-500 dark:text-red-400"}`}>{formatCurrency(ergebnis)}</span>
          </div>
        </div>
        {(fahrerFahrten.length > 0 || fahrerPlattform.length > 0) && (
          <details className="group">
            <summary className="text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors">Umsatzdetails anzeigen</summary>
            <div className="mt-3 space-y-3">
              {fahrerFahrten.length > 0 && (
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-semibold">Eigene Fahrten</div>
                  <table className="w-full"><tbody>
                    {fahrerFahrten.map(f => (
                      <tr key={f.id} className="border-b last:border-0 text-xs">
                        <td className="px-4 py-2">{formatDate(f.datum)}</td>
                        <td className="px-4 py-2">{fahrtTypLabels[f.typ]}</td>
                        <td className="px-4 py-2">{f.von} → {f.nach}</td>
                        <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(f.preis!)}</td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              )}
              {fahrerPlattform.length > 0 && (
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-semibold">Plattformumsätze</div>
                  <table className="w-full"><tbody>
                    {fahrerPlattform.map(p => (
                      <tr key={p.id} className="border-b last:border-0 text-xs">
                        <td className="px-4 py-2 font-medium">{p.plattform}</td>
                        <td className="px-4 py-2">{formatDate(p.zeitraumVon)} – {formatDate(p.zeitraumBis)}</td>
                        <td className="px-4 py-2 text-right tabular-nums font-medium">{formatCurrency(p.netto)}</td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              )}
            </div>
          </details>
        )}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => handleSpeichern("entwurf")}>Als Entwurf speichern</Button>
          <Button onClick={() => handleSpeichern("abgeschlossen")}><Check className="h-4 w-4 mr-1.5" />Abrechnung abschließen</Button>
        </div>
      </div>
    );
  }

  // Liste
  const filteredAbrechnungen = abrechnungen.filter(a => a.monat === monat);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader title="Abrechnungen" description="Monatliche Fahrerabrechnungen erstellen und verwalten" />
        <Button size="sm" onClick={handleNeu}><Plus className="h-4 w-4 mr-1.5" />Abrechnung erstellen</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Select value={monat} onValueChange={setMonat}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>{MONATE.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {filteredAbrechnungen.length > 0 ? (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/30"><h3 className="text-sm font-semibold">Abrechnungen {monatLabel(monat)}</h3></div>
          <table className="w-full">
            <thead><tr className="border-b bg-muted/20">
              <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fahrer</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Ergebnis</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Positionen</th>
              <th className="text-center px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr></thead>
            <tbody>
              {filteredAbrechnungen.map(abr => {
                const f = fahrer.find(x => x.id === abr.fahrerId);
                const total = abr.positionen.reduce((s, p) => s + (p.vorzeichen === "+" ? p.betrag : -p.betrag), 0);
                return (
                  <tr key={abr.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => handleOpenExisting(abr)}>
                    <td className="px-4 py-3 text-sm font-medium">{f?.vorname} {f?.nachname}</td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold tabular-nums ${total >= 0 ? "text-primary" : "text-red-500"}`}>{formatCurrency(total)}</td>
                    <td className="px-4 py-3 text-sm text-right text-muted-foreground">{abr.positionen.length}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${abr.status === "abgeschlossen" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {abr.status === "abgeschlossen" ? "Abgeschlossen" : "Entwurf"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="Noch keine Abrechnungen erstellt"
          description="Erstellen Sie monatliche Fahrerabrechnungen auf Basis der erfassten Fahrten und Plattformumsätze."
          actionLabel="Abrechnung erstellen"
          onAction={handleNeu}
        />
      )}
    </div>
  );
}
