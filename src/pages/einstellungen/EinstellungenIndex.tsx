import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Save, Moon, Plus, X } from "lucide-react";

const DEFAULT_TYPEN = ["Krankenfahrt", "Flughafentransfer", "Privatfahrt", "Firmenfahrt"];

function loadFahrttypen(): string[] {
  try {
    const saved = localStorage.getItem("fahrttypen");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [...DEFAULT_TYPEN];
}

function saveFahrttypen(typen: string[]) {
  localStorage.setItem("fahrttypen", JSON.stringify(typen));
}

export default function EinstellungenIndex() {
  const { theme, setTheme } = useTheme();
  const [firma, setFirma] = useState("MietFleet GmbH");
  const [adresse, setAdresse] = useState("Musterstraße 12, 10115 Berlin");
  const [telefon, setTelefon] = useState("030 1234567");
  const [email, setEmail] = useState("info@mietfleet.de");
  const [mwst, setMwst] = useState("19");

  const [fahrttypen, setFahrttypen] = useState<string[]>(loadFahrttypen);
  const [neuerTyp, setNeuerTyp] = useState("");

  const addTyp = () => {
    const name = neuerTyp.trim();
    if (!name) return;
    if (fahrttypen.some(t => t.toLowerCase() === name.toLowerCase())) {
      toast.error("Dieser Fahrttyp existiert bereits.");
      return;
    }
    const updated = [...fahrttypen, name];
    setFahrttypen(updated);
    saveFahrttypen(updated);
    setNeuerTyp("");
    toast.success(`„${name}" hinzugefügt.`);
  };

  const removeTyp = (typ: string) => {
    const updated = fahrttypen.filter(t => t !== typ);
    setFahrttypen(updated);
    saveFahrttypen(updated);
    toast(`„${typ}" entfernt.`, { duration: 2000 });
  };

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
        <p className="text-sm text-muted-foreground">Fahrttypen für Ihren Betrieb verwalten. Typen können hinzugefügt und entfernt werden.</p>
        <div className="space-y-2">
          {fahrttypen.map(typ => (
            <div key={typ} className="flex items-center justify-between px-3 py-2.5 rounded-lg border bg-muted/20 group">
              <span className="text-sm font-medium">{typ}</span>
              <button
                onClick={() => removeTyp(typ)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {fahrttypen.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">Keine Fahrttypen definiert.</p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Neuer Fahrttyp…"
            value={neuerTyp}
            onChange={e => setNeuerTyp(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTyp()}
            className="h-9 text-sm"
          />
          <Button size="sm" className="h-9 shrink-0" onClick={addTyp} disabled={!neuerTyp.trim()}>
            <Plus className="h-3.5 w-3.5 mr-1" />Hinzufügen
          </Button>
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
