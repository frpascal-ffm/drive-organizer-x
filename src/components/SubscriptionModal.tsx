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
import { Shield, CreditCard, LogOut, X } from "lucide-react";

export function SubscriptionModal() {
  const { showUpgradeModal, setShowUpgradeModal, startCheckout, openBillingPortal, status } = useSubscription();
  const { signOut } = useAuth();

  const hasHadSubscription = status === "canceled" || status === "past_due" || status === "unpaid";

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg">
            Kein aktives Abo
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground pt-2">
            Um MietFleet vollständig nutzen zu können, benötigen Sie ein aktives Abonnement.
            Mit einem Abo können Sie Fahrten erfassen, Fahrzeuge verwalten, Kosten tracken und vieles mehr.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => { setShowUpgradeModal(false); startCheckout(); }} className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Abo abschließen – ab 29,99 €/Monat
          </Button>

          {hasHadSubscription && (
            <Button variant="outline" onClick={() => { setShowUpgradeModal(false); openBillingPortal(); }} className="w-full">
              Billing verwalten
            </Button>
          )}

          <Button variant="ghost" onClick={async () => { setShowUpgradeModal(false); await signOut(); }} className="w-full text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Ausloggen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
