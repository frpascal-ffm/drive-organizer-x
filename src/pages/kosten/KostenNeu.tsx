import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { Save } from "lucide-react";

const fixKategorien = ["Leasing", "Versicherung", "Steuer", "Sonstiges"];
const varKategorien = ["Sprit", "Werkstatt", "Reinigung", "Material", "Sonstiges"];

type Betragsart = "brutto" | "netto" | "steuerneutral";
const MWST_SATZ = 19;

export default function KostenNeu() {
  const navigate = useNavigate();
  const { addKosten, fahrzeuge } = useAppContext();
  const [typ, setTyp] = useState<"fix" | "variabel">("variabel");
  const [kategorie, setKategorie] = useState("");
  const [betrag, setBetrag] = useState("");
  const [betragsart, setBetragsart] = useState<Betragsart>("brutto");
  const [fahrzeugId, setFahrzeugId] = useState("");
  const [datum, setDatum] = useState("");
  const [intervall, setIntervall] = useState("");
  const [notiz, setNotiz] = useState("");
  const [fzSearch, setFzSearch] = useState("");

  const betragNum = parseFloat(betrag) || 0;
  const nettoWert = betragsart === "brutto" ? betragNum / (1 + MWST_SATZ / 100) : betragsart === "netto" ? betragNum : betragNum;
  const bruttoWert = betragsart === "netto" ? betragNum * (1 + MWST_SATZ / 100) : betragsart === "brutto" ? betragNum : betragNum;
  const mwstWert = betragsart === "steuerneutral" ? 0 : bruttoWert - nettoWert;

  const filteredFz = fahrzeuge.filter(f => !fzSearch || f.kennzeichen.toLowerCase().includes(fzSearch.toLowerCase()) || `${f.marke} ${f.modell}`.toLowerCase().includes(fzSearch.toLowerCase()));

  const handleSave = () => {
    if (!kategorie || !betrag || !fahrzeugId || !datum) { toast.error("Bitte Pflichtfelder ausfüllen."); return; }
    addKosten({
      typ, kategorie, betrag: parseFloat(betrag), fahrzeugId, datum,
      intervall: typ === "fix" && intervall ? intervall as any : undefined,
      notiz: notiz || undefined,
    });
    toast.success("Kosten wurden erfasst.");
    navigate("/kosten");
  };

  const kats = typ === "fix" ? fixKategorien : varKategorien;

  return (
    <div className="max-w-xl animate-fade-in">
      <PageHeader title="Kosten erfassen" back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="space-y-2">
          <Label>Kostenart *</Label>
          <div className="flex gap-2">
            <button onClick={() => setTyp("variabel")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${typ === "variabel" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>Variable Kosten</button>
            <button onClick={() => setTyp("fix")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${typ === "fix" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>Fixkosten</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Kategorie *</Label>
            <Select value={kategorie} onValueChange={setKategorie}><SelectTrigger><SelectValue placeholder="Kategorie wählen" /></SelectTrigger>
              <SelectContent>{kats.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2">
            <Label>Betrag (€) *</Label>
            <Input type="number" placeholder="0,00" value={betrag} onChange={e => setBetrag(e.target.value)} />
            <div className="flex rounded-lg border overflow-hidden w-fit">
              {(["brutto", "netto", "steuerneutral"] as Betragsart[]).map(art => (
                <button key={art} type="button" onClick={() => setBetragsart(art)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${betragsart === art ? "bg-primary text-primary-foreground" : "hover:bg-muted"} ${art !== "steuerneutral" ? "border-r" : ""}`}>
                  {art === "brutto" ? "Brutto" : art === "netto" ? "Netto" : "Steuerneutral"}
                </button>
              ))}
            </div>
            {betragNum > 0 && betragsart !== "steuerneutral" && (
              <div className="flex gap-3 text-[11px] text-muted-foreground pt-0.5">
                <span>Netto: {nettoWert.toFixed(2)} €</span>
                <span>MwSt ({MWST_SATZ}%): {mwstWert.toFixed(2)} €</span>
                <span>Brutto: {bruttoWert.toFixed(2)} €</span>
              </div>
            )}
          </div>
          <div className="space-y-2"><Label>Datum *</Label><Input type="date" value={datum} onChange={e => setDatum(e.target.value)} /></div>
          {typ === "fix" && <div className="space-y-2"><Label>Intervall</Label>
            <Select value={intervall} onValueChange={setIntervall}><SelectTrigger><SelectValue placeholder="Intervall wählen" /></SelectTrigger>
              <SelectContent><SelectItem value="monatlich">Monatlich</SelectItem><SelectItem value="quartalsweise">Quartalsweise</SelectItem><SelectItem value="halbjaehrlich">Halbjährlich</SelectItem><SelectItem value="jaehrlich">Jährlich</SelectItem></SelectContent></Select></div>}
        </div>
        <div className="space-y-2">
          <Label>Fahrzeug *</Label>
          <Input placeholder="Kennzeichen eingeben…" value={fzSearch} onChange={e => { setFzSearch(e.target.value); setFahrzeugId(""); }} className="mb-2" />
          {fzSearch && !fahrzeugId && (
            <div className="border rounded-lg overflow-hidden">
              {filteredFz.map(f => (
                <button key={f.id} onClick={() => { setFahrzeugId(f.id); setFzSearch(f.kennzeichen); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-b last:border-0">
                  <span className="font-mono font-medium">{f.kennzeichen}</span> <span className="text-muted-foreground">– {f.marke} {f.modell}</span>
                </button>
              ))}
              {filteredFz.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">Kein Fahrzeug gefunden.</p>}
            </div>
          )}
        </div>
        <div className="space-y-2"><Label>Notiz</Label><Textarea value={notiz} onChange={e => setNotiz(e.target.value)} rows={2} /></div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Speichern</Button>
          <Button variant="outline" onClick={() => navigate("/kosten")}>Abbrechen</Button>
        </div>
      </div>
    </div>
  );
}
