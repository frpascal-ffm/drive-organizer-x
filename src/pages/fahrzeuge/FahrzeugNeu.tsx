import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function FahrzeugNeu() {
  const navigate = useNavigate();

  // Grunddaten
  const [kennzeichen, setKennzeichen] = useState("");
  const [marke, setMarke] = useState("");
  const [modell, setModell] = useState("");
  const [baujahr, setBaujahr] = useState("");
  const [farbe, setFarbe] = useState("");
  const [status, setStatus] = useState("aktiv");
  const [konzessionsnummer, setKonzessionsnummer] = useState("");

  // Technische Daten
  const [fin, setFin] = useState("");
  const [erstzulassung, setErstzulassung] = useState("");
  const [antrieb, setAntrieb] = useState("");
  const [getriebe, setGetriebe] = useState("");
  const [leistungKw, setLeistungKw] = useState("");
  const [hubraum, setHubraum] = useState("");
  const [sitzplaetze, setSitzplaetze] = useState("");
  const [fahrzeugklasse, setFahrzeugklasse] = useState("");
  const [kmStand, setKmStand] = useState("");

  // TÜV
  const [tuevBis, setTuevBis] = useState("");

  // Versicherung / Leasing
  const [versicherung, setVersicherung] = useState("");
  const [versicherungsnummer, setVersicherungsnummer] = useState("");
  const [leasinggeber, setLeasinggeber] = useState("");
  const [leasingEnde, setLeasingEnde] = useState("");
  const [vertragsnummer, setVertragsnummer] = useState("");

  // Notizen
  const [notiz, setNotiz] = useState("");

  const handleSave = () => {
    if (!kennzeichen || !marke || !modell) {
      toast.error("Bitte Pflichtfelder ausfüllen.");
      return;
    }
    toast.success("Fahrzeug wurde angelegt.");
    navigate("/fahrzeuge");
  };

  return (
    <div className="max-w-2xl animate-fade-in space-y-6">
      <PageHeader title="Neues Fahrzeug" back />

      {/* Grunddaten */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold">Grunddaten</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Kennzeichen *</Label>
            <Input placeholder="B-MF 1007" value={kennzeichen} onChange={e => setKennzeichen(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aktiv">Aktiv</SelectItem>
                <SelectItem value="inaktiv">Inaktiv</SelectItem>
                <SelectItem value="werkstatt">Werkstatt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Marke *</Label>
            <Input placeholder="Mercedes-Benz" value={marke} onChange={e => setMarke(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Modell *</Label>
            <Input placeholder="V-Klasse" value={modell} onChange={e => setModell(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Baujahr</Label>
            <Input type="number" placeholder="2024" value={baujahr} onChange={e => setBaujahr(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Farbe</Label>
            <Input placeholder="Schwarz" value={farbe} onChange={e => setFarbe(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Konzessionsnummer</Label>
            <Input placeholder="K-12345" value={konzessionsnummer} onChange={e => setKonzessionsnummer(e.target.value)} className="font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label>HU/TÜV gültig bis</Label>
            <Input type="month" value={tuevBis} onChange={e => setTuevBis(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Technische Daten */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold">Technische Daten</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>FIN (Fahrgestellnummer)</Label>
            <Input placeholder="WDB9066351S123456" value={fin} onChange={e => setFin(e.target.value)} className="font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label>Erstzulassung</Label>
            <Input type="date" value={erstzulassung} onChange={e => setErstzulassung(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Antrieb</Label>
            <Select value={antrieb} onValueChange={setAntrieb}>
              <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="benzin">Benzin</SelectItem>
                <SelectItem value="elektro">Elektro</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="phev">Plug-in-Hybrid</SelectItem>
                <SelectItem value="gas">Erdgas/LPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Getriebe</Label>
            <Select value={getriebe} onValueChange={setGetriebe}>
              <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="automatik">Automatik</SelectItem>
                <SelectItem value="manuell">Manuell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Leistung (kW)</Label>
            <Input type="number" placeholder="120" value={leistungKw} onChange={e => setLeistungKw(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Hubraum (ccm)</Label>
            <Input type="number" placeholder="1950" value={hubraum} onChange={e => setHubraum(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Sitzplätze</Label>
            <Input type="number" placeholder="5" value={sitzplaetze} onChange={e => setSitzplaetze(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Fahrzeugklasse</Label>
            <Select value={fahrzeugklasse} onValueChange={setFahrzeugklasse}>
              <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pkw">PKW</SelectItem>
                <SelectItem value="van">Van / Kleinbus</SelectItem>
                <SelectItem value="transporter">Transporter</SelectItem>
                <SelectItem value="kombi">Kombi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Aktueller km-Stand</Label>
            <Input type="number" placeholder="45000" value={kmStand} onChange={e => setKmStand(e.target.value)} />
          </div>
        </div>
      </div>

      {/* TÜV */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold">TÜV / Hauptuntersuchung</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>HU/TÜV gültig bis</Label>
            <Input type="month" value={tuevBis} onChange={e => setTuevBis(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Versicherung / Leasing */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold">Versicherung & Leasing/Finanzierung</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Versicherungsgesellschaft</Label>
            <Input placeholder="HUK-COBURG" value={versicherung} onChange={e => setVersicherung(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Versicherungsnummer</Label>
            <Input placeholder="VN-123456789" value={versicherungsnummer} onChange={e => setVersicherungsnummer(e.target.value)} className="font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label>Leasing/Finanzierung</Label>
            <Input placeholder="Mercedes-Benz Leasing" value={leasinggeber} onChange={e => setLeasinggeber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Leasing-Ende</Label>
            <Input type="date" value={leasingEnde} onChange={e => setLeasingEnde(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Vertragsnummer</Label>
            <Input placeholder="LV-2024-00123" value={vertragsnummer} onChange={e => setVertragsnummer(e.target.value)} className="font-mono text-sm" />
          </div>
        </div>
      </div>

      {/* Notizen */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold">Notizen</h3>
        <Textarea placeholder="Besonderheiten, Ausstattung, Anmerkungen…" value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-6">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1.5" />Speichern
        </Button>
        <Button variant="outline" onClick={() => navigate("/fahrzeuge")}>Abbrechen</Button>
      </div>
    </div>
  );
}
