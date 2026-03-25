import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { STRIPE_PRODUCTS } from "@/lib/stripe-config";

const PLAN_INFO: Record<string, { name: string; price: string; desc: string }> = {
  free: { name: "Kostenlos", price: "€0", desc: "1 Fahrzeug" },
  starter: { name: "Starter", price: "€29/Monat", desc: "2–5 Fahrzeuge" },
  professional: { name: "Professional", price: "€49/Monat", desc: "6–15 Fahrzeuge" },
  business: { name: "Business", price: "€69/Monat", desc: "16–30 Fahrzeuge" },
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "free";
  const planInfo = PLAN_INFO[selectedPlan] || PLAN_INFO.free;
  const isPaid = selectedPlan !== "free";

  // After OAuth redirect, check if we need to start checkout
  useEffect(() => {
    const pendingPlan = localStorage.getItem("mietfleet_pending_plan");
    if (!pendingPlan || pendingPlan === "free") return;

    const startCheckout = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      localStorage.removeItem("mietfleet_pending_plan");
      const tier = STRIPE_PRODUCTS[pendingPlan as keyof typeof STRIPE_PRODUCTS];
      if (!tier?.price_id) {
        navigate("/dashboard");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { priceId: tier.price_id },
        });
        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch {
        toast({ title: "Fehler", description: "Checkout konnte nicht gestartet werden. Sie können das Abo später in den Einstellungen abschließen.", variant: "destructive" });
        navigate("/dashboard");
      }
    };

    startCheckout();
  }, [navigate, toast]);

  const startCheckoutFlow = async (userId: string, userEmail: string) => {
    if (!isPaid) {
      navigate("/dashboard");
      return;
    }

    const tier = STRIPE_PRODUCTS[selectedPlan as keyof typeof STRIPE_PRODUCTS];
    if (!tier?.price_id) {
      navigate("/dashboard");
      return;
    }

    // We need a valid session for the checkout function
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // If email confirmation is required, user won't have a session yet
      toast({ title: "Registrierung erfolgreich", description: "Bitte bestätigen Sie Ihre E-Mail. Danach können Sie Ihr Abo abschließen." });
      navigate("/login");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: tier.price_id },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      toast({ title: "Hinweis", description: "Checkout konnte nicht gestartet werden. Sie können das Abo in den Einstellungen abschließen." });
    }
    navigate("/dashboard");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Fehler", description: "Das Passwort muss mindestens 6 Zeichen lang sein.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/dashboard" },
    });
    if (error) {
      toast({ title: "Registrierung fehlgeschlagen", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data.user && companyName) {
      await supabase.from("profiles").update({ company_name: companyName }).eq("id", data.user.id);
    }

    setLoading(false);

    if (data.user) {
      await startCheckoutFlow(data.user.id, data.user.email || email);
    } else {
      toast({ title: "Registrierung erfolgreich", description: "Bitte bestätigen Sie Ihre E-Mail-Adresse." });
      navigate("/login");
    }
  };

  const handleGoogleRegister = async () => {
    // Store pending plan so we can start checkout after OAuth redirect
    if (isPaid) {
      localStorage.setItem("mietfleet_pending_plan", selectedPlan);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + (isPaid ? "/register?plan=" + selectedPlan : "/dashboard") },
    });
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Konto erstellen</CardTitle>
          <CardDescription>Starten Sie jetzt mit MietFleet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected plan info */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${isPaid ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
            <div>
              <p className="text-sm font-semibold">{planInfo.name}</p>
              <p className="text-xs text-muted-foreground">{planInfo.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{planInfo.price}</p>
              {isPaid && <p className="text-[10px] text-muted-foreground">zzgl. MwSt.</p>}
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleRegister}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Mit Google registrieren
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">oder</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Firmenname</Label>
              <Input id="company" placeholder="Muster GmbH" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" placeholder="name@firma.de" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" type="password" placeholder="Mind. 6 Zeichen" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isPaid ? "Registrieren & Abo abschließen" : "Kostenlos starten"}
            </Button>
          </form>

          {isPaid && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <span>Nach der Registrierung werden Sie zur sicheren Zahlungsseite von Stripe weitergeleitet.</span>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Bereits ein Konto?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Anmelden</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
