import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fahrzeuge, fahrerList } from "@/data/mockData";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FahrtNeu() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      toast.error(t("fahrtNeu.pflichtfelder"));
      return;
    }
    toast.success(t("fahrtNeu.erfolg"));
    navigate("/fahrten");
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title={t("fahrtNeu.title")} description={t("fahrtNeu.description")} back />
      <div className="space-y-8">
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fahrtNeu.fahrtdetails")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("fahrtNeu.fahrttyp")}</Label>
              <Select value={typ} onValueChange={setTyp}>
                <SelectTrigger><SelectValue placeholder={t("fahrtNeu.typWaehlen")} /></SelectTrigger>
                <SelectContent>
                  {["krankenfahrt", "flughafentransfer", "privatfahrt", "firmenfahrt"].map(k => (
                    <SelectItem key={k} value={k}>{t(`fahrtTyp.${k}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("fahrtNeu.status")}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="geplant">{t("status.geplant")}</SelectItem>
                  <SelectItem value="erledigt">{t("status.erledigt")}</SelectItem>
                  <SelectItem value="storniert">{t("status.storniert")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>{t("fahrtNeu.datum")}</Label><Input type="date" value={datum} onChange={e => setDatum(e.target.value)} /></div>
            <div className="space-y-2"><Label>{t("fahrtNeu.uhrzeit")}</Label><Input type="time" value={uhrzeit} onChange={e => setUhrzeit(e.target.value)} /></div>
          </div>
        </section>

        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fahrtNeu.route")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("fahrtNeu.von")}</Label><Input placeholder={t("fahrtNeu.abholadresse")} value={von} onChange={e => setVon(e.target.value)} /></div>
            <div className="space-y-2"><Label>{t("fahrtNeu.nach")}</Label><Input placeholder={t("fahrtNeu.zieladresse")} value={nach} onChange={e => setNach(e.target.value)} /></div>
          </div>
        </section>

        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fahrtNeu.zuordnung")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("fahrten.fahrer")}</Label>
              <Select value={fahrerId} onValueChange={setFahrerId}>
                <SelectTrigger><SelectValue placeholder={t("fahrtNeu.fahrerWaehlen")} /></SelectTrigger>
                <SelectContent>
                  {fahrerList.filter(f => f.status === "aktiv").map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.vorname} {f.nachname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("fahrten.fahrzeug")}</Label>
              <Select value={fahrzeugId} onValueChange={setFahrzeugId}>
                <SelectTrigger><SelectValue placeholder={t("fahrtNeu.fahrzeugWaehlen")} /></SelectTrigger>
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
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fahrtNeu.preisUndKunde")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>{t("fahrtNeu.preis")}</Label><Input type="number" placeholder="0,00" value={preis} onChange={e => setPreis(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>{t("fahrtNeu.mwst")}</Label>
              <Select value={mwst} onValueChange={setMwst}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="7">7 %</SelectItem><SelectItem value="19">19 %</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>{t("fahrtNeu.kundeFirma")}</Label><Input placeholder={t("fahrtNeu.optional")} value={kunde} onChange={e => setKunde(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>{t("fahrtNeu.notiz")}</Label><Textarea placeholder={t("fahrtNeu.notizPlaceholder")} value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} /></div>
        </section>

        <div className="flex gap-3">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />{t("fahrtNeu.speichern")}</Button>
          <Button variant="outline" onClick={() => navigate("/fahrten")}>{t("common.cancel")}</Button>
        </div>
      </div>
    </div>
  );
}
