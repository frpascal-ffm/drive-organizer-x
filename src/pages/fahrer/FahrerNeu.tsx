import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FahrerNeu() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addFahrer } = useAppContext();
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [notiz, setNotiz] = useState("");

  const handleSave = () => {
    if (!vorname || !nachname || !telefon) { toast.error(t("fahrerNeu.pflichtfelder")); return; }
    const id = addFahrer({ vorname, nachname, adresse, telefon, email: email || undefined, status: "aktiv", notiz: notiz || undefined });
    toast.success(t("fahrerNeu.erfolg"));
    navigate(`/fahrer/${id}`);
  };

  return (
    <div className="max-w-xl animate-fade-in">
      <PageHeader title={t("fahrerNeu.title")} back />
      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>{t("fahrerNeu.vorname")}</Label><Input value={vorname} onChange={e => setVorname(e.target.value)} /></div>
          <div className="space-y-2"><Label>{t("fahrerNeu.nachname")}</Label><Input value={nachname} onChange={e => setNachname(e.target.value)} /></div>
          <div className="sm:col-span-2 space-y-2"><Label>{t("fahrerNeu.adresse")}</Label><Input value={adresse} onChange={e => setAdresse(e.target.value)} /></div>
          <div className="space-y-2"><Label>{t("fahrerNeu.telefon")}</Label><Input value={telefon} onChange={e => setTelefon(e.target.value)} /></div>
          <div className="space-y-2"><Label>{t("fahrerNeu.email")}</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>{t("fahrerNeu.notiz")}</Label><Textarea value={notiz} onChange={e => setNotiz(e.target.value)} rows={3} /></div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-1.5" />{t("common.save")}</Button>
          <Button variant="outline" onClick={() => navigate("/fahrer")}>{t("common.cancel")}</Button>
        </div>
      </div>
    </div>
  );
}
