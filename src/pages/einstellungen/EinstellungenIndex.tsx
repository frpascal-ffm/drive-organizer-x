import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Save, Moon, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n/config";
import { useAppContext } from "@/context/AppContext";

const fahrtTypLabels: Record<string, string> = {
  krankenfahrt: "Krankenfahrt",
  flughafentransfer: "Flughafentransfer",
  privatfahrt: "Privatfahrt",
  firmenfahrt: "Firmenfahrt",
};

export default function EinstellungenIndex() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { fahrttypen, toggleFahrttyp } = useAppContext();
  const [firma, setFirma] = useState("MietFleet GmbH");
  const [adresse, setAdresse] = useState("Musterstraße 12, 10115 Berlin");
  const [telefon, setTelefon] = useState("030 1234567");
  const [email, setEmail] = useState("info@mietfleet.de");
  const [mwst, setMwst] = useState("19");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("app-language", lng);
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <PageHeader title={t("einstellungen.title")} description={t("einstellungen.description")} />

      {/* Sprache */}
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Globe className="h-4 w-4" /> {t("einstellungen.sprache")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("einstellungen.spracheInfo")}</p>
        <Select value={i18n.language} onValueChange={changeLanguage}>
          <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>{lang.flag} {lang.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("einstellungen.firmendaten")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>{t("einstellungen.firmenname")}</Label><Input value={firma} onChange={e => setFirma(e.target.value)} /></div>
          <div className="space-y-2"><Label>{t("einstellungen.telefon")}</Label><Input value={telefon} onChange={e => setTelefon(e.target.value)} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>{t("einstellungen.adresse")}</Label><Input value={adresse} onChange={e => setAdresse(e.target.value)} /></div>
          <div className="space-y-2"><Label>{t("einstellungen.email")}</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label>{t("einstellungen.standardMwst")}</Label><Input value={mwst} onChange={e => setMwst(e.target.value)} /></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("einstellungen.fahrttypen")}</h3>
        <p className="text-sm text-muted-foreground">Aktivierte Fahrttypen sind in Formularen auswählbar.</p>
        <div className="space-y-3">
          {fahrttypen.map(typ => (
            <div key={typ.key} className="flex items-center justify-between">
              <Label className={typ.enabled ? "" : "text-muted-foreground"}>
                {fahrtTypLabels[typ.key] || typ.key}
              </Label>
              <Switch checked={typ.enabled} onCheckedChange={() => toggleFahrttyp(typ.key)} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Moon className="h-4 w-4" /> {t("einstellungen.erscheinungsbild")}
        </h3>
        <div className="flex items-center justify-between">
          <div><Label>{t("einstellungen.darkMode")}</Label><p className="text-xs text-muted-foreground mt-0.5">{t("einstellungen.darkModeInfo")}</p></div>
          <Switch checked={theme === "dark"} onCheckedChange={c => setTheme(c ? "dark" : "light")} />
        </div>
      </div>

      <Button onClick={() => toast.success(t("einstellungen.gespeichert"))}><Save className="h-4 w-4 mr-1.5" />{t("einstellungen.speichern")}</Button>
    </div>
  );
}
