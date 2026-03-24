import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
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
  type Kommentar,
} from "@/data/mockData";

interface FahrttypConfig {
  key: string;
  label: string;
  enabled: boolean;
  dbId?: string; // trip_types table id
}

interface AppState {
  fahrzeuge: Fahrzeug[];
  fahrer: Fahrer[];
  fahrten: Fahrt[];
  kosten: KostenEintrag[];
  plattformUmsaetze: PlattformUmsatz[];
  abrechnungen: Abrechnung[];
  fahrttypen: FahrttypConfig[];
  loading: boolean;
}

interface AppContextType extends Omit<AppState, 'loading'> {
  loading: boolean;
  // Fahrzeuge
  addFahrzeug: (fz: Omit<Fahrzeug, "id">) => Promise<string>;
  updateFahrzeug: (id: string, fz: Partial<Fahrzeug>) => Promise<void>;
  deleteFahrzeug: (id: string) => Promise<void>;
  getFahrzeug: (id: string) => Fahrzeug | undefined;
  // Fahrer
  addFahrer: (fa: Omit<Fahrer, "id">) => Promise<string>;
  updateFahrer: (id: string, fa: Partial<Fahrer>) => Promise<void>;
  deleteFahrer: (id: string) => Promise<void>;
  getFahrer: (id: string) => Fahrer | undefined;
  // Fahrten
  addFahrt: (ft: Omit<Fahrt, "id" | "fahrtNummer" | "kommentare">) => Promise<string>;
  updateFahrt: (id: string, ft: Partial<Fahrt>) => Promise<void>;
  deleteFahrt: (id: string) => Promise<void>;
  getFahrt: (id: string) => Fahrt | undefined;
  addKommentar: (fahrtId: string, text: string, autor: string) => Promise<void>;
  // Kosten
  addKosten: (k: Omit<KostenEintrag, "id">) => Promise<string>;
  updateKosten: (id: string, k: Partial<KostenEintrag>) => Promise<void>;
  deleteKosten: (id: string) => Promise<void>;
  // Plattformumsaetze
  addPlattformUmsatz: (p: Omit<PlattformUmsatz, "id">) => Promise<string>;
  updatePlattformUmsatz: (id: string, p: Partial<PlattformUmsatz>) => Promise<void>;
  deletePlattformUmsatz: (id: string) => Promise<void>;
  // Abrechnungen
  addAbrechnung: (a: Omit<Abrechnung, "id">) => Promise<string>;
  updateAbrechnung: (id: string, a: Partial<Abrechnung>) => Promise<void>;
  // Fahrttypen
  aktiveFahrttypen: FahrtTyp[];
  toggleFahrttyp: (key: FahrtTyp) => void;
  // Refresh
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Mapping helpers: Supabase rows ↔ App types ───

function mapVehicle(row: any): Fahrzeug {
  return {
    id: row.id,
    kennzeichen: row.license_plate || "",
    marke: row.make || "",
    modell: row.model || "",
    baujahr: row.year || 0,
    farbe: row.fuel_type || "", // we reuse fuel_type or notes for color; or just ""
    status: (row.status === "active" ? "aktiv" : row.status === "inactive" ? "inaktiv" : row.status === "workshop" ? "werkstatt" : row.status || "aktiv") as FahrzeugStatus,
  };
}

function mapDriver(row: any): Fahrer {
  return {
    id: row.id,
    vorname: row.first_name || "",
    nachname: row.last_name || "",
    adresse: row.address || "",
    telefon: row.phone || "",
    email: row.email || undefined,
    status: (row.status === "active" ? "aktiv" : "inaktiv") as FahrerStatus,
    notiz: row.notes || undefined,
  };
}

function mapTrip(row: any, comments: Kommentar[], tripTypes: FahrttypConfig[]): Fahrt {
  const tripDate = new Date(row.trip_date);
  const datum = row.trip_date.split("T")[0];
  const uhrzeit = tripDate.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  // Map trip_type_id to FahrtTyp key
  const ttConfig = tripTypes.find(t => t.dbId === row.trip_type_id);
  const typ = (ttConfig?.key || "privatfahrt") as FahrtTyp;

  // Map status
  let status: FahrtStatus = "geplant";
  if (row.status === "completed") status = "erledigt";
  else if (row.status === "cancelled") status = "storniert";
  else if (row.status === "pending") status = "geplant";

  return {
    id: row.id,
    fahrtNummer: `#${row.created_at ? new Date(row.created_at).getTime().toString().slice(-6) : row.id.slice(0, 6)}`,
    typ,
    datum,
    uhrzeit,
    von: row.pickup_address || "",
    nach: row.destination_address || "",
    fahrerId: row.driver_id || "",
    fahrzeugId: row.vehicle_id || "",
    status,
    preis: row.amount || undefined,
    mwst: row.vat_rate || undefined,
    kunde: row.passenger_name || undefined,
    notiz: row.notes || undefined,
    kommentare: comments,
  };
}

function mapCost(row: any): KostenEintrag {
  let intervall: KostenEintrag["intervall"] | undefined;
  if (row.period === "monatlich") intervall = "monatlich";
  else if (row.period === "quartalsweise") intervall = "quartalsweise";
  else if (row.period === "halbjaehrlich") intervall = "halbjaehrlich";
  else if (row.period === "jaehrlich") intervall = "jaehrlich";

  return {
    id: row.id,
    typ: row.cost_type === "fix" ? "fix" : "variabel",
    kategorie: row.name || "",
    betrag: row.amount || 0,
    fahrzeugId: row.vehicle_id || "",
    datum: row.date_from || "",
    intervall,
    notiz: row.description || undefined,
  };
}

function mapPlatformRevenue(row: any): PlattformUmsatz {
  return {
    id: row.id,
    plattform: row.platform || "",
    zeitraumVon: row.period_from || "",
    zeitraumBis: row.period_to || "",
    fahrzeugId: row.vehicle_id || "",
    fahrerId: row.driver_id || "",
    betrag: row.amount || 0,
    provision: row.commission || 0,
    netto: row.net_amount || 0,
    fahrtenAnzahl: row.trip_count || 0,
  };
}

// ─── Reverse mapping: App types → Supabase inserts ───

function vehicleToRow(fz: Partial<Fahrzeug>, userId: string) {
  const row: any = { user_id: userId };
  if (fz.kennzeichen !== undefined) row.license_plate = fz.kennzeichen;
  if (fz.marke !== undefined) row.make = fz.marke;
  if (fz.modell !== undefined) row.model = fz.modell;
  if (fz.baujahr !== undefined) row.year = fz.baujahr;
  if (fz.status !== undefined) {
    row.status = fz.status === "aktiv" ? "active" : fz.status === "inaktiv" ? "inactive" : "workshop";
  }
  return row;
}

function driverToRow(fa: Partial<Fahrer>, userId: string) {
  const row: any = { user_id: userId };
  if (fa.vorname !== undefined) row.first_name = fa.vorname;
  if (fa.nachname !== undefined) row.last_name = fa.nachname;
  if (fa.adresse !== undefined) row.address = fa.adresse;
  if (fa.telefon !== undefined) row.phone = fa.telefon;
  if (fa.email !== undefined) row.email = fa.email;
  if (fa.status !== undefined) row.status = fa.status === "aktiv" ? "active" : "inactive";
  if (fa.notiz !== undefined) row.notes = fa.notiz;
  return row;
}

function tripToRow(ft: Partial<Fahrt>, userId: string, tripTypes: FahrttypConfig[]) {
  const row: any = { user_id: userId };
  if (ft.datum !== undefined || ft.uhrzeit !== undefined) {
    const d = ft.datum || "";
    const t = ft.uhrzeit || "00:00";
    row.trip_date = `${d}T${t}:00`;
  }
  if (ft.von !== undefined) row.pickup_address = ft.von;
  if (ft.nach !== undefined) row.destination_address = ft.nach;
  if (ft.fahrerId !== undefined) row.driver_id = ft.fahrerId || null;
  if (ft.fahrzeugId !== undefined) row.vehicle_id = ft.fahrzeugId || null;
  if (ft.status !== undefined) {
    row.status = ft.status === "erledigt" ? "completed" : ft.status === "storniert" ? "cancelled" : "pending";
  }
  if (ft.preis !== undefined) row.amount = ft.preis || 0;
  if (ft.mwst !== undefined) row.vat_rate = ft.mwst;
  if (ft.kunde !== undefined) row.passenger_name = ft.kunde;
  if (ft.notiz !== undefined) row.notes = ft.notiz;
  if (ft.typ !== undefined) {
    const tt = tripTypes.find(t => t.key === ft.typ);
    if (tt?.dbId) row.trip_type_id = tt.dbId;
  }
  return row;
}

function costToRow(k: Partial<KostenEintrag>, userId: string) {
  const row: any = { user_id: userId };
  if (k.kategorie !== undefined) row.name = k.kategorie;
  if (k.betrag !== undefined) row.amount = k.betrag;
  if (k.fahrzeugId !== undefined) row.vehicle_id = k.fahrzeugId || null;
  if (k.datum !== undefined) row.date_from = k.datum || null;
  if (k.typ !== undefined) row.cost_type = k.typ;
  if (k.notiz !== undefined) row.description = k.notiz;
  if (k.intervall !== undefined) row.period = k.intervall;
  else if (k.typ === "variabel") row.period = "einmalig";
  return row;
}

function platformRevenueToRow(p: Partial<PlattformUmsatz>, userId: string) {
  const row: any = { user_id: userId };
  if (p.plattform !== undefined) row.platform = p.plattform;
  if (p.zeitraumVon !== undefined) row.period_from = p.zeitraumVon;
  if (p.zeitraumBis !== undefined) row.period_to = p.zeitraumBis;
  if (p.fahrzeugId !== undefined) row.vehicle_id = p.fahrzeugId || null;
  if (p.fahrerId !== undefined) row.driver_id = p.fahrerId || null;
  if (p.betrag !== undefined) row.amount = p.betrag;
  if (p.provision !== undefined) row.commission = p.provision;
  if (p.netto !== undefined) row.net_amount = p.netto;
  if (p.fahrtenAnzahl !== undefined) row.trip_count = p.fahrtenAnzahl;
  return row;
}

// ─── Default trip type mapping ───
const DEFAULT_TRIP_TYPE_MAP: Record<string, FahrtTyp> = {
  "Krankenfahrt": "krankenfahrt",
  "Flughafentransfer": "flughafentransfer",
  "Privatfahrt": "privatfahrt",
  "Firmenfahrt": "firmenfahrt",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>({
    fahrzeuge: [],
    fahrer: [],
    fahrten: [],
    kosten: [],
    plattformUmsaetze: [],
    abrechnungen: [],
    fahrttypen: [],
    loading: true,
  });

  // Load all data from Supabase
  const loadData = useCallback(async () => {
    if (!user) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    setState(s => ({ ...s, loading: true }));

    try {
      // Load trip types first (needed for mapping trips)
      const { data: tripTypesData } = await supabase
        .from("trip_types")
        .select("*")
        .order("order_index");

      const fahrttypen: FahrttypConfig[] = (tripTypesData || []).map((tt: any) => ({
        key: DEFAULT_TRIP_TYPE_MAP[tt.name] || tt.name.toLowerCase().replace(/\s+/g, ""),
        label: tt.name,
        enabled: tt.is_active,
        dbId: tt.id,
      }));

      // Load all data in parallel
      const [vehiclesRes, driversRes, tripsRes, costsRes, platformRes, commentsRes] = await Promise.all([
        supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
        supabase.from("drivers").select("*").order("created_at", { ascending: false }),
        supabase.from("trips").select("*").order("trip_date", { ascending: false }),
        supabase.from("company_costs").select("*").order("created_at", { ascending: false }),
        supabase.from("platform_revenues").select("*").order("created_at", { ascending: false }),
        supabase.from("trip_comments").select("*").order("created_at", { ascending: true }),
      ]);

      // Group comments by trip_id
      const commentsByTrip: Record<string, Kommentar[]> = {};
      for (const c of commentsRes.data || []) {
        if (!commentsByTrip[c.trip_id]) commentsByTrip[c.trip_id] = [];
        commentsByTrip[c.trip_id].push({
          id: c.id,
          text: c.text,
          datum: c.created_at || "",
          autor: "User",
        });
      }

      setState({
        fahrzeuge: (vehiclesRes.data || []).map(mapVehicle),
        fahrer: (driversRes.data || []).map(mapDriver),
        fahrten: (tripsRes.data || []).map((t: any) => mapTrip(t, commentsByTrip[t.id] || [], fahrttypen)),
        kosten: (costsRes.data || []).map(mapCost),
        plattformUmsaetze: (platformRes.data || []).map(mapPlatformRevenue),
        abrechnungen: [], // Abrechnungen handled locally for now
        fahrttypen,
        loading: false,
      });
    } catch (err) {
      console.error("Failed to load data:", err);
      setState(s => ({ ...s, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Fahrzeuge ───
  const addFahrzeug = useCallback(async (fz: Omit<Fahrzeug, "id">) => {
    if (!user) throw new Error("Not authenticated");
    const row = vehicleToRow(fz, user.id);
    const { data, error } = await supabase.from("vehicles").insert(row).select().single();
    if (error) throw error;
    const mapped = mapVehicle(data);
    setState(s => ({ ...s, fahrzeuge: [mapped, ...s.fahrzeuge] }));
    return data.id;
  }, [user]);

  const updateFahrzeug = useCallback(async (id: string, fz: Partial<Fahrzeug>) => {
    if (!user) return;
    const row = vehicleToRow(fz, user.id);
    delete row.user_id;
    const { error } = await supabase.from("vehicles").update(row).eq("id", id);
    if (error) throw error;
    setState(s => ({
      ...s,
      fahrzeuge: s.fahrzeuge.map(f => f.id === id ? { ...f, ...fz } : f),
    }));
  }, [user]);

  const deleteFahrzeug = useCallback(async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) throw error;
    setState(s => ({ ...s, fahrzeuge: s.fahrzeuge.filter(f => f.id !== id) }));
  }, []);

  const getFahrzeug = useCallback((id: string) => state.fahrzeuge.find(f => f.id === id), [state.fahrzeuge]);

  // ─── Fahrer ───
  const addFahrer = useCallback(async (fa: Omit<Fahrer, "id">) => {
    if (!user) throw new Error("Not authenticated");
    const row = driverToRow(fa, user.id);
    const { data, error } = await supabase.from("drivers").insert(row).select().single();
    if (error) throw error;
    const mapped = mapDriver(data);
    setState(s => ({ ...s, fahrer: [mapped, ...s.fahrer] }));
    return data.id;
  }, [user]);

  const updateFahrer = useCallback(async (id: string, fa: Partial<Fahrer>) => {
    if (!user) return;
    const row = driverToRow(fa, user.id);
    delete row.user_id;
    const { error } = await supabase.from("drivers").update(row).eq("id", id);
    if (error) throw error;
    setState(s => ({
      ...s,
      fahrer: s.fahrer.map(f => f.id === id ? { ...f, ...fa } : f),
    }));
  }, [user]);

  const deleteFahrer = useCallback(async (id: string) => {
    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) throw error;
    setState(s => ({ ...s, fahrer: s.fahrer.filter(f => f.id !== id) }));
  }, []);

  const getFahrer = useCallback((id: string) => state.fahrer.find(f => f.id === id), [state.fahrer]);

  // ─── Fahrten ───
  const addFahrt = useCallback(async (ft: Omit<Fahrt, "id" | "fahrtNummer" | "kommentare">) => {
    if (!user) throw new Error("Not authenticated");
    const row = tripToRow(ft, user.id, state.fahrttypen);
    const { data, error } = await supabase.from("trips").insert(row).select().single();
    if (error) throw error;
    const mapped = mapTrip(data, [], state.fahrttypen);
    setState(s => ({ ...s, fahrten: [mapped, ...s.fahrten] }));
    return data.id;
  }, [user, state.fahrttypen]);

  const updateFahrt = useCallback(async (id: string, ft: Partial<Fahrt>) => {
    if (!user) return;
    const row = tripToRow(ft, user.id, state.fahrttypen);
    delete row.user_id;
    const { error } = await supabase.from("trips").update(row).eq("id", id);
    if (error) throw error;
    setState(s => ({
      ...s,
      fahrten: s.fahrten.map(f => f.id === id ? { ...f, ...ft } : f),
    }));
  }, [user, state.fahrttypen]);

  const deleteFahrt = useCallback(async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) throw error;
    setState(s => ({ ...s, fahrten: s.fahrten.filter(f => f.id !== id) }));
  }, []);

  const getFahrt = useCallback((id: string) => state.fahrten.find(f => f.id === id), [state.fahrten]);

  const addKommentar = useCallback(async (fahrtId: string, text: string, _autor: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("trip_comments")
      .insert({ trip_id: fahrtId, text, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    const kommentar: Kommentar = {
      id: data.id,
      text: data.text,
      datum: data.created_at || "",
      autor: _autor || "User",
    };
    setState(s => ({
      ...s,
      fahrten: s.fahrten.map(f =>
        f.id === fahrtId
          ? { ...f, kommentare: [...f.kommentare, kommentar] }
          : f
      ),
    }));
  }, [user]);

  // ─── Kosten ───
  const addKosten = useCallback(async (k: Omit<KostenEintrag, "id">) => {
    if (!user) throw new Error("Not authenticated");
    const row = costToRow(k, user.id);
    const { data, error } = await supabase.from("company_costs").insert(row).select().single();
    if (error) throw error;
    const mapped = mapCost(data);
    setState(s => ({ ...s, kosten: [mapped, ...s.kosten] }));
    return data.id;
  }, [user]);

  const updateKosten = useCallback(async (id: string, k: Partial<KostenEintrag>) => {
    if (!user) return;
    const row = costToRow(k, user.id);
    delete row.user_id;
    const { error } = await supabase.from("company_costs").update(row).eq("id", id);
    if (error) throw error;
    setState(s => ({
      ...s,
      kosten: s.kosten.map(x => x.id === id ? { ...x, ...k } : x),
    }));
  }, [user]);

  const deleteKosten = useCallback(async (id: string) => {
    const { error } = await supabase.from("company_costs").delete().eq("id", id);
    if (error) throw error;
    setState(s => ({ ...s, kosten: s.kosten.filter(x => x.id !== id) }));
  }, []);

  // ─── Plattformumsaetze ───
  const addPlattformUmsatz = useCallback(async (p: Omit<PlattformUmsatz, "id">) => {
    if (!user) throw new Error("Not authenticated");
    const row = platformRevenueToRow(p, user.id);
    const { data, error } = await supabase.from("platform_revenues").insert(row).select().single();
    if (error) throw error;
    const mapped = mapPlatformRevenue(data);
    setState(s => ({ ...s, plattformUmsaetze: [mapped, ...s.plattformUmsaetze] }));
    return data.id;
  }, [user]);

  const updatePlattformUmsatz = useCallback(async (id: string, p: Partial<PlattformUmsatz>) => {
    if (!user) return;
    const row = platformRevenueToRow(p, user.id);
    delete row.user_id;
    const { error } = await supabase.from("platform_revenues").update(row).eq("id", id);
    if (error) throw error;
    setState(s => ({
      ...s,
      plattformUmsaetze: s.plattformUmsaetze.map(x => x.id === id ? { ...x, ...p } : x),
    }));
  }, [user]);

  const deletePlattformUmsatz = useCallback(async (id: string) => {
    const { error } = await supabase.from("platform_revenues").delete().eq("id", id);
    if (error) throw error;
    setState(s => ({ ...s, plattformUmsaetze: s.plattformUmsaetze.filter(x => x.id !== id) }));
  }, []);

  // ─── Abrechnungen (local for now) ───
  const addAbrechnung = useCallback(async (a: Omit<Abrechnung, "id">) => {
    const id = `abr${Date.now()}`;
    setState(s => ({ ...s, abrechnungen: [...s.abrechnungen, { ...a, id }] }));
    return id;
  }, []);

  const updateAbrechnung = useCallback(async (id: string, a: Partial<Abrechnung>) => {
    setState(s => ({
      ...s,
      abrechnungen: s.abrechnungen.map(x => x.id === id ? { ...x, ...a } : x),
    }));
  }, []);

  // ─── Fahrttypen ───
  const aktiveFahrttypen = state.fahrttypen
    .filter(t => t.enabled)
    .map(t => t.key as FahrtTyp);

  const toggleFahrttyp = useCallback((key: FahrtTyp) => {
    const tt = state.fahrttypen.find(t => t.key === key);
    if (tt?.dbId) {
      supabase
        .from("trip_types")
        .update({ is_active: !tt.enabled })
        .eq("id", tt.dbId)
        .then(() => {
          setState(s => ({
            ...s,
            fahrttypen: s.fahrttypen.map(t => t.key === key ? { ...t, enabled: !t.enabled } : t),
          }));
        });
    }
  }, [state.fahrttypen]);

  const value: AppContextType = {
    fahrzeuge: state.fahrzeuge,
    fahrer: state.fahrer,
    fahrten: state.fahrten,
    kosten: state.kosten,
    plattformUmsaetze: state.plattformUmsaetze,
    abrechnungen: state.abrechnungen,
    fahrttypen: state.fahrttypen,
    loading: state.loading,
    addFahrzeug, updateFahrzeug, deleteFahrzeug, getFahrzeug,
    addFahrer, updateFahrer, deleteFahrer, getFahrer,
    addFahrt, updateFahrt, deleteFahrt, getFahrt, addKommentar,
    addKosten, updateKosten, deleteKosten,
    addPlattformUmsatz, updatePlattformUmsatz, deletePlattformUmsatz,
    addAbrechnung, updateAbrechnung,
    aktiveFahrttypen, toggleFahrttyp,
    refreshData: loadData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
