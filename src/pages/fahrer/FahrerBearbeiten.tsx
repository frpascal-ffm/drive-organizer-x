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

export default function FahrerBearbeiten() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFahrer, updateFahrer } = useAppContext();
  const fa = getFahrer(id || "");

  const [vorname, setVorname] = useState(fa?.vorname || "");
  const [nachname, setNachname] = useState(fa?.nachname || "");
  const [adresse, setAdresse] = useState(fa?.adresse || "");
  const [telefon, setTelefon] = useState(fa?.telefon || "");
  const [email, setEmail] = useState(fa?.email || "");
  const [status, setStatus] = useState(fa?.status || "aktiv");
  const [notiz, setNotiz] = useState(fa?.notiz || "");

  if (!fa) return <div className="p-12 text-center text-muted-foreground">Fahrer nicht gefunden.</div>;

  const handleSave = () => {
    if (!vorname || !nachname || !telefon) { toast.error("Bitte Pflichtfelder ausfüllen."); return; }
    updateFahrer(fa.id, { vorname, nachname, adresse, telefon, email: email || undefined, status: status as any, notiz: notiz || undefined });
    toast.success("Fahrer wurde aktualisiert.");
    navigate(`/fahrer/${fa.id}`);
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <PageHeader title={`${fa.vorname} ${fa.nachname} bearbeiten`} back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Vorname *</Label><Input value={vorname} onChange={e => setVorname(e.target.value)} /></div>
          <div className="space-y-2"><Label>Nachname *</Label><Input value={nachname} onChange={e => setNachname(e.target.value)} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>Adresse</Label><Input value={adresse} onChange={e => setAdresse(e.target.value)} /></div>
          <div className="space-y-2"><Label>Telefon *</Label><Input value={telefon} onChange={e => setTelefon(e.target.value)} /></div>
          <div className="space-y-2"><Label>E-Mail</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aktiv">Aktiv</SelectItem>
                <SelectItem value="inaktiv">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2"><Label>Notiz</Label><Textarea value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} /></div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Speichern</Button>
          <Button variant="outline" onClick={() => navigate(`/fahrer/${fa.id}`)}>Abbrechen</Button>
        </div>
      </div>
    </div>
  );
}
