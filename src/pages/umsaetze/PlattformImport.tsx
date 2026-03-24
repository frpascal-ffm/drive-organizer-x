import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/data/mockData";
import { checkPlattformDuplicate } from "@/lib/calculations";
import { ArrowLeft, ArrowRight, Upload, Clipboard, X, Check, FileText, CalendarIcon, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

const STEPS = ["Datei hochladen", "Zeitraum", "Zuordnung", "Vorschau", "Abschluss"] as const;
type Step = 0 | 1 | 2 | 3 | 4;

export default function PlattformImport() {
  const navigate = useNavigate();
  const { addPlattformUmsatz, plattformUmsaetze, fahrer, fahrzeuge } = useAppContext();
  const [step, setStep] = useState<Step>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [plattform, setPlattform] = useState("");
  const [vonDatum, setVonDatum] = useState<Date>();
  const [bisDatum, setBisDatum] = useState<Date>();
  const [fahrerId, setFahrerId] = useState("");
  const [fahrzeugId, setFahrzeugId] = useState("");
  const [betrag, setBetrag] = useState("");
  const [provision, setProvision] = useState("");
  const [fahrtenAnzahl, setFahrtenAnzahl] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Duplicate check
  const duplicate = plattform && vonDatum && bisDatum && fahrzeugId
    ? checkPlattformDuplicate(plattformUmsaetze, plattform, format(vonDatum, "yyyy-MM-dd"), format(bisDatum, "yyyy-MM-dd"), fahrzeugId)
    : undefined;

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (step !== 0) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        if (blob) { setFile(blob); setPreview(URL.createObjectURL(blob)); }
        e.preventDefault(); break;
      }
    }
  }, [step]);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setPreview(f.type.startsWith("image/") ? URL.createObjectURL(f) : null); }
  };

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!file;
      case 1: return !!plattform && !!vonDatum && !!bisDatum;
      case 2: return !!fahrerId && !!fahrzeugId && !!betrag && parseFloat(betrag) > 0;
      case 3: return true;
      default: return false;
    }
  };

  const netto = betrag && provision ? parseFloat(betrag) - parseFloat(provision || "0") : parseFloat(betrag || "0");
  const selectedFahrer = fahrer.find(f => f.id === fahrerId);
  const selectedFahrzeug = fahrzeuge.find(f => f.id === fahrzeugId);

  const handleImport = async () => {
    setImporting(true);
    try {
      await addPlattformUmsatz({
        plattform,
        zeitraumVon: vonDatum ? format(vonDatum, "yyyy-MM-dd") : "",
        zeitraumBis: bisDatum ? format(bisDatum, "yyyy-MM-dd") : "",
        fahrzeugId, fahrerId,
        betrag: parseFloat(betrag),
        provision: parseFloat(provision || "0"),
        netto,
        fahrtenAnzahl: parseInt(fahrtenAnzahl || "0"),
      });
      setImporting(false);
      setStep(4);
      toast.success("Plattformumsatz erfolgreich importiert");
    } catch (e: any) {
      setImporting(false);
      toast.error(e.message || "Fehler beim Import.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/umsaetze")} className="shrink-0"><ArrowLeft className="h-4 w-4" /></Button>
        <PageHeader title="Plattform-Import" description="Umsätze aus Uber, Bolt oder anderen Plattformen importieren" />
      </div>

      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div className={cn("flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 transition-colors", i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-muted text-muted-foreground")}>
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium hidden sm:block truncate", i <= step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            {i < STEPS.length - 1 && <div className={cn("h-px flex-1 mx-1", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30">
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.csv,.xlsx,.pdf" onChange={handleFileChange} />
            {file ? (
              <div className="space-y-3">
                {preview ? <img src={preview} alt="Vorschau" className="max-h-48 mx-auto rounded-lg shadow-sm" /> : <FileText className="h-12 w-12 mx-auto text-primary" />}
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}><X className="h-3 w-3 mr-1" /> Entfernen</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <div><p className="text-sm font-medium">Datei hierher ziehen oder klicken</p><p className="text-xs text-muted-foreground mt-1">CSV, Excel, PDF oder Screenshot</p></div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">oder</span><div className="h-px flex-1 bg-border" /></div>
          <div className="bg-muted/30 rounded-xl border p-6 text-center space-y-2">
            <Clipboard className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Screenshot aus Zwischenablage einfügen</p>
            <p className="text-xs text-muted-foreground">Einfach <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">Strg+V</kbd> drücken</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-card rounded-xl border p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Plattform</label>
            <Select value={plattform} onValueChange={setPlattform}>
              <SelectTrigger><SelectValue placeholder="Plattform wählen" /></SelectTrigger>
              <SelectContent><SelectItem value="Uber">Uber</SelectItem><SelectItem value="Bolt">Bolt</SelectItem><SelectItem value="FreeNow">FreeNow</SelectItem><SelectItem value="Sonstige">Sonstige</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Zeitraum von</label>
              <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !vonDatum && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{vonDatum ? format(vonDatum, "dd.MM.yyyy") : "Datum wählen"}</Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={vonDatum} onSelect={setVonDatum} locale={de} className="p-3 pointer-events-auto" /></PopoverContent></Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zeitraum bis</label>
              <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !bisDatum && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{bisDatum ? format(bisDatum, "dd.MM.yyyy") : "Datum wählen"}</Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={bisDatum} onSelect={setBisDatum} locale={de} className="p-3 pointer-events-auto" /></PopoverContent></Popover>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-card rounded-xl border p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fahrer</label>
              <Select value={fahrerId} onValueChange={setFahrerId}>
                <SelectTrigger><SelectValue placeholder="Fahrer wählen" /></SelectTrigger>
                <SelectContent>{fahrer.filter(f => f.status === "aktiv").map(f => <SelectItem key={f.id} value={f.id}>{f.vorname} {f.nachname}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fahrzeug</label>
              <Select value={fahrzeugId} onValueChange={setFahrzeugId}>
                <SelectTrigger><SelectValue placeholder="Fahrzeug wählen" /></SelectTrigger>
                <SelectContent>{fahrzeuge.filter(f => f.status === "aktiv").map(f => <SelectItem key={f.id} value={f.id}>{f.kennzeichen} – {f.marke} {f.modell}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium">Bruttoumsatz (€)</label><Input type="number" min="0" step="0.01" placeholder="0,00" value={betrag} onChange={e => setBetrag(e.target.value)} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Provision (€)</label><Input type="number" min="0" step="0.01" placeholder="0,00" value={provision} onChange={e => setProvision(e.target.value)} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Anzahl Fahrten</label><Input type="number" min="0" placeholder="0" value={fahrtenAnzahl} onChange={e => setFahrtenAnzahl(e.target.value)} /></div>
          </div>
          {betrag && <div className="bg-muted/30 rounded-lg p-4"><p className="text-xs text-muted-foreground mb-1">Nettoumsatz</p><p className="text-xl font-semibold text-primary">{formatCurrency(netto)}</p></div>}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {/* Duplicate warning */}
          {duplicate && (
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Möglicher Doppelimport erkannt</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Es existiert bereits ein {duplicate.plattform}-Umsatz für diesen Zeitraum und dieses Fahrzeug ({formatCurrency(duplicate.netto)} netto). Möchtest du trotzdem importieren?
                </p>
              </div>
            </div>
          )}
          {preview && <div className="bg-card rounded-xl border p-4"><p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Hochgeladene Datei</p><img src={preview} alt="Screenshot" className="max-h-40 rounded-lg shadow-sm" /></div>}
          <div className="bg-card rounded-xl border divide-y">
            {[["Plattform", plattform], ["Zeitraum", `${vonDatum ? format(vonDatum, "dd.MM.yyyy") : "–"} – ${bisDatum ? format(bisDatum, "dd.MM.yyyy") : "–"}`],
              ["Fahrer", selectedFahrer ? `${selectedFahrer.vorname} ${selectedFahrer.nachname}` : "–"], ["Fahrzeug", selectedFahrzeug?.kennzeichen || "–"],
              ["Bruttoumsatz", formatCurrency(parseFloat(betrag || "0"))], ["Provision", formatCurrency(parseFloat(provision || "0"))],
              ["Nettoumsatz", formatCurrency(netto)], ["Fahrten", fahrtenAnzahl || "–"]].map(([l, v]) => (
              <div key={l} className="px-5 py-3 flex justify-between"><span className="text-sm text-muted-foreground">{l}</span><span className={`text-sm font-medium ${l === "Nettoumsatz" ? "text-primary font-semibold" : ""}`}>{v}</span></div>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-card rounded-xl border p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><Check className="h-8 w-8 text-primary" /></div>
          <h2 className="text-xl font-semibold">Import abgeschlossen</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Der Plattformumsatz von <span className="font-medium text-foreground">{formatCurrency(netto)}</span> ({plattform}) wurde erfolgreich erfasst und fließt in das Fahrzeugergebnis ein.</p>
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => navigate("/umsaetze")}>Zurück zu Umsätze</Button>
            <Button onClick={() => { setStep(0); setFile(null); setPreview(null); setPlattform(""); setVonDatum(undefined); setBisDatum(undefined); setFahrerId(""); setFahrzeugId(""); setBetrag(""); setProvision(""); setFahrtenAnzahl(""); }}>Weiteren Import starten</Button>
          </div>
        </div>
      )}

      {step < 4 && (
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={() => step === 0 ? navigate("/umsaetze") : setStep((step - 1) as Step)}>
            <ArrowLeft className="h-4 w-4 mr-1" />{step === 0 ? "Abbrechen" : "Zurück"}
          </Button>
          {step < 3 ? (
            <Button disabled={!canNext()} onClick={() => setStep((step + 1) as Step)}>Weiter<ArrowRight className="h-4 w-4 ml-1" /></Button>
          ) : (
            <Button disabled={importing} onClick={handleImport}>{importing ? "Importiere…" : "Import abschließen"}<Check className="h-4 w-4 ml-1" /></Button>
          )}
        </div>
      )}
    </div>
  );
}
