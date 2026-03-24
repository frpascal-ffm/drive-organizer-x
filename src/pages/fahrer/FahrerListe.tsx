import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/data/mockData";
import { Plus, Search, MoreVertical, Pencil, Trash2, UserX, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function FahrerListe() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { fahrer, fahrten, updateFahrer, deleteFahrer } = useAppContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("aktiv");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const data = fahrer
    .filter(f => {
      if (statusFilter !== "alle" && f.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const searchable = [f.vorname, f.nachname, f.adresse, f.telefon, f.email || "", f.notiz || "", f.status].join(" ").toLowerCase();
        if (!searchable.includes(s)) return false;
      }
      return true;
    })
    .map(f => {
      const fFahrten = fahrten.filter(ft => ft.fahrerId === f.id && ft.status === "erledigt" && ft.preis);
      const einnahmen = fFahrten.reduce((s, ft) => s + (ft.preis || 0), 0);
      const fzIds = [...new Set(fahrten.filter(ft => ft.fahrerId === f.id).map(ft => ft.fahrzeugId))];
      return { ...f, fahrtenCount: fFahrten.length, einnahmen, fahrzeugeCount: fzIds.length };
    });

  const deleteTargetFahrer = deleteTarget ? fahrer.find(f => f.id === deleteTarget) : null;

  if (fahrer.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title={t("fahrerSeite.title")} description={t("fahrerSeite.description", { filtered: 0, total: 0 })}
          action={<Button asChild><Link to="/fahrer/neu"><Plus className="h-4 w-4 mr-1.5" />{t("fahrerSeite.neu")}</Link></Button>} />
        <EmptyState
          icon={Users}
          title="Noch keine Fahrer angelegt"
          description="Erfassen Sie Ihre Fahrer, um Fahrten zuordnen und monatliche Abrechnungen erstellen zu können."
          actionLabel="Ersten Fahrer anlegen"
          actionTo="/fahrer/neu"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={t("fahrerSeite.title")} description={t("fahrerSeite.description", { filtered: data.length, total: fahrer.length })}
        action={<Button asChild><Link to="/fahrer/neu"><Plus className="h-4 w-4 mr-1.5" />{t("fahrerSeite.neu")}</Link></Button>} />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder={t("fahrerSeite.searchPlaceholder")} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">{t("fahrerSeite.alleStatus")}</SelectItem>
            <SelectItem value="aktiv">{t("status.aktiv")}</SelectItem>
            <SelectItem value="inaktiv">{t("status.inaktiv")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerSeite.name")}</th>
            <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerSeite.status")}</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerSeite.fahrten")}</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerSeite.einnahmen")}</th>
            <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("fahrerSeite.fahrzeuge")}</th>
            <th className="w-10 px-2 py-3"></th>
          </tr></thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3 text-sm font-medium cursor-pointer" onClick={() => navigate(`/fahrer/${d.id}`)}>{d.vorname} {d.nachname}</td>
                <td className="px-4 py-3 cursor-pointer" onClick={() => navigate(`/fahrer/${d.id}`)}><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-sm text-right tabular-nums cursor-pointer" onClick={() => navigate(`/fahrer/${d.id}`)}>{d.fahrtenCount}</td>
                <td className="px-4 py-3 text-sm text-right font-medium tabular-nums cursor-pointer" onClick={() => navigate(`/fahrer/${d.id}`)}>{formatCurrency(d.einnahmen)}</td>
                <td className="px-4 py-3 text-sm text-right tabular-nums cursor-pointer" onClick={() => navigate(`/fahrer/${d.id}`)}>{d.fahrzeugeCount}</td>
                <td className="px-2 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all focus:opacity-100">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => navigate(`/fahrer/${d.id}/bearbeiten`)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" />{t("fahrerSeite.bearbeiten")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        try {
                          await updateFahrer(d.id, { status: d.status === "aktiv" ? "inaktiv" : "aktiv" });
                          toast.success(d.status === "aktiv" ? t("fahrerSeite.wurdeDeaktiviert", { name: `${d.vorname} ${d.nachname}` }) : t("fahrerSeite.wurdeAktiviert", { name: `${d.vorname} ${d.nachname}` }));
                        } catch (e: any) { toast.error(e.message || "Fehler."); }
                      }}>
                        <UserX className="h-3.5 w-3.5 mr-2" />{d.status === "aktiv" ? t("fahrerSeite.deaktivieren") : t("fahrerSeite.aktivieren")}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(d.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" />{t("fahrerSeite.loeschen")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">{t("fahrerSeite.keineGefunden")}</div>}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("fahrerSeite.loeschenTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("fahrerSeite.loeschenDesc", { name: deleteTargetFahrer ? `${deleteTargetFahrer.vorname} ${deleteTargetFahrer.nachname}` : "" }).replace(/<\/?strong>/g, '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
              if (deleteTarget) {
                deleteFahrer(deleteTarget);
                toast.success(t("fahrerSeite.wurdeGeloescht", { name: `${deleteTargetFahrer?.vorname} ${deleteTargetFahrer?.nachname}` }));
              }
              setDeleteTarget(null);
            }}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
