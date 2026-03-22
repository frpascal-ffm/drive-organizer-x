import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/data/mockData";
import { MessageSquare, Send, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function FahrtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getFahrt, getFahrer, getFahrzeug, addKommentar } = useAppContext();
  const fahrt = getFahrt(id || "");
  const [comment, setComment] = useState("");

  if (!fahrt) return <div className="p-12 text-center text-muted-foreground">{t("fahrtDetail.nichtGefunden")}</div>;

  const fahrer = getFahrer(fahrt.fahrerId);
  const fz = getFahrzeug(fahrt.fahrzeugId);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addKommentar(fahrt.id, comment, "Sie");
    setComment("");
    toast.success(t("fahrtDetail.kommentarHinzugefuegt"));
  };

  const info = [
    [t("fahrtDetail.fahrttyp"), t(`fahrtTyp.${fahrt.typ}`)],
    [t("fahrtDetail.datum"), `${formatDate(fahrt.datum)} · ${fahrt.uhrzeit}`],
    [t("fahrtDetail.von"), fahrt.von],
    [t("fahrtDetail.nach"), fahrt.nach],
    [t("fahrtDetail.fahrer"), fahrer ? <Link to={`/fahrer/${fahrer.id}`} className="text-primary hover:underline">{fahrer.vorname} {fahrer.nachname}</Link> : "–"],
    [t("fahrtDetail.fahrzeug"), fz ? <Link to={`/fahrzeuge/${fz.id}`} className="text-primary hover:underline font-mono text-xs">{fz.kennzeichen}</Link> : "–"],
    [t("fahrtDetail.preis"), fahrt.preis ? `${formatCurrency(fahrt.preis)} (${fahrt.mwst} % MwSt)` : "–"],
    [t("fahrtDetail.kunde"), fahrt.kunde || "–"],
    [t("fahrtDetail.notiz"), fahrt.notiz || "–"],
  ];

  return (
    <div className="max-w-2xl animate-fade-in">
      <PageHeader title={`Fahrt ${fahrt.fahrtNummer}`} back
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={fahrt.status} />
            <Button size="sm" variant="outline" onClick={() => navigate(`/fahrten/${fahrt.id}/bearbeiten`)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />Bearbeiten
            </Button>
          </div>
        }
      />
      <div className="space-y-6">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="space-y-3">
            {info.map(([label, value]) => (
              <div key={String(label)} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> {t("fahrtDetail.kommentare")} ({fahrt.kommentare.length})
          </h3>
          {fahrt.kommentare.length === 0 && <p className="text-sm text-muted-foreground mb-4">{t("fahrtDetail.keineKommentare")}</p>}
          <div className="space-y-3 mb-4">
            {fahrt.kommentare.map(c => (
              <div key={c.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{c.autor}</span>
                  <span className="text-[11px] text-muted-foreground">{new Date(c.datum).toLocaleString("de-DE")}</span>
                </div>
                <p className="text-sm">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea placeholder={t("fahrtDetail.kommentarSchreiben")} value={comment} onChange={e => setComment(e.target.value)} rows={2} className="flex-1" />
            <Button size="icon" onClick={handleAddComment} className="shrink-0 self-end"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
