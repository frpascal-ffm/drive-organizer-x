import type { Fahrt, Fahrzeug, Fahrer, KostenEintrag, PlattformUmsatz } from "@/data/mockData";

export interface Zeitraum {
  von: string; // yyyy-MM-dd
  bis: string; // yyyy-MM-dd
}

// --- Date helpers ---
export function isInZeitraum(datum: string, z?: Zeitraum): boolean {
  if (!z) return true;
  return datum >= z.von && datum <= z.bis;
}

export function isPlattformInZeitraum(p: PlattformUmsatz, z?: Zeitraum): boolean {
  if (!z) return true;
  // Overlap check: platform period overlaps with filter period
  return p.zeitraumBis >= z.von && p.zeitraumVon <= z.bis;
}

// --- Per-vehicle calculations ---

export function getEigeneFahrtenEinnahmen(fahrten: Fahrt[], fahrzeugId: string, z?: Zeitraum): number {
  return fahrten
    .filter(f => f.fahrzeugId === fahrzeugId && f.status === "erledigt" && f.preis && isInZeitraum(f.datum, z))
    .reduce((s, f) => s + (f.preis || 0), 0);
}

export function getPlattformEinnahmen(plattformUmsaetze: PlattformUmsatz[], fahrzeugId: string, z?: Zeitraum): number {
  return plattformUmsaetze
    .filter(p => p.fahrzeugId === fahrzeugId && isPlattformInZeitraum(p, z))
    .reduce((s, p) => s + p.netto, 0);
}

export function getFahrzeugEinnahmen(fahrten: Fahrt[], plattformUmsaetze: PlattformUmsatz[], fahrzeugId: string, z?: Zeitraum): number {
  return getEigeneFahrtenEinnahmen(fahrten, fahrzeugId, z) + getPlattformEinnahmen(plattformUmsaetze, fahrzeugId, z);
}

export function getFahrzeugKosten(kosten: KostenEintrag[], fahrzeugId: string, z?: Zeitraum): number {
  return kosten
    .filter(k => k.fahrzeugId === fahrzeugId && isInZeitraum(k.datum, z))
    .reduce((s, k) => s + k.betrag, 0);
}

export function getFahrzeugFixkosten(kosten: KostenEintrag[], fahrzeugId: string, z?: Zeitraum): number {
  return kosten
    .filter(k => k.fahrzeugId === fahrzeugId && k.typ === "fix" && isInZeitraum(k.datum, z))
    .reduce((s, k) => s + k.betrag, 0);
}

export function getFahrzeugVariableKosten(kosten: KostenEintrag[], fahrzeugId: string, z?: Zeitraum): number {
  return kosten
    .filter(k => k.fahrzeugId === fahrzeugId && k.typ === "variabel" && isInZeitraum(k.datum, z))
    .reduce((s, k) => s + k.betrag, 0);
}

export function getFahrzeugErgebnis(fahrten: Fahrt[], plattformUmsaetze: PlattformUmsatz[], kosten: KostenEintrag[], fahrzeugId: string, z?: Zeitraum): number {
  return getFahrzeugEinnahmen(fahrten, plattformUmsaetze, fahrzeugId, z) - getFahrzeugKosten(kosten, fahrzeugId, z);
}

// --- Aggregated vehicle result ---
export interface FahrzeugErgebnis {
  fahrzeug: Fahrzeug;
  einnahmenEigen: number;
  einnahmenPlattform: number;
  einnahmenGesamt: number;
  kostenFix: number;
  kostenVariabel: number;
  kostenGesamt: number;
  ergebnis: number;
  fahrtenCount: number;
}

export function berechneFahrzeugErgebnis(
  fz: Fahrzeug, fahrten: Fahrt[], plattformUmsaetze: PlattformUmsatz[], kosten: KostenEintrag[], z?: Zeitraum
): FahrzeugErgebnis {
  const eigenFahrten = fahrten.filter(f => f.fahrzeugId === fz.id && f.status === "erledigt" && f.preis && isInZeitraum(f.datum, z));
  const einnahmenEigen = eigenFahrten.reduce((s, f) => s + (f.preis || 0), 0);
  const einnahmenPlattform = getPlattformEinnahmen(plattformUmsaetze, fz.id, z);
  const einnahmenGesamt = einnahmenEigen + einnahmenPlattform;
  const kostenFix = getFahrzeugFixkosten(kosten, fz.id, z);
  const kostenVariabel = getFahrzeugVariableKosten(kosten, fz.id, z);
  const kostenGesamt = kostenFix + kostenVariabel;
  return {
    fahrzeug: fz,
    einnahmenEigen, einnahmenPlattform, einnahmenGesamt,
    kostenFix, kostenVariabel, kostenGesamt,
    ergebnis: einnahmenGesamt - kostenGesamt,
    fahrtenCount: eigenFahrten.length,
  };
}

