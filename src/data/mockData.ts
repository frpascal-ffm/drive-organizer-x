export type FahrtTyp = 'krankenfahrt' | 'flughafentransfer' | 'privatfahrt' | 'firmenfahrt';
export type FahrtStatus = 'geplant' | 'erledigt' | 'storniert';
export type FahrzeugStatus = 'aktiv' | 'inaktiv' | 'werkstatt';
export type FahrerStatus = 'aktiv' | 'inaktiv';

export interface Fahrzeug {
  id: string; kennzeichen: string; marke: string; modell: string;
  baujahr: number; farbe: string; status: FahrzeugStatus;
}
export interface Fahrer {
  id: string; vorname: string; nachname: string; adresse: string;
  telefon: string; email?: string; status: FahrerStatus; notiz?: string;
}
export interface Kommentar { id: string; text: string; datum: string; autor: string; }
export interface Fahrt {
  id: string; fahrtNummer: string; typ: FahrtTyp; datum: string; uhrzeit: string;
  von: string; nach: string; fahrerId: string; fahrzeugId: string;
  status: FahrtStatus; preis?: number; mwst?: number;
  kunde?: string; notiz?: string; kommentare: Kommentar[];
}
export interface KostenEintrag {
  id: string; typ: 'fix' | 'variabel'; kategorie: string; betrag: number;
  fahrzeugId: string; datum: string;
  intervall?: 'monatlich' | 'quartalsweise' | 'halbjaehrlich' | 'jaehrlich';
  notiz?: string;
}
export interface PlattformUmsatz {
  id: string; plattform: string; zeitraumVon: string; zeitraumBis: string;
  fahrzeugId: string; fahrerId: string; betrag: number; provision: number;
  netto: number; fahrtenAnzahl: number;
}

export interface AbrechnungPosition {
  id: string; label: string; betrag: number; vorzeichen: '+' | '-';
}

export interface Abrechnung {
  id: string; fahrerId: string; monat: string;
  positionen: AbrechnungPosition[];
  status: 'entwurf' | 'abgeschlossen';
  erstelltAm: string;
}

export const fahrzeuge: Fahrzeug[] = [
  { id: 'fz1', kennzeichen: 'B-MF 1001', marke: 'Mercedes-Benz', modell: 'V-Klasse', baujahr: 2022, farbe: 'Schwarz', status: 'aktiv' },
  { id: 'fz2', kennzeichen: 'B-MF 1002', marke: 'Volkswagen', modell: 'Touran', baujahr: 2021, farbe: 'Silber', status: 'aktiv' },
  { id: 'fz3', kennzeichen: 'B-MF 1003', marke: 'Mercedes-Benz', modell: 'E-Klasse', baujahr: 2023, farbe: 'Weiß', status: 'aktiv' },
  { id: 'fz4', kennzeichen: 'B-MF 1004', marke: 'BMW', modell: '520d', baujahr: 2022, farbe: 'Grau', status: 'werkstatt' },
  { id: 'fz5', kennzeichen: 'B-MF 1005', marke: 'Volkswagen', modell: 'Caddy', baujahr: 2020, farbe: 'Weiß', status: 'aktiv' },
  { id: 'fz6', kennzeichen: 'B-MF 1006', marke: 'Mercedes-Benz', modell: 'Sprinter', baujahr: 2021, farbe: 'Silber', status: 'inaktiv' },
];

export const fahrerList: Fahrer[] = [
  { id: 'fa1', vorname: 'Mehmet', nachname: 'Yilmaz', adresse: 'Sonnenallee 42, 12045 Berlin', telefon: '0176 1234567', email: 'm.yilmaz@email.de', status: 'aktiv' },
  { id: 'fa2', vorname: 'Thomas', nachname: 'Richter', adresse: 'Kantstr. 15, 10623 Berlin', telefon: '0171 9876543', email: 't.richter@email.de', status: 'aktiv' },
  { id: 'fa3', vorname: 'Ahmed', nachname: 'Hassan', adresse: 'Turmstr. 88, 10551 Berlin', telefon: '0172 4567890', status: 'aktiv' },
  { id: 'fa4', vorname: 'Stefan', nachname: 'Krause', adresse: 'Prenzlauer Allee 210, 10405 Berlin', telefon: '0170 3456789', email: 's.krause@email.de', status: 'aktiv' },
  { id: 'fa5', vorname: 'Viktor', nachname: 'Petrov', adresse: 'Karl-Marx-Str. 56, 12043 Berlin', telefon: '0175 6789012', status: 'inaktiv', notiz: 'Aktuell in Elternzeit' },
];

