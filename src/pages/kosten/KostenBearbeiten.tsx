import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function KostenBearbeiten() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kosten, updateKosten, fahrzeuge } = useAppContext();
  const k = kosten.find(x => x.id === id);

  const [typ, setTyp] = useState<"fix" | "variabel">(k?.typ || "variabel");
  const [kategorie, setKategorie] = useState(k?.kategorie || "");
  const [betrag, setBetrag] = useState(k?.betrag?.toString() || "");
  const [fahrzeugId, setFahrzeugId] = useState(k?.fahrzeugId || "");
  const [datum, setDatum] = useState(k?.datum || "");
  const [intervall, setIntervall] = useState(k?.intervall || "");
  const [notiz, setNotiz] = useState(k?.notiz || "");

  if (!k) return <div className="p-12 text-center text-muted-foreground">Kosteneintrag nicht gefunden.</div>;

  const kats = typ === "fix" ? fixKategorien : varKategorien;

  const handleSave = () => {
    if (!kategorie || !betrag || !fahrzeugId || !datum) { toast.error("Bitte Pflichtfelder ausfüllen."); return; }
    updateKosten(k.id, {
      typ, kategorie, betrag: parseFloat(betrag), fahrzeugId, datum,
      intervall: typ === "fix" && intervall ? intervall as any : undefined,
      notiz: notiz || undefined,
    });
    toast.success("Kosten wurden aktualisiert.");
    navigate("/kosten");
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <PageHeader title="Kosten bearbeiten" back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="space-y-2">
          <Label>Kostenart</Label>
          <div className="flex gap-2">
            <button onClick={() => setTyp("variabel")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${typ === "variabel" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>Variable Kosten</button>
            <button onClick={() => setTyp("fix")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${typ === "fix" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>Fixkosten</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Kategorie *</Label>
            <Select value={kategorie} onValueChange={setKategorie}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{kats.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Betrag (€) *</Label><Input type="number" value={betrag} onChange={e => setBetrag(e.target.value)} /></div>
          <div className="space-y-2"><Label>Datum *</Label><Input type="date" value={datum} onChange={e => setDatum(e.target.value)} /></div>
          {typ === "fix" && <div className="space-y-2"><Label>Intervall</Label>
            <Select value={intervall} onValueChange={setIntervall}><SelectTrigger><SelectValue placeholder="Intervall wählen" /></SelectTrigger>
              <SelectContent><SelectItem value="monatlich">Monatlich</SelectItem><SelectItem value="quartalsweise">Quartalsweise</SelectItem><SelectItem value="halbjaehrlich">Halbjährlich</SelectItem><SelectItem value="jaehrlich">Jährlich</SelectItem></SelectContent></Select></div>}
          <div className="sm:col-span-2 space-y-2">
            <Label>Fahrzeug *</Label>
            <Select value={fahrzeugId} onValueChange={setFahrzeugId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{fahrzeuge.map(f => <SelectItem key={f.id} value={f.id}>{f.kennzeichen} – {f.marke} {f.modell}</SelectItem>)}</SelectContent>
            </Select>
          </div>
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
