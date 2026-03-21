import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function FahrerNeu() {
  const navigate = useNavigate();
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [notiz, setNotiz] = useState("");

  const handleSave = () => {
    if (!vorname || !nachname || !telefon) { toast.error("Bitte Pflichtfelder ausfüllen."); return; }
    toast.success("Fahrer wurde angelegt.");
    navigate("/fahrer");
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <PageHeader title="Neuer Fahrer" back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Vorname *</Label><Input value={vorname} onChange={e => setVorname(e.target.value)} /></div>
          <div className="space-y-2"><Label>Nachname *</Label><Input value={nachname} onChange={e => setNachname(e.target.value)} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>Adresse</Label><Input value={adresse} onChange={e => setAdresse(e.target.value)} /></div>
          <div className="space-y-2"><Label>Telefon *</Label><Input value={telefon} onChange={e => setTelefon(e.target.value)} /></div>
          <div className="space-y-2"><Label>E-Mail</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>Notiz</Label><Textarea value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} /></div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Speichern</Button>
          <Button variant="outline" onClick={() => navigate("/fahrer")}>Abbrechen</Button>
        </div>
      </div>
    </div>
  );
}