export const fahrten: Fahrt[] = [
  { id: 'ft1', typ: 'krankenfahrt', datum: '2026-03-21', uhrzeit: '08:00', von: 'Charité Mitte', nach: 'Vivantes Neukölln', fahrerId: 'fa1', fahrzeugId: 'fz1', status: 'erledigt', preis: 85, mwst: 7, kunde: 'AOK Berlin', kommentare: [{ id: 'k1', text: 'Patient pünktlich abgeholt', datum: '2026-03-21T08:15', autor: 'Disposition' }] },
  { id: 'ft2', typ: 'flughafentransfer', datum: '2026-03-21', uhrzeit: '14:30', von: 'Hotel Adlon', nach: 'BER Terminal 1', fahrerId: 'fa2', fahrzeugId: 'fz3', status: 'erledigt', preis: 120, mwst: 19, kunde: 'Hotel Adlon Kempinski', kommentare: [] },
  { id: 'ft3', typ: 'privatfahrt', datum: '2026-03-21', uhrzeit: '18:00', von: 'Alexanderplatz', nach: 'Potsdam Hbf', fahrerId: 'fa3', fahrzeugId: 'fz2', status: 'geplant', preis: 95, mwst: 19, kommentare: [] },
  { id: 'ft4', typ: 'firmenfahrt', datum: '2026-03-20', uhrzeit: '09:00', von: 'Siemensstadt', nach: 'Messe Berlin', fahrerId: 'fa4', fahrzeugId: 'fz1', status: 'erledigt', preis: 65, mwst: 19, kunde: 'Siemens AG', kommentare: [{ id: 'k2', text: 'Rückfahrt ebenfalls gebucht', datum: '2026-03-20T09:30', autor: 'Office' }] },
  { id: 'ft5', typ: 'krankenfahrt', datum: '2026-03-20', uhrzeit: '10:30', von: 'DRK Westend', nach: 'Charité Campus Virchow', fahrerId: 'fa1', fahrzeugId: 'fz5', status: 'erledigt', preis: 55, mwst: 7, kunde: 'Barmer', kommentare: [] },
  { id: 'ft6', typ: 'flughafentransfer', datum: '2026-03-20', uhrzeit: '05:00', von: 'Friedrichshain', nach: 'BER Terminal 1', fahrerId: 'fa2', fahrzeugId: 'fz3', status: 'erledigt', preis: 89, mwst: 19, kommentare: [] },
  { id: 'ft7', typ: 'privatfahrt', datum: '2026-03-19', uhrzeit: '20:00', von: 'Kurfürstendamm', nach: 'Tegel', fahrerId: 'fa3', fahrzeugId: 'fz2', status: 'erledigt', preis: 45, mwst: 19, kommentare: [] },
  { id: 'ft8', typ: 'firmenfahrt', datum: '2026-03-19', uhrzeit: '07:30', von: 'Potsdamer Platz', nach: 'Adlershof Science Park', fahrerId: 'fa4', fahrzeugId: 'fz1', status: 'erledigt', preis: 78, mwst: 19, kunde: 'Deutsche Telekom', kommentare: [] },
  { id: 'ft9', typ: 'krankenfahrt', datum: '2026-03-22', uhrzeit: '09:00', von: 'Helios Buch', nach: 'Praxis Dr. Müller, Mitte', fahrerId: 'fa1', fahrzeugId: 'fz1', status: 'geplant', kommentare: [] },
  { id: 'ft10', typ: 'flughafentransfer', datum: '2026-03-22', uhrzeit: '16:00', von: 'BER Terminal 5', nach: 'Marriott Hotel', fahrerId: 'fa2', fahrzeugId: 'fz3', status: 'geplant', preis: 110, mwst: 19, kommentare: [] },
  { id: 'ft11', typ: 'krankenfahrt', datum: '2026-03-18', uhrzeit: '11:00', von: 'Dialyse Spandau', nach: 'Wohnung Spandau', fahrerId: 'fa3', fahrzeugId: 'fz5', status: 'erledigt', preis: 42, mwst: 7, kunde: 'TK', kommentare: [] },
  { id: 'ft12', typ: 'privatfahrt', datum: '2026-03-18', uhrzeit: '22:00', von: 'Berghain Nähe', nach: 'Schöneberg', fahrerId: 'fa4', fahrzeugId: 'fz2', status: 'storniert', preis: 35, mwst: 19, kommentare: [{ id: 'k3', text: 'Kunde hat abgesagt', datum: '2026-03-18T21:30', autor: 'Disposition' }] },
  { id: 'ft13', typ: 'firmenfahrt', datum: '2026-03-17', uhrzeit: '08:00', von: 'Hauptbahnhof', nach: 'EUREF-Campus', fahrerId: 'fa1', fahrzeugId: 'fz3', status: 'erledigt', preis: 58, mwst: 19, kunde: 'Schneider Electric', kommentare: [] },
  { id: 'ft14', typ: 'krankenfahrt', datum: '2026-03-17', uhrzeit: '14:00', von: 'Unfallkrankenhaus', nach: 'Reha Marzahn', fahrerId: 'fa2', fahrzeugId: 'fz5', status: 'erledigt', preis: 68, mwst: 7, kunde: 'AOK Berlin', kommentare: [] },
  { id: 'ft15', typ: 'flughafentransfer', datum: '2026-03-23', uhrzeit: '04:30', von: 'Charlottenburg', nach: 'BER Terminal 1', fahrerId: 'fa3', fahrzeugId: 'fz3', status: 'geplant', preis: 95, mwst: 19, kommentare: [] },
  { id: 'ft16', typ: 'privatfahrt', datum: '2026-03-16', uhrzeit: '15:00', von: 'Zoo Palast', nach: 'Wannsee', fahrerId: 'fa4', fahrzeugId: 'fz2', status: 'erledigt', preis: 52, mwst: 19, kommentare: [] },
  { id: 'ft17', typ: 'krankenfahrt', datum: '2026-03-19', uhrzeit: '07:00', von: 'Seniorenheim Steglitz', nach: 'Charité Mitte', fahrerId: 'fa1', fahrzeugId: 'fz5', status: 'erledigt', mwst: 7, kunde: 'DAK', notiz: 'Preis noch offen', kommentare: [{ id: 'k4', text: 'Preis fehlt noch, Abrechnung klären', datum: '2026-03-19T10:00', autor: 'Office' }] },
  { id: 'ft18', typ: 'firmenfahrt', datum: '2026-03-15', uhrzeit: '12:00', von: 'Sony Center', nach: 'Schönefeld Industrie', fahrerId: 'fa2', fahrzeugId: 'fz1', status: 'erledigt', preis: 72, mwst: 19, kunde: 'Sony Europe', kommentare: [] },
];