export function berechneAlleFahrzeugErgebnisse(
  fahrzeuge: Fahrzeug[], fahrten: Fahrt[], plattformUmsaetze: PlattformUmsatz[], kosten: KostenEintrag[], z?: Zeitraum
): FahrzeugErgebnis[] {
  return fahrzeuge.map(fz => berechneFahrzeugErgebnis(fz, fahrten, plattformUmsaetze, kosten, z));
}

// --- Global aggregations ---
export function getGesamtEinnahmen(fahrten: Fahrt[], plattformUmsaetze: PlattformUmsatz[], z?: Zeitraum): number {
  const eigen = fahrten
    .filter(f => f.status === "erledigt" && f.preis && isInZeitraum(f.datum, z))
    .reduce((s, f) => s + (f.preis || 0), 0);
  const plat = plattformUmsaetze
    .filter(p => isPlattformInZeitraum(p, z))
    .reduce((s, p) => s + p.netto, 0);
  return eigen + plat;
}

export function getGesamtKosten(kosten: KostenEintrag[], z?: Zeitraum): number {
  return kosten.filter(k => isInZeitraum(k.datum, z)).reduce((s, k) => s + k.betrag, 0);
}

export function getGesamtErgebnis(fahrten: Fahrt[], plattformUmsaetze: PlattformUmsatz[], kosten: KostenEintrag[], z?: Zeitraum): number {
  return getGesamtEinnahmen(fahrten, plattformUmsaetze, z) - getGesamtKosten(kosten, z);
}

// --- Insights ---
export function getTopFahrzeuge(ergebnisse: FahrzeugErgebnis[], limit = 3): FahrzeugErgebnis[] {
  return [...ergebnisse].sort((a, b) => b.ergebnis - a.ergebnis).slice(0, limit);
}

export function getFlopFahrzeuge(ergebnisse: FahrzeugErgebnis[]): FahrzeugErgebnis[] {
  return ergebnisse.filter(e => e.ergebnis < 0).sort((a, b) => a.ergebnis - b.ergebnis);
}

export function getFahrzeugeOhneKosten(fahrzeuge: Fahrzeug[], kosten: KostenEintrag[], z?: Zeitraum): Fahrzeug[] {
  return fahrzeuge.filter(fz => fz.status === "aktiv" && !kosten.some(k => k.fahrzeugId === fz.id && isInZeitraum(k.datum, z)));
}

export function getFahrzeugeOhneFahrten(fahrzeuge: Fahrzeug[], fahrten: Fahrt[], z?: Zeitraum): Fahrzeug[] {
  return fahrzeuge.filter(fz => fz.status === "aktiv" && !fahrten.some(f => f.fahrzeugId === fz.id && isInZeitraum(f.datum, z)));
}

export function getErledigteFahrtenOhnePreis(fahrten: Fahrt[], z?: Zeitraum): Fahrt[] {
  return fahrten.filter(f => f.status === "erledigt" && !f.preis && isInZeitraum(f.datum, z));
}

// --- Intervall labels ---
export const intervallLabels: Record<string, string> = {
  monatlich: "Monatlich",
  quartalsweise: "Alle 3 Monate",
  halbjaehrlich: "Alle 6 Monate",
  jaehrlich: "Jährlich",
};

// --- Duplicate check for platform imports ---
export function checkPlattformDuplicate(
  existing: PlattformUmsatz[],
  plattform: string,
  zeitraumVon: string,
  zeitraumBis: string,
  fahrzeugId: string,
): PlattformUmsatz | undefined {
  return existing.find(p =>
    p.plattform === plattform &&
    p.zeitraumVon === zeitraumVon &&
    p.zeitraumBis === zeitraumBis &&
    p.fahrzeugId === fahrzeugId
  );
}
