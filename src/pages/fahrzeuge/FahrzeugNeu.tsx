import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function FahrzeugNeu() {
  const navigate = useNavigate();
  const [kennzeichen, setKennzeichen] = useState("");
  const [marke, setMarke] = useState("");
  const [modell, setModell] = useState("");
  const [baujahr, setBaujahr] = useState("");
  const [farbe, setFarbe] = useState("");
  const [status, setStatus] = useState("aktiv");

  const handleSave = () => {
    if (!kennzeichen || !marke || !modell) { toast.error("Bitte Pflichtfelder ausfüllen."); return; }
    toast.success("Fahrzeug wurde angelegt.");
    navigate("/fahrzeuge");
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <PageHeader title="Neues Fahrzeug" back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Kennzeichen *</Label><Input placeholder="B-MF 1007" value={kennzeichen} onChange={e => setKennzeichen(e.target.value)} /></div>
          <div className="space-y-2"><Label>Status</Label>
            <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="aktiv">Aktiv</SelectItem><SelectItem value="inaktiv">Inaktiv</SelectItem><SelectItem value="werkstatt">Werkstatt</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label>Marke *</Label><Input placeholder="Mercedes-Benz" value={marke} onChange={e => setMarke(e.target.value)} /></div>
          <div className="space-y-2"><Label>Modell *</Label><Input placeholder="V-Klasse" value={modell} onChange={e => setModell(e.target.value)} /></div>
          <div className="space-y-2"><Label>Baujahr</Label><Input type="number" placeholder="2024" value={baujahr} onChange={e => setBaujahr(e.target.value)} /></div>
          <div className="space-y-2"><Label>Farbe</Label><Input placeholder="Schwarz" value={farbe} onChange={e => setFarbe(e.target.value)} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Speichern</Button>
          <Button variant="outline" onClick={() => navigate("/fahrzeuge")}>Abbrechen</Button>
        </div>
      </div>
    </div>
  );
}
