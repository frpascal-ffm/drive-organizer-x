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
import { useTranslation } from "react-i18next";

export default function FahrtBearbeiten() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getFahrt, updateFahrt, fahrer, fahrzeuge, aktiveFahrttypen } = useAppContext();
  const fahrt = getFahrt(id || "");

  const [typ, setTyp] = useState(fahrt?.typ || "");
  const [datum, setDatum] = useState(fahrt?.datum || "");
  const [uhrzeit, setUhrzeit] = useState(fahrt?.uhrzeit || "");
  const [von, setVon] = useState(fahrt?.von || "");
  const [nach, setNach] = useState(fahrt?.nach || "");
  const [fahrerId, setFahrerId] = useState(fahrt?.fahrerId || "");
  const [fahrzeugId, setFahrzeugId] = useState(fahrt?.fahrzeugId || "");
  const [status, setStatus] = useState<string>(fahrt?.status || "geplant");
  const [preis, setPreis] = useState(fahrt?.preis?.toString() || "");
  const [mwst, setMwst] = useState(fahrt?.mwst?.toString() || "19");
  const [kunde, setKunde] = useState(fahrt?.kunde || "");
  const [notiz, setNotiz] = useState(fahrt?.notiz || "");

  if (!fahrt) return <div className="p-12 text-center text-muted-foreground">Fahrt nicht gefunden.</div>;

  // Include current type even if disabled
  const typOptions = [...new Set([...aktiveFahrttypen, fahrt.typ])];

  const handleSave = () => {
    if (!typ || !datum || !uhrzeit || !von || !nach || !fahrerId || !fahrzeugId) {
      toast.error("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }
    updateFahrt(fahrt.id, {
      typ: typ as any,
      datum, uhrzeit, von, nach, fahrerId, fahrzeugId,
      status: status as any,
      preis: preis ? parseFloat(preis) : undefined,
      mwst: mwst ? parseInt(mwst) : undefined,
      kunde: kunde || undefined,
      notiz: notiz || undefined,
    });
    toast.success("Fahrt wurde aktualisiert.");
    navigate(`/fahrten/${fahrt.id}`);
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title={`Fahrt ${fahrt.fahrtNummer} bearbeiten`} back />
      <div className="space-y-8">
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fahrtdetails</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fahrttyp *</Label>
              <Select value={typ} onValueChange={setTyp}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {typOptions.map(k => (
                    <SelectItem key={k} value={k}>{t(`fahrtTyp.${k}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="geplant">{t("status.geplant")}</SelectItem>
                  <SelectItem value="erledigt">{t("status.erledigt")}</SelectItem>
                  <SelectItem value="storniert">{t("status.storniert")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Datum *</Label><Input type="date" value={datum} onChange={e => setDatum(e.target.value)} /></div>
            <div className="space-y-2"><Label>Uhrzeit *</Label><Input type="time" value={uhrzeit} onChange={e => setUhrzeit(e.target.value)} /></div>
          </div>
        </section>
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Route</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Von *</Label><Input value={von} onChange={e => setVon(e.target.value)} /></div>
            <div className="space-y-2"><Label>Nach *</Label><Input value={nach} onChange={e => setNach(e.target.value)} /></div>
          </div>
        </section>
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Zuordnung</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fahrer *</Label>
              <Select value={fahrerId} onValueChange={setFahrerId}>
                <SelectTrigger><SelectValue placeholder="Fahrer wählen" /></SelectTrigger>
                <SelectContent>
                  {fahrer.filter(f => f.status === "aktiv").map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.vorname} {f.nachname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fahrzeug *</Label>
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
            <div className="space-y-2"><Label>Preis (€)</Label><Input type="number" value={preis} onChange={e => setPreis(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>MwSt.</Label>
              <Select value={mwst} onValueChange={setMwst}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="7">7 %</SelectItem><SelectItem value="19">19 %</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Kunde / Firma</Label><Input value={kunde} onChange={e => setKunde(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Notiz</Label><Textarea value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} /></div>
        </section>
        <div className="flex gap-3">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Speichern</Button>
          <Button variant="outline" onClick={() => navigate(`/fahrten/${fahrt.id}`)}>Abbrechen</Button>
        </div>
      </div>
    </div>
  );
}
