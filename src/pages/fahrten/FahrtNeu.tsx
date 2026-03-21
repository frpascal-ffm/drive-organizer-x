import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fahrzeuge, fahrerList, fahrtTypLabels } from "@/data/mockData";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function FahrtNeu() {
  const navigate = useNavigate();
  const [typ, setTyp] = useState("");
  const [datum, setDatum] = useState("");
  const [uhrzeit, setUhrzeit] = useState("");
  const [von, setVon] = useState("");
  const [nach, setNach] = useState("");
  const [fahrerId, setFahrerId] = useState("");
  const [fahrzeugId, setFahrzeugId] = useState("");
  const [status, setStatus] = useState("geplant");
  const [preis, setPreis] = useState("");
  const [mwst, setMwst] = useState("19");
  const [kunde, setKunde] = useState("");
  const [notiz, setNotiz] = useState("");

  const handleSave = () => {
    if (!typ || !datum || !von || !nach) {
      toast.error("Bitte füllen Sie die Pflichtfelder aus.");
      return;
    }
    toast.success("Fahrt wurde erfolgreich angelegt.");
    navigate("/fahrten");
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title="Neue Fahrt" description="Erfassen Sie eine neue Fahrt" back />

      <div className="space-y-8">
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fahrtdetails</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fahrttyp *</Label>
              <Select value={typ} onValueChange={setTyp}>
                <SelectTrigger><SelectValue placeholder="Typ wählen" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(fahrtTypLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="geplant">Geplant</SelectItem>
                  <SelectItem value="erledigt">Erledigt</SelectItem>
                  <SelectItem value="storniert">Storniert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Datum *</Label>
              <Input type="date" value={datum} onChange={e => setDatum(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Uhrzeit</Label>
              <Input type="time" value={uhrzeit} onChange={e => setUhrzeit(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Route</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Von *</Label>
              <Input placeholder="Abholadresse" value={von} onChange={e => setVon(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nach *</Label>
              <Input placeholder="Zieladresse" value={nach} onChange={e => setNach(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Zuordnung</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fahrer</Label>
              <Select value={fahrerId} onValueChange={setFahrerId}>
                <SelectTrigger><SelectValue placeholder="Fahrer wählen" /></SelectTrigger>
                <SelectContent>
                  {fahrerList.filter(f => f.status === "aktiv").map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.vorname} {f.nachname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fahrzeug</Label>
              <Select value={fahrzeugId} onValueChange={setFahrzeugId}>
                <SelectTrigger><SelectValue placeholder="Fahrzeug wählen" /></SelectTrigger>
                <SelectContent>
                  {fahrzeuge.filter(f => f.status === "aktiv").map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.kennzeichen} – {f.marke} {f.modell}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Preis & Kunde</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Preis (€)</Label>
              <Input type="number" placeholder="0,00" value={preis} onChange={e => setPreis(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>MwSt</Label>
              <Select value={mwst} onValueChange={setMwst}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 %</SelectItem>
                  <SelectItem value="19">19 %</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kunde / Firma</Label>
              <Input placeholder="Optional" value={kunde} onChange={e => setKunde(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notiz</Label>
            <Textarea placeholder="Anmerkungen zur Fahrt…" value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} />
          </div>
        </section>

        <div className="flex gap-3">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Fahrt speichern</Button>
          <Button variant="outline" onClick={() => navigate("/fahrten")}>Abbrechen</Button>
        </div>
      </div>
    </div>
  );
}
