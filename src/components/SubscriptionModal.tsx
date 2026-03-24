import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";
import { STRIPE_PRODUCTS } from "@/lib/stripe-config";
import { Shield, CreditCard, LogOut, Check } from "lucide-react";

const plans = [
  {
    key: "starter" as const,
    label: "Starter",
    desc: "2–5 Fahrzeuge",
    price: "29",
    features: ["Bis zu 5 Fahrzeuge", "Unbegrenzte Fahrten", "Dashboard & Ergebnis", "Kostenerfassung", "E-Mail-Support"],
  },
  {
    key: "professional" as const,
    label: "Professional",
    desc: "6–15 Fahrzeuge",
    price: "49",
    popular: true,
    features: ["Bis zu 15 Fahrzeuge", "Alles aus Starter", "Plattform-Import (Uber, Bolt …)", "Fahrerabrechnung", "Statistik & Vergleiche"],
  },
  {
    key: "business" as const,
    label: "Business",
    desc: "16–30 Fahrzeuge",
    price: "69",
    features: ["Bis zu 30 Fahrzeuge", "Alles aus Professional", "Detaillierte Auswertungen", "Prioritäts-Support", "Telefon-Support"],
  },
];

export function SubscriptionModal() {
  const { showUpgradeModal, setShowUpgradeModal, startCheckout, openBillingPortal, status } = useSubscription();
  const { signOut } = useAuth();

  const hasHadSubscription = status === "canceled" || status === "past_due" || status === "unpaid";

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg">
            Abo erforderlich
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground pt-1">
            Wählen Sie ein Abo, um MietFleet vollständig nutzen zu können.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          {plans.map((plan) => {
            const priceId = STRIPE_PRODUCTS[plan.key].price_id;
            return (
              <div
                key={plan.key}
                className={`rounded-xl border p-4 flex flex-col ${plan.popular ? "border-primary ring-1 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <span className="text-[10px] font-semibold uppercase text-primary mb-2">Beliebt</span>
                )}
                <h3 className="font-semibold text-sm">{plan.label}</h3>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-bold">€{plan.price}</span>
                  <span className="text-xs text-muted-foreground">/Monat</span>
                </div>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    if (priceId) startCheckout(priceId);
                  }}
                >
                  Auswählen
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t mt-2">
          {hasHadSubscription && (
            <Button variant="outline" size="sm" onClick={() => { setShowUpgradeModal(false); openBillingPortal(); }} className="w-full">
              Billing verwalten
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={async () => { setShowUpgradeModal(false); await signOut(); }} className="w-full text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Ausloggen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
