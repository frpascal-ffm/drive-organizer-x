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
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState("");

  const changeLanguage = (lng: string) => { i18n.changeLanguage(lng); localStorage.setItem("app-language", lng); setLangOpen(false); };
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSending(true);
    setContactError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: `${formData.get("vorname")} ${formData.get("nachname")}`.trim(),
      email: formData.get("email") as string,
      company: formData.get("firma") as string || undefined,
      message: formData.get("nachricht") as string || `Fahrzeuganzahl: ${formData.get("fahrzeuge") || "k.A."}`,
    };

    try {
      const res = await fetch(
        `https://bndvrjbvfghjwwjebjvz.supabase.co/functions/v1/send-contact-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Error");
      setContactSent(true);
    } catch {
      setContactError(t("landing.contactError"));
    } finally {
      setContactSending(false);
    }
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
            <span className="font-bold text-lg tracking-tight">MietFleet</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#problem" className="hover:text-foreground transition-colors">{t("landing.navWhy")}</a>
            <a href="#funktionen" className="hover:text-foreground transition-colors">{t("landing.navFeatures")}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{t("landing.navPricing")}</a>
            <a href="#kontakt" className="hover:text-foreground transition-colors">{t("landing.navContact")}</a>
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
            <Link to="/login"><Button variant="ghost" size="sm">{t("landing.login")}</Button></Link>
            <Link to="/register"><Button size="sm" className="shadow-md shadow-primary/20 active:scale-[0.97] transition-transform">{t("landing.ctaTry")}</Button></Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-background border-b border-border px-5 pb-5 space-y-3">
            <a href="#problem" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">{t("landing.navWhy")}</a>
            <a href="#funktionen" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">{t("landing.navFeatures")}</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">{t("landing.navPricing")}</a>
            <a href="#kontakt" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">{t("landing.navContact")}</a>
            <Link to="/login" className="block py-2 text-sm font-medium">{t("landing.login")}</Link>
            <div className="flex gap-2 pt-1">
              {languages.map(lang => (
                <button key={lang.code} onClick={() => { changeLanguage(lang.code); setMobileMenu(false); }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border transition-colors ${lang.code === i18n.language ? "border-primary bg-primary/10 font-semibold" : "border-border hover:bg-muted"}`}>
                  {lang.flag}
                </button>
              ))}
            </div>
            <Link to="/register"><Button className="w-full mt-2" size="sm">{t("landing.ctaTry")}</Button></Link>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-5">
                <Target className="h-3.5 w-3.5" /> {t("landing.heroTag")}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight text-balance" style={{ lineHeight: "1.08" }}>
                {t("landing.heroTitle")}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed text-pretty">
                {t("landing.heroDesc")}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {[t("landing.heroCheck1"), t("landing.heroCheck2"), t("landing.heroCheck3"), t("landing.heroCheck4")].map(label => (
                  <span key={label} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" />{label}</span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button size="lg" className="shadow-lg shadow-primary/25 active:scale-[0.97] transition-transform text-base px-7 h-12">
                    {t("landing.ctaStart")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#funktionen">
                  <Button variant="outline" size="lg" className="text-base px-7 h-12 active:scale-[0.97] transition-transform">
                    {t("landing.ctaFeatures")}
                  </Button>
                </a>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <p className="mt-5 text-xs text-muted-foreground flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" /> {t("landing.ctaNoCard")}
              </p>
            </Reveal>
          </div>

          {/* Hero visual — mini dashboard */}
          <Reveal delay={200}>
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/5 p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: t("landing.heroKpi1Label"), val: t("landing.heroKpi1Val"), trend: t("landing.heroKpi1Trend") },
                    { label: t("landing.heroKpi2Label"), val: t("landing.heroKpi2Val"), trend: t("landing.heroKpi2Trend") },
                    { label: t("landing.heroKpi3Label"), val: t("landing.heroKpi3Val"), trend: t("landing.heroKpi3Trend") },
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
                    { car: "B-MR 1234", result: "+€ 1.240", tag: t("landing.heroCar1Tag"), positive: true },
                    { car: "B-MR 5678", result: "+€ 890", tag: t("landing.heroCar1Tag"), positive: true },
                    { car: "B-MR 9012", result: "-€ 120", tag: t("landing.heroCar3Tag"), positive: false },
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
            <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-primary" /> {t("landing.socialProof1")}</span>
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> {t("landing.socialProof2")}</span>
            <span className="flex items-center gap-1.5"><Gauge className="h-4 w-4 text-primary" /> {t("landing.socialProof3")}</span>
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-primary" /> {t("landing.socialProof4")}</span>
          </div>
        </div>
      </Reveal>

      {/* ─── PROBLEM ─── */}
      <section id="problem" className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">{t("landing.problemTag")}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              {t("landing.problemTitle")}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto text-pretty leading-relaxed">
              {t("landing.problemDesc")}
            </p>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              { icon: AlertTriangle, title: t("landing.problem1Title"), desc: t("landing.problem1Desc") },
              { icon: TrendingUp, title: t("landing.problem2Title"), desc: t("landing.problem2Desc") },
              { icon: Clock, title: t("landing.problem3Title"), desc: t("landing.problem3Desc") },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t("landing.solutionTag")}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-balance">
              {t("landing.solutionTitle")}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-pretty leading-relaxed"
               dangerouslySetInnerHTML={{ __html: t("landing.solutionDesc") }} />
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                t("landing.solutionStep1"),
                t("landing.solutionStep2"),
                t("landing.solutionStep3"),
                t("landing.solutionStep4"),
              ].map((label, i) => (
                <Reveal key={i} delay={180 + i * 60}>
                  <div className="flex flex-col items-center gap-2">
                    <span className="h-9 w-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-xs font-medium text-center leading-snug">{label}</span>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">{t("landing.featuresTag")}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              {t("landing.featuresTitle")}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-xl mx-auto text-pretty">
              {t("landing.featuresDesc")}
            </p>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Gauge, title: t("landing.feat1Title"), desc: t("landing.feat1Desc") },
              { icon: Route, title: t("landing.feat2Title"), desc: t("landing.feat2Desc") },
              { icon: TrendingUp, title: t("landing.feat3Title"), desc: t("landing.feat3Desc") },
              { icon: Car, title: t("landing.feat4Title"), desc: t("landing.feat4Desc") },
              { icon: Receipt, title: t("landing.feat5Title"), desc: t("landing.feat5Desc") },
              { icon: Layers, title: t("landing.feat6Title"), desc: t("landing.feat6Desc") },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 70}>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">{t("landing.diffTag")}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              {t("landing.diffTitle")}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto text-pretty leading-relaxed">
              {t("landing.diffDesc")}
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 gap-5">
            {[
              { label: t("landing.diff1Label"), desc: t("landing.diff1Desc") },
              { label: t("landing.diff2Label"), desc: t("landing.diff2Desc") },
              { label: t("landing.diff3Label"), desc: t("landing.diff3Desc") },
              { label: t("landing.diff4Label"), desc: t("landing.diff4Desc") },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 70}>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">{t("landing.targetTag")}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              {t("landing.targetTitle")}
            </h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {[
              { title: t("landing.target1Title"), desc: t("landing.target1Desc"), icon: Layers },
              { title: t("landing.target2Title"), desc: t("landing.target2Desc"), icon: Route },
              { title: t("landing.target3Title"), desc: t("landing.target3Desc"), icon: BarChart3 },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">{t("landing.pricingTag")}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              {t("landing.pricingTitle")}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-muted-foreground text-center mt-4 max-w-lg mx-auto">
              {t("landing.pricingDesc")}
            </p>
          </Reveal>

          {/* Free tier banner */}
          <Reveal delay={160}>
            <div className="mt-12 mb-10 max-w-md mx-auto text-center border border-primary/30 bg-primary/5 rounded-2xl p-6">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">{t("landing.pricingFreeLabel")}</p>
              <p className="text-4xl font-extrabold tabular-nums">€0</p>
              <p className="text-muted-foreground text-sm mt-1 mb-1">{t("landing.pricingFreeVehicles")}</p>
              <p className="text-muted-foreground text-xs mb-4">{t("landing.pricingFreeFeatures")}</p>
              <Link to="/register?plan=free">
                <Button variant="outline" className="active:scale-[0.97] transition-transform">
                  {t("landing.pricingFreeCta")} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-sm font-medium text-muted-foreground mb-6">{t("landing.pricingMoreLabel")}</p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: t("landing.plan1Name"), sub: t("landing.plan1Sub"), price: "29", vehicles: t("landing.plan1Vehicles"), cta: t("landing.plan1Cta"), highlight: false, planKey: "starter", features: [t("landing.plan1F1"), t("landing.plan1F2"), t("landing.plan1F3"), t("landing.plan1F4"), t("landing.plan1F5")] },
              { name: t("landing.plan2Name"), sub: t("landing.plan2Sub"), price: "49", vehicles: t("landing.plan2Vehicles"), cta: t("landing.plan2Cta"), highlight: true, planKey: "professional", features: [t("landing.plan2F1"), t("landing.plan2F2"), t("landing.plan2F3"), t("landing.plan2F4"), t("landing.plan2F5")] },
              { name: t("landing.plan3Name"), sub: t("landing.plan3Sub"), price: "69", vehicles: t("landing.plan3Vehicles"), cta: t("landing.plan3Cta"), highlight: false, planKey: "business", features: [t("landing.plan3F1"), t("landing.plan3F2"), t("landing.plan3F3"), t("landing.plan3F4"), t("landing.plan3F5")] },
            ].map((plan, i) => (
              <Reveal key={i} delay={220 + i * 80}>
                <div className={`relative flex flex-col bg-card border rounded-2xl p-6 h-full transition-shadow duration-300 hover:shadow-lg ${
                  plan.highlight ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-border hover:shadow-primary/5"
                }`}>
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      {t("landing.pricingRecommended")}
                    </span>
                  )}
                  <p className="text-sm font-bold">{plan.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{plan.sub}</p>

                  <div className="mt-5 mb-1">
                    <span className="text-3xl font-extrabold tabular-nums">€{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{t("landing.pricingPerMonth")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">{plan.vehicles}</p>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Link to={`/register?plan=${plan.planKey}`}>
                      <Button className={`w-full active:scale-[0.97] transition-transform ${plan.highlight ? "shadow-md shadow-primary/20" : ""}`}
                        variant={plan.highlight ? "default" : "outline"}>
                        {plan.cta} <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={500}>
            <p className="text-center text-xs text-muted-foreground mt-6">
              {t("landing.pricingFooter")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">{t("landing.testimonialsTag")}</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-balance">
              {t("landing.testimonialsTitle")}
            </h2>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {[
              { text: t("landing.testimonial1Text"), name: t("landing.testimonial1Name"), role: t("landing.testimonial1Role") },
              { text: t("landing.testimonial2Text"), name: t("landing.testimonial2Name"), role: t("landing.testimonial2Role") },
            ].map((tm, i) => (
              <Reveal key={i} delay={i * 100}>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t("landing.contactTag")}</p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-balance">
                  {t("landing.contactTitle")}
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
                  {t("landing.contactDesc")}
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t("landing.contactEmail")}</p>
                      <p className="text-muted-foreground text-xs">info@mietfleet.de</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t("landing.contactResponseTime")}</p>
                      <p className="text-muted-foreground text-xs">{t("landing.contactResponseValue")}</p>
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
                    <h3 className="font-bold text-base mb-2">{t("landing.contactSentTitle")}</h3>
                    <p className="text-sm text-muted-foreground">{t("landing.contactSentDesc")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="font-bold text-base mb-1">{t("landing.contactFormTitle")}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{t("landing.contactFormDesc")}</p>
                    {contactError && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                        {contactError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1.5 block">{t("landing.contactFirstName")}</label>
                        <Input name="vorname" placeholder="Max" className="h-9 text-sm" required />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1.5 block">{t("landing.contactLastName")}</label>
                        <Input name="nachname" placeholder="Mustermann" className="h-9 text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">{t("landing.contactEmailLabel")}</label>
                      <Input name="email" type="email" placeholder="info@ihr-betrieb.de" className="h-9 text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">{t("landing.contactCompany")}</label>
                      <Input name="firma" placeholder="Ihr Betriebsname" className="h-9 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">{t("landing.contactVehicles")}</label>
                      <Input name="fahrzeuge" type="number" placeholder={t("landing.contactVehiclesPlaceholder")} min="1" max="100" className="h-9 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">{t("landing.contactMessage")}</label>
                      <Textarea name="nachricht" placeholder={t("landing.contactMessagePlaceholder")} className="text-sm min-h-[70px]" />
                    </div>
                    <Button type="submit" disabled={contactSending} className="w-full active:scale-[0.97] transition-transform shadow-md shadow-primary/20">
                      {contactSending ? t("landing.contactSending") : t("landing.contactSubmit")} {!contactSending && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">{t("landing.contactPrivacy")}</p>
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
              {t("landing.finalCtaTitle")}
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-sm md:text-base max-w-md mx-auto relative">
              {t("landing.finalCtaDesc")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 shadow-lg active:scale-[0.97] transition-transform font-semibold">
                  {t("landing.finalCtaButton")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="ghost" className="text-base px-6 h-12 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  {t("landing.finalCtaRegister")}
                </Button>
              </Link>
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
                <span className="font-bold text-sm">MietFleet</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("landing.footerDesc")}
              </p>
            </div>
            <div>
              <p className="font-semibold text-xs mb-3 uppercase tracking-wider text-muted-foreground">{t("landing.footerProduct")}</p>
              <div className="space-y-2">
                <a href="#funktionen" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerFeatures")}</a>
                <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerPricing")}</a>
                <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerOpenApp")}</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-3 uppercase tracking-wider text-muted-foreground">{t("landing.footerCompany")}</p>
              <div className="space-y-2">
                <Link to="/kontakt" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerContact")}</Link>
                <Link to="/impressum" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerImprint")}</Link>
                <Link to="/datenschutz" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerPrivacy")}</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs mb-3 uppercase tracking-wider text-muted-foreground">{t("landing.footerLegal")}</p>
              <div className="space-y-2">
                <Link to="/impressum" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerTerms")}</Link>
                <Link to="/datenschutz" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerPrivacy")}</Link>
                <Link to="/cookie-richtlinie" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footerCookies")}</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{t("landing.footerCopyright")}</p>
            <p className="text-xs text-muted-foreground">{t("landing.footerMadeIn")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
