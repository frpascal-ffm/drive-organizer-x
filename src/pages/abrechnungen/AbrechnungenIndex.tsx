import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fahrerList, fahrten, formatCurrency, formatDate, fahrtTypLabels } from "@/data/mockData";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AbrechnungenIndex() {
  const [fahrerId, setFahrerId] = useState("");
  const [zeitraum, setZeitraum] = useState("maerz-2026");

  const fahrer = fahrerList.find(f => f.id === fahrerId);
  const fFahrten = fahrerId ? fahrten.filter(f => f.fahrerId === fahrerId && f.status === "erledigt" && f.preis) : [];
  const summe = fFahrten.reduce((s, f) => s + (f.preis || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Abrechnungen" description="Fahrerabrechnungen erstellen" />

      <div className="flex flex-wrap gap-3">
        <Select value={zeitraum} onValueChange={setZeitraum}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="maerz-2026">März 2026</SelectItem>
            <SelectItem value="februar-2026">Februar 2026</SelectItem>
            <SelectItem value="januar-2026">Januar 2026</SelectItem>
          </SelectContent>
        </Select>
        <Select value={fahrerId} onValueChange={setFahrerId}>
          <SelectTrigger className="w-[200px] h-9 text-sm"><SelectValue placeholder="Fahrer wählen" /></SelectTrigger>
          <SelectContent>
            {fahrerList.filter(f => f.status === "aktiv").map(f => (
              <SelectItem key={f.id} value={f.id}>{f.vorname} {f.nachname}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!fahrerId ? (
        <div className="bg-card rounded-xl border p-12 shadow-sm text-center">
          <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Wählen Sie einen Fahrer und Zeitraum, um eine Abrechnung zu erstellen.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{fahrer?.vorname} {fahrer?.nachname}</h3>
                <p className="text-sm text-muted-foreground">Abrechnungszeitraum: März 2026</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Gesamtumsatz</p>
                <p className="text-2xl font-semibold text-primary">{formatCurrency(summe)}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <table className="w-full">
                <thead><tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left pb-2">Datum</th><th className="text-left pb-2">Typ</th><th className="text-left pb-2">Route</th><th className="text-right pb-2">Preis</th>
                </tr></thead>
                <tbody>
                  {fFahrten.map(f => (
                    <tr key={f.id} className="border-t">
                      <td className="py-2 text-sm">{formatDate(f.datum)}</td>
                      <td className="py-2 text-sm">{fahrtTypLabels[f.typ]}</td>
                      <td className="py-2 text-sm">{f.von} → {f.nach}</td>
                      <td className="py-2 text-sm text-right font-medium tabular-nums">{formatCurrency(f.preis!)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Button onClick={() => toast.success("Abrechnung wurde als PDF vorbereitet.")}><FileText className="h-4 w-4 mr-1.5" />Abrechnung exportieren</Button>
        </div>
      )}
    </div>
  );
}
