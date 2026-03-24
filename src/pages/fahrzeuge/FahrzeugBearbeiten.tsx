import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function FahrzeugBearbeiten() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFahrzeug, updateFahrzeug } = useAppContext();
  const fz = getFahrzeug(id || "");

  const [kennzeichen, setKennzeichen] = useState(fz?.kennzeichen || "");
  const [marke, setMarke] = useState(fz?.marke || "");
  const [modell, setModell] = useState(fz?.modell || "");
  const [baujahr, setBaujahr] = useState(fz?.baujahr?.toString() || "");
  const [farbe, setFarbe] = useState(fz?.farbe || "");
  const [status, setStatus] = useState<string>(fz?.status || "aktiv");

  if (!fz) return <div className="p-12 text-center text-muted-foreground">Fahrzeug nicht gefunden.</div>;

  const handleSave = async () => {
    if (!kennzeichen || !marke || !modell) { toast.error("Bitte Pflichtfelder ausfüllen."); return; }
    try {
      await updateFahrzeug(fz.id, {
        kennzeichen, marke, modell,
        baujahr: baujahr ? parseInt(baujahr) : fz.baujahr,
        farbe, status: status as any,
      });
      toast.success("Fahrzeug wurde aktualisiert.");
      navigate(`/fahrzeuge/${fz.id}`);
    } catch (e: any) { toast.error(e.message || "Fehler beim Speichern."); }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title={`${fz.kennzeichen} bearbeiten`} back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Kennzeichen *</Label><Input value={kennzeichen} onChange={e => setKennzeichen(e.target.value)} /></div>
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
          <div className="space-y-2"><Label>Marke *</Label><Input value={marke} onChange={e => setMarke(e.target.value)} /></div>
          <div className="space-y-2"><Label>Modell *</Label><Input value={modell} onChange={e => setModell(e.target.value)} /></div>
          <div className="space-y-2"><Label>Baujahr</Label><Input type="number" value={baujahr} onChange={e => setBaujahr(e.target.value)} /></div>
          <div className="space-y-2"><Label>Farbe</Label><Input value={farbe} onChange={e => setFarbe(e.target.value)} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Speichern</Button>
          <Button variant="outline" onClick={() => navigate(`/fahrzeuge/${fz.id}`)}>Abbrechen</Button>
        </div>
      </div>
    </div>
  );
}
