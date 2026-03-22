import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  fahrzeuge as initialFahrzeuge,
  fahrerList as initialFahrer,
  fahrten as initialFahrten,
  kosten as initialKosten,
  plattformUmsaetze as initialPlattformUmsaetze,
  abrechnungen as initialAbrechnungen,
  type Fahrzeug,
  type Fahrer,
  type Fahrt,
  type KostenEintrag,
  type PlattformUmsatz,
  type Abrechnung,
  type FahrtTyp,
  type FahrtStatus,
  type FahrzeugStatus,
  type FahrerStatus,
} from "@/data/mockData";

interface AppState {
  fahrzeuge: Fahrzeug[];
  fahrer: Fahrer[];
  fahrten: Fahrt[];
  kosten: KostenEintrag[];
  plattformUmsaetze: PlattformUmsatz[];
  abrechnungen: Abrechnung[];
}

interface AppContextType extends AppState {
  // Fahrzeuge
  addFahrzeug: (fz: Omit<Fahrzeug, "id">) => string;
  updateFahrzeug: (id: string, fz: Partial<Fahrzeug>) => void;
  deleteFahrzeug: (id: string) => void;
  getFahrzeug: (id: string) => Fahrzeug | undefined;
  // Fahrer
  addFahrer: (fa: Omit<Fahrer, "id">) => string;
  updateFahrer: (id: string, fa: Partial<Fahrer>) => void;
  deleteFahrer: (id: string) => void;
  getFahrer: (id: string) => Fahrer | undefined;
  // Fahrten
  addFahrt: (ft: Omit<Fahrt, "id" | "fahrtNummer" | "kommentare">) => string;
  updateFahrt: (id: string, ft: Partial<Fahrt>) => void;
  deleteFahrt: (id: string) => void;
  getFahrt: (id: string) => Fahrt | undefined;
  addKommentar: (fahrtId: string, text: string, autor: string) => void;
  // Kosten
  addKosten: (k: Omit<KostenEintrag, "id">) => string;
  updateKosten: (id: string, k: Partial<KostenEintrag>) => void;
  deleteKosten: (id: string) => void;
  // Plattformumsaetze
  addPlattformUmsatz: (p: Omit<PlattformUmsatz, "id">) => string;
  updatePlattformUmsatz: (id: string, p: Partial<PlattformUmsatz>) => void;
  deletePlattformUmsatz: (id: string) => void;
  // Abrechnungen
  addAbrechnung: (a: Omit<Abrechnung, "id">) => string;
  updateAbrechnung: (id: string, a: Partial<Abrechnung>) => void;
}

const STORAGE_KEY = "mietwagen-app-state";

