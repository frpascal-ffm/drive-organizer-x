import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n/config";
import {
  Car, BarChart3, Users, FileText, Shield, ChevronRight, Check, Menu, X,
  ArrowRight, TrendingUp, Clock, Star, Globe, AlertTriangle, Target, PieChart,
  Route, Receipt, Layers, ChevronDown, Phone, Mail, Building2,
  ArrowUpRight, Minus, CircleDot, Gauge, BadgeCheck,
} from "lucide-react";

/* ───────── scroll-reveal hook ───────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        filter: visible ? "blur(0px)" : "blur(4px)",
        transition: `opacity 650ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 650ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 650ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const changeLanguage = (lng: string) => { i18n.changeLanguage(lng); localStorage.setItem("app-language", lng); setLangOpen(false); };
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : ""}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Drive Organizer X</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#problem" className="hover:text-foreground transition-colors">Warum</a>
            <a href="#funktionen" className="hover:text-foreground transition-colors">Funktionen</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Preise</a>
            <a href="#kontakt" className="hover:text-foreground transition-colors">Kontakt</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                <Globe className="h-4 w-4" /><span>{currentLang.flag}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg py-1.5 min-w-[160px]">
                    {languages.map(lang => (
                      <button key={lang.code} onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-muted transition-colors ${lang.code === i18n.language ? "font-semibold text-primary" : "text-foreground"}`}>
                        <span>{lang.flag}</span><span>{lang.label}</span>
                        {lang.code === i18n.language && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link to="/dashboard"><Button variant="ghost" size="sm">Anmelden</Button></Link>
            <a href="#kontakt"><Button size="sm" className="shadow-md shadow-primary/20 active:scale-[0.97] transition-transform">Demo anfragen</Button></a>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-background border-b border-border px-5 pb-5 space-y-3">
            <a href="#problem" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">Warum</a>
            <a href="#funktionen" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">Funktionen</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">Preise</a>
            <a href="#kontakt" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">Kontakt</a>
            <Link to="/dashboard" className="block py-2 text-sm font-medium">Anmelden</Link>
            <div className="flex gap-2 pt-1">
              {languages.map(lang => (
                <button key={lang.code} onClick={() => { changeLanguage(lang.code); setMobileMenu(false); }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border transition-colors ${lang.code === i18n.language ? "border-primary bg-primary/10 font-semibold" : "border-border hover:bg-muted"}`}>
                  {lang.flag}
                </button>
              ))}
            </div>
            <a href="#kontakt"><Button className="w-full mt-2" size="sm">Demo anfragen</Button></a>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-5">
                <Target className="h-3.5 w-3.5" /> Für Mietwagenbetriebe in der Personenbeförderung
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight text-balance" style={{ lineHeight: "1.08" }}>
                Welches Ihrer Fahrzeuge verdient wirklich Geld?
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed text-pretty">
                Die meisten Mietwagenbetriebe kennen ihren Umsatz — aber nicht ihr Ergebnis pro Fahrzeug. Drive Organizer X macht sichtbar, was nach Abzug aller Kosten wirklich übrig bleibt.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {["Uber & Bolt", "Flughafentransfer", "Krankenfahrten", "Firmenfahrten"].map(t => (
                  <span key={t} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" />{t}</span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#kontakt">
                  <Button size="lg" className="shadow-lg shadow-primary/25 active:scale-[0.97] transition-transform text-base px-7 h-12">
                    Demo anfragen <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="text-base px-7 h-12 active:scale-[0.97] transition-transform">
                    Kostenlos testen
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <p className="mt-5 text-xs text-muted-foreground flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" /> Kostenlos für bis zu 3 Fahrzeuge · Keine Kreditkarte nötig
              </p>
            </Reveal>
          </div>

          {/* Hero visual — mini dashboard */}
          <Reveal delay={200}>
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/5 p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Fahrzeuge", val: "8", trend: "5 aktiv" },
                    { label: "Einnahmen", val: "€ 14.820", trend: "März 2026" },
                    { label: "Ergebnis", val: "€ 6.340", trend: "+12 % ggü. Vormonat" },
                  ].map((k) => (
                    <div key={k.label} className="bg-muted/50 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-medium text-muted-foreground">{k.label}</span>
                      <p className="text-lg font-bold tabular-nums">{k.val}</p>
                      <span className="text-[10px] text-primary font-medium">{k.trend}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { car: "B-MR 1234", result: "+€ 1.240", tag: "Profitabel", positive: true },
                    { car: "B-MR 5678", result: "+€ 890", tag: "Profitabel", positive: true },
                    { car: "B-MR 9012", result: "-€ 120", tag: "Nicht rentabel", positive: false },
                  ].map((row) => (
                    <div key={row.car} className="flex items-center justify-between text-xs px-3 py-2.5 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2">
                        <Car className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium font-mono">{row.car}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${row.positive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{row.tag}</span>
                        <span className={`font-semibold tabular-nums ${row.positive ? "text-primary" : "text-destructive"}`}>{row.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -z-10 -top-8 -right-8 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <Reveal>
        <div className="border-y border-border bg-muted/20 py-6 px-5">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-primary" /> Speziell für Personenbeförderung</span>
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> DSGVO-konform</span>
            <span className="flex items-center gap-1.5"><Gauge className="h-4 w-4 text-primary" /> In 5 Minuten startklar</span>
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-primary" /> Für 3–30 Fahrzeuge</span>
          </div>
        </div>
      </Reveal>

      {/* ─── PROBLEM ─── */}
      <section id="problem" className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">Das Problem</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              Umsatz kennen Sie. Aber was bleibt wirklich übrig?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto text-pretty leading-relaxed">
              Die meisten Mietwagenbetriebe wissen, wie viel Umsatz sie machen. Aber nur wenige wissen, welches Fahrzeug profitabel ist und welches Geld kostet. Excel-Listen, Bauchgefühl und verteilte Plattform-Abrechnungen machen es unmöglich, schnell die richtigen Entscheidungen zu treffen.
            </p>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              { icon: AlertTriangle, title: "Kein klares Ergebnis pro Fahrzeug", desc: "Einnahmen aus Uber, Bolt, Flughafentransfers und eigenen Fahrten liegen verstreut. Welches Fahrzeug Gewinn macht und welches nicht, bleibt unklar." },
              { icon: TrendingUp, title: "Versteckte Verluste bleiben unsichtbar", desc: "Manche Fahrzeuge kosten über die Summe aus Leasing, Versicherung und Sprit mehr als sie einbringen — aber das fällt erst am Jahresende auf." },
              { icon: Clock, title: "Excel statt Entscheidungen", desc: "Stunden gehen für das manuelle Zusammentragen von Zahlen drauf. Zeit, die besser in die Steuerung des Betriebs fließen sollte." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="text-center">
                  <div className="h-11 w-11 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-5 w-5 text-destructive" />
                  </div>
                  <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION BRIDGE ─── */}
      <section className="py-16 px-5 bg-muted/20 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Die Lösung</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-balance">
              Weniger Excel. Weniger Bauchgefühl. Mehr Klarheit.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-pretty leading-relaxed">
              Drive Organizer X beantwortet die wichtigste Frage für Ihren Betrieb: <span className="font-semibold text-foreground">Was bleibt pro Fahrzeug übrig — und wo müssen Sie handeln?</span>
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { step: "1", label: "Fahrten erfassen" },
                { step: "2", label: "Plattformumsätze importieren" },
                { step: "3", label: "Kosten zuordnen" },
                { step: "4", label: "Ergebnis pro Fahrzeug sehen" },
              ].map((s, i) => (
                <Reveal key={s.step} delay={180 + i * 60}>
                  <div className="flex flex-col items-center gap-2">
                    <span className="h-9 w-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{s.step}</span>
                    <span className="text-xs font-medium text-center leading-snug">{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="funktionen" className="py-20 md:py-28 px-5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">Funktionen</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              Alles, was Sie für die Steuerung Ihres Betriebs brauchen
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-xl mx-auto text-pretty">
              Von der Fahrterfassung bis zur Fahrzeugbilanz — einfach, übersichtlich, auf den Punkt.
            </p>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Gauge, title: "Dashboard", desc: "Sehen Sie sofort, welche Fahrzeuge rentabel sind, wo Handlungsbedarf besteht und wie Ihr Betrieb insgesamt dasteht." },
              { icon: Route, title: "Fahrten", desc: "Erfassen und dokumentieren Sie eigene Fahrten zentral — Krankenfahrten, Flughafentransfers, Privat- und Firmenfahrten." },
              { icon: TrendingUp, title: "Umsätze", desc: "Kombinieren Sie eigene Fahrten und Plattformumsätze von Uber, Bolt & Co. in einer Übersicht." },
              { icon: Car, title: "Fahrzeuge", desc: "Verstehen Sie, was pro Fahrzeug übrig bleibt. Einnahmen, Kosten und Ergebnis — klar aufgeschlüsselt." },
              { icon: Receipt, title: "Kosten", desc: "Ordnen Sie Fixkosten und variable Kosten sauber Ihren Fahrzeugen zu. Leasing, Versicherung, Sprit, Werkstatt." },
              { icon: Layers, title: "Plattform-Import", desc: "Importieren Sie Umsätze von Uber, Bolt & Co. und ordnen Sie sie automatisch Fahrzeugen und Fahrern zu." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300 h-full">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIFFERENZIERUNG ─── */}
      <section className="py-20 md:py-28 px-5 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">Warum Drive Organizer X</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              Kein allgemeines Flottentool. Kein Buchhaltungsprogramm.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto text-pretty leading-relaxed">
              Drive Organizer X wurde speziell für Mietwagenbetriebe in der Personenbeförderung entwickelt. Es verbindet Fahrten, Plattformeinnahmen und Fahrzeugkosten zu einer einzigen Kennzahl: dem Ergebnis pro Fahrzeug.
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 gap-5">
            {[
              { label: "Spezialisiert auf Personenbeförderung", desc: "Nicht für Speditionen, nicht für LKW-Flotten — sondern für Mietwagenbetriebe mit Uber, Bolt, Krankenfahrten und Mischbetrieb." },
              { label: "Fokus auf Ergebnis pro Fahrzeug", desc: "Die wichtigste Kennzahl für Ihren Betrieb. Keine überladenen Dashboards, sondern klare Antworten." },
              { label: "Für Unternehmer gemacht", desc: "Einfach verständlich, keine Buchhaltungskenntnisse nötig. Einnahmen, Kosten, Ergebnis — fertig." },
              { label: "Eigene Fahrten + Plattformen", desc: "Kombiniert eigene Fahrten und Plattformumsätze in einer Sicht. Kein manuelles Zusammenrechnen mehr." },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 70}>
                <div className="flex gap-4 p-5 bg-card border border-border rounded-xl">
                  <div className="mt-0.5 shrink-0">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{item.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FÜR WEN GEEIGNET ─── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">Zielgruppe</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              Für wen ist Drive Organizer X?
            </h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              { title: "Mischbetriebe", desc: "Sie kombinieren Uber, Bolt, Flughafentransfers und eigene Kundenfahrten? Dann brauchen Sie eine Übersicht, die alles zusammenbringt.", icon: Layers },
              { title: "Krankenfahrtbetriebe", desc: "Krankenfahrten mit Kassenabrechnung, dazu private Fahrten? Drive Organizer X zeigt Ihnen das Ergebnis pro Fahrzeug — unabhängig vom Fahrttyp.", icon: Route },
              { title: "Wachsende Flotten", desc: "3 bis 30 Fahrzeuge, mehrere Fahrer, verschiedene Einnahmequellen? Ab dieser Größe wird Bauchgefühl zum Risiko.", icon: BarChart3 },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="text-center p-6 bg-card border border-border rounded-2xl h-full">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 md:py-28 px-5 bg-muted/20 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">Preise</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              Starten Sie kostenlos — wachsen Sie, wenn Sie bereit sind
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-lg mx-auto">
              1 Fahrzeug ist dauerhaft kostenlos. Kein Vertrag, monatlich kündbar.
            </p>
          </Reveal>

          {/* Free tier banner */}
          <Reveal delay={160}>
            <div className="mt-12 mb-10 max-w-md mx-auto text-center border border-primary/30 bg-primary/5 rounded-2xl p-6">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Dauerhaft kostenlos</p>
              <p className="text-4xl font-extrabold tabular-nums">€0</p>
              <p className="text-muted-foreground text-sm mt-1 mb-1">1 Fahrzeug</p>
              <p className="text-muted-foreground text-xs mb-4">Fahrten erfassen · Kosten zuordnen · Ergebnis sehen</p>
              <Link to="/dashboard">
                <Button variant="outline" className="active:scale-[0.97] transition-transform">
                  Kostenlos starten <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-sm font-medium text-muted-foreground mb-6">Mehr Fahrzeuge? Wählen Sie Ihren Plan:</p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: "Starter", sub: "Für kleine Betriebe", price: "19", vehicles: "2–5 Fahrzeuge", cta: "Jetzt starten", highlight: false, features: ["Bis zu 5 Fahrzeuge", "Unbegrenzte Fahrten", "Dashboard & Ergebnis pro Fahrzeug", "Kostenerfassung (fix & variabel)", "E-Mail-Support"] },
              { name: "Professional", sub: "Für wachsende Betriebe", price: "39", vehicles: "6–15 Fahrzeuge", cta: "Demo anfragen", highlight: true, features: ["Bis zu 15 Fahrzeuge", "Alles aus Starter", "Plattform-Import (Uber, Bolt …)", "Fahrerabrechnung", "Statistik & Vergleiche"] },
              { name: "Business", sub: "Für etablierte Unternehmen", price: "69", vehicles: "16–30 Fahrzeuge", cta: "Demo anfragen", highlight: false, features: ["Bis zu 30 Fahrzeuge", "Alles aus Professional", "Detaillierte Auswertungen", "Prioritäts-Support", "Telefon-Support"] },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={220 + i * 80}>
                <div className={`relative flex flex-col bg-card border rounded-2xl p-6 h-full transition-shadow duration-300 hover:shadow-lg ${
                  plan.highlight ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-border hover:shadow-primary/5"
                }`}>
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      Empfohlen
                    </span>
                  )}
                  <p className="text-sm font-bold">{plan.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{plan.sub}</p>

                  <div className="mt-5 mb-1">
                    <span className="text-3xl font-extrabold tabular-nums">€{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/ Monat</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">{plan.vehicles}</p>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <a href="#kontakt">
                      <Button className={`w-full active:scale-[0.97] transition-transform ${plan.highlight ? "shadow-md shadow-primary/20" : ""}`}
                        variant={plan.highlight ? "default" : "outline"}>
                        {plan.cta} <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={500}>
            <p className="text-center text-xs text-muted-foreground mt-6">
              Alle Preise zzgl. MwSt. · Monatlich kündbar · Keine versteckten Kosten
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">Stimmen aus der Branche</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              Was Unternehmer sagen
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {[
              { text: "Endlich sehe ich auf einen Blick, welches Fahrzeug sich lohnt. Vorher war das Bauchgefühl — jetzt sind es Zahlen.", name: "Mehmet K.", role: "Mietwagenbetrieb, 12 Fahrzeuge, Berlin" },
              { text: "Die Plattform-Importe sparen mir jede Woche Stunden. Uber, Bolt — alles kommt zusammen und ich sehe sofort das Ergebnis pro Fahrzeug.", name: "Sandra W.", role: "Personenbeförderung, 7 Fahrzeuge, Hamburg" },
            ].map((tm, i) => (
              <Reveal key={tm.name} delay={i * 100}>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">„{tm.text}"</p>
                  <div>
                    <p className="text-sm font-bold">{tm.name}</p>
                    <p className="text-xs text-muted-foreground">{tm.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KONTAKT / DEMO CTA ─── */}
      <section id="kontakt" className="py-20 md:py-28 px-5 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Kontakt</p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-balance">
                  Unverbindlich anfragen oder Demo vereinbaren
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
                  Sie möchten wissen, ob Drive Organizer X zu Ihrem Betrieb passt? Schreiben Sie uns — wir melden uns innerhalb von 24 Stunden.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">E-Mail</p>
                      <p className="text-muted-foreground text-xs">info@driveorganizerx.de</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Telefon</p>
                      <p className="text-muted-foreground text-xs">+49 30 123 456 78</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Antwortzeit</p>
                      <p className="text-muted-foreground text-xs">Innerhalb von 24 Stunden</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                {contactSent ? (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-base mb-2">Anfrage gesendet</h3>
                    <p className="text-sm text-muted-foreground">Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="font-bold text-base mb-1">Demo anfragen</h3>
                    <p className="text-xs text-muted-foreground mb-4">Unverbindlich und kostenlos. Wir zeigen Ihnen, wie Drive Organizer X zu Ihrem Betrieb passt.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1.5 block">Vorname</label>
                        <Input placeholder="Max" className="h-9 text-sm" required />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1.5 block">Nachname</label>
                        <Input placeholder="Mustermann" className="h-9 text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">E-Mail</label>
                      <Input type="email" placeholder="info@ihr-betrieb.de" className="h-9 text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Firmenname</label>
                      <Input placeholder="Ihr Betriebsname" className="h-9 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Anzahl Fahrzeuge</label>
                      <Input type="number" placeholder="z. B. 8" min="1" max="100" className="h-9 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Nachricht (optional)</label>
                      <Textarea placeholder="Erzählen Sie uns kurz von Ihrem Betrieb…" className="text-sm min-h-[70px]" />
                    </div>
                    <Button type="submit" className="w-full active:scale-[0.97] transition-transform shadow-md shadow-primary/20">
                      Anfrage senden <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">Ihre Daten werden vertraulich behandelt. Keine Weitergabe an Dritte.</p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 md:py-28 px-5">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl px-8 py-14 md:py-18 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary-foreground)/0.06),transparent_60%)]" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground tracking-tight relative text-balance">
              Wissen Sie, was pro Fahrzeug übrig bleibt?
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-sm md:text-base max-w-md mx-auto relative">
              Starten Sie kostenlos mit bis zu 3 Fahrzeugen. Keine Kreditkarte, kein Vertrag. In 5 Minuten eingerichtet.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 shadow-lg active:scale-[0.97] transition-transform font-semibold">
                  Kostenlos testen <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#kontakt">
                <Button size="lg" variant="ghost" className="text-base px-6 h-12 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  Demo anfragen
                </Button>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-muted/20 py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Car className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold text-sm">Drive Organizer X</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Das Steuerungstool für Mietwagenbetriebe in der Personenbeförderung.
              </p>
            </div>
            <div>
              <p className="font-semibold text-xs mb-3 uppercase tracking-wider text-muted-foreground">Produkt</p>
              <div className="space-y-2">
                <a href="#funktionen" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Funktionen</a>
                <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Preise</a>
                <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">App öffnen</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-3 uppercase tracking-wider text-muted-foreground">Unternehmen</p>
              <div className="space-y-2">
                <a href="#kontakt" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Kontakt</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Impressum</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Datenschutz</a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-3 uppercase tracking-wider text-muted-foreground">Rechtliches</p>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">AGB</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Datenschutz</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie-Richtlinie</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2026 Drive Organizer X · Alle Rechte vorbehalten</p>
            <p className="text-xs text-muted-foreground">Entwickelt in Deutschland 🇩🇪</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
