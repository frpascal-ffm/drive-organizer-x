import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { Save, Plus, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FahrtTyp, FahrtStatus } from "@/data/mockData";

export default function FahrtNeu() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addFahrt, fahrer, fahrzeuge, aktiveFahrttypen } = useAppContext();
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
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = () => {
    const e: Record<string, boolean> = {};
    if (!typ) e.typ = true;
    if (!datum) e.datum = true;
    if (!uhrzeit) e.uhrzeit = true;
    if (!von) e.von = true;
    if (!nach) e.nach = true;
    if (!fahrerId) e.fahrerId = true;
    if (!fahrzeugId) e.fahrzeugId = true;
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Bitte alle Pflichtfelder ausfüllen.");
      return false;
    }
    return true;
  };

  const buildFahrt = () => ({
    typ: typ as FahrtTyp,
    datum, uhrzeit, von, nach,
    fahrerId, fahrzeugId,
    status: status as FahrtStatus,
    preis: preis ? parseFloat(preis) : undefined,
    mwst: mwst ? parseInt(mwst) : undefined,
    kunde: kunde || undefined,
    notiz: notiz || undefined,
  });

  const handleSave = () => {
    if (!validate()) return;
    const id = addFahrt(buildFahrt());
    toast.success("Fahrt wurde erstellt.");
    navigate(`/fahrten/${id}`);
  };

  const handleSaveAndNew = () => {
    if (!validate()) return;
    addFahrt(buildFahrt());
    toast.success("Fahrt erstellt – neues Formular bereit.");
    setTyp(""); setDatum(""); setUhrzeit(""); setVon(""); setNach("");
    setFahrerId(""); setFahrzeugId(""); setStatus("geplant");
    setPreis(""); setMwst("19"); setKunde(""); setNotiz("");
    setErrors({});
  };

  const handleSaveAndDuplicate = () => {
    if (!validate()) return;
    addFahrt(buildFahrt());
    toast.success("Fahrt erstellt – Formular dupliziert.");
    // Keep all fields as-is for duplication
  };

  const errCls = (field: string) => errors[field] ? "border-destructive ring-1 ring-destructive/30" : "";

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title={t("fahrtNeu.title")} description={t("fahrtNeu.description")} back />
      <div className="space-y-8">
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fahrtNeu.fahrtdetails")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fahrttyp *</Label>
              <Select value={typ} onValueChange={v => { setTyp(v); setErrors(e => ({ ...e, typ: false })); }}>
                <SelectTrigger className={errCls("typ")}><SelectValue placeholder={t("fahrtNeu.typWaehlen")} /></SelectTrigger>
                <SelectContent>
                  {aktiveFahrttypen.map(k => (
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
            <div className="space-y-2">
              <Label>Datum *</Label>
              <Input type="date" value={datum} onChange={e => { setDatum(e.target.value); setErrors(er => ({ ...er, datum: false })); }} className={errCls("datum")} />
            </div>
            <div className="space-y-2">
              <Label>Uhrzeit *</Label>
              <Input type="time" value={uhrzeit} onChange={e => { setUhrzeit(e.target.value); setErrors(er => ({ ...er, uhrzeit: false })); }} className={errCls("uhrzeit")} />
            </div>
          </div>
        </section>
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fahrtNeu.route")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Von *</Label>
              <Input placeholder={t("fahrtNeu.abholadresse")} value={von} onChange={e => { setVon(e.target.value); setErrors(er => ({ ...er, von: false })); }} className={errCls("von")} />
            </div>
            <div className="space-y-2">
              <Label>Nach *</Label>
              <Input placeholder={t("fahrtNeu.zieladresse")} value={nach} onChange={e => { setNach(e.target.value); setErrors(er => ({ ...er, nach: false })); }} className={errCls("nach")} />
            </div>
          </div>
        </section>
        <section className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fahrtNeu.zuordnung")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fahrer *</Label>
              <Select value={fahrerId} onValueChange={v => { setFahrerId(v); setErrors(e => ({ ...e, fahrerId: false })); }}>
                <SelectTrigger className={errCls("fahrerId")}><SelectValue placeholder={t("fahrtNeu.fahrerWaehlen")} /></SelectTrigger>
                <SelectContent>
                  {fahrer.filter(f => f.status === "aktiv").map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.vorname} {f.nachname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fahrzeug *</Label>
              <Select value={fahrzeugId} onValueChange={v => { setFahrzeugId(v); setErrors(e => ({ ...e, fahrzeugId: false })); }}>
                <SelectTrigger className={errCls("fahrzeugId")}><SelectValue placeholder={t("fahrtNeu.fahrzeugWaehlen")} /></SelectTrigger>
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
            <div className="space-y-2"><Label>Preis (€)</Label><Input type="number" placeholder="0,00" value={preis} onChange={e => setPreis(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>MwSt.</Label>
              <Select value={mwst} onValueChange={setMwst}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="7">7 %</SelectItem><SelectItem value="19">19 %</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Kunde / Firma</Label><Input placeholder={t("fahrtNeu.optional")} value={kunde} onChange={e => setKunde(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Notiz</Label><Textarea placeholder={t("fahrtNeu.notizPlaceholder")} value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} /></div>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />Speichern</Button>
          <Button variant="outline" onClick={handleSaveAndNew}><Plus className="h-4 w-4 mr-1.5" />Speichern & weitere</Button>
          <Button variant="outline" onClick={handleSaveAndDuplicate}><Copy className="h-4 w-4 mr-1.5" />Speichern & duplizieren</Button>
          <Button variant="ghost" onClick={() => navigate("/fahrten")}>{t("common.cancel")}</Button>
        </div>
      </div>
    </div>
  );
}