function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function genId(prefix: string) {
  return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function genFahrtNummer(fahrten: Fahrt[]) {
  const max = fahrten.reduce((m, f) => {
    const num = parseInt(f.fahrtNummer.replace("#", ""));
    return num > m ? num : m;
  }, 0);
  return `#${max + 1}`;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    if (saved) return saved;
    return {
      fahrzeuge: initialFahrzeuge,
      fahrer: initialFahrer,
      fahrten: initialFahrten,
      kosten: initialKosten,
      plattformUmsaetze: initialPlattformUmsaetze,
      abrechnungen: initialAbrechnungen,
    };
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Fahrzeuge
  const addFahrzeug = useCallback((fz: Omit<Fahrzeug, "id">) => {
    const id = genId("fz");
    setState(s => ({ ...s, fahrzeuge: [...s.fahrzeuge, { ...fz, id }] }));
    return id;
  }, []);
  const updateFahrzeug = useCallback((id: string, fz: Partial<Fahrzeug>) => {
    setState(s => ({ ...s, fahrzeuge: s.fahrzeuge.map(f => f.id === id ? { ...f, ...fz } : f) }));
  }, []);
  const deleteFahrzeug = useCallback((id: string) => {
    setState(s => ({ ...s, fahrzeuge: s.fahrzeuge.filter(f => f.id !== id) }));
  }, []);
  const getFahrzeug = useCallback((id: string) => state.fahrzeuge.find(f => f.id === id), [state.fahrzeuge]);

  // Fahrer
  const addFahrer = useCallback((fa: Omit<Fahrer, "id">) => {
    const id = genId("fa");
    setState(s => ({ ...s, fahrer: [...s.fahrer, { ...fa, id }] }));
    return id;
  }, []);
  const updateFahrer = useCallback((id: string, fa: Partial<Fahrer>) => {
    setState(s => ({ ...s, fahrer: s.fahrer.map(f => f.id === id ? { ...f, ...fa } : f) }));
  }, []);
  const deleteFahrer = useCallback((id: string) => {
    setState(s => ({ ...s, fahrer: s.fahrer.filter(f => f.id !== id) }));
  }, []);
  const getFahrer = useCallback((id: string) => state.fahrer.find(f => f.id === id), [state.fahrer]);

  // Fahrten
  const addFahrt = useCallback((ft: Omit<Fahrt, "id" | "fahrtNummer" | "kommentare">) => {
    const id = genId("ft");
    setState(s => ({
      ...s,
      fahrten: [...s.fahrten, { ...ft, id, fahrtNummer: genFahrtNummer(s.fahrten), kommentare: [] }],
    }));
    return id;
  }, []);
  const updateFahrt = useCallback((id: string, ft: Partial<Fahrt>) => {
    setState(s => ({ ...s, fahrten: s.fahrten.map(f => f.id === id ? { ...f, ...ft } : f) }));
  }, []);
  const deleteFahrt = useCallback((id: string) => {
    setState(s => ({ ...s, fahrten: s.fahrten.filter(f => f.id !== id) }));
  }, []);
  const getFahrt = useCallback((id: string) => state.fahrten.find(f => f.id === id), [state.fahrten]);
  const addKommentar = useCallback((fahrtId: string, text: string, autor: string) => {
    setState(s => ({
      ...s,
      fahrten: s.fahrten.map(f =>
        f.id === fahrtId
          ? { ...f, kommentare: [...f.kommentare, { id: `k${Date.now()}`, text, datum: new Date().toISOString(), autor }] }
          : f
      ),
    }));
  }, []);

  // Kosten
  const addKosten = useCallback((k: Omit<KostenEintrag, "id">) => {
    const id = genId("ko");
    setState(s => ({ ...s, kosten: [...s.kosten, { ...k, id }] }));
    return id;
  }, []);
  const updateKosten = useCallback((id: string, k: Partial<KostenEintrag>) => {
    setState(s => ({ ...s, kosten: s.kosten.map(x => x.id === id ? { ...x, ...k } : x) }));
  }, []);
  const deleteKosten = useCallback((id: string) => {
    setState(s => ({ ...s, kosten: s.kosten.filter(x => x.id !== id) }));
  }, []);

  // Plattformumsaetze
  const addPlattformUmsatz = useCallback((p: Omit<PlattformUmsatz, "id">) => {
    const id = genId("pu");
    setState(s => ({ ...s, plattformUmsaetze: [...s.plattformUmsaetze, { ...p, id }] }));
    return id;
  }, []);
  const updatePlattformUmsatz = useCallback((id: string, p: Partial<PlattformUmsatz>) => {
    setState(s => ({ ...s, plattformUmsaetze: s.plattformUmsaetze.map(x => x.id === id ? { ...x, ...p } : x) }));
  }, []);
  const deletePlattformUmsatz = useCallback((id: string) => {
    setState(s => ({ ...s, plattformUmsaetze: s.plattformUmsaetze.filter(x => x.id !== id) }));
  }, []);

  // Abrechnungen
  const addAbrechnung = useCallback((a: Omit<Abrechnung, "id">) => {
    const id = genId("abr");
    setState(s => ({ ...s, abrechnungen: [...s.abrechnungen, { ...a, id }] }));
    return id;
  }, []);
  const updateAbrechnung = useCallback((id: string, a: Partial<Abrechnung>) => {
    setState(s => ({ ...s, abrechnungen: s.abrechnungen.map(x => x.id === id ? { ...x, ...a } : x) }));
  }, []);

  const value: AppContextType = {
    ...state,
    addFahrzeug, updateFahrzeug, deleteFahrzeug, getFahrzeug,
    addFahrer, updateFahrer, deleteFahrer, getFahrer,
    addFahrt, updateFahrt, deleteFahrt, getFahrt, addKommentar,
    addKosten, updateKosten, deleteKosten,
    addPlattformUmsatz, updatePlattformUmsatz, deletePlattformUmsatz,
    addAbrechnung, updateAbrechnung,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
