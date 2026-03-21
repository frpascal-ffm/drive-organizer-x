import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Save, Moon } from "lucide-react";

export default function EinstellungenIndex() {
  const { theme, setTheme } = useTheme();
  const [firma, setFirma] = useState("MietFleet GmbH");
  const [adresse, setAdresse] = useState("Musterstraße 12, 10115 Berlin");
  const [telefon, setTelefon] = useState("030 1234567");
  const [email, setEmail] = useState("info@mietfleet.de");
  const [mwst, setMwst] = useState("19");

  const [krankenfahrt, setKrankenfahrt] = useState(true);
  const [flughafentransfer, setFlughafentransfer] = useState(true);
  const [privatfahrt, setPrivatfahrt] = useState(true);
  const [firmenfahrt, setFirmenfahrt] = useState(true);

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <PageHeader title="Einstellungen" description="Firmendaten und Konfiguration" />

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Firmendaten</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Firmenname</Label><Input value={firma} onChange={e => setFirma(e.target.value)} /></div>
          <div className="space-y-2"><Label>Telefon</Label><Input value={telefon} onChange={e => setTelefon(e.target.value)} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>Adresse</Label><Input value={adresse} onChange={e => setAdresse(e.target.value)} /></div>
          <div className="space-y-2"><Label>E-Mail</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label>Standard-MwSt (%)</Label><Input value={mwst} onChange={e => setMwst(e.target.value)} /></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fahrttypen</h3>
        <p className="text-sm text-muted-foreground">Aktivieren oder deaktivieren Sie Fahrttypen für Ihren Betrieb.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between"><Label>Krankenfahrt</Label><Switch checked={krankenfahrt} onCheckedChange={setKrankenfahrt} /></div>
          <div className="flex items-center justify-between"><Label>Flughafentransfer</Label><Switch checked={flughafentransfer} onCheckedChange={setFlughafentransfer} /></div>
          <div className="flex items-center justify-between"><Label>Privatfahrt</Label><Switch checked={privatfahrt} onCheckedChange={setPrivatfahrt} /></div>
          <div className="flex items-center justify-between"><Label>Firmenfahrt</Label><Switch checked={firmenfahrt} onCheckedChange={setFirmenfahrt} /></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Moon className="h-4 w-4" /> Erscheinungsbild
        </h3>
        <div className="flex items-center justify-between">
          <div><Label>Dark Mode</Label><p className="text-xs text-muted-foreground mt-0.5">Dunkles Erscheinungsbild aktivieren</p></div>
          <Switch checked={theme === "dark"} onCheckedChange={c => setTheme(c ? "dark" : "light")} />
        </div>
      </div>

      <Button onClick={() => toast.success("Einstellungen gespeichert.")}><Save className="h-4 w-4 mr-1.5" />Einstellungen speichern</Button>
    </div>
  );
}