export const kosten: KostenEintrag[] = [
  { id: 'ko1', typ: 'fix', kategorie: 'Leasing', betrag: 890, fahrzeugId: 'fz1', datum: '2026-03-01', intervall: 'monatlich' },
  { id: 'ko2', typ: 'fix', kategorie: 'Versicherung', betrag: 320, fahrzeugId: 'fz1', datum: '2026-03-01', intervall: 'monatlich' },
  { id: 'ko3', typ: 'fix', kategorie: 'Leasing', betrag: 650, fahrzeugId: 'fz2', datum: '2026-03-01', intervall: 'monatlich' },
  { id: 'ko4', typ: 'fix', kategorie: 'Versicherung', betrag: 280, fahrzeugId: 'fz2', datum: '2026-03-01', intervall: 'monatlich' },
  { id: 'ko5', typ: 'fix', kategorie: 'Leasing', betrag: 1100, fahrzeugId: 'fz3', datum: '2026-03-01', intervall: 'monatlich' },
  { id: 'ko6', typ: 'fix', kategorie: 'Versicherung', betrag: 380, fahrzeugId: 'fz3', datum: '2026-03-01', intervall: 'monatlich' },
  { id: 'ko7', typ: 'variabel', kategorie: 'Sprit', betrag: 340, fahrzeugId: 'fz1', datum: '2026-03-15' },
  { id: 'ko8', typ: 'variabel', kategorie: 'Sprit', betrag: 280, fahrzeugId: 'fz2', datum: '2026-03-14' },
  { id: 'ko9', typ: 'variabel', kategorie: 'Werkstatt', betrag: 450, fahrzeugId: 'fz4', datum: '2026-03-18', notiz: 'Bremsen erneuert' },
  { id: 'ko10', typ: 'variabel', kategorie: 'Reinigung', betrag: 85, fahrzeugId: 'fz1', datum: '2026-03-10' },
  { id: 'ko11', typ: 'fix', kategorie: 'Steuer', betrag: 120, fahrzeugId: 'fz1', datum: '2026-01-01', intervall: 'quartalsweise' },
  { id: 'ko12', typ: 'variabel', kategorie: 'Sprit', betrag: 310, fahrzeugId: 'fz3', datum: '2026-03-16' },
];

