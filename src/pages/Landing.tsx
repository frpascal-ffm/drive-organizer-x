import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n/config";
import {
  Car,
  BarChart3,
  Users,
  FileText,
  Shield,
  Zap,
  ChevronRight,
  Check,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Globe,
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
    <div
      ref={ref}
      className={className}
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

/* ───────── feature icons ───────── */
const featureIcons = [Car, Users, BarChart3, FileText, Shield, Zap];

/* ───────── component ───────── */
export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("app-language", lng);
    setLangOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const features = [
    { icon: featureIcons[0], titleKey: "landing.feat1Title", descKey: "landing.feat1Desc" },
    { icon: featureIcons[1], titleKey: "landing.feat2Title", descKey: "landing.feat2Desc" },
    { icon: featureIcons[2], titleKey: "landing.feat3Title", descKey: "landing.feat3Desc" },
    { icon: featureIcons[3], titleKey: "landing.feat4Title", descKey: "landing.feat4Desc" },
    { icon: featureIcons[4], titleKey: "landing.feat5Title", descKey: "landing.feat5Desc" },
    { icon: featureIcons[5], titleKey: "landing.feat6Title", descKey: "landing.feat6Desc" },
  ];

  const plans = [
    { nameKey: "landing.plan1Name", subKey: "landing.plan1Sub", price: "0", vehiclesKey: "landing.plan1Vehicles", ctaKey: "landing.plan1Cta", highlight: false, featureKeys: ["landing.plan1F1","landing.plan1F2","landing.plan1F3","landing.plan1F4","landing.plan1F5"] },
    { nameKey: "landing.plan2Name", subKey: "landing.plan2Sub", price: "29,99", vehiclesKey: "landing.plan2Vehicles", ctaKey: "landing.plan2Cta", highlight: true, featureKeys: ["landing.plan2F1","landing.plan2F2","landing.plan2F3","landing.plan2F4","landing.plan2F5"] },
    { nameKey: "landing.plan3Name", subKey: "landing.plan3Sub", price: "59,99", vehiclesKey: "landing.plan3Vehicles", ctaKey: "landing.plan3Cta", highlight: false, featureKeys: ["landing.plan3F1","landing.plan3F2","landing.plan3F3","landing.plan3F4","landing.plan3F5"] },
    { nameKey: "landing.plan4Name", subKey: "landing.plan4Sub", price: "79,99", vehiclesKey: "landing.plan4Vehicles", ctaKey: "landing.plan4Cta", highlight: false, featureKeys: ["landing.plan4F1","landing.plan4F2","landing.plan4F3","landing.plan4F4","landing.plan4F5"] },
  ];

  const stats = [
    { value: "1.200+", labelKey: "landing.statVehicles" },
    { value: "98,7 %", labelKey: "landing.statSatisfaction" },
    { value: "4,2 Std.", labelKey: "landing.statTimeSaved" },
    { value: "23 %", labelKey: "landing.statMoreRevenue" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── NAV ─── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">MietFleet</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">{t("landing.navFeatures")}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{t("landing.navPricing")}</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">{t("landing.navTestimonials")}</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
              >
                <Globe className="h-4 w-4" />
                <span>{currentLang.flag}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg py-1.5 min-w-[160px]">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-muted transition-colors ${
                          lang.code === i18n.language ? "font-semibold text-primary" : "text-foreground"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {lang.code === i18n.language && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">{t("landing.login")}</Button>
            </Link>
            <a href="#pricing">
              <Button size="sm" className="shadow-md shadow-primary/20 active:scale-[0.97] transition-transform">
                {t("landing.ctaTry")}
              </Button>
            </a>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-background border-b border-border px-5 pb-5 space-y-3">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">{t("landing.navFeatures")}</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">{t("landing.navPricing")}</a>
            <a href="#testimonials" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-medium">{t("landing.navTestimonials")}</a>
            <Link to="/dashboard" className="block py-2 text-sm font-medium">{t("landing.login")}</Link>
            <div className="flex gap-2 pt-1">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { changeLanguage(lang.code); setMobileMenu(false); }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border transition-colors ${
                    lang.code === i18n.language ? "border-primary bg-primary/10 font-semibold" : "border-border hover:bg-muted"
                  }`}
                >
                  {lang.flag}
                </button>
              ))}
            </div>
            <a href="#pricing"><Button className="w-full mt-2" size="sm">{t("landing.ctaTry")}</Button></a>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-5">
                <Zap className="h-3.5 w-3.5" /> {t("landing.heroTag")}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight text-balance">
                {t("landing.heroTitle1")}{" "}
                <span className="text-primary">{t("landing.heroTitle2")}</span>{" "}
                {t("landing.heroTitle3")}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed text-pretty">
                {t("landing.heroDesc")}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#pricing">
                  <Button size="lg" className="shadow-lg shadow-primary/25 active:scale-[0.97] transition-transform text-base px-7 h-12">
                    {t("landing.ctaStart")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="#features">
                  <Button variant="outline" size="lg" className="text-base px-7 h-12 active:scale-[0.97] transition-transform">
                    {t("landing.ctaFeatures")}
                  </Button>
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-5 text-xs text-muted-foreground flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" /> {t("landing.ctaNoCard")}
              </p>
            </Reveal>
          </div>

          {/* Hero visual — abstract dashboard mockup */}
          <Reveal delay={200}>
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/5 p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { labelKey: "landing.kpiVehicles", val: "12", icon: Car, trend: "+2" },
                    { labelKey: "landing.kpiRevenue", val: "€ 14.820", icon: TrendingUp, trend: "+8,3 %" },
                    { labelKey: "landing.kpiRides", val: "347", icon: Clock, trendKey: "landing.kpiThisWeek" },
                  ].map((k) => (
                    <div key={k.labelKey} className="bg-muted/50 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <k.icon className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-medium">{t(k.labelKey)}</span>
                      </div>
                      <p className="text-lg font-bold tabular-nums">{k.val}</p>
                      <span className="text-[10px] text-primary font-medium">{k.trendKey ? t(k.trendKey) : k.trend}</span>
                    </div>
                  ))}
                </div>
                <div className="h-28 rounded-xl bg-gradient-to-t from-primary/5 to-transparent border border-border/50 flex items-end px-4 pb-3 gap-1.5">
                  {[40, 55, 35, 70, 60, 80, 65, 90, 75, 95, 85, 78].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-primary/70 transition-all"
                      style={{ height: `${h}%`, opacity: 0.5 + (h / 200) }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { car: "Mercedes Vito", statusKey: "landing.mockActive", active: true },
                    { car: "VW Touran", statusKey: "landing.mockMaintenance", active: false },
                    { car: "BMW 5er", statusKey: "landing.mockActive", active: true },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-muted/30">
                      <span className="font-medium">{row.car}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${!row.active ? "bg-warning/15 text-warning" : "bg-primary/10 text-primary"}`}>
                        {t(row.statusKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -z-10 -top-8 -right-8 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.labelKey} delay={i * 70}>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{t(s.labelKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 md:py-28 px-5">
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
            {features.map((f, i) => (
              <Reveal key={f.titleKey} delay={i * 70}>
                <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300 h-full">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{t(f.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 md:py-28 px-5 bg-muted/20">
        <div className="max-w-6xl mx-auto">
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

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <Reveal key={plan.nameKey} delay={i * 80}>
                <div
                  className={`relative flex flex-col bg-card border rounded-2xl p-6 h-full transition-shadow duration-300 hover:shadow-lg ${
                    plan.highlight
                      ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                      : "border-border hover:shadow-primary/5"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      {t("landing.popular")}
                    </span>
                  )}
                  <p className="text-sm font-bold">{t(plan.nameKey)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t(plan.subKey)}</p>

                  <div className="mt-5 mb-1">
                    <span className="text-3xl font-extrabold tabular-nums">
                      {plan.price === "0" ? t("landing.free") : `€${plan.price}`}
                    </span>
                    {plan.price !== "0" && <span className="text-sm text-muted-foreground ml-1">{t("landing.perMonth")}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">{t(plan.vehiclesKey)}</p>

                  <ul className="space-y-2.5 flex-1">
                    {plan.featureKeys.map((fk) => (
                      <li key={fk} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{t(fk)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button
                      className={`w-full active:scale-[0.97] transition-transform ${
                        plan.highlight ? "shadow-md shadow-primary/20" : ""
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {t(plan.ctaKey)} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-20 md:py-28 px-5">
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
              { textKey: "landing.testimonial1Text", nameKey: "landing.testimonial1Name", roleKey: "landing.testimonial1Role" },
              { textKey: "landing.testimonial2Text", nameKey: "landing.testimonial2Name", roleKey: "landing.testimonial2Role" },
            ].map((tm, i) => (
              <Reveal key={tm.nameKey} delay={i * 100}>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">"{t(tm.textKey)}"</p>
                  <div>
                    <p className="text-sm font-bold">{t(tm.nameKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(tm.roleKey)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 md:py-28 px-5">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center bg-primary rounded-3xl px-8 py-14 md:py-18 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary-foreground)/0.06),transparent_60%)]" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground tracking-tight relative text-balance">
              {t("landing.ctaTitle")}
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-sm md:text-base max-w-md mx-auto relative">
              {t("landing.ctaDesc")}
            </p>
            <div className="mt-8 relative">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-8 h-12 shadow-lg active:scale-[0.97] transition-transform font-semibold"
                >
                  {t("landing.ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-muted/20 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">MietFleet</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">{t("landing.footerImprint")}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t("landing.footerPrivacy")}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t("landing.footerTerms")}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t("landing.footerContact")}</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MietFleet GmbH</p>
        </div>
      </footer>
    </div>
  );
}