export const plattformUmsaetze: PlattformUmsatz[] = [
  { id: 'pu1', plattform: 'Uber', zeitraumVon: '2026-03-01', zeitraumBis: '2026-03-15', fahrzeugId: 'fz2', fahrerId: 'fa3', betrag: 2840, provision: 710, netto: 2130, fahrtenAnzahl: 47 },
  { id: 'pu2', plattform: 'Bolt', zeitraumVon: '2026-03-01', zeitraumBis: '2026-03-15', fahrzeugId: 'fz2', fahrerId: 'fa3', betrag: 1560, provision: 390, netto: 1170, fahrtenAnzahl: 31 },
  { id: 'pu3', plattform: 'Uber', zeitraumVon: '2026-03-01', zeitraumBis: '2026-03-15', fahrzeugId: 'fz5', fahrerId: 'fa4', betrag: 1920, provision: 480, netto: 1440, fahrtenAnzahl: 38 },
  { id: 'pu4', plattform: 'Bolt', zeitraumVon: '2026-02-16', zeitraumBis: '2026-02-28', fahrzeugId: 'fz5', fahrerId: 'fa4', betrag: 1680, provision: 420, netto: 1260, fahrtenAnzahl: 33 },
];

export const abrechnungen: Abrechnung[] = [
  {
    id: 'abr1', fahrerId: 'fa1', monat: '2026-03', status: 'abgeschlossen', erstelltAm: '2026-03-20',
    positionen: [
      { id: 'p1', label: 'Eigene Fahrten (5)', betrag: 328, vorzeichen: '+' },
      { id: 'p2', label: '19% Umsatzsteuer', betrag: 62.32, vorzeichen: '-' },
      { id: 'p3', label: 'Bruttolohn', betrag: 180, vorzeichen: '-' },
      { id: 'p4', label: 'Trinkgeld', betrag: 45, vorzeichen: '+' },
    ],
  },
  {
    id: 'abr2', fahrerId: 'fa2', monat: '2026-03', status: 'abgeschlossen', erstelltAm: '2026-03-20',
    positionen: [
      { id: 'p5', label: 'Eigene Fahrten (4)', betrag: 349, vorzeichen: '+' },
      { id: 'p6', label: '19% Umsatzsteuer', betrag: 66.31, vorzeichen: '-' },
      { id: 'p7', label: 'Bruttolohn', betrag: 195, vorzeichen: '-' },
      { id: 'p8', label: 'Blitzer', betrag: 28.50, vorzeichen: '-' },
    ],
  },
  {
    id: 'abr3', fahrerId: 'fa3', monat: '2026-03', status: 'entwurf', erstelltAm: '2026-03-21',
    positionen: [
      { id: 'p9', label: 'Plattformumsätze (netto)', betrag: 3300, vorzeichen: '+' },
      { id: 'p10', label: '19% Umsatzsteuer', betrag: 627, vorzeichen: '-' },
      { id: 'p11', label: 'Bruttolohn', betrag: 1800, vorzeichen: '-' },
    ],
  },
  {
    id: 'abr4', fahrerId: 'fa1', monat: '2026-02', status: 'abgeschlossen', erstelltAm: '2026-02-28',
    positionen: [
      { id: 'p12', label: 'Eigene Fahrten (8)', betrag: 510, vorzeichen: '+' },
      { id: 'p13', label: '19% Umsatzsteuer', betrag: 96.90, vorzeichen: '-' },
      { id: 'p14', label: 'Bruttolohn', betrag: 220, vorzeichen: '-' },
    ],
  },
];

export const getAbrechnungenByFahrer = (fahrerId: string) => abrechnungen.filter(a => a.fahrerId === fahrerId);

export const getFahrzeug = (id: string) => fahrzeuge.find(f => f.id === id);
export const getFahrer = (id: string) => fahrerList.find(f => f.id === id);
export const getFahrt = (id: string) => fahrten.find(f => f.id === id);

export const fahrtTypLabels: Record<FahrtTyp, string> = {
  krankenfahrt: 'Krankenfahrt', flughafentransfer: 'Flughafentransfer',
  privatfahrt: 'Privatfahrt', firmenfahrt: 'Firmenfahrt',
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
